# 时间轴组件设计规划文档

## 项目概述

为 anshun-meteo-ui 第三方库开发一套完整的时间轴组件系统，支持时间点和时间段选择，具备灵活的组合式设计。

## 需求分析

### 核心功能需求

1. **时间选择模式**
   - 单独时间点选择（point 模式）
   - 时间段选择（range 模式，包含 start 和 end）

2. **组件组合**
   - 支持灵活的组件组合使用
   - 数据部分和显示部分可独立配置

3. **时间轴显示**
   - 刻度模式（scale）：显示时间刻度
   - 按钮模式：点击选择特定时段
   - 可配置时间步长（step 参数）

4. **时间过渡**
   - 支持今日、明日、昨日的时间过渡
   - 清晰的时间区分显示

5. **外部访问**
   - 外部组件可访问和监听时间值变化
   - 支持双向数据绑定

### 技术需求

- 基于 Vue 3 + TypeScript
- 使用 Composition API
- 集成 ant-design-vue 时间选择器
- 使用 dayjs 处理时间逻辑
- 支持响应式设计

## 组件架构设计

### 组件层次结构

```
TimelineContainer (容器组件)
├── TimelineData (数据管理组件)
│   └── TimelinePicker (时间选择器组件)
└── TimelineScale (时间轴显示组件)
```

### 组件职责

#### TimelineContainer
- 作为根容器，管理全局状态
- 提供上下文（Context）给子组件
- 处理组件间的通信
- 暴露外部 API

#### TimelineData
- 管理时间数据状态
- 支持 point 和 range 两种模式
- 处理时间验证和格式化
- 提供数据给其他组件

#### TimelinePicker
- 基于 ant-design-vue 的时间选择器
- 支持时间点和时间段两种选择模式
- 处理用户输入和验证

#### TimelineScale
- 时间轴的可视化显示
- 支持刻度模式和按钮模式
- 可配置时间步长
- 处理拖拽和点击交互

## API 设计

### 基本用法

```vue
<template>
  <TimelineContainer>
    <!-- 时间点模式 -->
    <TimelineData point>
      <TimelinePicker />
    </TimelineData>
    
    <!-- 时间轴显示 -->
    <TimelineScale scale :step="60" />
  </TimelineContainer>
</template>
```

### 时间段模式

```vue
<template>
  <TimelineContainer>
    <!-- 时间段模式 -->
    <TimelineData range>
      <TimelinePicker />
    </TimelineData>
    
    <!-- 按钮模式时间轴 -->
    <TimelineScale button :step="120" />
  </TimelineContainer>
</template>
```

### Props 定义

#### TimelineContainer
```typescript
interface TimelineContainerProps {
  modelValue?: TimeValue | TimeRange
  mode?: 'point' | 'range'
  defaultValue?: TimeValue | TimeRange
}
```

#### TimelineData
```typescript
interface TimelineDataProps {
  point?: boolean  // 时间点模式
  range?: boolean  // 时间段模式（默认）
}
```

#### TimelineScale
```typescript
interface TimelineScaleProps {
  scale?: boolean   // 刻度模式（默认）
  button?: boolean  // 按钮模式
  step?: number     // 时间步长（分钟，默认60）
  showToday?: boolean    // 显示今日标记
  showTransition?: boolean // 显示日期过渡
}
```

#### TimelinePicker
```typescript
interface TimelinePickerProps {
  format?: string   // 时间格式
  placeholder?: string | [string, string]
  disabled?: boolean
}
```

### Events

```typescript
interface TimelineEvents {
  'update:modelValue': (value: TimeValue | TimeRange) => void
  'change': (value: TimeValue | TimeRange) => void
  'timeChange': (value: TimeValue) => void  // 时间点变化
  'rangeChange': (value: TimeRange) => void // 时间段变化
}
```

### 类型定义

```typescript
type TimeValue = number | Date | dayjs.Dayjs

interface TimeRange {
  start: TimeValue
  end: TimeValue
}

interface TimelineContext {
  mode: 'point' | 'range'
  currentValue: TimeValue | TimeRange
  step: number
  updateValue: (value: TimeValue | TimeRange) => void
}
```

## 实现计划

### 第一阶段：项目准备
1. 添加必要依赖包（ant-design-vue, dayjs）
2. 创建类型定义文件
3. 设计组件文件结构

### 第二阶段：核心组件开发
1. 实现 TimelineContainer 容器组件
2. 实现 TimelineData 数据管理组件
3. 实现 TimelinePicker 选择器组件
4. 实现 TimelineScale 时间轴组件

### 第三阶段：功能完善
1. 实现样式系统
2. 添加时间过渡功能
3. 完善外部访问接口
4. 添加动画效果

### 第四阶段：文档和示例
1. 编写 API 文档
2. 创建使用示例
3. 添加单元测试

## 文件组织结构

```
src/
├── components/
│   └── timeline/
│       ├── index.ts                 # 导出文件
│       ├── TimelineContainer.vue    # 容器组件
│       ├── TimelineData.vue         # 数据组件
│       ├── TimelinePicker.vue       # 选择器组件
│       ├── TimelineScale.vue        # 时间轴组件
│       ├── composables/
│       │   ├── useTimeline.ts       # 时间轴逻辑
│       │   ├── useTimelineData.ts   # 数据管理
│       │   └── useTimelineScale.ts  # 时间轴显示
│       └── styles/
│           └── timeline.scss        # 样式文件
├── types/
│   └── timeline.ts                  # 类型定义
└── utils/
    └── time.ts                      # 时间工具函数
```

## 设计原则

1. **组合优于继承**：使用组合式 API 和组件组合
2. **单一职责**：每个组件只负责特定功能
3. **可扩展性**：预留扩展接口，支持自定义
4. **类型安全**：完整的 TypeScript 类型定义
5. **用户友好**：简洁的 API 设计，清晰的文档

## 兼容性考虑

- Vue 3.0+ 支持
- 现代浏览器支持
- 移动端响应式设计
- 无障碍访问支持

## 后续扩展

1. 支持更多时间格式
2. 添加时间范围限制
3. 支持自定义主题
4. 添加国际化支持
5. 性能优化和虚拟滚动
