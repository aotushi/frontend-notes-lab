import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ConceptNote from './components/ConceptNote.vue'
import DemoFrame from './components/DemoFrame.vue'
import GridConceptDiagram from './components/GridConceptDiagram.vue'
import FlexPlayground from './components/FlexPlayground.vue'
import GridPlayground from './components/GridPlayground.vue'
import HeightPercentDiagram from './components/HeightPercentDiagram.vue'
import LayoutPatternsPlayground from './components/LayoutPatternsPlayground.vue'
import PositionPlayground from './components/PositionPlayground.vue'
import TimelineTrace from './components/TimelineTrace.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ConceptNote', ConceptNote)
    app.component('DemoFrame', DemoFrame)
    app.component('GridConceptDiagram', GridConceptDiagram)
    app.component('FlexPlayground', FlexPlayground)
    app.component('GridPlayground', GridPlayground)
    app.component('HeightPercentDiagram', HeightPercentDiagram)
    app.component('LayoutPatternsPlayground', LayoutPatternsPlayground)
    app.component('PositionPlayground', PositionPlayground)
    app.component('TimelineTrace', TimelineTrace)
  }
} satisfies Theme
