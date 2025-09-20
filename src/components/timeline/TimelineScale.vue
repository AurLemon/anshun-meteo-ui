<template>
  <div
    class="timeline-scale"
    :class="{
      'timeline-scale--scale': isScaleMode,
      'timeline-scale--button': isButtonMode,
      'timeline-scale--disabled': contextValue.disabled,
      'timeline-scale--dragging': isDragging,
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
          [`timeline-scale__mark--${mark.dateType}`]: true,
        }"
        :style="{ left: `${mark.position}%` }"
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
        :style="{ left: `${getTransitionPosition(transition.time)}%` }"
      >
        <div class="timeline-scale__transition-line"></div>
        <div class="timeline-scale__transition-label">
          {{ getTransitionLabel(transition.time, transition.type) }}
        </div>
      </div>

      <!-- 时间指针 -->
      <!-- 点模式：显示单个时间指针 -->
      <div
        v-if="dataContext.isPointMode"
        class="timeline-scale__thumb timeline-scale__thumb--point"
        :style="{ left: `${thumbPosition}%` }"
        @mousedown.stop="handleThumbMouseDown"
        @touchstart.stop.passive="handleThumbTouchStart"
      >
        <div class="timeline-scale__thumb-handle"></div>
        <div class="timeline-scale__thumb-tooltip">
          {{ currentTimeLabel }}
        </div>
      </div>

      <!-- 范围模式：显示开始和结束时间指针 -->
      <template v-if="dataContext.isRangeMode">
        <!-- 开始时间指针 -->
        <div
          class="timeline-scale__thumb timeline-scale__thumb--range-start"
          :style="{ left: `${startThumbPosition}%` }"
          @mousedown.stop="handleStartThumbMouseDown"
          @touchstart.stop.passive="handleStartThumbTouchStart"
        >
          <div class="timeline-scale__thumb-handle timeline-scale__thumb-handle--start"></div>
          <div class="timeline-scale__thumb-tooltip">
            {{ startTimeLabel }}
          </div>
        </div>

        <!-- 结束时间指针 -->
        <div
          class="timeline-scale__thumb timeline-scale__thumb--range-end"
          :style="{ left: `${endThumbPosition}%` }"
          @mousedown.stop="handleEndThumbMouseDown"
          @touchstart.stop.passive="handleEndThumbTouchStart"
        >
          <div class="timeline-scale__thumb-handle timeline-scale__thumb-handle--end"></div>
          <div class="timeline-scale__thumb-tooltip">
            {{ endTimeLabel }}
          </div>
        </div>
      </template>

      <!-- 范围选择（仅在范围模式下显示） -->
      <div
        v-if="dataContext.isRangeMode"
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
          [`timeline-scale__button--${mark.dateType}`]: true,
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
  TimelineContext,
  TimeValue,
  TimeRange,
} from '../../types/timeline'
import type { ComputedRef } from 'vue'
import type { Dayjs } from 'dayjs'

// 定义组件名称
defineOptions({
  name: 'TimelineScale',
})

// 定义 Props
const props = withDefaults(defineProps<TimelineScaleProps>(), {
  scale: true,
  button: false,
  step: 60,
  showToday: true,
  showTransition: true,
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
  setStartTime: (value: TimeValue) => boolean
  setEndTime: (value: TimeValue) => boolean
}>('timelineDataContext')

if (!timelineContext) {
  throw new Error('TimelineScale must be used within TimelineContainer')
}

if (!dataContext) {
  throw new Error(
    'TimelineScale: timelineDataContext not found. Make sure TimelineContainer provides it.',
  )
}

// 创建便于访问的计算属性
const contextValue = computed(() => timelineContext.value)

// 模板引用
const trackRef = ref<HTMLElement | null>(null)

// 内部状态
const isDragging = ref(false)
const dragType = ref<'thumb' | 'range-start' | 'range-end'>('thumb')
const currentDisplayRange = ref<{ start: Dayjs; end: Dayjs } | null>(null)
const edgeScrollTimer = ref<number | null>(null)
const lastMousePosition = ref<{ x: number; time: number } | null>(null)

// 计算属性
const isScaleMode = computed(() => {
  if (props.scale && props.button) {
    console.warn(
      'TimelineScale: Both scale and button props are set, using scale mode',
    )
    return true
  }
  return props.scale
})

const isButtonMode = computed(() => !isScaleMode.value)

const displayRange = computed(() => {
  // 如果有自定义显示范围（拖拽时），使用它
  if (currentDisplayRange.value) {
    return currentDisplayRange.value
  }

  // 否则基于当前时间计算
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
    props.step,
  )
})

const dateTransitions = computed(() => {
  if (!props.showTransition) return []
  return TimeUtils.getDateTransitions(
    displayRange.value.start,
    displayRange.value.end,
  )
})

