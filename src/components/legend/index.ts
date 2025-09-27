import type { App } from 'vue'
import LegendBar from './LegendBar.vue'

// 导出组件
export { LegendBar }

// 组件列表
const components = [LegendBar]

// 安装函数
export const install = (app: App) => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 默认导出
export default {
  install,
  LegendBar,
}

// 导出类型
export * from '../../types/legend'
