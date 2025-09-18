<template>
  <div 
    class="timeline-scale"
    :class="{
      'timeline-scale--scale': isScaleMode,
      'timeline-scale--button': isButtonMode,
      'timeline-scale--disabled': contextValue.disabled
    }"
  >
    <!-- 刻度模式 -->
    <div 
      v-if="isScaleMode"
      ref="trackRef"
      class="timeline-scale__track"
      @mousedown="handleMouseDown"
      @touchstart.passive="handleTouchStart"
    >
      <!-- 时间轴背景 -->
      <div class="timeline-scale__background"></div>
      
      <!-- 时间刻度 -->
      <div 
        v-for="mark in timeMarks"
        :key="mark.time.valueOf()"
        class="timeline-scale__mark"
        :class="{
          'timeline-scale__mark--major': mark.major,
          'timeline-scale__mark--today': mark.isToday,
          [`timeline-scale__mark--${mark.dateType}`]: true
        }"
        :style="{ left: mark.position + '%' }"
      >
        <div class="timeline-scale__mark-line"></div>
        <div class="timeline-scale__mark-label">{{ mark.label }}</div>
      </div>
      
      <!-- 日期过渡标记 -->
      <div 
        v-if="showTransition"
        v-for="transition in dateTransitions"
        :key="transition.time.valueOf()"
        class="timeline-scale__transition"
        :class="`timeline-scale__transition--${transition.type}`"
        :style="{ left: getTransitionPosition(transition.time) + '%' }"
      >
        <div class="timeline-scale__transition-line"></div>
        <div class="timeline-scale__transition-label">
          {{ getTransitionLabel(transition.time, transition.type) }}
        </div>
      </div>
      
      <!-- 时间指针 -->
      <div 
        class="timeline-scale__thumb"
        :style="{ left: thumbPosition + '%' }"
        @mousedown.stop="handleThumbMouseDown"
        @touchstart.stop.passive="handleThumbTouchStart"
      >
        <div class="timeline-scale__thumb-handle"></div>
        <div class="timeline-scale__thumb-tooltip">
          {{ currentTimeLabel }}
        </div>
      </div>
      
      <!-- 范围选择（仅在范围模式下显示） -->
      <div 
        v-if="dataContext.isRangeMode.value"
        class="timeline-scale__range"
        :style="rangeStyle"
      >
        <div class="timeline-scale__range-fill"></div>
        <div 
          class="timeline-scale__range-handle timeline-scale__range-handle--start"
          @mousedown.stop="handleRangeStartMouseDown"
          @touchstart.stop.passive="handleRangeStartTouchStart"
        ></div>
        <div 
          class="timeline-scale__range-handle timeline-scale__range-handle--end"
          @mousedown.stop="handleRangeEndMouseDown"
          @touchstart.stop.passive="handleRangeEndTouchStart"
        ></div>
      </div>
    </div>
    
    <!-- 按钮模式 -->
    <div v-else class="timeline-scale__buttons">
      <button
        v-for="mark in timeMarks"
        :key="mark.time.valueOf()"
        class="timeline-scale__button"
        :class="{
          'timeline-scale__button--active': isActiveTime(mark.time),
          'timeline-scale__button--today': mark.isToday,
          [`timeline-scale__button--${mark.dateType}`]: true
        }"
        @click="handleButtonClick(mark.time)"
      >
        {{ mark.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import { TimeUtils } from '../../utils/time'
import type {
  TimelineScaleProps,
  TimelineContext
} from '../../types/timeline'
import type { ComputedRef } from 'vue'
import type { Dayjs } from 'dayjs'

// 定义组件名称
defineOptions({
  name: 'TimelineScale'
})

// 定义 Props
const props = withDefaults(defineProps<TimelineScaleProps>(), {
  scale: true,
  button: false,
  step: 60,
  showToday: true,
  showTransition: true
})

// 注入上下文
const timelineContext = inject<ComputedRef<TimelineContext>>('timelineContext')
const dataContext = inject<any>('timelineDataContext')

if (!timelineContext) {
  throw new Error('TimelineScale must be used within TimelineContainer')
}

if (!dataContext) {
  throw new Error('TimelineScale: timelineDataContext not found. Make sure TimelineContainer provides it.')
}

// 创建便于访问的计算属性
const contextValue = computed(() => timelineContext.value)



// 模板引用
const trackRef = ref<HTMLElement>()

// 内部状态
const isDragging = ref(false)
const dragType = ref<'thumb' | 'range-start' | 'range-end'>('thumb')

// 计算属性
const isScaleMode = computed(() => {
  if (props.scale && props.button) {
    console.warn('TimelineScale: Both scale and button props are set, using scale mode')
    return true
  }
  return props.scale
})

const isButtonMode = computed(() => !isScaleMode.value)

const displayRange = computed(() => {
  try {
    const currentValue = dataContext.getCurrentTimeValue()
    return TimeUtils.getDisplayRange(currentValue, 24)
  } catch (error) {
    console.warn('Error getting display range, using current time:', error)
    return TimeUtils.getDisplayRange(TimeUtils.now(), 24)
  }
})

const timeMarks = computed(() => {
  return TimeUtils.generateTimeMarks(
    displayRange.value.start,
    displayRange.value.end,
    props.step
  )
})

const dateTransitions = computed(() => {
  if (!props.showTransition) return []
  return TimeUtils.getDateTransitions(
    displayRange.value.start,
    displayRange.value.end
  )
})

const thumbPosition = computed(() => {
  const currentValue = dataContext.getCurrentTimeValue()
  return TimeUtils.calculatePosition(
    currentValue,
    displayRange.value.start,
    displayRange.value.end
  )
})

const rangeStyle = computed(() => {
  if (dataContext.isPointMode.value) return {}
  
  const range = dataContext.getCurrentTimeRange()
  const startPos = TimeUtils.calculatePosition(
    range.start,
    displayRange.value.start,
    displayRange.value.end
  )
  const endPos = TimeUtils.calculatePosition(
    range.end,
    displayRange.value.start,
    displayRange.value.end
  )
  
  return {
    left: Math.min(startPos, endPos) + '%',
    width: Math.abs(endPos - startPos) + '%'
  }
})

const currentTimeLabel = computed(() => {
  const currentValue = dataContext.getCurrentTimeValue()
  return TimeUtils.formatTime(currentValue, 'HH:mm')
})

// 方法
const getTransitionPosition = (time: Dayjs): number => {
  return TimeUtils.calculatePosition(
    time,
    displayRange.value.start,
    displayRange.value.end
  )
}

const getTransitionLabel = (time: Dayjs, type: string): string => {
  if (type === 'day-start') {
    const dateType = TimeUtils.getDateType(time)
    switch (dateType) {
      case 'today': return '今日'
      case 'tomorrow': return '明日'
      case 'yesterday': return '昨日'
      default: return time.format('MM-DD')
    }
  }
  return ''
}

const isActiveTime = (time: Dayjs): boolean => {
  const currentValue = dataContext.getCurrentTimeValue()
  const current = TimeUtils.toDayjs(currentValue)
  return time.isSame(current, 'minute')
}

const calculateTimeFromEvent = (event: MouseEvent | TouchEvent): Dayjs => {
  if (!trackRef.value) return TimeUtils.now()

  const rect = trackRef.value.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0]?.clientX || 0 : event.clientX
  const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))

  try {
    return TimeUtils.calculateTimeFromPosition(
      percentage,
      displayRange.value.start,
      displayRange.value.end
    )
  } catch (error) {
    console.warn('Error calculating time from event, using current time:', error)
    return TimeUtils.now()
  }
}

