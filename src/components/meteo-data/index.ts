import type { App } from 'vue'
import MeteoDataCard from './MeteoDataCard.vue'
import StationTableView from './StationTableView.vue'
import RadarListView from './RadarListView.vue'
import GridView from './GridView.vue'

// 导出组件
export {
  MeteoDataCard,
  StationTableView,
  RadarListView,
  GridView
}

// 组件列表
const components = [
  MeteoDataCard,
  StationTableView,
  RadarListView,
  GridView
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
  MeteoDataCard,
  StationTableView,
  RadarListView,
  GridView
}

// 导出类型
export * from '../../types/meteo-data'
