import { Hono } from 'hono'
import { linkScriptPositionRoutes } from './routes/demos/linkScriptPosition'
import { scriptAsyncDeferRoutes } from './routes/demos/scriptAsyncDefer'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.route('/api/demos/script-async-defer', scriptAsyncDeferRoutes)
app.route('/api/demos/link-script-position', linkScriptPositionRoutes)

app.get('*', (context) => {
  return context.env.ASSETS.fetch(context.req.raw)
})

export default app
