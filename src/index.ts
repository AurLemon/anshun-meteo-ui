import type { App, Component } from 'vue'

// 导入组件
// import WeatherCard from './components/WeatherCard.vue'
// import TemperatureDisplay from './components/TemperatureDisplay.vue'
// import WindIndicator from './components/WindIndicator.vue'

// 组件列表
const components: Component[] = [
  // WeatherCard,
  // TemperatureDisplay,
  // WindIndicator,
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

// 导出类型
export * from './types'
