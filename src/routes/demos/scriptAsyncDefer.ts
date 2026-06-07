import { Hono } from 'hono'
import { clampDemoDelay, scriptAsyncDeferScripts } from '../../demos/scriptAsyncDeferScripts'
import { sleep } from '../../lib/sleep'
import type { Env } from '../../types'

export const scriptAsyncDeferRoutes = new Hono<{ Bindings: Env }>()

scriptAsyncDeferRoutes.get('/:file', async (context) => {
  const file = context.req.param('file')
  const script = scriptAsyncDeferScripts[file]

  if (!script) {
    return context.text('Not found', 404)
  }

  const delay = clampDemoDelay(Number(context.req.query('delay') || 0))
  await sleep(delay)

  return new Response(script, {
    headers: {
      'content-type': 'text/javascript; charset=utf-8'
    }
  })
})
