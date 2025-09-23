#!/usr/bin/env node

import 'zx/globals';
import { getBuildOptions, getExternals, getWorkspaceFolders } from './utils.js';
import { dye } from '@prostojs/dye';
import { rollup } from 'rollup';
import { rolldown } from 'rolldown';
import dyePlugin from '@prostojs/dye/rolldown';
import dtsPlugin from 'rollup-plugin-dts';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import pkg from '../package.json' with { type: 'json' };
import path from 'path';
import swcPlugin from 'unplugin-swc';
import { build as viteBuild } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteDts from 'vite-plugin-dts';
import { glob } from 'glob';

const swc = swcPlugin.rolldown();
const _dye = dyePlugin();

let i = 1;

// Generic import transformation function (regex-based)
function transformImports(content, transformRules) {
  if (!transformRules || transformRules.length === 0) return content;

  let transformed = content;

  for (const rule of transformRules) {
    const pattern = new RegExp(rule.pattern, rule.flags || 'g');
    transformed = transformed.replace(pattern, rule.replacement);
  }

  return transformed;
}

// Generic context-aware transformation (mapping-based)
function transformImportsContextAware(content, file, transformConfig) {
  if (!transformConfig || !transformConfig.mappings) {
    return content;
  }

  const importRegex = /from\s+['"]([^'"]+)['"]/g;

  return content.replace(importRegex, (match, importPath) => {
    // Check each mapping rule from package.json
    for (const rule of transformConfig.mappings) {
      // Test if the import matches this rule's condition
      const condition = new RegExp(rule.test);
      if (condition.test(importPath)) {
        // Apply the replacement template
        let replacement = rule.replacement;

        // Support placeholders like {basename}
        if (replacement.includes('{basename}')) {
          const basename = path.basename(importPath, path.extname(importPath));
          replacement = replacement.replace('{basename}', basename);
        }

        return `from '${replacement}'`;
      }
    }

    // No rule matched, keep original
    return match;
  });
}

// Function to update package.json exports with Vue components
async function updateVueExports(ws, vueFiles) {
  const packageJsonPath = `packages/${ws}/package.json`;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  // Preserve existing non-Vue exports
  const existingExports = packageJson.exports || {};
  const newExports = {};

  // Keep all non-Vue exports first
  for (const [key, value] of Object.entries(existingExports)) {
    if (!key.endsWith('.vue') && key !== './*') {
      newExports[key] = value;
    }
  }

  // Add explicit exports for each Vue component
  for (const file of vueFiles) {
    const componentName = file.basename;
    const exportPath = `./${componentName}.vue`;

    // Create export entry with types if .d.ts file exists
    const dtsPath = `./dist/${componentName}.vue.d.ts`;
    const vuePath = `./dist/${componentName}.vue`;

    // Check if .d.ts file exists
    const hasDts = await glob(`packages/${ws}/dist/${componentName}.vue.d.ts`).then(
      (files) => files.length > 0
    );

    if (hasDts) {
      newExports[exportPath] = {
        types: dtsPath,
        import: vuePath,
        default: vuePath,
      };
    } else {
      newExports[exportPath] = vuePath;
    }
  }

  // Add package.json at the end
  newExports['./package.json'] = './package.json';

  // Update package.json with new exports
  packageJson.exports = newExports;

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  done(`Updated exports in ${ws}/package.json with ${vueFiles.length} Vue components`);
}

// Generic function to copy files with transformations
async function copyRawFiles(ws, build) {
  const sourceDir = `packages/${ws}/src`;
  const destDir = `packages/${ws}/dist`;

  // Get file pattern (default to *.vue)
  const pattern = build.filePattern || '**/*.vue';
  const files = await glob(`${sourceDir}/${pattern}`);

  step(`Copying ${files.length} files with transformations...`);

  const copiedFiles = [];

  for (const file of files) {
    // Determine destination path based on flattenStructure option
    let destPath;
    if (build.flattenStructure) {
      const filename = path.basename(file);
      destPath = path.join(destDir, filename);
    } else {
      const relativePath = path.relative(sourceDir, file);
      destPath = path.join(destDir, build.outputDir || '', relativePath);
    }

    // Ensure directory exists
    mkdirSync(path.dirname(destPath), { recursive: true });

    // Read, transform (if rules provided), and write
    const content = readFileSync(file, 'utf-8');

    // Use either new mapping mode or old regex mode
    let transformed = content;
    if (build.transformMode === 'mappings' && build.transformMappings) {
      transformed = transformImportsContextAware(content, file, {
        mappings: build.transformMappings,
      });
    } else if (build.transformRules) {
      transformed = transformImports(content, build.transformRules);
    }

    writeFileSync(destPath, transformed);

    // Track copied files for export updates
    copiedFiles.push({
      source: file,
      dest: destPath,
      basename: path.basename(file, path.extname(file)),
    });

    done(`Processed ${path.basename(file)}`);
  }

  return copiedFiles;
}

