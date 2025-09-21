<template>
  <div
    class="timeline-data"
    :class="{
      'timeline-data--point': isPointMode,
      'timeline-data--range': isRangeMode,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, computed, provide } from 'vue'
import type { TimelineDataProps, TimelineContext } from '../../types/timeline'
import type { ComputedRef } from 'vue'

defineOptions({
  name: 'TimelineData',
})

const props = withDefaults(defineProps<TimelineDataProps>(), {
  point: false,
  range: false,
})

// 注入父组件上下文
const timelineContext = inject<ComputedRef<TimelineContext>>('timelineContext')!
const parentDataContext = inject<{
  isPointMode: ComputedRef<boolean>
  isRangeMode: ComputedRef<boolean>
  getCurrentTimeValue: () => any
  getCurrentTimeRange: () => any
  setTimeValue: (value: any) => boolean
  setTimeRange: (range: any) => boolean
  formatTimeValue: (value: any) => string
  normalizeValue: (value: any) => any
  setStartTime: (value: any) => boolean
  setEndTime: (value: any) => boolean
  isValidating: ComputedRef<boolean>
}>('timelineDataContext')!

// 计算当前模式
const isPointMode = computed(() => {
  if (props.point && props.range) {
    console.warn(
      'TimelineData: Both point and range props are set, using point mode',
    )
    return true
  }

  if (props.point) return true
  if (props.range) return false

  // 如果都没设置，使用父组件的模式
  return timelineContext.value.mode === 'point'
})

const isRangeMode = computed(() => !isPointMode.value)

// 创建新的 dataContext，覆盖模式信息
const dataContext = {
  ...parentDataContext,
  isPointMode,
  isRangeMode,
}

// 提供新的 dataContext 给子组件
provide('timelineDataContext', dataContext)

defineExpose({
  isPointMode,
  isRangeMode,
})
</script>

<style lang="scss" scoped>
.timeline-data {
  position: relative;

  &--point {
    // 时间点模式特定样式
    // 暂时先不写
  }

  &--range {
    // 时间段模式特定样式
    // 暂时先不写
  }
}
</style>
