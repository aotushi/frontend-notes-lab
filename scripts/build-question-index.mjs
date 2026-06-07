import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scratchDir = path.join(root, '.scratch')
const corpusDir = path.join(scratchDir, 'source-corpus')
const outputPath = path.join(scratchDir, 'questions.jsonl')

const sources = [
  {
    repo: 'yygmind/blog',
    url: 'https://github.com/yygmind/blog.git',
    dir: 'yygmind__blog'
  },
  {
    repo: 'lgwebdream/FE-Interview',
    url: 'https://github.com/lgwebdream/FE-Interview.git',
    dir: 'lgwebdream__FE-Interview'
  },
  {
    repo: 'poetries/FE-Interview-Questions',
    url: 'https://github.com/poetries/FE-Interview-Questions.git',
    dir: 'poetries__FE-Interview-Questions'
  },
  {
    repo: 'haizlin/fe-interview',
    url: 'https://github.com/haizlin/fe-interview.git',
    dir: 'haizlin__fe-interview'
  }
]

const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build', '.vitepress'])
const questionPrefixes = [
  '什么是',
  '什么叫',
  '为什么',
  '如何',
  '怎么',
  '怎样',
  '请说',
  '请解释',
  '说说',
  '谈谈',
  '描述',
  '解释',
  '实现',
  '列举',
  '写一个',
  '写个',
  '简述',
  '举一些'
]

const tagRules = [
  ['async', ['async', 'defer', 'script']],
  ['event-loop', ['事件循环', 'event loop', '宏任务', '微任务', 'microtask', 'macrotask']],
  ['closure', ['闭包', 'closure']],
  ['this', ['this 指向', 'this']],
  ['prototype', ['原型', 'prototype']],
  ['promise', ['promise', 'async/await']],
  ['scope', ['作用域', 'scope']],
  ['css-layout', ['flex', 'grid', '布局', 'position', 'float']],
  ['browser-cache', ['缓存', 'cache', 'etag', '强缓存', '协商缓存']],
  ['http', ['http', 'https', '状态码', '请求头', '响应头']],
  ['security', ['xss', 'csrf', '安全', '跨站']],
  ['performance', ['性能', '优化', '首屏', '懒加载', '防抖', '节流']],
  ['vue', ['vue', '响应式', 'computed', 'watch', '生命周期']],
  ['react', ['react', 'hooks', 'fiber', 'jsx']],
  ['typescript', ['typescript', 'ts ', '泛型', '类型']]
]

const outdatedKeywords = [
  'jquery',
  'jQuery',
  '$(',
  'webpack',
  'loader',
  'plugin'
]

mkdirSync(corpusDir, { recursive: true })

for (const source of sources) {
  const targetDir = path.join(corpusDir, source.dir)
  if (existsSync(targetDir)) {
    console.log(`skip existing ${source.repo}`)
    continue
  }

  console.log(`clone ${source.repo}`)
  execFileSync('git', ['clone', '--depth', '1', source.url, targetDir], {
    cwd: corpusDir,
    stdio: 'inherit'
  })
}

const records = []
const seen = new Set()

for (const source of sources) {
  const repoDir = path.join(corpusDir, source.dir)
  const branch = getBranch(repoDir)
  const files = sortFilesForExtraction(source.repo, listMarkdownFiles(repoDir))

  for (const file of files) {
    const relativePath = toPosix(path.relative(repoDir, file))
    const content = readFileSync(file, 'utf8')
    const sections = extractSections(content)

    sections.forEach((section, index) => {
      const title = cleanTitle(section.title)
      const answer = cleanAnswer(section.answer)

      if (!isCandidateTitle(title, {
        fromListLink: section.fromListLink,
        relativePath,
        sourceRepo: source.repo
      }) || answer.length < 20) {
        return
      }

      const fingerprint = createFingerprint(title)
      const dedupeKey = `${source.repo}:${fingerprint}`
      if (seen.has(dedupeKey)) {
        return
      }

      seen.add(dedupeKey)

      const classificationText = `${title}\n${stripUrls(answer)}\n${relativePath}`
      const category = inferCategory(classificationText)

      records.push({
        id: createId(source.repo, relativePath, index, fingerprint),
        fingerprint,
        title,
        answer,
        category,
        tags: inferTags(classificationText),
        sourceRepo: source.repo,
        sourcePath: relativePath,
        sourceUrl: section.sourceUrlOverride || createSourceUrl(source.repo, branch, relativePath),
        isOutdated: isOutdated(`${title}\n${answer}\n${relativePath}`)
      })
    })
  }
}

records.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category)
  if (a.sourceRepo !== b.sourceRepo) return a.sourceRepo.localeCompare(b.sourceRepo)
  return a.title.localeCompare(b.title)
})

