<template>
  <div class="legend-bar-container" :style="containerStyle">
    <!-- 颜色条 -->
    <div class="legend-bar" :style="legendBarStyle">
      <div
        v-for="(segment, index) in processedData.segments"
        :key="index"
        class="legend-bar-item"
        :style="{
          backgroundColor: segment.color,
          flex: getSegmentFlex(segment),
        }"
        @click="handleItemClick(segment, index)"
        @mouseenter="handleItemHover(segment, index)"
        @mouseleave="handleItemLeave(segment, index)"
      />
    </div>

    <!-- 数值标签 -->
    <div v-if="showLabels" class="legend-labels" :style="labelsStyle">
      <div
        v-for="(label, index) in processedData.labels"
        :key="index"
        class="legend-label"
        :style="{ left: `${label.position}%` }"
      >
        {{ label.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  LegendBarProps,
  LegendBarEvents,
  LegendRange,
  ProcessedLegendData,
  LegendBarItem,
} from '../../types/legend'

// 定义组件名称
defineOptions({
  name: 'LegendBar',
})

// 定义 Props
const props = withDefaults(defineProps<LegendBarProps>(), {
  count: 3,
  width: 259,
  height: 9,
  minWidth: 200,
  showBorder: true,
  borderColor: '#000',
  showLabels: true,
})

// 定义 Events
const emit = defineEmits<LegendBarEvents>()

// 默认颜色和数值
const defaultColors = [
  'white',
  'rgb(253, 255, 31)',
  'rgb(0, 254, 17)',
  'rgb(33, 254, 254)',
  'rgb(44, 0, 254)',
  'rgb(255, 32, 255)',
  'rgb(126, 13, 38)',
  'rgb(255, 165, 0)',
  'rgb(128, 0, 128)',
  'rgb(0, 0, 0)',
]

const defaultValues = [0, 0.1, 10, 25, 50, 100, 250, 500, 750, 1000]

// 处理数据
const processedData = computed((): ProcessedLegendData => {
  // 优先使用 ranges 配置
  if (props.ranges && props.ranges.length > 0) {
    return processRangesData(props.ranges)
  }

  // 使用传统配置方式
  return processTraditionalData()
})

// 处理区间配置数据
const processRangesData = (ranges: LegendRange[]): ProcessedLegendData => {
  const segments: LegendBarItem[] = ranges.map((range, index) => ({
    color: range.color,
    min: range.min,
    max: range.max,
    label: range.label || `${range.min}-${range.max}`,
    index,
  }))

  // 生成数值标签（区间的边界值）
  const valueSet = new Set<number>()
  ranges.forEach((range) => {
    valueSet.add(range.min)
    valueSet.add(range.max)
  })

  const sortedValues = Array.from(valueSet).sort((a, b) => a - b)
  const totalRange = sortedValues[sortedValues.length - 1] - sortedValues[0]

  const labels = sortedValues.map((value) => ({
    value,
    label: formatLabel(value),
    position:
      totalRange === 0 ? 0 : ((value - sortedValues[0]) / totalRange) * 100,
  }))

  return { segments, labels }
}

// 处理传统配置数据
const processTraditionalData = (): ProcessedLegendData => {
  const count = Math.max(1, Math.min(10, props.count || 3))
  const colors = props.colors || defaultColors.slice(0, count)
  const values = props.values || defaultValues.slice(0, count + 1)

  const segments: LegendBarItem[] = colors.map((color, index) => ({
    color,
    min: values[index] || 0,
    max: values[index + 1] || values[index] || 0,
    label: `${values[index] || 0}-${values[index + 1] || 0}`,
    index,
  }))

  const labels = values.map((value, index) => ({
    value,
    label: formatLabel(value),
    position: values.length <= 1 ? 0 : (index / (values.length - 1)) * 100,
  }))

  return { segments, labels }
}

// 格式化标签
const formatLabel = (value: number): string => {
  if (props.labelFormatter) {
    return props.labelFormatter(value)
  }
  return value.toString()
}

// 计算段的flex值（基于数值范围）
const getSegmentFlex = (segment: LegendBarItem): number => {
  if (props.ranges && props.ranges.length > 0) {
    // 基于实际数值范围计算比例
    const range = segment.max - segment.min
    const totalRange = processedData.value.segments.reduce(
      (sum, s) => sum + (s.max - s.min),
      0,
    )
    return totalRange === 0 ? 1 : range / totalRange
  }
  // 传统方式：等分
  return 1
}

// 样式计算
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  minWidth: `${props.minWidth}px`,
}))

const legendBarStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  border: props.showBorder ? `1px solid ${props.borderColor}` : 'none',
}))

const labelsStyle = computed(() => ({
  width: '100%',
}))

// 事件处理
const handleItemClick = (item: LegendBarItem, index: number) => {
  emit('item-click', item, index)
}

const handleItemHover = (item: LegendBarItem, index: number) => {
  emit('item-hover', item, index)
}

const handleItemLeave = (item: LegendBarItem, index: number) => {
  emit('item-leave', item, index)
}
</script>

<style scoped>
.legend-bar-container {
  position: relative;
  display: inline-block;
}

.legend-bar {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.legend-bar-item {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.legend-bar-item:hover {
  opacity: 0.8;
}

.legend-labels {
  position: relative;
  margin-top: 8px;
  height: 20px;
}

.legend-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  user-select: none;
}

.legend-label:first-child {
  transform: translateX(0);
}

.legend-label:last-child {
  transform: translateX(-100%);
}
</style>
