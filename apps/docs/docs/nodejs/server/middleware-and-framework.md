# Node.js 服务端框架与中间件

## 问题

koa 的洋葱模型是什么？在没有 `async` / `await` 的年代它是怎么实现的？中间件里抛出的异常怎么统一处理？`body-parser` 做了什么？不用它的话，怎么手动解析一个带图片和字段的 POST 请求？

## 结论

### 理解路径

koa 这类框架的核心只有两件事：把 `req` / `res` 封装成 `context`，以及用一套中间件机制串起一次请求的处理流程。洋葱模型、异常处理、body 解析，本质都是「如何组织和拦截这条流程」。

### koa 的洋葱模型是什么？

中间件按注册顺序「进入」，每个中间件用 `await next()` 把控制权交给下一个；`next()` 之后的代码要等内层所有中间件执行完，再逆序「穿出」。进入是顺序、返回是逆序，像一层层穿过洋葱再绕回来。

```js
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(6)
})
app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log(5)
})
app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})
// 输出顺序：1 2 3 4 5 6
```

这种「先进后出」的结构让计时、日志、异常捕获、响应包装可以包在外层：外层中间件在 `next()` 前后各做一半工作，天然能度量和拦截内层的全部行为。

### 没有 async/await 时，洋葱模型怎么实现？

不管哪种语法，洋葱模型的内核都是 **compose**：把中间件数组组合成一个函数，给每个中间件传入 `next`，而 `next` 就是「调用下一个中间件」的函数，返回 Promise 串起整条链。

```js
function compose(middlewares) {
  return function (context, next) {
    let lastIndex = -1
    function dispatch(i) {
      // 同一个中间件里多次调用 next() 是错误用法
      if (i <= lastIndex) return Promise.reject(new Error('next() called multiple times'))
      lastIndex = i
      const fn = i === middlewares.length ? next : middlewares[i]
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}
```

koa1 时代没有 `async` / `await`，用的是 **Generator + co**：中间件写成 `function* (next) {}`，用 `yield next` 交出控制权，`co` 这个执行器递归地驱动 generator——`yield` 出来一个 Promise，等它 resolve 后再 `next()` 把结果送回继续执行。这正是后来 `async` / `await` 的语法糖原理，所以 koa2 换成 `async` 中间件后，洋葱模型的行为完全一致。

```js
// koa1 风格：generator 中间件
function* logger(next) {
  console.log('enter')
  yield next // 交出控制权，等内层完成
  console.log('leave')
}
```

### 中间件的异常处理怎么做？

洋葱模型让**最外层中间件**成为天然的错误边界：用 `try/catch` 包住 `await next()`，内层任意中间件 `throw` 或返回 rejected Promise，都会被它捕获。

```js
// 注册在最外层的统一错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { message: err.message }
    ctx.app.emit('error', err, ctx) // 触发集中日志
  }
})
```

要注意一个边界：只有「能被 `await` 链等到」的异步错误才能这样捕获。`async` 中间件里 `throw` 会变成 rejected Promise，被外层 `await` 捕到；但如果错误发生在回调式异步里（例如 `setTimeout` 内部直接 `throw`），它脱离了 Promise 链，外层 `try/catch` 捕不到，会变成未捕获异常。解决办法是把这类异步操作包成 Promise 再 `await`，或挂 `process.on('uncaughtException')` 兜底。

### body-parser 做什么？不用它怎么解析 POST？

HTTP 请求体是一个可读流，`req` 本身不会替你解析。`body-parser` / `koa-bodyparser` 做的事是：监听 `req` 的 `data` / `end` 事件，把 chunk 拼成完整 buffer，再根据 `Content-Type` 解析成 JSON 或表单对象，挂到 `ctx.request.body`。

手动解析 `application/json` 并不难：

```js
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}
```

带图片和字段的表单是 `multipart/form-data`，复杂在于它是二进制混合内容，**不能当字符串处理**。关键信息在请求头里：

```http
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryabc123
```

`boundary` 是各部分之间的分隔符。请求体按 `--boundary` 切成多段，每段有自己的头部：

```
------WebKitFormBoundaryabc123
Content-Disposition: form-data; name="title"

前端面试                          ← 文本字段段
------WebKitFormBoundaryabc123
Content-Disposition: form-data; name="avatar"; filename="a.png"
Content-Type: image/png

‹二进制图片字节›                   ← 文件段
------WebKitFormBoundaryabc123--
```

手动解析的要点：

1. 从 `Content-Type` 头取出 `boundary`。
2. 把 buffer 按 `boundary` 字节序列切分，**对 Buffer 操作而不是 String**，否则图片二进制会被编码破坏。
3. 每段再拆出头部（`name`、`filename`、`Content-Type`）和内容：有 `filename` 的是文件，没有的是普通字段。

实际开发不会手撸这套字节解析，而是用 `formidable`、`multer`（Express）或 `busboy`（流式、性能好）。面试能讲清「boundary 分段 + 文件段是二进制要按 Buffer 处理」就抓住了重点。

## 参考来源

- [koa 官方文档](https://koajs.com/)
- [koa-compose 源码](https://github.com/koajs/compose/blob/master/index.js)
- [MDN: POST multipart/form-data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST)
- [busboy](https://github.com/mscdex/busboy)
