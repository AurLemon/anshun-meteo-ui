<template>
  <div class="legend-doc">
    <h1>图例条组件 (LegendBar)</h1>

    <section id="overview">
      <h2>概述</h2>
      <p>
        图例条组件是一个用于显示颜色图例和数值标签的可视化组件，支持自定义颜色数量、颜色配置、数值标签等，
        适用于气象数据可视化、数据图表图例展示等场景。
      </p>
    </section>

    <section id="installation">
      <h2>安装</h2>
      <pre class="code-block"><code>import { LegendBar } from 'anshun-meteo-ui'</code></pre>
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

    <section id="custom-count">
      <h2>自定义数量</h2>
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
      <p class="demo-tip">
        组件会自动限制count值在1-10之间
      </p>
    </section>

    <section id="api">
      <h2>API</h2>

      <h3>LegendBar Props</h3>
      <a-table
        :columns="propsColumns"
        :data-source="propsData"
        :pagination="false"
      />

      <h3>颜色配置</h3>
      <p>组件内置了10种预设颜色，按顺序显示：</p>
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

      <h3>数值配置</h3>
      <p>组件内置了对应的数值标签：</p>
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

// API表格数据
const propsColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '默认值', dataIndex: 'default', key: 'default' },
]

const propsData = [
  {
    prop: 'count',
    description: '图例条数量，会自动限制在1-10之间',
    type: 'number',
    default: '3',
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
