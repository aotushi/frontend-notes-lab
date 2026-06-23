# Webpack 核心概念与优化

## 问题

- webpack 与 Grunt/Gulp 有何不同？webpack、Rollup、Parcel 各适合什么场景？
- webpack 有哪些主要配置项？
- 有哪些常见的 Loader 和 Plugin？Loader 和 Plugin 有什么区别？Loader 的执行顺序？
- webpack 的构建流程是什么？
- 什么是 HMR（热更新）？原理是什么？
- bundle、chunk、module 分别是什么？
- 什么是 Code Splitting？
- Source Map 是什么？如何配置？
- Tree Shaking 的原理是什么？
- 如何提高 webpack 打包速度？如何减少打包后体积？
- 怎么配置单页/多页应用？
- Vite 比 webpack 快在哪里？
- Babel 的原理是什么？

## 结论

### 理解路径

webpack 本质是一个模块打包器：从入口出发，递归分析依赖图，用 Loader 转换非 JS 资源，用 Plugin 在构建生命周期各阶段干预输出，最终把所有模块合并成 bundle 输出到文件系统。

### webpack vs Grunt/Gulp vs Rollup vs Parcel

**Grunt / Gulp** 是**任务运行工具**，按流水线自动执行预定义的任务（压缩、编译、拷贝等），不处理模块依赖。现代项目多用 `npm scripts` 代替它们。

**webpack** 是**模块打包器**：以模块为单位，递归构建依赖图，强大的 Loader/Plugin 生态适合复杂的大型应用。

| | webpack | Rollup | Parcel |
| --- | --- | --- | --- |
| 定位 | 大型应用打包，Loader/Plugin 生态丰富 | 库打包，Tree Shaking 优先，输出干净 | 零配置，快速原型，生态较弱 |
| 适用场景 | 复杂前端应用（路由/代码分割/HMR） | Vue/React 等库的源码打包 | 实验性项目、Demo |
| Tree Shaking | 需手动配置 | 原生支持，效果最好 | 支持 |
| 代码分割 | 完善 | 有限 | 有限 |

### 主要配置项

| 配置项 | 说明 |
| --- | --- |
| `entry` | 入口文件 |
| `output` | 输出文件路径与文件名 |
| `resolve` | 模块解析方式（别名、扩展名等） |
| `module` | 配置模块如何被解析（Loader 在此配置） |
| `plugins` | 插件列表 |
| `devServer` | 开发服务器配置 |
| `devtool` | Source Map 类型 |
| `optimization` | 优化相关（代码分割、Tree Shaking 等） |
| `externals` | 指定不打包的外部依赖 |
| `performance` | 性能提示配置 |
| `target` | 构建目标环境（web / node 等） |

### 常见 Loader 与 Plugin

**Loader：**
- `babel-loader`：将 ES6+ 转换成 ES5
- `css-loader`：解析 CSS，支持模块化和 `@import`
- `style-loader`：把 CSS 注入到 DOM（通过 `<style>` 标签）
- `image-loader`：加载并压缩图片
- `eslint-loader`：通过 ESLint 检查 JS 代码

**Plugin：**
- `html-webpack-plugin`：自动生成 HTML 文件并注入 bundle
- `mini-css-extract-plugin`：将 CSS 提取为独立文件，支持按需加载
- `define-plugin`：定义全局环境变量
- `webpack-bundle-analyzer`：可视化打包体积分析
- `speed-measure-webpack-plugin`：查看各 Loader/Plugin 耗时
- `webpack-parallel-uglify-plugin`：多进程压缩代码

### Loader 执行顺序

Loader 的执行顺序是**从右向左**（或从下向上）。例如：

```js
use: ['style-loader', 'css-loader', 'sass-loader']
// 实际执行：sass-loader → css-loader → style-loader
```

原因：webpack 选择了 `compose` 函数式组合方式，即 `f(g(x))`，表达式从右向左求值。

### Loader vs Plugin 区别

| | Loader | Plugin |
| --- | --- | --- |
| 本质 | 函数（转换器） | 插件对象（增强器） |
| 作用 | 将非 JS 文件转换成 webpack 能处理的模块 | 监听 webpack 生命周期事件，改变输出结果 |
| 配置位置 | `module.rules` 数组，描述 test + loader + options | `plugins` 数组，每项是插件实例 |

