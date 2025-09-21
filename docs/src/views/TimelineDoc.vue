<template>
  <div class="timeline-doc">
    <h1>时间轴组件 (Timeline)</h1>

    <section id="overview">
      <h2>概述</h2>
      <p>
        时间轴组件是一个用于时间选择和展示的交互式组件，支持时间点选择、时间段选择、多种交互模式，
        适用于气象数据时间选择、时间范围筛选等场景。
      </p>
    </section>

    <section id="installation">
      <h2>安装</h2>
      <pre class="code-block"><code>import { 
  TimelineContainer, 
  TimelineData, 
  TimelinePicker, 
  TimelineScale 
} from 'anshun-meteo-ui'</code></pre>
    </section>

    <section id="basic-usage">
      <h2>基本用法</h2>
      <h3>时间点选择</h3>
      <div class="demo-container">
        <TimelineContainer v-model="pointValue" mode="point">
          <TimelineData point>
            <TimelinePicker />
          </TimelineData>
          <TimelineScale scale :step="60" />
        </TimelineContainer>
      </div>
      <p>当前时间: {{ formatTime(pointValue) }}</p>

      <pre class="code-block"><code>&lt;template&gt;
  &lt;TimelineContainer v-model="pointValue" mode="point"&gt;
    &lt;TimelineData point&gt;
      &lt;TimelinePicker /&gt;
    &lt;/TimelineData&gt;
    &lt;TimelineScale scale :step="60" /&gt;
  &lt;/TimelineContainer&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import { TimelineContainer, TimelineData, TimelinePicker, TimelineScale } from 'anshun-meteo-ui'

const pointValue = ref(TimeUtils.now())
&lt;/script&gt;</code></pre>
    </section>

    <section id="range-usage">
      <h2>时间段选择</h2>
      <div class="demo-container">
        <TimelineContainer v-model="rangeValue" mode="range">
          <TimelineData range>
            <TimelinePicker />
          </TimelineData>
          <TimelineScale scale :step="120" />
        </TimelineContainer>
      </div>
      <p>开始时间: {{ formatTime(rangeValue.start) }}</p>
      <p>结束时间: {{ formatTime(rangeValue.end) }}</p>

      <pre
        class="code-block"
      ><code>&lt;TimelineContainer v-model="rangeValue" mode="range"&gt;
  &lt;TimelineData range&gt;
    &lt;TimelinePicker /&gt;
  &lt;/TimelineData&gt;
  &lt;TimelineScale scale :step="120" /&gt;
&lt;/TimelineContainer&gt;</code></pre>
    </section>

    <section id="button-mode">
      <h2>按钮模式</h2>
      <div class="demo-container">
        <TimelineContainer v-model="buttonValue" mode="point">
          <TimelineData point>
            <TimelinePicker />
          </TimelineData>
          <TimelineScale button :step="180" />
        </TimelineContainer>
      </div>
      <p>当前时间: {{ formatTime(buttonValue) }}</p>
    </section>

    <section id="custom-step">
      <h2>自定义步长</h2>
      <div class="demo-container">
        <TimelineContainer v-model="customStepValue" mode="point">
          <TimelineData point>
            <TimelinePicker />
          </TimelineData>
          <TimelineScale scale :step="30" :dragStep="5" />
        </TimelineContainer>
      </div>
      <p class="demo-tip">
        拖动时间指针按5分钟步长对齐，时间轴刻度按30分钟显示
      </p>
      <p>当前时间: {{ formatTime(customStepValue) }}</p>
    </section>

    <section id="disabled-state">
      <h2>禁用状态</h2>
      <div class="demo-container">
        <TimelineContainer v-model="disabledValue" mode="point" disabled>
          <TimelineData point>
            <TimelinePicker />
          </TimelineData>
          <TimelineScale scale :step="60" />
        </TimelineContainer>
      </div>
    </section>

    <section id="api">
      <h2>API</h2>

      <h3>TimelineContainer Props</h3>
      <a-table
        :columns="containerColumns"
        :data-source="containerProps"
        :pagination="false"
      />

      <h3>TimelineContainer Events</h3>
      <a-table
        :columns="eventColumns"
        :data-source="containerEvents"
        :pagination="false"
      />

      <h3>TimelineScale Props</h3>
      <a-table
        :columns="scaleColumns"
        :data-source="scaleProps"
        :pagination="false"
      />
    </section>

    <section id="time-utils">
      <h2>时间工具类</h2>
      <p>组件提供了 TimeUtils 工具类，包含常用的时间操作方法：</p>
      <ul>
        <li><code>TimeUtils.now()</code> - 获取当前时间</li>
        <li><code>TimeUtils.startOfToday()</code> - 获取今天开始时间</li>
        <li><code>TimeUtils.endOfToday()</code> - 获取今天结束时间</li>
        <li><code>TimeUtils.formatTime(value, format)</code> - 格式化时间</li>
        <li><code>TimeUtils.toDayjs(value)</code> - 转换为 Dayjs 对象</li>
      </ul>
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
  type TimeRange,
} from 'anshun-meteo-ui'

