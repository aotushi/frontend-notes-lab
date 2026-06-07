export const scriptAsyncDeferScripts: Record<string, string> = {
  'normal-blocking.js': "window.demoLog('normal external script: 无 async/defer，会阻塞 HTML 解析');",
  'async-slow.js': "window.demoLog('async slow: 标签在 async fast 前，但响应被 Worker/Vite dev 延迟 900ms');",
  'async-fast.js': "window.demoLog('async fast: 响应更快，所以会先于 async slow 执行');",
  'defer-a.js': "window.demoLog('defer A: 标签在 defer B 前，即使响应更慢，也按文档顺序先执行');",
  'defer-b.js': "window.demoLog('defer B: 等 defer A 执行后再执行，随后才触发 DOMContentLoaded');"
}

export function clampDemoDelay(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(value, 0), 3000)
}