// 事件处理
const handleMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return
  
  const time = calculateTimeFromEvent(event)
  const alignedTime = TimeUtils.alignToStep(time, props.step)
  
  if (dataContext.isPointMode.value) {
    dataContext.setTimeValue(alignedTime)
  } else {
    // 在范围模式下，点击设置开始时间
    const currentRange = dataContext.getCurrentTimeRange()
    dataContext.setTimeRange({
      start: alignedTime,
      end: currentRange.end
    })
  }
}

const handleTouchStart = (event: TouchEvent) => {
  handleMouseDown(event as any)
}

const handleThumbMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  isDragging.value = true
  dragType.value = 'thumb'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleThumbTouchStart = (event: TouchEvent) => {
  handleThumbMouseDown(event as any)
}

const handleRangeStartMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  isDragging.value = true
  dragType.value = 'range-start'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleRangeStartTouchStart = (event: TouchEvent) => {
  handleRangeStartMouseDown(event as any)
}

const handleRangeEndMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  isDragging.value = true
  dragType.value = 'range-end'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleRangeEndTouchStart = (event: TouchEvent) => {
  handleRangeEndMouseDown(event as any)
}

const handleButtonClick = (time: Dayjs) => {
  if (contextValue.value.disabled) return
  
  const alignedTime = TimeUtils.alignToStep(time, props.step)
  
  if (dataContext.isPointMode.value) {
    dataContext.setTimeValue(alignedTime)
  } else {
    // 在范围模式下，设置为以该时间为中心的时间段
    const duration = props.step
    const start = alignedTime
    const end = alignedTime.add(duration, 'minute')
    
    dataContext.setTimeRange({ start, end })
  }
}

