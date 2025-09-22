/**
 * 图例条组件属性
 */
export interface LegendBarProps {
  /** 图例条数量 */
  count?: number
  /** 自定义颜色数组 */
  colors?: string[]
  /** 自定义数值数组 */
  values?: number[]
  /** 图例条宽度 */
  width?: number | string
  /** 图例条高度 */
  height?: number | string
  /** 是否显示边框 */
  showBorder?: boolean
  /** 边框颜色 */
  borderColor?: string
  /** 是否显示数值标签 */
  showLabels?: boolean
  /** 数值标签格式化函数 */
  labelFormatter?: (value: number) => string
}

/**
 * 图例条配置
 */
export interface LegendBarConfig {
  /** 默认颜色数组 */
  defaultColors: string[]
  /** 默认数值数组 */
  defaultValues: number[]
  /** 最小数量 */
  minCount: number
  /** 最大数量 */
  maxCount: number
  /** 默认宽度 */
  defaultWidth: number
  /** 默认高度 */
  defaultHeight: number
}

/**
 * 图例条项目
 */
export interface LegendBarItem {
  /** 颜色值 */
  color: string
  /** 数值 */
  value: number
  /** 标签 */
  label: string
  /** 索引 */
  index: number
}

/**
 * 图例条事件
 */
export interface LegendBarEvents {
  /** 点击图例项事件 */
  'item-click': [item: LegendBarItem, index: number]
  /** 鼠标悬停事件 */
  'item-hover': [item: LegendBarItem, index: number]
  /** 鼠标离开事件 */
  'item-leave': [item: LegendBarItem, index: number]
}
