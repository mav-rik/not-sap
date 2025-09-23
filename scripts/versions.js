import 'zx/globals'
import { readFileSync, writeFileSync } from 'fs'
import pkg from '../package.json' with { type: 'json' }
import { getWorkspaceFolders } from './utils.js'
import inquirer from 'inquirer'
import { dye } from '@prostojs/dye'

let i = 1
const info = dye('blue').attachConsole()
const step = dye('cyan')
  .prefix(() => `\n${i++}. `)
  .attachConsole()
const done = dye('green')
  .prefix(() => ` ✅ `)
  .attachConsole()

function syncVersions(newVersion) {
  const workspaces = getWorkspaceFolders()
  for (const ws of workspaces) {
    const packagePath = `./packages/${ws}/package.json`
    const packageData = JSON.parse(readFileSync(packagePath, 'utf8'))
    packageData.version = newVersion
    writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n')
    done(`Updated ${ws} to version ${newVersion}`)
  }
}

async function main() {
  try {
    // Check if git working directory is clean
    const gitStatus = await $`git status --porcelain`
    if (gitStatus.stdout.trim()) {
      throw new Error('Git working directory is not clean. Please commit or stash your changes.')
    }

    // Get current version
    const currentVersion = pkg.version
    info(`Current version: ${currentVersion}`)

    // Version bump options
    const semverParts = currentVersion.split('.')
    const major = parseInt(semverParts[0])
    const minor = parseInt(semverParts[1])
    const patch = parseInt(semverParts[2])

    const versionOptions = [
      { name: `Patch (${major}.${minor}.${patch + 1})`, value: `${major}.${minor}.${patch + 1}` },
      { name: `Minor (${major}.${minor + 1}.0)`, value: `${major}.${minor + 1}.0` },
      { name: `Major (${major + 1}.0.0)`, value: `${major + 1}.0.0` },
      { name: 'Custom', value: 'custom' },
    ]

    const { selectedVersion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedVersion',
        message: 'Select version bump type:',
        choices: versionOptions,
      },
    ])

    let newVersion = selectedVersion
    if (selectedVersion === 'custom') {
      const { customVersion } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customVersion',
          message: 'Enter custom version:',
          validate: input => /^\d+\.\d+\.\d+/.test(input) || 'Invalid version format',
        },
      ])
      newVersion = customVersion
    }

    // Update root package.json
    step('Updating root package.json...')
    pkg.version = newVersion
    writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
    done(`Updated root to version ${newVersion}`)

    // Sync versions across workspaces
    step('Syncing versions across workspaces...')
    syncVersions(newVersion)

    // Git operations
    step('Creating git commit and tag...')
    await $`git add .`
    await $`git commit -m "chore: release v${newVersion}"`
    await $`git tag v${newVersion}`
    done(`Created commit and tag for v${newVersion}`)

    info(`\n✨ Version updated to ${newVersion}`)
    info(`Run 'git push && git push --tags' to publish the release`)
  } catch (error) {
    info(`\n❌ Failed version update: ${error.message}`)
    process.exit(1)
  }
}

await main()