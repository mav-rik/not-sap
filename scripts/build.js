#!/usr/bin/env node

import 'zx/globals'
import { getBuildOptions, getExternals, getWorkspaceFolders } from './utils.js'
import { dye } from '@prostojs/dye'
import { rollup } from 'rollup'
import { rolldown } from 'rolldown'
import dyePlugin from '@prostojs/dye/rolldown'
import dtsPlugin from 'rollup-plugin-dts'
import { writeFileSync } from 'fs'
import pkg from '../package.json' with { type: 'json' }
import path from 'path'
import swcPlugin from 'unplugin-swc'

const swc = swcPlugin.rolldown()
const _dye = dyePlugin()

let i = 1

const info = dye('blue').attachConsole()
const step = dye('cyan')
  .prefix(() => `\n${i++}. `)
  .attachConsole()
const done = dye('green')
  .prefix(() => ` ✅ `)
  .attachConsole()
const file = dye('blue', 'bold')

const target = process.argv[2]

// $.verbose = true
const workspaces = target ? getWorkspaceFolders().filter(t => t === target) : getWorkspaceFolders()
if (!workspaces.length) {
  console.error(`No workspaces found`)
  process.exit(1)
}
const externals = new Map()
for (const ws of workspaces) {
  externals.set(ws, getExternals(ws))
}

async function run() {
  console.log()
  let types = true
  if (target) {
    info(`Target: ${dye('bold')(target)}`)
    console.log()
    types = false
    for (const build of getBuildOptions(target)) {
      if (build.dts !== false) {
        types = true
        break
      }
    }
  }

  for (const ws of workspaces) {
    const builds = getBuildOptions(ws)
    step(`Building ${file(ws)}...`)
    await $`rm -rf packages/${ws}/dist`
    for (const build of builds) {
      for (const entry of build.entries) {
        for (const format of build.formats) {
          const config = {
            input: `packages/${ws}/${entry}`,
            external: build.external || externals.get(ws),
            plugins: [swc, _dye],
          }
          const extname = format === 'esm' ? 'mjs' : 'cjs'
          const outputDir = `packages/${ws}/dist`
          const outputFile = entry.replace('src/', '').replace('.ts', `.${extname}`)
          const output = {
            dir: outputDir,
            format,
            entryFileNames: outputFile,
          }
          const bundle = await rolldown(config)
          await bundle.write(output)
          await bundle.close()
          done(`Built ${format.toUpperCase()} format for ${entry}`)
        }
      }
    }
  }

  if (types) {
    step('Building types...')
    for (const ws of workspaces) {
      const builds = getBuildOptions(ws)
      for (const build of builds) {
        if (build.dts === false) continue
        for (const entry of build.entries) {
          const config = {
            input: `packages/${ws}/${entry}`,
            external: build.external || externals.get(ws),
            plugins: [dtsPlugin()],
          }
          const outputDir = `packages/${ws}/dist`
          const outputFile = entry.replace('src/', '').replace('.ts', '.d.ts')
          const output = {
            dir: outputDir,
            entryFileNames: outputFile,
          }
          const bundle = await rollup(config)
          await bundle.write(output)
          await bundle.close()
          done(`Built types for ${ws}/${entry}`)
        }
      }
    }
  }

  step('Updating package.json versions...')
  for (const ws of workspaces) {
    const packageJsonPath = `packages/${ws}/package.json`
    const packageJson = JSON.parse(await $`cat ${packageJsonPath}`.text())
    packageJson.version = pkg.version
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    done(`Updated ${ws} to version ${pkg.version}`)
  }

  console.log()
  info('Build completed successfully!')
}

run().catch(console.error)