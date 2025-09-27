<template>
  <div class="meteo-data-doc">
    <h1>气象数据卡片组件 (MeteoDataCard)</h1>

    <section id="overview">
      <h2>概述</h2>
      <p>
        气象数据卡片组件是一个智能的、面向气象业务的复合组件，能够根据不同气象数据类型（如站点观测、格点产品等）
        自动切换渲染模式。它集数据展示、统计摘要、交互功能于一体，是气象系统中数据展示的核心组件。
      </p>
    </section>

    <section id="installation">
      <h2>安装</h2>
      <pre class="code-block"><code>import {
  MeteoDataCard,
  StationTableView,
  GridView
} from 'anshun-meteo-ui'</code></pre>
    </section>

    <section id="station-usage">
      <h2>站点数据表格</h2>
      <h3>温度数据展示</h3>
      <div class="demo-container">
        <MeteoDataCard
          title="实时温度排行"
          :is-loading="isStationLoading"
          :data="temperatureData"
          :config="temperatureConfig"
          :highlighted-id="selectedStationId"
          @item-select="handleStationSelect"
        />
      </div>

      <pre class="code-block"><code>&lt;template&gt;
  &lt;MeteoDataCard
    title="实时温度排行"
    :is-loading="isLoading"
    :data="temperatureData"
    :config="temperatureConfig"
    :highlighted-id="selectedStationId"
    @item-select="handleStationSelect"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import { MeteoDataCard } from 'anshun-meteo-ui'

const temperatureConfig = {
  type: 'station',
  valueField: 'temperature',
  unit: '°C',
  initialSortOrder: 'desc',
  mapKeys: { id: 'station_id', lat: 'latitude', lon: 'longitude' },
  columns: [
    { key: 'rank', title: '排名', width: 60, align: 'center' },
    { key: 'station_name', title: '站名' },
    { key: 'temperature', title: '温度', align: 'right' },
  ],
}
&lt;/script&gt;</code></pre>
    </section>

    <section id="grid-usage">
      <h2>格点数据统计</h2>
      <div class="demo-container">
        <MeteoDataCard
          title="CLDAS温度数据"
          :is-loading="isGridLoading"
          :data="gridData"
          :config="gridConfig"
        />
      </div>

      <pre class="code-block"><code>const gridConfig = {
  type: 'grid',
  elementName: '2米温度',
  unit: '°C',
  statistics: {
    showMax: true,
    showMin: true,
    showAvg: true,
    showCount: true,
    precision: 1
  }
}</code></pre>
    </section>

    <section id="api">
      <h2>API</h2>

      <h3>MeteoDataCard Props</h3>
      <a-table
        :columns="propsColumns"
        :data-source="propsData"
        :pagination="false"
      />

      <h3>MeteoDataCard Events</h3>
      <a-table
        :columns="eventColumns"
        :data-source="eventData"
        :pagination="false"
      />

      <h3>配置类型</h3>
      <h4>StationConfig (站点配置)</h4>
      <a-table
        :columns="configColumns"
        :data-source="stationConfigData"
        :pagination="false"
      />

      <h4>GridConfig (格点配置)</h4>
      <a-table
        :columns="configColumns"
        :data-source="gridConfigData"
        :pagination="false"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MeteoDataCard } from 'anshun-meteo-ui'

// 演示数据
const isStationLoading = ref(false)
const isGridLoading = ref(false)
const selectedStationId = ref(null)

// 模拟温度数据
const temperatureData = ref([
  {
    station_id: '001',
    station_name: '北京',
    temperature: 25.6,
    latitude: 39.9,
    longitude: 116.4,
  },
  {
    station_id: '002',
    station_name: '上海',
    temperature: 28.3,
    latitude: 31.2,
    longitude: 121.5,
  },
  {
    station_id: '003',
    station_name: '广州',
    temperature: 32.1,
    latitude: 23.1,
    longitude: 113.3,
  },
  {
    station_id: '004',
    station_name: '深圳',
    temperature: 31.8,
    latitude: 22.5,
    longitude: 114.1,
  },
  {
    station_id: '005',
    station_name: '杭州',
    temperature: 27.9,
    latitude: 30.3,
    longitude: 120.2,
  },
])

