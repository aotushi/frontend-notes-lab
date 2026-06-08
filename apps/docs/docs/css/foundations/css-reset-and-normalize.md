# CSS 初始化、Reset 与 Normalize

## 问题

为什么需要初始化 CSS？CSS Reset、Normalize.css 和现代自定义 reset 有什么区别，项目里应该怎么选？

## 结论

CSS 初始化不是为了“清空所有样式”，而是为了建立项目可预期的样式基线。它处理的是浏览器 UA stylesheet、跨浏览器默认样式差异、项目排版基线和组件开发默认值。

- 传统 reset：倾向把浏览器默认样式压平，得到更空的画布，但会丢掉不少有用默认值。
- Normalize.css：保留有用默认样式，修正浏览器之间的不一致和常见 bug，适合希望温和接入的项目。
- 现代自定义 reset：不追求完全清空，而是主动设置项目开发更舒服的默认值，例如 `border-box`、媒体元素不溢出、表单控件继承字体、更合理的行高和换行策略。

面试回答中不要只说“不同浏览器默认样式不同”。更好的说法是：初始化 CSS 是在 UA 默认样式和业务组件样式之间加一层稳定基线，减少不可控默认值，让布局、排版、表单和媒体元素表现更符合项目预期。

## 两种代表方案

### Josh W. Comeau 的现代自定义 reset

[A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/) 的思路不是复刻传统 reset，而是给现代项目建立一组更好用的默认值。文章最后更新于 2026 年 6 月 3 日，包含 `box-sizing`、默认 margin、媒体元素、表单控件字体、文本溢出、换行和根层叠上下文等规则。

适合关注组件开发体验的新项目。它的核心判断是：浏览器之间的默认样式差异已经不像早期那样巨大，完全抹平默认样式没有必要；真正有价值的是把常见踩坑点提前变成稳定默认。

常见可采用片段：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}
```

使用时要注意：现代 reset 会改变很多基础行为，例如清除默认 margin、让图片变成块级元素、让控件继承字体。新项目通常很好接入；老项目接入前需要做视觉回归检查。

### Nicolas Gallagher 的 Normalize.css

[About normalize.css](https://nicolasgallagher.com/about-normalize-css/) 介绍了 Normalize.css 的设计目标：保留有用的浏览器默认样式，标准化大量 HTML 元素的默认表现，修正常见浏览器不一致，并通过注释解释每段代码的原因。

适合希望温和统一浏览器差异、又不想完全抹掉默认语义样式的项目。Normalize.css 尤其适合处理表单、HTML5 元素、排版、列表、嵌入内容和表格等浏览器默认表现差异。

使用方式一般有两种：

```bash
npm install normalize.css
```

```css
@import "normalize.css";
```

也可以把 Normalize.css 当作项目基础样式的起点，按设计系统需要删减或覆盖其中的规则。

## Demo

<DemoFrame src="/demos/css-reset-normalize/index.html?v=20260608-6" title="CSS 初始化方案对比" height="2350" />

## 面试回答

CSS 初始化是为了把浏览器默认样式变成项目可控的基础层。浏览器本身有 UA stylesheet，不同元素天然带有 margin、字体、表单控件外观、列表缩进、图片行内表现等默认值；如果项目直接在这些默认值上写组件，样式会受浏览器、元素类型和默认层叠影响。

Reset 和 Normalize 的区别在于目标不同。Reset 更偏向清空默认样式，让项目从接近空白的画布开始；Normalize 更偏向保留有用默认值，只修正跨浏览器不一致和常见 bug。现代项目常用自定义 reset，它不会盲目清空，而是设置一些更符合组件开发的基线，比如全局 `box-sizing: border-box`、媒体元素 `max-width: 100%`、表单控件 `font: inherit`、合理的 `line-height` 和文本换行。

项目选择上，新项目可以采用一份现代自定义 reset，再按设计系统补充基础排版；老项目不要直接替换 reset，因为初始化层会影响所有页面，应先局部验证或做视觉回归。需要温和兼容时可以引入 Normalize.css；需要统一组件开发基线时，可以参考 Josh W. Comeau 的现代 reset 思路定制自己的基线。

## 参考来源

- [A Modern CSS Reset - Josh W. Comeau](https://www.joshwcomeau.com/css/custom-css-reset/)
- [About normalize.css - Nicolas Gallagher](https://nicolasgallagher.com/about-normalize-css/)
- [Normalize.css project site](https://necolas.github.io/normalize.css/)
