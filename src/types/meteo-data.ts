/**
 * 表格列配置
 */
export interface ColumnConfig {
  /** 对应 data item 的字段名 */
  key: string
  /** 表格列头显示的文字 */
  title: string
  /** 列宽 */
  width?: number
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 自定义渲染函数 */
  customRender?: (value: any, record: any, index: number) => string
}

/**
 * 站点数据（表格视图）的配置
 */
export interface StationConfig {
  type: 'station'
  /** 定义表格需要展示哪些列，以及它们的标题和样式 */
  columns: ColumnConfig[]
  /** 指定哪个字段用于数值排序和单位显示 */
  valueField: string
  /** 指定数值的单位 */
  unit: string
  /** 默认排序规则 */
  initialSortOrder?: 'asc' | 'desc'
  /** 指定数据项中用于地图交互的字段 */
  mapKeys: {
    /** 唯一标识符 */
    id: string
    /** 纬度字段 */
    lat: string
    /** 经度字段 */
    lon: string
  }
  /** 分页配置 */
  pagination?: {
    pageSize?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
  }
  /** 外部事件配置 */
  externalEvents?: ExternalEventConfig
  /** 是否显示异常值行 */
  showInvalidRows?: boolean
  /** 异常值判断函数 */
  isInvalidValue?: (value: any) => boolean
}



/**
 * CLDAS格点数据（统计摘要视图）的配置
 */
export interface GridConfig {
  type: 'grid'
  /** 需要展示的元素名称 */
  elementName: string
  /** 单位 */
  unit: string
  /** 统计项配置 */
  statistics?: {
    /** 是否显示最大值 */
    showMax?: boolean
    /** 是否显示最小值 */
    showMin?: boolean
    /** 是否显示平均值 */
    showAvg?: boolean
    /** 是否显示总数 */
    showCount?: boolean
    /** 数值精度 */
    precision?: number
  }
}

/**
 * 配置联合类型
 */
export type MeteoDataConfig = StationConfig | GridConfig

/**
 * MeteoDataCard 组件的 Props
 */
export interface MeteoDataCardProps {
  /** 核心配置对象，决定了组件如何渲染 */
  config: MeteoDataConfig
  /** 从API获取的原始数据数组 */
  data: any[]
  /** 控制加载状态的布尔值 */
  isLoading: boolean
  /** 卡片顶部显示的标题 */
  title?: string
  /** 当前高亮的数据项ID，用于地图到列表的联动 */
  highlightedId?: string | number
}

/**
 * MeteoDataCard 组件的事件
 */
export interface MeteoDataCardEvents {
  /** 当用户在组件内部选择一个数据项时触发 */
  'item-select': [item: any]
  /** 当数据项被高亮时触发 */
  'item-highlight': [item: any]
  /** 当数据项失去高亮时触发 */
  'item-unhighlight': [item: any]
  /** 当分页改变时触发 */
  'page-change': [page: number, pageSize: number]
  /** 当表格行被点击时触发（包含全局索引） */
  'row-click': [record: any, globalIndex: number]
}



/**
 * 统计数据
 */
export interface StatisticsData {
  /** 最大值 */
  max: number
  /** 最小值 */
  min: number
  /** 平均值 */
  avg: number
  /** 总数 */
  count: number
  /** 有效数据数量 */
  validCount: number
}

/**
 * 表格排序信息
 */
export interface SortInfo {
  /** 排序字段 */
  field: string
  /** 排序方向 */
  order: 'asc' | 'desc'
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  /** 当前页 */
  current: number
  /** 每页大小 */
  pageSize: number
  /** 总数 */
  total: number
}

/**
 * StationTableView 组件属性
 */
export interface StationTableProps {
  config: StationConfig
  data: any[]
  highlightedId?: string | number
}



/**
 * GridView 组件属性
 */
export interface GridViewProps {
  config: GridConfig
  data: any[]
}

/**
 * 外部事件监听配置
 */
export interface ExternalEventConfig {
  /** 是否启用图例点击监听 */
  enableLegendClick?: boolean
  /** 是否启用地图标记点击监听 */
  enableMarkerClick?: boolean
  /** 是否启用站点选择监听 */
  enableStationSelect?: boolean
  /** 自动清除高亮的延迟时间（毫秒） */
  autoUnhighlightDelay?: number
}

/**
 * 增强的站点配置
 */
export interface EnhancedStationConfig extends StationConfig {
  /** 外部事件配置 */
  externalEvents?: ExternalEventConfig
  /** 是否显示异常值行 */
  showInvalidRows?: boolean
  /** 异常值判断函数 */
  isInvalidValue?: (value: any) => boolean
}
