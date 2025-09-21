import type { Dayjs } from 'dayjs'

/**
 * 时间值类型
 */
export type TimeValue = number | Date | Dayjs | string

/**
 * 时间范围类型
 */
export interface TimeRange {
  start: TimeValue
  end: TimeValue
}

/**
 * 时间轴模式
 */
export type TimelineMode = 'point' | 'range'

/**
 * 时间轴显示模式
 */
export type TimelineDisplayMode = 'scale' | 'button'

/**
 * 时间轴容器组件属性
 */
export interface TimelineContainerProps {
  /** 当前值 */
  modelValue?: TimeValue | TimeRange
  /** 时间轴模式 */
  mode?: TimelineMode
  /** 默认值 */
  defaultValue?: TimeValue | TimeRange
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 时间轴数据组件属性
 */
export interface TimelineDataProps {
  /** 时间点模式 */
  point?: boolean
  /** 时间段模式 */
  range?: boolean
}

/**
 * 时间轴刻度组件属性
 */
export interface TimelineScaleProps {
  /** 刻度模式 */
  scale?: boolean
  /** 按钮模式 */
  button?: boolean
  /** 时间轴刻度步长（分钟） */
  step?: number
  /** 时间指针拖动步长（分钟） */
  dragStep?: number
  /** 显示今日标记 */
  showToday?: boolean
  /** 显示日期过渡 */
  showTransition?: boolean
  /** 最小时间 */
  min?: TimeValue
  /** 最大时间 */
  max?: TimeValue
}

/**
 * 时间选择器组件属性
 */
export interface TimelinePickerProps {
  /** 时间格式 */
  format?: string
  /** 占位符 */
  placeholder?: string | [string, string]
  /** 是否禁用 */
  disabled?: boolean
  /** 显示时间选择 */
  showTime?: boolean
  /** 允许清除 */
  allowClear?: boolean
}

/**
 * 时间轴事件
 */
export interface TimelineEvents {
  /** 值更新事件 */
  'update:modelValue': [value: TimeValue | TimeRange]
  /** 值变化事件 */
  change: [value: TimeValue | TimeRange]
  /** 时间点变化事件 */
  timeChange: [value: TimeValue]
  /** 时间段变化事件 */
  rangeChange: [value: TimeRange]
  /** 获得焦点事件 */
  focus: []
  /** 失去焦点事件 */
  blur: []
}

/**
 * 时间轴上下文
 */
export interface TimelineContext {
  /** 当前模式 */
  mode: TimelineMode
  /** 当前值 */
  currentValue: TimeValue | TimeRange
  /** 时间步长 */
  step: number
  /** 是否禁用 */
  disabled: boolean
  /** 更新值方法 */
  updateValue: (value: TimeValue | TimeRange) => void
  /** 验证值方法 */
  validateValue: (value: TimeValue | TimeRange) => boolean
  /** 设置拖拽状态 */
  setDragging?: (dragging: boolean) => void
  /** 设置焦点状态 */
  setFocused?: (focused: boolean) => void
}

/**
 * 时间刻度标记
 */
export interface TimeMark {
  /** 时间值 */
  time: Dayjs
  /** 显示标签 */
  label: string
  /** 位置百分比 */
  position: number
  /** 是否为主要刻度 */
  major: boolean
  /** 是否为今日 */
  isToday: boolean
  /** 日期类型 */
  dateType: 'yesterday' | 'today' | 'tomorrow' | 'other'
}

/**
 * 时间轴状态
 */
export interface TimelineState {
  /** 当前模式 */
  mode: TimelineMode
  /** 当前值 */
  currentValue: TimeValue | TimeRange
  /** 时间步长 */
  step: number
  /** 显示范围 */
  displayRange: {
    start: Dayjs
    end: Dayjs
  }
  /** 是否正在过渡 */
  isTransitioning: boolean
  /** 是否正在拖拽 */
  isDragging: boolean
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean
  /** 错误信息 */
  error?: string
}

/**
 * 时间轴配置
 */
export interface TimelineConfig {
  /** 默认时间格式 */
  defaultFormat: string
  /** 默认步长 */
  defaultStep: number
  /** 最小步长 */
  minStep: number
  /** 最大步长 */
  maxStep: number
  /** 是否显示毫秒 */
  showMilliseconds: boolean
  /** 时区偏移 */
  timezoneOffset: number
}

/**
 * 时间轴主题
 */
export interface TimelineTheme {
  /** 主色调 */
  primaryColor: string
  /** 背景色 */
  backgroundColor: string
  /** 边框色 */
  borderColor: string
  /** 文字色 */
  textColor: string
  /** 今日标记色 */
  todayColor: string
  /** 过去时间色 */
  pastColor: string
  /** 未来时间色 */
  futureColor: string
}

// 类型已在上面定义，无需重复导出
