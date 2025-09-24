import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { builtinModules } from 'module'
import path from 'path'

export function getExternals(ws) {
  const pkgPath = getWorkspacePath(ws ? `packages/${ws}/package.json` : 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath))

  const deps = Object.keys(pkg.dependencies ?? {})
  const devDeps = Object.keys(pkg.devDependencies ?? {})
  const peerDeps = Object.keys(pkg.peerDependencies ?? {})

  return [
    ...deps,
    ...devDeps,
    ...peerDeps,
    ...builtinModules,
    ...builtinModules.map(mod => `node:${mod}`),
    'vscode',
  ]
}

export function getBuildOptions(ws) {
  const pkgPath = getWorkspacePath(ws ? `packages/${ws}/package.json` : 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath))
  const buildArray = Array.isArray(pkg?.build) ? pkg.build : pkg?.build ? [pkg.build] : [{}]
  return buildArray.map(build => ({
    // Common options
    entries: build.entries || ['src/index.ts'],
    formats: build.formats || (build.format ? [build.format] : ['esm', 'cjs']),
    dts: build.dts ?? true,
    external: build.external,
    bundler: build.bundler || 'rolldown',
    output: build.output,
    type: build.type,

    // Vite-specific options
    vue: build.vue || false,
    css: build.css || false,
    alias: build.alias || {},

    // Raw copy options
    filePattern: build.filePattern,
    flattenStructure: build.flattenStructure,
    outputDir: build.outputDir,
    transformRules: build.transformRules,
    transformMode: build.transformMode,
    transformMappings: build.transformMappings
  }))
}

export function getWorkspacePath(target) {
  return path.resolve(process.cwd(), target)
}

export function getWorkspaceFolders() {
  const packagesPath = getWorkspacePath('packages')

  if (!existsSync(packagesPath)) {
    return []
  }

  return readdirSync(packagesPath).filter(item => {
    const fullPath = path.join(packagesPath, item)
    return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, 'package.json'))
  })
}