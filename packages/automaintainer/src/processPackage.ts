import { existsSync, readFileSync, writeFileSync } from 'fs'
import { basename, dirname } from 'path'

export async function processPackage(packagePath: string) {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
  const originalPackageJson = JSON.parse(JSON.stringify(packageJson))

  if (packageJson.private) {
    console.log('Package is private, skipping')
    return
  }

  if (!packageJson.name) {
    // Infer name from package path
    const name = '@(-.-)/' + basename(dirname(packagePath))
    console.log(`Package name is missing, using ${name}`)
    packageJson.name = name
  }

  if (!packageJson.version) {
    console.log(`Package version is missing, using 0.0.0-0`)
    packageJson.version = '0.0.0-0'
  }

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {}
  }
  packageJson.devDependencies['tsup'] = '^7.2.0'
  packageJson.devDependencies['typescript'] = '^5.2.2'
  packageJson.devDependencies['vitest'] = '^0.34.2'
  packageJson.devDependencies['@tsconfig/node18'] = '^18.2.1'

  const packageTypes = [] as ('cli' | 'lib')[]
  if (existsSync(dirname(packagePath) + '/src/index.ts')) {
    packageTypes.push('lib')
  }
  if (existsSync(dirname(packagePath) + '/src/main.ts')) {
    packageTypes.push('cli')
  }
  if (packageTypes.length === 0) {
    throw new Error('Package has no entry point')
  }
  if (packageTypes.length > 1) {
    throw new Error('Package must either be a CLI or a library, not both')
  }

  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }
  packageJson.scripts.test = 'vitest'

  packageJson.publishConfig = { access: 'public' }
  packageJson.repository = {
    url: 'git+https://github.com/dtinth/-.-',
  }

  if (packageTypes.includes('lib')) {
    packageJson.scripts.build =
      'tsup src/index.ts --format cjs,esm --dts --sourcemap'
    packageJson.main = './dist/index.js'
    packageJson.module = './dist/index.mjs'
    packageJson.types = './dist/index.d.ts'
  }
  if (packageTypes.includes('cli')) {
    packageJson.scripts.build = 'tsup src/main.ts --format esm --sourcemap'
    packageJson.bin = './dist/main.js'
  }

  // Write package.json if it changed
  if (JSON.stringify(packageJson) !== JSON.stringify(originalPackageJson)) {
    console.log(`Writing ${packagePath}`)
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
  }

  // Write tsconfig.json if it doesn't exist
  const tsconfigPath = dirname(packagePath) + '/tsconfig.json'
  if (!existsSync(tsconfigPath)) {
    console.log(`Writing ${tsconfigPath}`)
    writeFileSync(
      tsconfigPath,
      JSON.stringify(
        {
          extends: '@tsconfig/node18/tsconfig.json',
          compilerOptions: {
            noEmit: true,
          },
        },
        null,
        2,
      ),
    )
  }
}
