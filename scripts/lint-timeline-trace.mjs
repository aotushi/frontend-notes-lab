import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd()
const docsDir = join(root, 'docs')
const ignoredFiles = new Set([
  'docs/agents/timeline-trace-guidelines.md'
])

const forbiddenPatterns = [
  {
    name: 'private timeline class',
    pattern: /\b(?:timeline__|trace-map|connector-layer|connector-line|connector-dot)\b/,
    message: '时序图样式必须由 TimelineTrace 组件提供，不要在 Markdown 中手写私有 timeline 类。'
  },
  {
    name: 'manual svg',
    pattern: /<svg[\s>]/i,
    message: 'Markdown 中不要手写 SVG 时序图；请使用 TimelineTrace 组件。'
  },
  {
    name: 'numbered marker wording',
    pattern: /数字圆点|编号圆点|序号圆点/,
    message: '时序图不要使用数字圆点；事件顺序应由 X 轴位置表达。'
  }
]

const errors = []

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === '.vitepress' || entry.name === 'public') {
        continue
      }

      await walk(fullPath)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      await lintMarkdown(fullPath)
    }
  }
}

async function lintMarkdown(filePath) {
  const normalized = relative(root, filePath).replaceAll('\\', '/')
  if (ignoredFiles.has(normalized)) {
    return
  }

  const content = await readFile(filePath, 'utf8')
  const hasTimelineContext = /TimelineTrace|时序图|加载时序|执行时序|timeline trace/i.test(content)

  for (const rule of forbiddenPatterns) {
    if (rule.name === 'manual svg' && !hasTimelineContext) {
      continue
    }

    const match = rule.pattern.exec(content)

    if (match) {
      const line = content.slice(0, match.index).split('\n').length
      errors.push(`${normalized}:${line} ${rule.message}`)
    }
  }
}

await walk(docsDir)

if (errors.length > 0) {
  console.error('TimelineTrace lint failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log('TimelineTrace lint passed.')