writeFileSync(outputPath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8')

const outdatedCount = records.filter((record) => record.isOutdated).length
console.log(`wrote ${records.length} questions to ${outputPath}`)
console.log(`marked ${outdatedCount} questions as outdated`)

function getBranch(repoDir) {
  try {
    return execFileSync('git', ['-C', repoDir, 'rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8'
    }).trim()
  } catch {
    return 'master'
  }
}

function listMarkdownFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...listMarkdownFiles(fullPath))
      }
      continue
    }

    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function extractSections(content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
    const boldQuestion = /^\s*\*\*(.+?)\*\*\s*$/.exec(line)
    const qaHeading = /^\s*(?:[-*]|\d+[.)、])\s*(?:Q[:：]\s*)?(.+?[?？])\s*$/.exec(line)
    const listLink = /^\s*(?:[-*]|\d+[.)、])\s*\[(.+?)\]\((https?:\/\/[^)]+)\)\s*$/.exec(line)

    if (heading || boldQuestion || qaHeading || listLink) {
      if (current) {
        sections.push(current)
      }

      current = {
        title: heading ? heading[2] : boldQuestion ? boldQuestion[1] : qaHeading ? qaHeading[1] : listLink[1],
        answerLines: listLink ? [`答案见原仓库链接：${listLink[2]}`] : [],
        fromListLink: Boolean(listLink),
        sourceUrlOverride: listLink ? listLink[2] : undefined
      }
      continue
    }

    if (current) {
      current.answerLines.push(line)
    }
  }

  if (current) {
    sections.push(current)
  }

  return sections.map((section) => ({
    title: section.title,
    answer: section.answerLines.join('\n'),
    fromListLink: section.fromListLink,
    sourceUrlOverride: section.sourceUrlOverride
  }))
}

function cleanTitle(title) {
  return title
    .replace(/\[[^\]]*?\]\([^)]*?\)/g, '')
    .replace(/^(?:\[[^\]]+\]\s*)+/, '')
    .replace(/^[^\]]+\]\s*\[/, '')
    .replace(/[#*_`~]/g, '')
    .replace(/^\s*(?:Q[:：]\s*)?/, '')
    .replace(/^\s*\d+[.)、]\s*/, '')
    .replace(/^Day\s*\d+\s*[:：]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanAnswer(answer) {
  return answer
    .replace(/!\[[^\]]*?\]\([^)]*?\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function isCandidateTitle(title, context = {}) {
  if (!title || title.length < 4 || title.length > 120) {
    return false
  }

  if (
    context.sourceRepo === 'haizlin/fe-interview' &&
    context.fromListLink &&
    context.relativePath?.startsWith('category/')
  ) {
    return true
  }

  if (/[?？]/.test(title)) {
    return true
  }

  if (/^(?:第\s*)?\d+\s*[、.]/.test(title)) {
    return false
  }

  return questionPrefixes.some((prefix) => title.startsWith(prefix))
}

function sortFilesForExtraction(sourceRepo, files) {
  if (sourceRepo !== 'haizlin/fe-interview') {
    return files
  }

  const aggregateFiles = new Set(['category/all.md', 'category/history.md', 'category/week.md'])
  return files.sort((a, b) => {
    const aRelative = toPosix(path.relative(path.join(corpusDir, 'haizlin__fe-interview'), a))
    const bRelative = toPosix(path.relative(path.join(corpusDir, 'haizlin__fe-interview'), b))
    const aScore = aggregateFiles.has(aRelative) ? 1 : 0
    const bScore = aggregateFiles.has(bRelative) ? 1 : 0
    return aScore - bScore || aRelative.localeCompare(bRelative)
  })
}

function createFingerprint(title) {
  return title
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|，。、“”‘’：；？！《》（）【】\s]/g, '')
    .slice(0, 80)
}

function createId(repo, relativePath, index, fingerprint) {
  const prefix = repo.toLowerCase().replace(/[^a-z0-9]+/g, '__').replace(/^_+|_+$/g, '')
  const hash = createHash('sha1')
    .update(`${repo}:${relativePath}:${index}:${fingerprint}`)
    .digest('hex')
    .slice(0, 10)
  return `${prefix}__${hash}`
}

function inferCategory(text) {
  const value = text.toLowerCase()

  if (matchesAny(value, ['html', 'dom', 'script', 'doctype'])) return 'html'
  if (matchesAny(value, ['css', 'flex', 'grid', '布局', '选择器', '盒模型'])) return 'css'
  if (matchesAny(value, ['typescript', 'ts ', '泛型', '类型'])) return 'typescript'
  if (matchesAny(value, ['vue', 'nuxt'])) return 'vue'
  if (matchesAny(value, ['react', 'hooks', 'fiber'])) return 'react'
  if (matchesAny(value, ['node', 'npm', 'express', 'koa'])) return 'nodejs'
  if (matchesAny(value, ['http', 'https', 'tcp', 'udp', '缓存', '跨域', 'cors'])) return 'network'
  if (matchesAny(value, ['浏览器', 'browser', '渲染', 'event loop', '事件循环'])) return 'browser'
  if (matchesAny(value, ['webpack', 'vite', 'babel', 'rollup', 'loader', 'plugin'])) return 'build-tools'
  if (matchesAny(value, ['性能', '优化', '首屏', '懒加载'])) return 'performance'
  if (matchesAny(value, ['git'])) return 'git'

  return 'javascript'
}

function inferTags(text) {
  const value = text.toLowerCase()
  const tags = []

  for (const [tag, keywords] of tagRules) {
    if (keywords.some((keyword) => value.includes(keyword.toLowerCase()))) {
      tags.push(tag)
    }
  }

  return [...new Set(tags)]
}

function stripUrls(text) {
  return text.replace(/https?:\/\/\S+/g, '')
}

function isOutdated(text) {
  return outdatedKeywords.some((keyword) => text.includes(keyword))
}

function matchesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()))
}

function createSourceUrl(repo, branch, relativePath) {
  const encodedPath = relativePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
  return `https://github.com/${repo}/blob/${branch}/${encodedPath}`
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}
