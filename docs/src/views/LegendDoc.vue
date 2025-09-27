<template>
  <div class="legend-doc">
    <h1>图例条组件 (LegendBar)</h1>

    <section id="overview">
      <h2>概述</h2>
      <p>
        图例条组件是一个用于显示颜色图例和数值标签的可视化组件，支持灵活的区间配置、自定义颜色和数值范围，
        适用于气象数据可视化、数据图表图例展示等场景。组件支持两种配置方式：新的区间配置方式和传统的数量配置方式。
      </p>
    </section>

    <section id="installation">
      <h2>安装</h2>
      <pre
        class="code-block"
      ><code>import { LegendBar } from 'anshun-meteo-ui'</code></pre>
    </section>

    <section id="basic-usage">
      <h2>基本用法</h2>
      <h3>默认图例条</h3>
      <div class="demo-container">
        <LegendBar />
      </div>
      <p>默认显示3个颜色段的图例条</p>

      <pre class="code-block"><code>&lt;template&gt;
  &lt;LegendBar /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { LegendBar } from 'anshun-meteo-ui'
&lt;/script&gt;</code></pre>
    </section>

    <section id="ranges-usage">
      <h2>区间配置方式（推荐）</h2>
      <h3>自定义颜色和数值区间</h3>
      <div class="demo-container">
        <LegendBar :ranges="temperatureRanges" />
      </div>
      <p>使用区间配置可以精确控制每个颜色段对应的数值范围</p>

      <pre class="code-block"><code>&lt;template&gt;
  &lt;LegendBar :ranges="temperatureRanges" /&gt;
&lt;/template&gt;

&lt;script setup&gt;
const temperatureRanges = [
  { min: -10, max: 0, color: '#0066cc' },
  { min: 0, max: 10, color: '#00ccff' },
  { min: 10, max: 20, color: '#66ff66' },
  { min: 20, max: 30, color: '#ffff00' },
  { min: 30, max: 40, color: '#ff6600' }
]
&lt;/script&gt;</code></pre>

      <h3>降水量图例</h3>
      <div class="demo-container">
        <LegendBar :ranges="precipitationRanges" />
      </div>

      <pre class="code-block"><code>const precipitationRanges = [
  { min: 0, max: 0.1, color: 'white', label: '无降水' },
  { min: 0.1, max: 10, color: '#90EE90', label: '小雨' },
  { min: 10, max: 25, color: '#32CD32', label: '中雨' },
  { min: 25, max: 50, color: '#FFD700', label: '大雨' },
  { min: 50, max: 100, color: '#FF4500', label: '暴雨' }
]</code></pre>
    </section>

    <section id="custom-count">
      <h2>传统配置方式（向后兼容）</h2>
      <h3>自定义数量</h3>
      <div class="demo-container">
        <LegendBar :count="5" />
      </div>
      <p>当前显示: {{ customCount }} 个颜色段</p>

      <pre class="code-block"><code>&lt;LegendBar :count="5" /&gt;</code></pre>
    </section>

    <section id="different-counts">
      <h2>不同数量示例</h2>
      <div class="demo-container">
        <div class="legend-group">
          <div class="legend-item">
            <h4>最小数量 (1个)</h4>
            <LegendBar :count="1" />
          </div>
          <div class="legend-item">
            <h4>中等数量 (6个)</h4>
            <LegendBar :count="6" />
          </div>
          <div class="legend-item">
            <h4>最大数量 (10个)</h4>
            <LegendBar :count="10" />
          </div>
        </div>
      </div>
    </section>

    <section id="boundary-test">
      <h2>边界值测试</h2>
      <div class="demo-container">
        <div class="legend-group">
          <div class="legend-item">
            <h4>超出下限 (count=0，实际显示1个)</h4>
            <LegendBar :count="0" />
          </div>
          <div class="legend-item">
            <h4>超出上限 (count=15，实际显示10个)</h4>
            <LegendBar :count="15" />
          </div>
        </div>
      </div>
      <p class="demo-tip">组件会自动限制count值在1-10之间</p>
    </section>

    <section id="style-config">
      <h2>样式配置</h2>
      <h3>自定义宽度和高度</h3>
      <div class="demo-container">
        <LegendBar
          :ranges="temperatureRanges"
          :width="400"
          :height="15"
          :min-width="300"
        />
      </div>

      <pre class="code-block"><code>&lt;LegendBar
  :ranges="temperatureRanges"
  :width="400"
  :height="15"
  :min-width="300"
/&gt;</code></pre>

      <h3>隐藏边框和标签</h3>
      <div class="demo-container">
        <LegendBar
          :ranges="temperatureRanges"
          :show-border="false"
          :show-labels="false"
        />
      </div>

      <pre class="code-block"><code>&lt;LegendBar
  :ranges="temperatureRanges"
  :show-border="false"
  :show-labels="false"
