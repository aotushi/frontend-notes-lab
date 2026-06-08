import { Hono } from 'hono'
import {
  clampLinkScriptPositionDelay,
  linkScriptPositionAssets
} from '../../demos/linkScriptPositionAssets'
import { sleep } from '../../lib/sleep'
import type { Env } from '../../types'

export const linkScriptPositionRoutes = new Hono<{ Bindings: Env }>()

linkScriptPositionRoutes.get('/:file', async (context) => {
  const file = context.req.param('file')
  const asset = linkScriptPositionAssets[file]

  if (!asset) {
    return context.text('Not found', 404)
  }

  const delay = clampLinkScriptPositionDelay(Number(context.req.query('delay') || 0))
  await sleep(delay)

  return new Response(asset.body, {
    headers: {
      'cache-control': 'no-store',
      'content-type': asset.contentType
    }
  })
})
