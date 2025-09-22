import type { App, Component } from 'vue'

// 导入组件
// import WeatherCard from './components/WeatherCard.vue'
// import TemperatureDisplay from './components/TemperatureDisplay.vue'
// import WindIndicator from './components/WindIndicator.vue'

// 导入时间轴组件
import {
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale
} from './components/timeline'

// 导入图例组件
import {
  LegendBar
} from './components/legend'

// 组件列表
const components: Component[] = [
  // WeatherCard,
  // TemperatureDisplay,
  // WindIndicator,
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale,
  LegendBar
]

// 定义 install 方法
const install = (app: App) => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 导出组件库
export default {
  install,
}

// 单独导出组件
// export { WeatherCard, TemperatureDisplay, WindIndicator }

// 导出时间轴组件
export {
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale
}

// 导出图例组件
export {
  LegendBar
}

// 导出时间轴相关类型和工具
export * from './components/timeline'
export * from './types/timeline'
export { TimeUtils } from './utils/time'

// 导出图例相关类型
export * from './types/legend'
