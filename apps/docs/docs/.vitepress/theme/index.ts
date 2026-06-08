import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ConceptNote from './components/ConceptNote.vue'
import DemoFrame from './components/DemoFrame.vue'
import HeightPercentDiagram from './components/HeightPercentDiagram.vue'
import TimelineTrace from './components/TimelineTrace.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ConceptNote', ConceptNote)
    app.component('DemoFrame', DemoFrame)
    app.component('HeightPercentDiagram', HeightPercentDiagram)
    app.component('TimelineTrace', TimelineTrace)
  }
} satisfies Theme
