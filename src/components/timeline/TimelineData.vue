<template>
  <div 
    class="timeline-data"
    :class="{
      'timeline-data--point': isPointMode,
      'timeline-data--range': isRangeMode
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type {
  TimelineDataProps,
  TimelineContext
} from '../../types/timeline'
import type { ComputedRef } from 'vue'

// 定义组件名称
defineOptions({
  name: 'TimelineData'
})

// 定义 Props
const props = withDefaults(defineProps<TimelineDataProps>(), {
  point: false,
  range: false
})

// 注入父组件上下文
const timelineContext = inject<ComputedRef<TimelineContext>>('timelineContext')!



// 计算当前模式
const isPointMode = computed(() => {
  if (props.point && props.range) {
    console.warn('TimelineData: Both point and range props are set, using point mode')
    return true
  }
  
  if (props.point) return true
  if (props.range) return false
  
  // 如果都没设置，使用父组件的模式
  return timelineContext.value.mode === 'point'
})

const isRangeMode = computed(() => !isPointMode.value)

// TimelineData 现在主要作为布局容器，数据逻辑由 TimelineContainer 管理

// 暴露模式计算属性给父组件
defineExpose({
  isPointMode,
  isRangeMode
})
</script>

<style lang="scss" scoped>
.timeline-data {
  position: relative;
  
  &--point {
    // 时间点模式特定样式
  }
  
  &--range {
    // 时间段模式特定样式
  }
}
</style>