// 全局事件处理
const handleGlobalMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || contextValue.value.disabled) return

  const time = calculateTimeFromEvent(event)
  const alignedTime = TimeUtils.alignToStep(time, props.step)

  if (dragType.value === 'thumb') {
    if (dataContext.isPointMode.value) {
      dataContext.setTimeValue(alignedTime)
    }
  } else if (dragType.value === 'range-start') {
    dataContext.setStartTime(alignedTime)
  } else if (dragType.value === 'range-end') {
    dataContext.setEndTime(alignedTime)
  }
}

const handleGlobalMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    if (contextValue.value.setDragging) {
      contextValue.value.setDragging(false)
    }
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseup', handleGlobalMouseUp)
  document.addEventListener('touchmove', handleGlobalMouseMove as any)
  document.addEventListener('touchend', handleGlobalMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
  document.removeEventListener('touchmove', handleGlobalMouseMove as any)
  document.removeEventListener('touchend', handleGlobalMouseUp)
})

// 暴露方法
defineExpose({
  getTimeMarks: () => timeMarks.value,
  getDisplayRange: () => displayRange.value,
  calculateTimeFromPosition: (percentage: number) => {
    return TimeUtils.calculateTimeFromPosition(
      percentage,
      displayRange.value.start,
      displayRange.value.end
    )
  }
})
</script>

