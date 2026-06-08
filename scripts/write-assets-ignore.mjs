import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'apps', 'docs', 'docs', '.vitepress', 'dist')

await mkdir(dist, { recursive: true })
await writeFile(join(dist, '.assetsignore'), '_worker.js\n', 'utf8')