### webpack 构建流程

**7 个步骤：**

1. **初始化参数**：从配置文件和 shell 语句中读取并合并参数
2. **开始编译**：用参数初始化 `Compiler` 对象，加载所有 Plugin，执行 `run()`
3. **确定入口**：根据 `entry` 找到所有入口文件
4. **编译模块**：从入口出发，调用对应 Loader 翻译模块，再递归处理依赖模块
5. **完成模块编译**：得到每个模块翻译后的内容和依赖关系图
6. **输出资源**：根据依赖关系组装 Chunk，将每个 Chunk 转换成文件加入输出列表
7. **输出完成**：将文件内容写入文件系统

**三阶段总结：**
- **初始化**：读取配置、加载 Plugin、实例化 Compiler
- **编译**：从 Entry 递归调用 Loader 翻译文件，构建完整依赖图
- **输出**：将 Module 组合成 Chunk，写入文件系统

### HMR 热更新

HMR（Hot Module Replacement）在**不刷新页面**的前提下，将修改后的模块替换掉旧模块。

原理：
1. `webpack-dev-server`（WDS）与浏览器之间建立 WebSocket 连接
2. 本地文件变更后，webpack 先把新模块代码打包到内存中
3. WDS 通过 WebSocket 向浏览器推送更新，附带本次构建的 hash
4. 浏览器对比 hash，发现有差异后向 WDS 发起 Ajax 请求，获取变更的文件列表和 hash
5. 再通过 JSONP 请求获取最新的模块代码并替换

### bundle / chunk / module

- **module**：代码的基本单位，可以是一个文件、一个组件、一个库。构建时从 `entry` 递归收集所有依赖的 module。
- **chunk**：多个 module 的组合，用于代码合并和分割，最终会输出为一个文件。
- **bundle**：构建的最终产物，由所有需要的 chunk 和 module 组成。

### Code Splitting

Code Splitting（代码分割）是一种优化技术，将大的 bundle 拆分成多个小 chunk，**按需加载**，减少首屏加载时间。

在 webpack 中通过 `optimization.splitChunks` 开启：

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

路由级懒加载是最常见的实践，结合动态 `import()` 使用：

```js
const Page = () => import('./pages/Detail.vue')
```

### Source Map

Source Map 是构建后代码与原始源码之间的映射文件，开发阶段用于定位错误到原始代码位置。

在 webpack 配置中通过 `devtool` 开启：

```js
// 开发环境：带列信息、重建快
devtool: 'eval-source-map'

// 生产环境：单独 .map 文件，不暴露给用户
devtool: 'source-map'
```

### Tree Shaking

Tree Shaking（摇树优化）通过移除未使用的代码减小打包体积，**生产模式（`mode: 'production'`）默认开启**。

原理：
1. **依赖 ES6 模块**：ESM 的 `import`/`export` 是静态的，在编译时就能确定依赖关系（CommonJS 的 `require` 是动态的，无法静态分析）
2. **静态分析**：webpack 构建时从入口递归追踪每个模块的导入导出
3. **标记未使用代码**：对只被导入但未被引用的导出，标记为 `unused`
4. **删除未使用代码**：最终由 Terser（或 UglifyJS）将标记的代码删除

### 提高打包速度

- **持久缓存**：`cache: { type: 'filesystem' }` 避免重复构建未变化的模块
- **多进程/多线程**：`thread-loader` 将耗时 Loader 分发到 worker 线程并行处理
- **DllPlugin 预编译**：将不常变动的第三方库预先打包，减少每次构建的工作量
- **缩小构建范围**：`resolve.alias`、`exclude: /node_modules/`、`include` 限制 Loader 处理范围
- **移除不必要的插件**：避免引入低效或冗余的 Plugin

### 减少打包体积

- **Code Splitting**：按需加载，减小初始 bundle 体积
- **Tree Shaking**：删除未使用代码
- **代码压缩**：生产模式下 Terser 自动压缩 JS，删除注释和空白
- **图片优化**：`image-loader` 压缩图片；小图转 base64 减少请求
- **Gzip / Brotli**：服务端或 CDN 开启传输压缩（webpack 侧可用 `compression-webpack-plugin` 预生成 .gz 文件）
- **CDN 加速**：将第三方库通过 `externals` 排除打包，改用 CDN 引入

