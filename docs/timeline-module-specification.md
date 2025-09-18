# 时间轴模块技术规范

## 模块概述

时间轴模块是一个高度可配置的 Vue 3 组件系统，专为气象数据可视化应用设计。支持时间点和时间段选择，具备灵活的组合式架构。

## 核心特性

### 1. 双模式支持
- **Point 模式**：单一时间点选择
- **Range 模式**：时间段选择（start/end）

### 2. 灵活的时间步长
- 默认步长：60分钟
- 支持自定义步长：3分钟、120分钟等
- 智能刻度显示：0, 2, 4, 6, 8, 10...（2小时间隔示例）

### 3. 时间过渡处理
- 今日/明日/昨日自动识别
- 跨日期边界处理
- 视觉区分不同日期

### 4. 多种显示模式
- **Scale 模式**：带刻度的连续时间轴
- **Button 模式**：离散的时间段按钮

## 技术架构

### 组件层次

```
TimelineContainer
├── provide/inject 上下文管理
├── 全局状态管理
└── 事件总线

TimelineData
├── 时间数据验证
├── 格式化处理
└── 模式切换逻辑

TimelinePicker
├── Ant Design 集成
├── 自定义样式覆盖
└── 双向绑定

TimelineScale
├── Canvas/SVG 渲染
├── 交互事件处理
└── 动画效果
```

### 状态管理

```typescript
interface TimelineState {
  mode: 'point' | 'range'
  currentValue: TimeValue | TimeRange
  step: number
  displayRange: {
    start: dayjs.Dayjs
    end: dayjs.Dayjs
  }
  isTransitioning: boolean
}
```

### 核心 Composables

#### useTimeline
```typescript
export function useTimeline(props: TimelineProps) {
  const state = reactive<TimelineState>({...})
  
  const updateValue = (value: TimeValue | TimeRange) => {
    // 值更新逻辑
  }
  
  const getStepMarks = () => {
    // 生成步长标记
  }
  
  const checkDateTransition = () => {
    // 检查日期过渡
  }
  
  return {
    state,
    updateValue,
    getStepMarks,
    checkDateTransition
  }
}
```

#### useTimelineData
```typescript
export function useTimelineData(mode: 'point' | 'range') {
  const validateTimeValue = (value: unknown): boolean => {
    // 时间值验证
  }
  
  const formatTimeValue = (value: TimeValue): string => {
    // 时间格式化
  }
  
  const normalizeTimeRange = (range: TimeRange): TimeRange => {
    // 时间段标准化
  }
  
  return {
    validateTimeValue,
    formatTimeValue,
    normalizeTimeRange
  }
}
```

#### useTimelineScale
```typescript
export function useTimelineScale(step: number) {
  const generateMarks = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    // 生成时间刻度
  }
  
  const calculatePosition = (time: dayjs.Dayjs) => {
    // 计算时间在轴上的位置
  }
  
  const handleDrag = (event: MouseEvent | TouchEvent) => {
    // 处理拖拽交互
  }
  
  return {
    generateMarks,
    calculatePosition,
    handleDrag
  }
}
```

## 样式系统

### CSS 变量设计
```scss
:root {
  // 时间轴颜色
  --timeline-primary-color: #1890ff;
  --timeline-background-color: #f5f5f5;
  --timeline-border-color: #d9d9d9;
  
  // 时间过渡颜色
  --timeline-today-color: #52c41a;
  --timeline-past-color: #8c8c8c;
  --timeline-future-color: #1890ff;
  
  // 尺寸
  --timeline-height: 48px;
  --timeline-thumb-size: 16px;
  --timeline-mark-height: 8px;
}
```

### 组件样式结构
```scss
.timeline-container {
  .timeline-data {
    .timeline-picker {
      // Ant Design 样式覆盖
    }
  }
  
  .timeline-scale {
    &.scale-mode {
      // 刻度模式样式
    }
    
    &.button-mode {
      // 按钮模式样式
    }
    
    .timeline-track {
      // 时间轴轨道
    }
    
    .timeline-thumb {
      // 时间指针
    }
    
    .timeline-marks {
      // 时间刻度
    }
    
    .date-transition {
      // 日期过渡标记
    }
  }
}
```

## 交互设计

### 鼠标交互
- **点击**：快速定位到指定时间
- **拖拽**：连续调整时间值
- **滚轮**：快速跳转（可选）

### 触摸交互
- **点击**：移动端时间选择
- **滑动**：连续时间调整
- **双击**：重置到当前时间

### 键盘交互
- **左右箭头**：按步长调整时间
- **Home/End**：跳转到开始/结束时间
- **Space**：打开时间选择器

## 性能优化

### 渲染优化
```typescript
// 使用 requestAnimationFrame 优化动画
const animateThumb = (targetPosition: number) => {
  requestAnimationFrame(() => {
    // 动画逻辑
  })
}

// 防抖处理用户输入
const debouncedUpdate = debounce((value: TimeValue) => {
  emit('update:modelValue', value)
}, 100)
```

### 内存优化
```typescript
// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// 使用 shallowRef 优化大对象
const timeMarks = shallowRef<TimeMark[]>([])
```

## 数据流设计

### 单向数据流
```
Props → State → Computed → Template
  ↑                           ↓
Events ← Emit ← User Interaction
```

### 事件系统
```typescript
// 内部事件
interface InternalEvents {
  'time-drag-start': (time: TimeValue) => void
  'time-drag-move': (time: TimeValue) => void
  'time-drag-end': (time: TimeValue) => void
  'scale-click': (time: TimeValue) => void
}

// 外部事件
interface ExternalEvents {
  'update:modelValue': (value: TimeValue | TimeRange) => void
  'change': (value: TimeValue | TimeRange) => void
  'focus': () => void
  'blur': () => void
}
```

## 错误处理

### 输入验证
```typescript
const validateInput = (value: unknown): ValidationResult => {
  if (!value) return { valid: false, error: 'Value is required' }
  
  if (!dayjs(value).isValid()) {
    return { valid: false, error: 'Invalid date format' }
  }
  
  return { valid: true }
}
```

### 边界情况处理
- 无效时间值的回退机制
- 时间范围超出限制的处理
- 网络错误时的降级方案

## 测试策略

### 单元测试
- 时间计算函数测试
- 组件渲染测试
- 事件处理测试

### 集成测试
- 组件间通信测试
- 用户交互流程测试
- 边界情况测试

### 性能测试
- 大量数据渲染性能
- 频繁交互响应性能
- 内存泄漏检测

## 国际化支持

### 时间格式
```typescript
const timeFormats = {
  'zh-CN': 'YYYY-MM-DD HH:mm',
  'en-US': 'MM/DD/YYYY HH:mm',
  'ja-JP': 'YYYY年MM月DD日 HH:mm'
}
```

### 文本翻译
```typescript
const i18nTexts = {
  'zh-CN': {
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日'
  },
  'en-US': {
    today: 'Today',
    yesterday: 'Yesterday', 
    tomorrow: 'Tomorrow'
  }
}
```

## 部署和构建

### 构建配置
- Tree-shaking 支持
- CSS 提取和压缩
- TypeScript 声明文件生成

### 包大小优化
- 按需导入支持
- 外部依赖标记
- 代码分割策略
