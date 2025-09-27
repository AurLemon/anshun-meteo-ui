<template>
  <div class="grid-view">
    <div class="element-header">
      <h4 class="element-name">{{ config.elementName }}</h4>
      <span class="element-unit">单位: {{ config.unit }}</span>
    </div>

    <!-- 统计数据表格 -->
    <div class="statistics-table">
      <table class="stat-table">
        <tbody>
          <tr v-if="showMax">
            <td class="stat-label">最大值</td>
            <td class="stat-value">{{ formatValue(stats.max) }}</td>
          </tr>
          <tr v-if="showMin">
            <td class="stat-label">最小值</td>
            <td class="stat-value">{{ formatValue(stats.min) }}</td>
          </tr>
          <tr v-if="showAvg">
            <td class="stat-label">平均值</td>
            <td class="stat-value">{{ formatValue(stats.avg) }}</td>
          </tr>
          <tr v-if="showCount">
            <td class="stat-label">数据点数</td>
            <td class="stat-value">{{ stats.count }}</td>
          </tr>
          <tr>
            <td class="stat-label">有效数据</td>
            <td class="stat-value">
              {{ stats.validCount }} / {{ stats.count }}
            </td>
          </tr>
          <tr>
            <td class="stat-label">数据完整性</td>
            <td class="stat-value">{{ completenessPercentage }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 格点数据分布信息 -->
    <div class="grid-info">
      <h5>格点数据分布</h5>
      <div class="grid-summary">
        <p>数据覆盖范围: 网格化{{ getElementTypeName() }}数据</p>
        <p>空间分辨率: 高精度格点数据</p>
        <p>数据类型: {{ getElementTypeName() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatisticsData, GridViewProps } from '../../types/meteo-data'

// 定义组件名称
defineOptions({
  name: 'GridView',
})

// 定义 Props
const props = defineProps<GridViewProps>()

// 统计配置
const statisticsConfig = computed(() => ({
  showMax: true,
  showMin: true,
  showAvg: true,
  showCount: true,
  precision: 2,
  ...props.config.statistics,
}))

// 显示控制
const showMax = computed(() => statisticsConfig.value.showMax)
const showMin = computed(() => statisticsConfig.value.showMin)
const showAvg = computed(() => statisticsConfig.value.showAvg)
const showCount = computed(() => statisticsConfig.value.showCount)

// 计算统计数据
const stats = computed((): StatisticsData => {
  if (!props.data || props.data.length === 0) {
    return {
      max: 0,
      min: 0,
      avg: 0,
      count: 0,
      validCount: 0,
    }
  }

  // 提取数值数据（假设数据是数值数组或包含value字段的对象数组）
  const values = props.data
    .map((item) => {
      if (typeof item === 'number') return item
      if (typeof item === 'object' && item !== null) {
        return Number(item.value) || Number(item.data) || 0
      }
      return Number(item) || 0
    })
    .filter((val) => !isNaN(val) && isFinite(val))

  if (values.length === 0) {
    return {
      max: 0,
      min: 0,
      avg: 0,
      count: props.data.length,
      validCount: 0,
    }
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const sum = values.reduce((acc, val) => acc + val, 0)
  const avg = sum / values.length

  return {
    max,
    min,
    avg,
    count: props.data.length,
    validCount: values.length,
  }
})

// 数据完整性百分比
const completenessPercentage = computed(() => {
  if (stats.value.count === 0) return 0
  return Math.round((stats.value.validCount / stats.value.count) * 100)
})

// 格式化数值
const formatValue = (value: number) => {
  if (isNaN(value) || !isFinite(value)) return '--'
  const formatted = value.toFixed(statisticsConfig.value.precision)
  const unit = props.config.unit || ''
  return `${formatted}${unit ? ' ' + unit : ''}`
}

// 获取要素类型名称
const getElementTypeName = () => {
  if (!props.config.elementName) return ''

  const elementMap: Record<string, string> = {
    CLDAS_TAIR: '温度',
    CLDAS_QAIR: '湿度',
    CLDAS_WIND: '风速',
    CLDAS_PRE: '降水',
    temperature: '温度',
    humidity: '湿度',
    wind: '风速',
    precipitation: '降水',
    pressure: '气压',
  }

  return elementMap[props.config.elementName] || props.config.elementName
}
</script>

<style lang="scss" scoped>
.grid-view {
  background: #fff;

  .element-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;

    .element-name {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .element-unit {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .statistics-table {
    margin-bottom: 16px;

    .stat-table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border: 1px solid #f0f0f0;

      tbody tr {
        border-bottom: 1px solid #f9f9f9;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background: #fafafa;
        }
      }

      td {
        padding: 8px 12px;
        font-size: 12px;

        &.stat-label {
          color: #8c8c8c;
          width: 80px;
          text-align: left;
        }

        &.stat-value {
          color: #333;
          font-weight: 500;
          text-align: right;
        }
      }
    }
  }

  .grid-info {
    h5 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 500;
      color: #333;
    }

    .grid-summary {
      p {
        margin: 4px 0;
        font-size: 11px;
        color: #8c8c8c;
        line-height: 1.4;
      }
    }
  }
}
</style>
