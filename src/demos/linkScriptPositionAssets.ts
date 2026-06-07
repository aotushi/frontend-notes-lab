export interface LinkScriptPositionAsset {
  body: string
  contentType: string
}

export const linkScriptPositionAssets: Record<string, LinkScriptPositionAsset> = {
  'slow-style.css': {
    contentType: 'text/css; charset=utf-8',
    body: `
body {
  background: #f8fafc;
}

.case-card {
  border-color: #0f766e;
  box-shadow: inset 0 0 0 2px rgba(15, 118, 110, 0.2);
}

.css-status::before {
  content: "slow stylesheet 已加载并应用";
  display: inline-flex;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  color: #ffffff;
  background: #0f766e;
  font-size: 12px;
  font-weight: 700;
}
`
  },
  'blocking.js': {
    contentType: 'text/javascript; charset=utf-8',
    body:
      "window.demoLog('blocking external script: 位于 body 之前，target exists = ' + Boolean(document.getElementById('target')));"
  },
  'defer.js': {
    contentType: 'text/javascript; charset=utf-8',
    body:
      "window.demoLog('defer script: DOM 已解析，target exists = ' + Boolean(document.getElementById('target')));"
  },
  'slow-image.svg': {
    contentType: 'image/svg+xml; charset=utf-8',
    body: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="220" viewBox="0 0 640 220" role="img" aria-labelledby="title desc">
  <title id="title">Delayed image resource</title>
  <desc id="desc">A simple image used to show that window load waits for image resources.</desc>
  <rect width="640" height="220" fill="#ecfeff"/>
  <rect x="32" y="32" width="576" height="156" rx="14" fill="#ffffff" stroke="#0891b2" stroke-width="4"/>
  <text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#155e75">slow image loaded</text>
  <text x="50%" y="65%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="16" fill="#475569">图片不会阻塞 DOM 解析，但会推迟 window load</text>
</svg>`
  }
}

export function clampLinkScriptPositionDelay(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(value, 0), 3000)
}