// 模拟格点数据
const gridData = ref([
  { value: 25.6 },
  { value: 28.3 },
  { value: 32.1 },
  { value: 31.8 },
  { value: 27.9 },
  { value: 24.2 },
  { value: 29.7 },
  { value: 33.4 },
  { value: 30.1 },
  { value: 26.8 },
])

// 配置对象
const temperatureConfig = {
  type: 'station',
  valueField: 'temperature',
  unit: '°C',
  initialSortOrder: 'desc',
  mapKeys: { id: 'station_id', lat: 'latitude', lon: 'longitude' },
  columns: [
    { key: 'rank', title: '排名', width: 60, align: 'center' },
    { key: 'station_name', title: '站名' },
    { key: 'temperature', title: '温度', align: 'right' },
  ],
}

const gridConfig = {
  type: 'grid',
  elementName: '2米温度',
  unit: '°C',
  statistics: {
    showMax: true,
    showMin: true,
    showAvg: true,
    showCount: true,
    precision: 1,
  },
}

// 事件处理
const handleStationSelect = (station: any) => {
  console.log('选中站点:', station)
  selectedStationId.value = station.station_id
}

// API表格数据
const propsColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '默认值', dataIndex: 'default', key: 'default' },
]

const propsData = [
  {
    prop: 'config',
    description: '配置对象，决定组件渲染模式',
    type: 'StationConfig | GridConfig',
    default: '-',
  },
  {
    prop: 'data',
    description: '数据数组',
    type: 'any[]',
    default: '[]',
  },
  {
    prop: 'isLoading',
    description: '加载状态',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: 'title',
    description: '卡片标题',
    type: 'string',
    default: '-',
  },
  {
    prop: 'highlightedId',
    description: '高亮项ID',
    type: 'string | number',
    default: '-',
  },
]

const eventColumns = [
  { title: '事件名', dataIndex: 'event', key: 'event' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '回调参数', dataIndex: 'params', key: 'params' },
]

const eventData = [
  {
    event: 'item-select',
    description: '选择数据项时触发',
    params: 'item: any',
  },

  {
    event: 'item-highlight',
    description: '高亮数据项时触发',
    params: 'item: any',
  },
  {
    event: 'item-unhighlight',
    description: '取消高亮时触发',
    params: 'item: any',
  },
]

const configColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '必填', dataIndex: 'required', key: 'required' },
]

const stationConfigData = [
  { prop: 'type', description: '配置类型', type: '"station"', required: '是' },
  {
    prop: 'columns',
    description: '表格列配置',
    type: 'ColumnConfig[]',
    required: '是',
  },
  {
    prop: 'valueField',
    description: '数值字段名',
    type: 'string',
    required: '是',
  },
  { prop: 'unit', description: '数值单位', type: 'string', required: '是' },
  {
    prop: 'mapKeys',
    description: '地图交互字段',
    type: 'object',
    required: '是',
  },
]

const gridConfigData = [
  { prop: 'type', description: '配置类型', type: '"grid"', required: '是' },
  {
    prop: 'elementName',
    description: '要素名称',
    type: 'string',
    required: '是',
  },
  { prop: 'unit', description: '数值单位', type: 'string', required: '是' },
  {
    prop: 'statistics',
    description: '统计配置',
    type: 'object',
    required: '否',
  },
]
</script>

<style scoped>
.meteo-data-doc {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.meteo-data-doc h1 {
  font-size: 32px;
  margin-bottom: 32px;
  color: #262626;
}

.meteo-data-doc h2 {
  font-size: 24px;
  margin: 32px 0 16px 0;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.meteo-data-doc h3 {
  font-size: 18px;
  margin: 24px 0 12px 0;
  color: #595959;
}

.meteo-data-doc h4 {
  font-size: 16px;
  margin: 20px 0 8px 0;
  color: #595959;
}

.meteo-data-doc p {
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
