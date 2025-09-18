<template>
  <div 
    class="timeline-container"
    :class="{
      'timeline-container--disabled': disabled,
      'timeline-container--point': mode === 'point',
      'timeline-container--range': mode === 'range'
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, computed, watch } from 'vue'
import { TimeUtils } from '../../utils/time'
import type {
  TimelineContainerProps,
  TimelineContext,
  TimeValue,
  TimeRange,
  TimelineMode
} from '../../types/timeline'

// 定义组件名称
defineOptions({
  name: 'TimelineContainer'
})

// 定义 Props
const props = withDefaults(defineProps<TimelineContainerProps>(), {
  mode: 'point',
  disabled: false
})

// 定义 Emits
const emit = defineEmits<{
  'update:modelValue': [value: TimeValue | TimeRange]
  'change': [value: TimeValue | TimeRange]
  'timeChange': [value: TimeValue]
  'rangeChange': [value: TimeRange]
  'focus': []
  'blur': []
}>()

// 内部状态
const getInitialValue = () => {
  if (props.modelValue) {
    // 验证传入的值是否有效
    if (validateValue(props.modelValue)) {
      return props.modelValue
    } else {
      console.warn('Invalid initial modelValue, using default:', props.modelValue)
    }
  }

  // 使用默认值
  return props.mode === 'point' ? TimeUtils.now() : {
    start: TimeUtils.startOfToday(),
    end: TimeUtils.endOfToday()
  }
}

const state = reactive({
  currentValue: getInitialValue(),
  step: 60,
  isDragging: false,
  isFocused: false
})

// 计算属性
const mode = computed<TimelineMode>(() => props.mode)

const currentValue = computed({
  get: () => props.modelValue || state.currentValue,
  set: (value: TimeValue | TimeRange) => {
    updateValue(value)
  }
})

// 方法
const updateValue = (value: TimeValue | TimeRange) => {
  // 验证值的有效性
  if (!validateValue(value)) {
    console.warn('Invalid time value:', value)
    // 提供回退机制：使用当前时间或默认时间范围
    const fallbackValue = mode.value === 'point'
      ? TimeUtils.now()
      : { start: TimeUtils.startOfToday(), end: TimeUtils.endOfToday() }

    console.warn('Using fallback value:', fallbackValue)
    state.currentValue = fallbackValue
    emit('update:modelValue', fallbackValue)
    emit('change', fallbackValue)

    if (mode.value === 'point') {
      emit('timeChange', fallbackValue as TimeValue)
    } else {
      emit('rangeChange', fallbackValue as TimeRange)
    }
    return
  }

  // 更新内部状态
  state.currentValue = value

  // 触发事件
  emit('update:modelValue', value)
  emit('change', value)

  // 根据模式触发特定事件
  if (mode.value === 'point') {
    emit('timeChange', value as TimeValue)
  } else {
    emit('rangeChange', value as TimeRange)
  }
}

const validateValue = (value: TimeValue | TimeRange): boolean => {
  if (mode.value === 'point') {
    return TimeUtils.validateTimeValue(value as TimeValue).valid
  } else {
    return TimeUtils.validateTimeRange(value as TimeRange).valid
  }
}

const setStep = (newStep: number) => {
  if (newStep > 0) {
    state.step = newStep
  }
}

const setDragging = (dragging: boolean) => {
  state.isDragging = dragging
}

const setFocused = (focused: boolean) => {
  state.isFocused = focused
  if (focused) {
    emit('focus')
  } else {
    emit('blur')
  }
}

// 监听 props 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined && newValue !== state.currentValue) {
      // 验证新值是否有效
      if (validateValue(newValue)) {
        state.currentValue = newValue
      } else {
        console.warn('Invalid modelValue received, ignoring:', newValue)
        // 不更新状态，保持当前有效值
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.mode,
  (newMode) => {
    // 模式切换时重置值
    if (newMode === 'point') {
      const pointValue = TimeUtils.now()
      state.currentValue = pointValue
      updateValue(pointValue)
    } else {
      const rangeValue = {
        start: TimeUtils.startOfToday(),
        end: TimeUtils.endOfToday()
      }
      state.currentValue = rangeValue
      updateValue(rangeValue)
    }
  }
)

// 数据管理方法
const formatTimeValue = (value: TimeValue): string => {
  return TimeUtils.formatTime(value)
}

const normalizeValue = (value: TimeValue | TimeRange): TimeValue | TimeRange => {
  if (typeof value === 'object' && 'start' in value && 'end' in value) {
    return {
      start: TimeUtils.toDayjs(value.start),
      end: TimeUtils.toDayjs(value.end)
    }
  }
  return TimeUtils.toDayjs(value as TimeValue)
}

const getCurrentTimeValue = (): TimeValue => {
  if (mode.value === 'range') {
    const range = currentValue.value as TimeRange
    return range.start
  }
  return currentValue.value as TimeValue
}

const getCurrentTimeRange = (): TimeRange => {
  if (mode.value === 'point') {
    const point = currentValue.value as TimeValue
    return {
      start: point,
      end: TimeUtils.toDayjs(point).add(1, 'hour')
    }
  }
  return currentValue.value as TimeRange
}

const setTimeValue = (value: TimeValue): boolean => {
  updateValue(value)
  return true
}

const setTimeRange = (range: TimeRange): boolean => {
  updateValue(range)
  return true
}

const setStartTime = (value: TimeValue): boolean => {
  if (mode.value === 'range') {
    const currentRange = getCurrentTimeRange()
    const newRange: TimeRange = {
      start: value,
      end: currentRange.end
    }
    updateValue(newRange)
    return true
  }
  return setTimeValue(value)
}

const setEndTime = (value: TimeValue): boolean => {
  if (mode.value === 'range') {
    const currentRange = getCurrentTimeRange()
    const newRange: TimeRange = {
      start: currentRange.start,
      end: value
    }
    updateValue(newRange)
    return true
  }
  return setTimeValue(value)
}

// 提供完整的上下文给子组件
const timelineContext = computed<TimelineContext>(() => ({
  mode: mode.value,
  currentValue: currentValue.value,
  step: state.step,
  disabled: props.disabled,
  updateValue,
  validateValue,
  setDragging,
  setFocused
}))

const dataContext = reactive({
  isPointMode: computed(() => mode.value === 'point'),
  isRangeMode: computed(() => mode.value === 'range'),
  formatTimeValue,
  normalizeValue,
  getCurrentTimeValue,
  getCurrentTimeRange,
  setTimeValue,
  setTimeRange,
  setStartTime,
  setEndTime,
  isValidating: computed(() => false)
})

provide('timelineContext', timelineContext)
provide('timelineDataContext', dataContext)

// 暴露方法给父组件
defineExpose({
  updateValue,
  validateValue,
  setStep,
  setDragging,
  setFocused,
  getCurrentValue: () => state.currentValue,
  getStep: () => state.step,
  isDragging: () => state.isDragging,
  isFocused: () => state.isFocused
})
</script>

<style lang="scss" scoped>
.timeline-container {
  position: relative;
  width: 100%;
  min-height: 48px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
    background: #f5f5f5;
  }

  &--point {
    // 时间点模式特定样式
  }

  &--range {
    // 时间段模式特定样式
  }
}
</style>