### 编写 Loader 与 Plugin 的思路

**Loader**：像"翻译官"，接收源文件内容（`source`），返回转换后的内容。每个 Loader 只做一种转义（单一职责），通过链式组合完成复杂转换。可用 `this.callback()` 返回结果，或 `this.async()` 处理异步。

**Plugin**：监听 webpack 在构建生命周期中广播的事件（钩子），在合适时机通过 webpack API 修改输出结果。需要实现 `apply(compiler)` 方法，在其中注册钩子。

### 单页/多页应用配置

**单页应用（SPA）**：webpack 的标准模式，`entry` 指向一个入口即可。

**多页应用（MPA）**：在 `entry` 中配置多个入口，每个页面对应一个入口文件。使用 `html-webpack-plugin` 为每个入口生成 HTML，并用 `chunks` 选项指定注入哪些 bundle。

```js
entry: {
  home: './src/home.js',
  about: './src/about.js',
},
plugins: [
  new HtmlWebpackPlugin({ template: './src/home.html', chunks: ['home'] }),
  new HtmlWebpackPlugin({ template: './src/about.html', chunks: ['about'] }),
]
```

注意将各页面公共代码用 `splitChunks` 提取，避免重复打包。

### Vite 比 webpack 快在哪里

| | Vite | webpack |
| --- | --- | --- |
| 开发启动 | 直接启动，利用浏览器原生 ESM 按需加载 | 先把整个项目打包成 bundle 再启动 |
| HMR | 模块级更新，只重载变更的文件 | 重新构建变更相关的 bundle 再推送 |
| 生产构建 | 基于 Rollup，配置简单，输出小 | 配置复杂，体积优化依赖手动配置 |
| 冷启动后缓存 | 依赖预构建结果缓存在浏览器 | 需要持久缓存配置（`cache: filesystem`） |

**核心原因**：开发阶段 Vite 不打包、按 ESM 按需加载，文件改动只影响自身模块；webpack 每次都要重新分析模块图并打包。

### Babel 原理

Babel 是一个 JS 编译器，将 ES6+ 代码转换成向后兼容的 ES5 代码。转译过程分三个阶段：

1. **解析（Parse）**：将源码词法分析 + 语法分析，生成 **AST**（抽象语法树）
2. **转换（Transform）**：用 `@babel/traverse` 遍历 AST，通过各种 **plugin/preset** 对节点进行添加、修改、删除操作，得到新 AST
3. **生成（Generate）**：用 `@babel/generator` 将新 AST 输出为 JS 代码（含 Source Map）

```
source code → [@babel/parser] → AST → [@babel/traverse + plugins] → new AST → [@babel/generator] → output code
```

常用 preset：`@babel/preset-env`（按目标环境自动选择转换）、`@babel/preset-react`（JSX 转换）、`@babel/preset-typescript`（剥离 TS 类型）。

### 如何用 webpack 优化前端性能

优化 webpack 的输出结果，让打包产物在浏览器中运行得更快：

- **压缩代码**：JS 用 Terser（生产模式自动启用），CSS 用 `css-minimizer-webpack-plugin`，删除注释和空白
- **CDN 加速**：用 `externals` 将第三方库排除出 bundle，通过 CDN `<script>` 引入；同时可配置 `output.publicPath` 将静态资源指向 CDN 路径
- **Tree Shaking**：删除未使用的代码，依赖 ES6 模块的静态分析，生产模式自动开启
- **Code Splitting**：按路由或组件分块，实现按需加载，避免首屏加载过多代码
- **提取公共第三方库**：`SplitChunksPlugin` 将不常变动的公共模块单独打包，利用浏览器长效缓存

## 参考来源

- [webpack: Configuration](https://webpack.js.org/configuration/)
- [webpack: Loaders](https://webpack.js.org/loaders/)
- [webpack: Plugins](https://webpack.js.org/plugins/)
- [webpack: Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [webpack: Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Vite: Why Vite](https://vite.dev/guide/why)
