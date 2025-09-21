<template>
  <div class="timeline-picker">
    <!-- 时间点模式 -->
    <ADatePicker
      v-if="dataContext.isPointMode.value"
      :value="pointValue"
      :format="format"
      :placeholder="pointPlaceholder"
      :disabled="contextValue.disabled || disabled"
      :show-time="showTime"
      :allow-clear="allowClear"
      class="timeline-picker__input"
      @change="handlePointChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- 时间段模式 -->
    <ARangePicker
      v-else
      :value="rangeValue"
      :format="format"
      :placeholder="rangePlaceholder"
      :disabled="contextValue.disabled || disabled"
      :show-time="showTime"
      :allow-clear="allowClear"
      class="timeline-picker__input"
      @change="handleRangeChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import { DatePicker as ADatePicker } from 'ant-design-vue'
import { TimeUtils } from '../../utils/time'
import type { TimelinePickerProps, TimelineContext, TimeValue, TimeRange } from '../../types/timeline'
import type { ComputedRef } from 'vue'
import type { Dayjs } from 'dayjs'

// 注册 ant-design-vue 组件
const ARangePicker = ADatePicker.RangePicker

// 定义组件名称
defineOptions({
  name: 'TimelinePicker',
})

// 定义 Props
const props = withDefaults(defineProps<TimelinePickerProps>(), {
  format: 'YYYY-MM-DD HH:mm:ss',
  placeholder: '',
  disabled: false,
  showTime: true,
  allowClear: true,
})

// 注入上下文
const timelineContext = inject<ComputedRef<TimelineContext>>('timelineContext')
const dataContext = inject<{
  isPointMode: ComputedRef<boolean>
  isRangeMode: ComputedRef<boolean>
  getCurrentTimeValue: () => TimeValue
  getCurrentTimeRange: () => TimeRange
  setTimeValue: (value: TimeValue) => boolean
  setTimeRange: (range: TimeRange) => boolean
}>('timelineDataContext')

if (!timelineContext) {
  throw new Error('TimelinePicker must be used within TimelineContainer')
}

if (!dataContext) {
  throw new Error('TimelinePicker: timelineDataContext not found')
}

// 创建便于访问的计算属性
const contextValue = computed(() => timelineContext.value)

// 内部状态
const isFocused = ref(false)

// 计算属性
const pointValue = computed(() => {
  if (dataContext.isPointMode.value) {
    const value = contextValue.value.currentValue as TimeValue
    return TimeUtils.toDayjs(value)
  }
  return undefined
})

const rangeValue = computed(() => {
  if (dataContext.isRangeMode.value) {
    const range = contextValue.value.currentValue as TimeRange
    if (range && typeof range === 'object' && 'start' in range && 'end' in range) {
      return [TimeUtils.toDayjs(range.start), TimeUtils.toDayjs(range.end)] as [
        Dayjs,
        Dayjs,
      ]
    }
  }
  return undefined
})

const pointPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder as string
  }
  return '请选择时间'
})

const rangePlaceholder = computed(() => {
  if (props.placeholder) {
    if (Array.isArray(props.placeholder)) {
      return props.placeholder
    }
    return [props.placeholder, props.placeholder]
  }
  return ['开始时间', '结束时间']
})

// 事件处理
const handlePointChange = (value: string | Dayjs) => {
  if (value) {
    const dayjsValue =
      typeof value === 'string' ? TimeUtils.toDayjs(value) : value
    dataContext.setTimeValue(dayjsValue)
  }
}

const handleRangeChange = (values: [string, string] | [Dayjs, Dayjs]) => {
  if (values && values.length === 2) {
    const [start, end] = values
    if (start && end) {
      const startDayjs =
        typeof start === 'string' ? TimeUtils.toDayjs(start) : start
      const endDayjs = typeof end === 'string' ? TimeUtils.toDayjs(end) : end
      dataContext.setTimeRange({
        start: startDayjs,
        end: endDayjs,
      })
    }
  }
}

const handleFocus = () => {
  isFocused.value = true
  if (contextValue.value.setFocused) {
    contextValue.value.setFocused(true)
  }
}

const handleBlur = () => {
  isFocused.value = false
  if (contextValue.value.setFocused) {
    contextValue.value.setFocused(false)
  }
}

// 暴露方法
defineExpose({
  focus: () => {
    // 可添加聚焦逻辑 先不写
  },
  blur: () => {
    // 可添加失焦逻辑 先不写
  },
  isFocused: () => isFocused.value,
})
</script>

<style lang="scss" scoped>
.timeline-picker {
  display: flex;
  align-items: center;

  &__input {
    width: 100%;

    :deep(.ant-picker) {
      border-color: var(--timeline-border-color, #d9d9d9);
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        border-color: var(--timeline-primary-color, #1890ff);
      }

      &:focus,
      &.ant-picker-focused {
        border-color: var(--timeline-primary-color, #1890ff);
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }

      &.ant-picker-disabled {
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
      }
    }

    :deep(.ant-picker-input) {
      input {
        font-family: inherit;

        &::placeholder {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }

    :deep(.ant-picker-suffix) {
      color: rgba(0, 0, 0, 0.25);
    }

    :deep(.ant-picker-clear) {
      background-color: rgba(0, 0, 0, 0.25);

      &:hover {
        background-color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .timeline-picker {
    &__input {
      :deep(.ant-picker) {
        font-size: 14px;
      }
    }
  }
}
</style>
