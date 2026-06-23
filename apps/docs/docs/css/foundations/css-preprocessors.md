# CSS 预处理器

## 问题

CSS 预处理器是什么？现在还有必要使用 Sass、Less 这类工具吗？常见 CSS 相关技术、库、框架、预处理和后处理工具应该如何分类？

## 结论

CSS 预处理器是在构建阶段把 Sass、Less、Stylus 等扩展语法编译成浏览器可识别的 CSS。它不属于浏览器原生 CSS 语法，依赖构建工具链；工具链可以是 Vite、Webpack、PostCSS 流程或框架内置构建，不应简单说成“通过 Webpack 编译”。

预处理器常见能力包括变量、嵌套、mixin、函数、循环、条件和文件拆分。现代 CSS 已经有自定义属性、`@layer`、原生 CSS Nesting、`color-mix()` 等能力，因此预处理器不再是所有项目的默认必需品，但在大型样式系统、历史项目和复杂 mixin 复用场景里仍有价值。

### 常见 CSS 相关技术怎么分类？

回答“用过哪些 CSS 技术”时，不要只罗列库名，可以按解决的问题分类：

| 类型 | 代表 | 解决什么问题 |
| --- | --- | --- |
| 预处理器 | Sass、Less、Stylus | 变量、嵌套、mixin、函数、模块拆分，构建期输出 CSS |
| 后处理器 | PostCSS、Autoprefixer、cssnano | 基于 CSS AST 做兼容前缀、语法转换、压缩和规范检查 |
| 方法论 | BEM、OOCSS、SMACSS | 命名、模块边界、复用和团队协作约束 |
| 工具类框架 | Tailwind CSS、UnoCSS | 用原子类快速组合样式，减少手写业务 CSS |
| 组件库样式系统 | Ant Design、Element Plus、Material UI | 提供组件、主题 token、交互状态和一致性规范 |
| CSS-in-JS / scoped 样式 | styled-components、Emotion、Vue SFC scoped CSS、CSS Modules | 处理组件作用域、动态样式和工程化拆分 |
| 原生 CSS 新能力 | CSS Variables、Cascade Layers、Container Queries、Nesting | 减少对工具链的依赖，直接利用浏览器能力 |

选型重点是团队约束和项目复杂度：内容站或组件库更重视语义、可维护和主题 token；后台系统更重视一致性和组件库集成；活动页可能更重视开发速度和视觉还原。无论用哪类工具，最终浏览器执行的仍然是 CSS，不能用工具替代对层叠、继承、布局和渲染成本的理解。

## Demo

```scss
$brand: #168a7a;

.button {
  color: white;
  background: $brand;

  &:hover {
    background: color.scale($brand, $lightness: -10%);
  }
}
```

编译后浏览器实际拿到的是普通 CSS：

```css
.button {
  color: white;
  background: #168a7a;
}

.button:hover {
  background: #126f62;
}
```

## 面试回答

CSS 预处理器是在构建期扩展 CSS 写法，最后输出普通 CSS。它能提供变量、嵌套、mixin、函数和模块拆分等能力。现代 CSS 已经补齐了很多能力，所以新项目要看团队和复杂度选择；如果只是变量和简单嵌套，原生 CSS 可能够用，如果有大量 mixin、函数和历史代码，Sass/Less 仍然有价值。

### 对 CSS 工程化的理解

CSS 工程化是为了解决以下问题：

1. **宏观设计**：CSS 代码如何组织、如何拆分、模块结构怎样设计？
2. **编码优化**：怎样写出更好的 CSS？
3. **构建**：如何处理 CSS，使打包结果最优？
4. **可维护性**：如何降低后续变更成本？

**三个核心方向：**

**（1）预处理器（Less、Sass 等）**

解决传统 CSS 不支持变量、嵌套、函数、循环、模块拆分的问题，让样式代码更结构化。

**（2）PostCSS**

对 CSS 本身进行 AST 解析和处理：
- `Autoprefixer`：自动添加浏览器私有前缀；
- `cssnano`：压缩 CSS；
- 支持编写面向未来的 CSS 语法（postcss-preset-env）。

与预处理器的区别：预处理器处理"类 CSS"语法，PostCSS 直接处理 CSS，插件化扩展能力更强。

**（3）Webpack/Vite Loader**

- `css-loader`：解析 CSS 中的 `@import` 和 `url()`，把 CSS 编译成 JS 模块；
- `style-loader`：创建 `<style>` 标签，把 CSS 注入 DOM；
- 注意：`css-loader` 必须在 `style-loader` 前执行（Webpack loader 从右往左执行）。

**现代方案还包括：** CSS Modules（作用域隔离）、原子类框架（Tailwind CSS）、CSS-in-JS（styled-components）、CSS 自定义属性（设计 token）。

## 参考来源

- [Sass: Documentation](https://sass-lang.com/documentation/)
- [Less: Getting started](https://lesscss.org/)
- [PostCSS](https://postcss.org/)
- [MDN: CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
