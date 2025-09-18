import type { App } from 'vue'
import TimelineContainer from './TimelineContainer.vue'
import TimelineData from './TimelineData.vue'
import TimelinePicker from './TimelinePicker.vue'
import TimelineScale from './TimelineScale.vue'

// 导出组件
export {
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale
}

// 组件列表
const components = [
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale
]

// 安装函数
export const install = (app: App) => {
  components.forEach(component => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 默认导出
export default {
  install,
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale
}

// 导出类型
export * from '../../types/timeline'
export { TimeUtils } from '../../utils/time'