<style lang="scss" scoped>
.timeline-scale {
  position: relative;
  width: 100%;
  min-height: 48px;
  margin-top: 16px;

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  // 刻度模式样式
  &__track {
    position: relative;
    height: 48px;
    background: var(--timeline-background-color, #f5f5f5);
    border: 1px solid var(--timeline-border-color, #d9d9d9);
    border-radius: 6px;
    cursor: pointer;
    overflow: visible;

    &:hover {
      border-color: var(--timeline-primary-color, #1890ff);
    }
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      var(--timeline-past-color, #8c8c8c) 0%,
      var(--timeline-today-color, #52c41a) 50%,
      var(--timeline-future-color, #1890ff) 100%);
    opacity: 0.1;
    border-radius: 5px;
  }

  // 时间刻度
  &__mark {
    position: absolute;
    top: 0;
    transform: translateX(-50%);

    &-line {
      width: 1px;
      height: 12px;
      background: var(--timeline-border-color, #d9d9d9);
      margin: 0 auto;
    }

    &-label {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: var(--timeline-text-color, #666);
      white-space: nowrap;
      user-select: none;
    }

    &--major {
      .timeline-scale__mark-line {
        height: 16px;
        background: var(--timeline-text-color, #666);
      }

      .timeline-scale__mark-label {
        font-weight: 500;
        color: var(--timeline-text-color, #333);
      }
    }

    &--today {
      .timeline-scale__mark-line {
        background: var(--timeline-today-color, #52c41a);
      }

      .timeline-scale__mark-label {
        color: var(--timeline-today-color, #52c41a);
        font-weight: 600;
      }
    }

    &--yesterday {
      .timeline-scale__mark-label {
        color: var(--timeline-past-color, #8c8c8c);
      }
    }

    &--tomorrow {
      .timeline-scale__mark-label {
        color: var(--timeline-future-color, #1890ff);
      }
    }
  }

  // 日期过渡标记
  &__transition {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    z-index: 2;

    &-line {
      width: 2px;
      height: 48px;
      background: var(--timeline-primary-color, #1890ff);
      margin: 0 auto;
      opacity: 0.6;
    }

    &-label {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      color: var(--timeline-primary-color, #1890ff);
      background: white;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--timeline-primary-color, #1890ff);
      white-space: nowrap;
      user-select: none;
    }
  }

  // 时间指针
  &__thumb {
    position: absolute;
    top: -8px;
    transform: translateX(-50%);
    z-index: 3;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &-handle {
      width: 16px;
      height: 16px;
      background: var(--timeline-primary-color, #1890ff);
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.2);
      }
    }

    &-tooltip {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--timeline-primary-color, #1890ff);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      user-select: none;

      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: var(--timeline-primary-color, #1890ff);
      }
    }
  }

  // 范围选择
  &__range {
    position: absolute;
    top: 8px;
    height: 32px;
    z-index: 2;

    &-fill {
      width: 100%;
      height: 100%;
      background: var(--timeline-primary-color, #1890ff);
      opacity: 0.2;
      border-radius: 4px;
    }

    &-handle {
      position: absolute;
      top: -4px;
      width: 12px;
      height: 40px;
      background: var(--timeline-primary-color, #1890ff);
      border-radius: 2px;
      cursor: ew-resize;

      &--start {
        left: -6px;
      }

      &--end {
        right: -6px;
      }

      &:hover {
        background: var(--timeline-primary-color, #1890ff);
        opacity: 0.8;
      }
    }
  }

  // 按钮模式样式
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
  }

  &__button {
    padding: 6px 12px;
    border: 1px solid var(--timeline-border-color, #d9d9d9);
    border-radius: 4px;
    background: white;
    color: var(--timeline-text-color, #666);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;

    &:hover {
      border-color: var(--timeline-primary-color, #1890ff);
      color: var(--timeline-primary-color, #1890ff);
    }

    &--active {
      background: var(--timeline-primary-color, #1890ff);
      border-color: var(--timeline-primary-color, #1890ff);
      color: white;
    }

    &--today {
      border-color: var(--timeline-today-color, #52c41a);
      color: var(--timeline-today-color, #52c41a);

      &.timeline-scale__button--active {
        background: var(--timeline-today-color, #52c41a);
        border-color: var(--timeline-today-color, #52c41a);
      }
    }

    &--yesterday {
      color: var(--timeline-past-color, #8c8c8c);
      border-color: var(--timeline-past-color, #8c8c8c);
    }

    &--tomorrow {
      color: var(--timeline-future-color, #1890ff);
      border-color: var(--timeline-future-color, #1890ff);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .timeline-scale {
    &__track {
      height: 40px;
    }

    &__mark-label {
      font-size: 10px;
    }

    &__thumb-tooltip {
      font-size: 10px;
    }

    &__button {
      padding: 4px 8px;
      font-size: 11px;
    }
  }
}
</style>
