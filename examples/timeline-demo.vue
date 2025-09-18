<template>
  <div class="timeline-demo">
    <h1>时间轴组件演示</h1>
    
    <!-- 基本时间点选择 -->
    <section class="demo-section">
      <h2>基本时间点选择</h2>
      <p>当前时间: {{ formatTime(pointValue) }}</p>
      
      <TimelineContainer v-model="pointValue" mode="point">
        <TimelineData point>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale scale :step="60" />
      </TimelineContainer>
    </section>
    
    <!-- 时间段选择 -->
    <section class="demo-section">
      <h2>时间段选择</h2>
      <p>
        开始时间: {{ formatTime(rangeValue.start) }}<br>
        结束时间: {{ formatTime(rangeValue.end) }}
      </p>
      
      <TimelineContainer v-model="rangeValue" mode="range">
        <TimelineData range>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale scale :step="120" />
      </TimelineContainer>
    </section>
    
    <!-- 按钮模式 -->
    <section class="demo-section">
      <h2>按钮模式时间选择</h2>
      <p>当前时间: {{ formatTime(buttonValue) }}</p>
      
      <TimelineContainer v-model="buttonValue" mode="point">
        <TimelineData point>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale button :step="180" />
      </TimelineContainer>
    </section>
    
    <!-- 自定义步长 -->
    <section class="demo-section">
      <h2>自定义步长 (3分钟)</h2>
      <p>当前时间: {{ formatTime(customStepValue) }}</p>
      
      <TimelineContainer v-model="customStepValue" mode="point">
        <TimelineData point>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale scale :step="3" />
      </TimelineContainer>
    </section>
    
    <!-- 禁用状态 -->
    <section class="demo-section">
      <h2>禁用状态</h2>
      <p>当前时间: {{ formatTime(disabledValue) }}</p>
      
      <TimelineContainer v-model="disabledValue" mode="point" disabled>
        <TimelineData point>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale scale :step="60" />
      </TimelineContainer>
    </section>
    
    <!-- 事件监听 -->
    <section class="demo-section">
      <h2>事件监听</h2>
      <p>最后一次变化: {{ lastChangeTime }}</p>
      
      <TimelineContainer 
        v-model="eventValue" 
        mode="point"
        @change="handleChange"
        @timeChange="handleTimeChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <TimelineData point>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale scale :step="30" />
      </TimelineContainer>
    </section>
    
    <!-- 控制按钮 -->
    <section class="demo-section">
      <h2>程序控制</h2>
      <div class="control-buttons">
        <button @click="setToNow">设置为当前时间</button>
        <button @click="setToToday">设置为今天开始</button>
        <button @click="setToTomorrow">设置为明天开始</button>
        <button @click="addHour">增加1小时</button>
        <button @click="subtractHour">减少1小时</button>
      </div>
      
      <TimelineContainer v-model="controlValue" mode="point">
        <TimelineData point>
          <TimelinePicker />
        </TimelineData>
        <TimelineScale scale :step="60" />
      </TimelineContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TimelineContainer,
  TimelineData,
  TimelinePicker,
  TimelineScale,
  TimeUtils,
  type TimeValue,
  type TimeRange
} from '../src/components/timeline'

// 响应式数据
const pointValue = ref<TimeValue>(TimeUtils.now())
const rangeValue = ref<TimeRange>({
  start: TimeUtils.startOfToday(),
  end: TimeUtils.endOfToday()
})
const buttonValue = ref<TimeValue>(TimeUtils.now())
const customStepValue = ref<TimeValue>(TimeUtils.now())
const disabledValue = ref<TimeValue>(TimeUtils.now())
const eventValue = ref<TimeValue>(TimeUtils.now())
const controlValue = ref<TimeValue>(TimeUtils.now())

// 事件状态
const lastChangeTime = ref<string>('')

// 方法
const formatTime = (value: TimeValue): string => {
  return TimeUtils.formatTime(value, 'YYYY-MM-DD HH:mm:ss')
}

const handleChange = (value: TimeValue) => {
  lastChangeTime.value = `Change: ${formatTime(value)} at ${new Date().toLocaleTimeString()}`
}

const handleTimeChange = (value: TimeValue) => {
  lastChangeTime.value = `TimeChange: ${formatTime(value)} at ${new Date().toLocaleTimeString()}`
}

const handleFocus = () => {
  lastChangeTime.value = `Focus at ${new Date().toLocaleTimeString()}`
}

const handleBlur = () => {
  lastChangeTime.value = `Blur at ${new Date().toLocaleTimeString()}`
}

// 控制方法
const setToNow = () => {
  controlValue.value = TimeUtils.now()
}

const setToToday = () => {
  controlValue.value = TimeUtils.startOfToday()
}

const setToTomorrow = () => {
  controlValue.value = TimeUtils.startOfToday().add(1, 'day')
}

const addHour = () => {
  controlValue.value = TimeUtils.toDayjs(controlValue.value).add(1, 'hour')
}

const subtractHour = () => {
  controlValue.value = TimeUtils.toDayjs(controlValue.value).subtract(1, 'hour')
}
</script>

<style scoped>
.timeline-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
}

.demo-section p {
  margin: 10px 0;
  color: #666;
  font-family: monospace;
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-buttons button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.control-buttons button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.control-buttons button:active {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .timeline-demo {
    padding: 10px;
  }
  
  .demo-section {
    padding: 15px;
  }
  
  .control-buttons {
    flex-direction: column;
  }
  
  .control-buttons button {
    width: 100%;
  }
}
</style>
