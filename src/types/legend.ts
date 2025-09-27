/**
 * 图例区间配置
 */
export interface LegendRange {
  /** 区间最小值 */
  min: number
  /** 区间最大值 */
  max: number
  /** 区间颜色 */
  color: string
  /** 可选的自定义标签 */
  label?: string
}

/**
 * 图例条组件属性
 */
export interface LegendBarProps {
  /** 区间配置数组（优先级最高） */
  ranges?: LegendRange[]
  /** 图例条数量（传统方式，向后兼容） */
  count?: number
  /** 自定义颜色数组（传统方式，向后兼容） */
  colors?: string[]
  /** 自定义数值数组（传统方式，向后兼容） */
  values?: number[]
  /** 图例条宽度 */
  width?: number | string
  /** 图例条高度 */
  height?: number | string
  /** 最小宽度 */
  minWidth?: number
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
  /** 最小值 */
  min: number
  /** 最大值 */
  max: number
  /** 标签 */
  label: string
  /** 索引 */
  index: number
}

/**
 * 处理后的图例数据
 */
export interface ProcessedLegendData {
  /** 颜色段数组 */
  segments: LegendBarItem[]
  /** 数值标签数组 */
  labels: Array<{
    value: number
    label: string
    position: number
  }>
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