const thumbPosition = computed(() => {
  const currentValue = dataContext.getCurrentTimeValue()
  return TimeUtils.calculatePosition(
    currentValue,
    displayRange.value.start,
    displayRange.value.end,
  )
})

const startThumbPosition = computed(() => {
  if (dataContext.isPointMode) return 0

  const range = dataContext.getCurrentTimeRange()
  return TimeUtils.calculatePosition(
    range.start,
    displayRange.value.start,
    displayRange.value.end,
  )
})

const endThumbPosition = computed(() => {
  if (dataContext.isPointMode) return 0

  const range = dataContext.getCurrentTimeRange()
  return TimeUtils.calculatePosition(
    range.end,
    displayRange.value.start,
    displayRange.value.end,
  )
})

const rangeStyle = computed(() => {
  if (dataContext.isPointMode.value) return {}

  const range = dataContext.getCurrentTimeRange()
  const startPos = TimeUtils.calculatePosition(
    range.start,
    displayRange.value.start,
    displayRange.value.end,
  )
  const endPos = TimeUtils.calculatePosition(
    range.end,
    displayRange.value.start,
    displayRange.value.end,
  )

  return {
    left: `${Math.min(startPos, endPos)}%`,
    width: `${Math.abs(endPos - startPos)}%`,
  }
})

const currentTimeLabel = computed(() => {
  const currentValue = dataContext.getCurrentTimeValue()
  return TimeUtils.formatTime(currentValue, 'HH:mm')
})

const startTimeLabel = computed(() => {
  if (dataContext.isPointMode.value) return ''

  const range = dataContext.getCurrentTimeRange()
  return TimeUtils.formatTime(range.start, 'HH:mm')
})

const endTimeLabel = computed(() => {
  if (dataContext.isPointMode.value) return ''

  const range = dataContext.getCurrentTimeRange()
  return TimeUtils.formatTime(range.end, 'HH:mm')
})

// 方法
const getTransitionPosition = (time: Dayjs): number => {
  return TimeUtils.calculatePosition(
    time,
    displayRange.value.start,
    displayRange.value.end,
  )
}

const getTransitionLabel = (time: Dayjs, type: string): string => {
  if (type === 'day-start') {
    const dateType = TimeUtils.getDateType(time)
    switch (dateType) {
      case 'today':
        return '今日'
      case 'tomorrow':
        return '明日'
      case 'yesterday':
        return '昨日'
      default:
        return time.format('MM-DD')
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
  let clientX = 0

  // 安全地检查事件类型
  if (
    event instanceof TouchEvent &&
    event.touches &&
    event.touches.length > 0
  ) {
    clientX = event.touches[0]?.clientX || 0
  } else if (event instanceof MouseEvent) {
    clientX = event.clientX
  } else {
    // 兼容性处理：检查是否有 touches 属性
    const touchEvent = event as any
    if (touchEvent.touches && touchEvent.touches.length > 0) {
      clientX = touchEvent.touches[0]?.clientX || 0
    } else {
      clientX = (event as any).clientX || 0
    }
  }

  const percentage = Math.max(
    0,
    Math.min(100, ((clientX - rect.left) / rect.width) * 100),
  )

  try {
    return TimeUtils.calculateTimeFromPosition(
      percentage,
      displayRange.value.start,
      displayRange.value.end,
    )
  } catch (error) {
    console.warn(
      'Error calculating time from event, using current time:',
      error,
    )
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
      end: currentRange.end,
    })
  }
}

const handleTouchStart = (event: TouchEvent) => {
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
      end: currentRange.end,
    })
  }
}

const handleThumbMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'thumb'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleThumbTouchStart = (event: TouchEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'thumb'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleStartThumbMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-start'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleStartThumbTouchStart = (event: TouchEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-start'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleEndThumbMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-end'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleEndThumbTouchStart = (event: TouchEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-end'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleRangeStartMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-start'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleRangeStartTouchStart = (event: TouchEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-start'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleRangeEndMouseDown = (event: MouseEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-end'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
}

const handleRangeEndTouchStart = (event: TouchEvent) => {
  if (contextValue.value.disabled) return

  // 开始拖拽时，固定当前显示范围
  currentDisplayRange.value = {
    start: displayRange.value.start,
    end: displayRange.value.end,
  }

  isDragging.value = true
  dragType.value = 'range-end'
  if (contextValue.value.setDragging) {
    contextValue.value.setDragging(true)
  }

  event.preventDefault()
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

// 边缘检测和自动滚动
const checkEdgeScroll = (event: MouseEvent | TouchEvent) => {
  if (!trackRef.value || !currentDisplayRange.value) return

  const rect = trackRef.value.getBoundingClientRect()
  let clientX = 0

  if (
    event instanceof TouchEvent &&
    event.touches &&
    event.touches.length > 0
  ) {
    clientX = event.touches[0]?.clientX || 0
  } else if (event instanceof MouseEvent) {
    clientX = event.clientX
  } else {
    const touchEvent = event as any
    if (touchEvent.touches && touchEvent.touches.length > 0) {
      clientX = touchEvent.touches[0]?.clientX || 0
    } else {
      clientX = (event as any).clientX || 0
    }
  }

  const percentage = ((clientX - rect.left) / rect.width) * 100
  const edgeThreshold = 15 // 边缘阈值 15%

  // 记录鼠标位置和时间，用于计算移动速度
  const currentTime = Date.now()
  if (lastMousePosition.value) {
    const timeDiff = currentTime - lastMousePosition.value.time
    const positionDiff = Math.abs(clientX - lastMousePosition.value.x)
    const speed = timeDiff > 0 ? positionDiff / timeDiff : 0 // 像素/毫秒

    // 基于速度调整滚动量（速度越快，滚动越快）
    const baseScrollAmount = 0.5 // 基础滚动量（小时）
    const speedMultiplier = Math.min(Math.max(speed * 100, 0.5), 3) // 限制在0.5-3倍之间
    const scrollAmount = baseScrollAmount * speedMultiplier

    if (percentage < edgeThreshold) {
      // 左边缘，向前滚动（显示更早的时间）
      const intensity = (edgeThreshold - percentage) / edgeThreshold // 距离边缘越近，强度越大
      const finalScrollAmount = scrollAmount * intensity

      currentDisplayRange.value = {
        start: currentDisplayRange.value.start.subtract(finalScrollAmount, 'hour'),
        end: currentDisplayRange.value.end.subtract(finalScrollAmount, 'hour'),
      }

      // 启动持续滚动
      startContinuousScroll('left', finalScrollAmount)
    } else if (percentage > 100 - edgeThreshold) {
      // 右边缘，向后滚动（显示更晚的时间）
      const intensity = (percentage - (100 - edgeThreshold)) / edgeThreshold
      const finalScrollAmount = scrollAmount * intensity

      currentDisplayRange.value = {
        start: currentDisplayRange.value.start.add(finalScrollAmount, 'hour'),
        end: currentDisplayRange.value.end.add(finalScrollAmount, 'hour'),
      }

      // 启动持续滚动
      startContinuousScroll('right', finalScrollAmount)
    } else {
      // 不在边缘区域，停止持续滚动
      stopContinuousScroll()
    }
  }

  // 更新鼠标位置记录
  lastMousePosition.value = { x: clientX, time: currentTime }
}

// 启动持续滚动
const startContinuousScroll = (direction: 'left' | 'right', scrollAmount: number) => {
  // 清除之前的定时器
  stopContinuousScroll()

  // 启动新的定时器，每100ms滚动一次
  edgeScrollTimer.value = window.setInterval(() => {
    if (!currentDisplayRange.value) return

    const amount = scrollAmount * 0.3 // 持续滚动时使用较小的滚动量

    if (direction === 'left') {
      currentDisplayRange.value = {
        start: currentDisplayRange.value.start.subtract(amount, 'hour'),
        end: currentDisplayRange.value.end.subtract(amount, 'hour'),
      }
    } else {
      currentDisplayRange.value = {
        start: currentDisplayRange.value.start.add(amount, 'hour'),
        end: currentDisplayRange.value.end.add(amount, 'hour'),
      }
    }
  }, 100)
}

// 停止持续滚动
const stopContinuousScroll = () => {
  if (edgeScrollTimer.value) {
    clearInterval(edgeScrollTimer.value)
    edgeScrollTimer.value = null
  }
}

// 全局事件处理
const handleGlobalMouseMove = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || contextValue.value.disabled) return

  event.preventDefault()

  // 检查边缘滚动
  checkEdgeScroll(event)

  const time = calculateTimeFromEvent(event)
  const alignedTime = TimeUtils.alignToStep(time, props.step)

  if (dragType.value === 'thumb') {
    // 时间指针拖拽：直接设置时间，不管是点模式还是范围模式
    if (dataContext.isPointMode.value) {
      dataContext.setTimeValue(alignedTime)
    } else {
      // 在范围模式下，拖拽时间指针应该移动整个范围，保持范围长度不变
      const currentRange = dataContext.getCurrentTimeRange()
      const duration = TimeUtils.toDayjs(currentRange.end).diff(
        TimeUtils.toDayjs(currentRange.start),
        'minute',
      )
      const newStart = alignedTime
      const newEnd = alignedTime.add(duration, 'minute')

      dataContext.setTimeRange({
        start: newStart,
        end: newEnd,
      })
    }
  } else if (dragType.value === 'range-start') {
    const currentRange = dataContext.getCurrentTimeRange()
    dataContext.setTimeRange({
      start: alignedTime,
      end: currentRange.end,
    })
  } else if (dragType.value === 'range-end') {
    const currentRange = dataContext.getCurrentTimeRange()
    dataContext.setTimeRange({
      start: currentRange.start,
      end: alignedTime,
    })
  }
}

const handleGlobalMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    if (contextValue.value.setDragging) {
      contextValue.value.setDragging(false)
    }

    // 停止持续滚动
    stopContinuousScroll()

    // 清除鼠标位置记录
    lastMousePosition.value = null

    // 在范围模式下，检查并修正时间顺序
    if (dataContext.isRangeMode.value) {
      const currentRange = dataContext.getCurrentTimeRange()
      const startTime = TimeUtils.toDayjs(currentRange.start)
      const endTime = TimeUtils.toDayjs(currentRange.end)

      // 如果结束时间在开始时间之前，交换它们
      if (endTime.isBefore(startTime)) {
        dataContext.setTimeRange({
          start: endTime,
          end: startTime,
        })
      }
    }

    // 拖拽结束后，清除固定的显示范围，让时间轴重新自动调整
    // 延迟一点时间，确保最后的时间更新已经完成
    setTimeout(() => {
      currentDisplayRange.value = null
    }, 100)
  }
}

// 生命周期
onMounted(() => {
  // 使用 passive: false 确保可以调用 preventDefault
  document.addEventListener('mousemove', handleGlobalMouseMove, {
    passive: false,
  })
  document.addEventListener('mouseup', handleGlobalMouseUp)
  document.addEventListener('touchmove', handleGlobalMouseMove, {
    passive: false,
  })
  document.addEventListener('touchend', handleGlobalMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
  document.removeEventListener('touchmove', handleGlobalMouseMove)
  document.removeEventListener('touchend', handleGlobalMouseUp)

  // 清理定时器
  stopContinuousScroll()
})

// 暴露方法
defineExpose({
  getTimeMarks: () => timeMarks.value,
  getDisplayRange: () => displayRange.value,
  calculateTimeFromPosition: (percentage: number) => {
    return TimeUtils.calculateTimeFromPosition(
      percentage,
      displayRange.value.start,
      displayRange.value.end,
    )
  },
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

  &--dragging {
    user-select: none;

    .timeline-scale__track {
      cursor: grabbing;
    }

    .timeline-scale__thumb {
      cursor: grabbing;
    }

    .timeline-scale__range-handle {
      cursor: grabbing;
    }
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
    background: linear-gradient(
      90deg,
      var(--timeline-past-color, #8c8c8c) 0%,
      var(--timeline-today-color, #52c41a) 50%,
      var(--timeline-future-color, #1890ff) 100%
    );
    opacity: 0.1;
    border-radius: 5px;
  }

  // 时间刻度
  &__mark {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    z-index: 1;

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

    // 点模式指针样式
    &--point {
      .timeline-scale__thumb-handle {
        background: var(--timeline-primary-color, #1890ff);
      }

      .timeline-scale__thumb-tooltip {
        background: var(--timeline-primary-color, #1890ff);

        &::after {
          border-top-color: var(--timeline-primary-color, #1890ff);
        }
      }
    }

    // 范围开始指针样式
    &--range-start {
      .timeline-scale__thumb-handle {
        background: var(--timeline-success-color, #52c41a);

        &--start {
          background: var(--timeline-success-color, #52c41a);
        }
      }

      .timeline-scale__thumb-tooltip {
        background: var(--timeline-success-color, #52c41a);

        &::after {
          border-top-color: var(--timeline-success-color, #52c41a);
        }
      }
    }

    // 范围结束指针样式
    &--range-end {
      .timeline-scale__thumb-handle {
        background: var(--timeline-warning-color, #fa8c16);

        &--end {
          background: var(--timeline-warning-color, #fa8c16);
        }
      }

      .timeline-scale__thumb-tooltip {
        background: var(--timeline-warning-color, #fa8c16);

        &::after {
          border-top-color: var(--timeline-warning-color, #fa8c16);
        }
      }
    }

    &-handle {
      width: 18px;
      height: 18px;
      background: var(--timeline-primary-color, #1890ff);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.3);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
    top: 6px;
    height: 36px;
    z-index: 2;

    &-fill {
      width: 100%;
      height: 100%;
      background: var(--timeline-primary-color, #1890ff);
      opacity: 0.3;
      border-radius: 6px;
      border: 1px solid var(--timeline-primary-color, #1890ff);
    }

    &-handle {
      position: absolute;
      top: -6px;
      width: 14px;
      height: 48px;
      background: var(--timeline-primary-color, #1890ff);
      border-radius: 3px;
      cursor: ew-resize;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;

      &--start {
        left: -7px;
      }

      &--end {
        right: -7px;
      }

      &:hover {
        background: var(--timeline-primary-color, #1890ff);
        transform: scaleX(1.2);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
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
