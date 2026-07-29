import { Hono } from 'hono'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.get('/html/resource-loading/link-script-position', (context) => {
  return context.redirect('/html/resource-loading/script-async-defer', 301)
})

app.get('*', (context) => {
  return context.env.ASSETS.fetch(context.req.raw)
})

export default app