// 演示数据
const pointValue = ref<TimeValue>(TimeUtils.now())
const rangeValue = ref<TimeRange>({
  start: TimeUtils.startOfToday(),
  end: TimeUtils.endOfToday(),
})
const buttonValue = ref<TimeValue>(TimeUtils.now())
const customStepValue = ref<TimeValue>(TimeUtils.now())
const disabledValue = ref<TimeValue>(TimeUtils.now())

const formatTime = (value: TimeValue): string => {
  return TimeUtils.formatTime(value, 'YYYY-MM-DD HH:mm:ss')
}

// API表格数据
const containerColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '默认值', dataIndex: 'default', key: 'default' },
]

const containerProps = [
  {
    prop: 'v-model',
    description: '绑定值，时间点模式为 TimeValue，时间段模式为 TimeRange',
    type: 'TimeValue | TimeRange',
    default: '-',
  },
  {
    prop: 'mode',
    description: '选择模式，point 为时间点，range 为时间段',
    type: '"point" | "range"',
    default: '"point"',
  },
  {
    prop: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: 'false',
  },
]

const eventColumns = [
  { title: '事件名', dataIndex: 'event', key: 'event' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '回调参数', dataIndex: 'params', key: 'params' },
]

const containerEvents = [
  {
    event: 'change',
    description: '值改变时触发',
    params: 'value: TimeValue | TimeRange',
  },
  {
    event: 'timeChange',
    description: '时间改变时触发',
    params: 'value: TimeValue | TimeRange',
  },
  {
    event: 'focus',
    description: '获得焦点时触发',
    params: '-',
  },
  {
    event: 'blur',
    description: '失去焦点时触发',
    params: '-',
  },
]

const scaleColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '默认值', dataIndex: 'default', key: 'default' },
]

const scaleProps = [
  {
    prop: 'scale',
    description: '是否显示刻度模式',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'button',
    description: '是否显示按钮模式',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: 'step',
    description: '刻度步长（分钟）',
    type: 'number',
    default: '60',
  },
  {
    prop: 'dragStep',
    description: '拖动步长（分钟）',
    type: 'number',
    default: '与 step 相同',
  },
]
</script>

<style scoped>
.timeline-doc {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.timeline-doc h1 {
  font-size: 32px;
  margin-bottom: 32px;
  color: #262626;
}

.timeline-doc h2 {
  font-size: 24px;
  margin: 32px 0 16px 0;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.timeline-doc h3 {
  font-size: 18px;
  margin: 24px 0 12px 0;
  color: #595959;
}

.timeline-doc p {
  line-height: 1.6;
  margin-bottom: 16px;
  color: #595959;
}

.timeline-doc ul {
  margin-bottom: 16px;
  padding-left: 24px;
}

.timeline-doc li {
  margin-bottom: 8px;
  color: #595959;
}

.demo-container {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 20px;
  margin: 16px 0;
  background: #fafafa;
}

.code-block {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.code-block code {
  color: #262626;
}

.demo-tip {
  color: #8c8c8c;
  font-size: 14px;
  margin-top: 8px;
}

:deep(.ant-table) {
  margin: 16px 0;
}

:deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #d46b08;
}
</style>