// Generic Vite config creator
function createViteConfig(ws, build, externals) {
  const entries = build.entries.reduce((acc, entry) => {
    const name = build.output || entry.replace('src/', '').replace('.ts', '');
    acc[name] = path.resolve(`packages/${ws}/${entry}`);
    return acc;
  }, {});

  const plugins = [];

  // Add Vue plugin if specified
  if (build.vue) {
    plugins.push(vue());
  }

  // Add TypeScript definitions plugin if needed
  if (build.dts) {
    plugins.push(
      viteDts({
        rollupTypes: true,
        insertTypesEntry: true,
        outDir: `packages/${ws}/dist`,
        skipDiagnostics: false,
      })
    );
  }

  // Add custom transform plugin if rules provided
  if (build.transformRules) {
    plugins.push({
      name: 'transform-imports',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes(`packages/${ws}/src`)) return null;
        const transformed = transformImports(code, build.transformRules);
        return transformed !== code ? { code: transformed, map: null } : null;
      },
    });
  }

  return {
    plugins,
    resolve: {
      alias: {
        ...build.alias,
      },
    },
    build: {
      lib: {
        entry: entries,
        formats: build.formats.map((f) => (f === 'esm' ? 'es' : f)),
        fileName: (format, entryName) => {
          const ext = format === 'es' ? 'mjs' : 'cjs';
          return `${entryName}.${ext}`;
        },
      },
      rollupOptions: {
        external: build.external || externals,
        output: {
          exports: 'named',
          preserveModules: false,
        },
      },
      outDir: `packages/${ws}/dist`,
      emptyOutDir: false,
      minify: false,
      sourcemap: true,
    },
    configFile: false,
  };
}

const info = dye('blue').attachConsole();
const step = dye('cyan')
  .prefix(() => `\n${i++}. `)
  .attachConsole();
const done = dye('green')
  .prefix(() => ` ✅ `)
  .attachConsole();
const file = dye('blue', 'bold');

const target = process.argv[2];

// $.verbose = true
const workspaces = target
  ? getWorkspaceFolders().filter((t) => t === target)
  : getWorkspaceFolders();
if (!workspaces.length) {
  console.error(`No workspaces found`);
  process.exit(1);
}
const externals = new Map();
for (const ws of workspaces) {
  externals.set(ws, getExternals(ws));
}

async function run() {
  console.log();
  let types = true;
  if (target) {
    info(`Target: ${dye('bold')(target)}`);
    console.log();
    types = false;
    for (const build of getBuildOptions(target)) {
      if (build.dts !== false) {
        types = true;
        break;
      }
    }
  }

  // Track Vue files for each workspace
  const workspaceVueFiles = new Map();

  for (const ws of workspaces) {
    const builds = getBuildOptions(ws);
    step(`Building ${file(ws)}...`);

    // Clean dist only once per workspace
    await $`rm -rf packages/${ws}/dist`;

    let allVueFiles = [];

    for (const build of builds) {
      // Handle different build types
      if (build.type === 'raw-vue' || build.type === 'raw-copy') {
        // Copy files with optional transformations
        step(`Copying raw files for ${ws}...`);
        const copiedFiles = await copyRawFiles(ws, build);

        // Collect Vue files for export update
        if (build.type === 'raw-vue') {
          allVueFiles = allVueFiles.concat(copiedFiles);
        }
      } else if (build.bundler === 'vite') {
        // Build with Vite
        const viteConfig = createViteConfig(ws, build, externals.get(ws));
        await viteBuild(viteConfig);
        done(`Built with Vite: ${build.entries.join(', ')}`);
      } else {
        // Build with rolldown (default)
        for (const entry of build.entries) {
          for (const format of build.formats) {
            const config = {
              input: `packages/${ws}/${entry}`,
              external: build.external || externals.get(ws),
              plugins: [swc, _dye],
            };
            const extname = format === 'esm' ? 'mjs' : 'cjs';
            const outputName = build.output || entry.replace('src/', '').replace('.ts', '');
            const outputFile = `${outputName}.${extname}`;
            const output = {
              dir: `packages/${ws}/dist`,
              format,
              entryFileNames: outputFile,
            };
            const bundle = await rolldown(config);
            await bundle.write(output);
            await bundle.close();
            done(`Built with Rolldown: ${entry} (${format})`);
          }
        }
      }
    }

    // Store Vue files for later export update
    if (allVueFiles.length > 0) {
      workspaceVueFiles.set(ws, allVueFiles);
    }
  }

  if (types) {
    step('Building types...');
    for (const ws of workspaces) {
      const builds = getBuildOptions(ws);
      for (const build of builds) {
        // Skip type generation for raw copies and Vite builds (Vite handles its own types)
        if (build.type === 'raw-vue' || build.type === 'raw-copy' || build.bundler === 'vite')
          continue;
        if (build.dts === false) continue;
        for (const entry of build.entries) {
          const config = {
            input: `packages/${ws}/${entry}`,
            external: build.external || externals.get(ws),
            plugins: [dtsPlugin()],
          };
          const outputName = build.output || entry.replace('src/', '').replace('.ts', '');
          const output = {
            dir: `packages/${ws}/dist`,
            entryFileNames: `${outputName}.d.ts`,
          };
          const bundle = await rollup(config);
          await bundle.write(output);
          await bundle.close();
          done(`Built types for ${ws}/${entry}`);
        }
      }
    }
  }

  step('Updating Vue exports in package.json...');
  for (const [ws, vueFiles] of workspaceVueFiles) {
    await updateVueExports(ws, vueFiles);
  }

  step('Updating package.json versions...');
  for (const ws of workspaces) {
    const packageJsonPath = `packages/${ws}/package.json`;
    const packageJson = JSON.parse(await $`cat ${packageJsonPath}`.text());
    packageJson.version = pkg.version;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    done(`Updated ${ws} to version ${pkg.version}`);
  }

  console.log();
  info('Build completed successfully!');
}

run().catch(console.error);
