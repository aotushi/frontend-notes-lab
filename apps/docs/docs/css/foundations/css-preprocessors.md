# CSS 预处理器

## 问题

CSS 预处理器是什么？现在还有必要使用 Sass、Less 这类工具吗？

## 结论

CSS 预处理器是在构建阶段把 Sass、Less、Stylus 等扩展语法编译成浏览器可识别的 CSS。它不属于浏览器原生 CSS 语法，依赖构建工具链；工具链可以是 Vite、Webpack、PostCSS 流程或框架内置构建，不应简单说成“通过 Webpack 编译”。

预处理器常见能力包括变量、嵌套、mixin、函数、循环、条件和文件拆分。现代 CSS 已经有自定义属性、`@layer`、原生 CSS Nesting、`color-mix()` 等能力，因此预处理器不再是所有项目的默认必需品，但在大型样式系统、历史项目和复杂 mixin 复用场景里仍有价值。

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

## 参考来源

- [Sass: Documentation](https://sass-lang.com/documentation/)
- [Less: Getting started](https://lesscss.org/)
- [MDN: CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