/&gt;</code></pre>
    </section>

    <section id="api">
      <h2>API</h2>

      <h3>LegendBar Props</h3>
      <a-table
        :columns="propsColumns"
        :data-source="propsData"
        :pagination="false"
      />

      <h3>LegendRange 类型</h3>
      <a-table
        :columns="rangeColumns"
        :data-source="rangeData"
        :pagination="false"
      />

      <h3>事件</h3>
      <a-table
        :columns="eventColumns"
        :data-source="eventData"
        :pagination="false"
      />

      <h3>默认颜色配置</h3>
      <p>传统配置方式使用的内置颜色：</p>
      <div class="color-list">
        <div
          v-for="(color, index) in defaultColors"
          :key="index"
          class="color-item"
        >
          <div class="color-box" :style="{ backgroundColor: color }"></div>
          <span class="color-text">{{ color }}</span>
        </div>
      </div>

      <h3>默认数值配置</h3>
      <p>传统配置方式使用的内置数值：</p>
      <div class="value-list">
        <span
          v-for="(value, index) in defaultValues"
          :key="index"
          class="value-item"
        >
          {{ value }}
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LegendBar } from 'anshun-meteo-ui'

// 演示数据
const customCount = ref(5)

// 温度区间配置
const temperatureRanges = ref([
  { min: -10, max: 0, color: '#0066cc' },
  { min: 0, max: 10, color: '#00ccff' },
  { min: 10, max: 20, color: '#66ff66' },
  { min: 20, max: 30, color: '#ffff00' },
  { min: 30, max: 40, color: '#ff6600' },
])

// 降水量区间配置
const precipitationRanges = ref([
  { min: 0, max: 0.1, color: 'white', label: '无降水' },
  { min: 0.1, max: 10, color: '#90EE90', label: '小雨' },
  { min: 10, max: 25, color: '#32CD32', label: '中雨' },
  { min: 25, max: 50, color: '#FFD700', label: '大雨' },
  { min: 50, max: 100, color: '#FF4500', label: '暴雨' },
])

// API表格数据
const propsColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '默认值', dataIndex: 'default', key: 'default' },
]

const propsData = [
  {
    prop: 'ranges',
    description: '区间配置数组，优先级最高',
    type: 'LegendRange[]',
    default: '-',
  },
  {
    prop: 'count',
    description: '图例条数量，会自动限制在1-10之间（传统方式）',
    type: 'number',
    default: '3',
  },
  {
    prop: 'colors',
    description: '自定义颜色数组（传统方式）',
    type: 'string[]',
    default: '-',
  },
  {
    prop: 'values',
    description: '自定义数值数组（传统方式）',
    type: 'number[]',
    default: '-',
  },
  {
    prop: 'width',
    description: '图例条宽度',
    type: 'number | string',
    default: '259',
  },
  {
    prop: 'height',
    description: '图例条高度',
    type: 'number | string',
    default: '9',
  },
  {
    prop: 'minWidth',
    description: '最小宽度',
    type: 'number',
    default: '200',
  },
  {
    prop: 'showBorder',
    description: '是否显示边框',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'borderColor',
    description: '边框颜色',
    type: 'string',
    default: '#000',
  },
  {
    prop: 'showLabels',
    description: '是否显示数值标签',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'labelFormatter',
    description: '数值标签格式化函数',
    type: '(value: number) => string',
    default: '-',
  },
]

// LegendRange 类型表格
const rangeColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '必填', dataIndex: 'required', key: 'required' },
]

const rangeData = [
  {
    prop: 'min',
    description: '区间最小值',
    type: 'number',
    required: '是',
  },
  {
    prop: 'max',
    description: '区间最大值',
    type: 'number',
    required: '是',
  },
  {
    prop: 'color',
    description: '区间颜色',
    type: 'string',
    required: '是',
  },
  {
    prop: 'label',
    description: '可选的自定义标签',
    type: 'string',
    required: '否',
  },
]

// 事件表格
const eventColumns = [
  { title: '事件名', dataIndex: 'event', key: 'event' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '回调参数', dataIndex: 'params', key: 'params' },
]

const eventData = [
  {
    event: 'item-click',
    description: '点击图例项时触发',
    params: 'item: LegendBarItem, index: number',
  },
  {
    event: 'item-hover',
    description: '鼠标悬停图例项时触发',
    params: 'item: LegendBarItem, index: number',
  },
  {
    event: 'item-leave',
    description: '鼠标离开图例项时触发',
    params: 'item: LegendBarItem, index: number',
  },
]

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
</script>

<style scoped>
.legend-doc {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.legend-doc h1 {
  font-size: 32px;
  margin-bottom: 32px;
  color: #262626;
}

.legend-doc h2 {
  font-size: 24px;
  margin: 32px 0 16px 0;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.legend-doc h3 {
  font-size: 18px;
  margin: 24px 0 12px 0;
  color: #595959;
}

.legend-doc h4 {
  font-size: 16px;
  margin: 16px 0 8px 0;
  color: #595959;
}

.legend-doc p {
  line-height: 1.6;
  margin-bottom: 16px;
  color: #595959;
}

.demo-container {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 20px;
  margin: 16px 0;
  background: #fafafa;
}

.legend-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.legend-item {
  padding: 16px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
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

.color-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 2px;
}

.color-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
}

.value-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.value-item {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #666;
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
