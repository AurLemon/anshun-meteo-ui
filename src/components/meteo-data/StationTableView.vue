<template>
  <div class="station-table-view">
    <!-- 数据统计信息 -->
    <div v-if="showDataSummary" class="data-summary">
      <span class="summary-text">共 {{ totalDataCount }} 个站点</span>
    </div>

    <!-- 表格容器 -->
    <div class="table-wrapper">
      <a-table
        :columns="tableColumns"
        :data-source="paginationData"
        :pagination="false"
        :row-class-name="getRowClassName"
        :custom-row="customRow"
        size="small"
        :scroll="{ x: 'max-content' }"
        class="observation-table"
        rowKey="rank"
      >
        <!-- 自定义渲染数值列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === config.valueField">
            <span class="value-cell">
              {{ formatValue(record[config.valueField]) }} {{ config.unit }}
            </span>
          </template>
          <template v-else-if="column.key === 'rank'">
            <span class="rank-cell">{{ record.rank }}</span>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 外部分页组件 -->
    <a-pagination
      v-model:current="currentPage"
      :total="total"
      :page-size="pageSize"
      show-quick-jumper
      show-less-items
      show-size-changer
      :page-size-options="['10', '20', '50', '100']"
      @showSizeChange="onShowSizeChange"
      @change="onPageChange"
      class="pagination-container"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Table as ATable, Pagination as APagination } from 'ant-design-vue'
import type { StationTableProps } from '../../types/meteo-data'

// 定义组件名称
defineOptions({
  name: 'StationTableView',
})

// 定义 Props
const props = withDefaults(defineProps<StationTableProps>(), {
  highlightedId: undefined,
})

// 定义 Events
const emit = defineEmits<{
  'item-select': [item: any]
  'item-highlight': [item: any]
  'item-unhighlight': [item: any]
  'page-change': [page: number, pageSize: number]
  'row-click': [record: any, globalIndex: number]
}>()

// 分页状态
const currentPage = ref(1)
const pageSize = ref(props.config.pagination?.pageSize || 20)

// 数据处理 - 排序并添加排名
const sortedData = computed(() => {
  if (!props.data || props.data.length === 0) return []

  const sorted = [...props.data].sort((a, b) => {
    const valueA = Number(a[props.config.valueField]) || 0
    const valueB = Number(b[props.config.valueField]) || 0

    if (props.config.initialSortOrder === 'asc') {
      return valueA - valueB
    } else {
      return valueB - valueA
    }
  })

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
    key: item[props.config.mapKeys.id] || index,
    isInvalid: props.config.isInvalidValue ? props.config.isInvalidValue(item[props.config.valueField]) : false,
  }))
})

// 分页数据
const paginationData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedData.value.slice(start, start + pageSize.value)
})

// 总数据量
const total = computed(() => sortedData.value.length)
const totalDataCount = computed(() => props.data?.length || 0)

// 是否显示数据统计
const showDataSummary = computed(() => totalDataCount.value > 0)

// 表格列配置
const tableColumns = computed(() => {
  return props.config.columns.map(col => ({
    title: col.title,
    dataIndex: col.key,
    key: col.key,
    width: col.width,
    align: col.align || 'left',
    sorter: col.sortable ? (a: any, b: any) => {
      const valueA = Number(a[col.key]) || 0
      const valueB = Number(b[col.key]) || 0
      return valueA - valueB
    } : false,
  }))
})

// 分页事件处理
const onShowSizeChange = (_current: number, size: number) => {
  pageSize.value = size
  currentPage.value = 1
  emit('page-change', currentPage.value, pageSize.value)
}

const onPageChange = (page: number) => {
  currentPage.value = page
  emit('page-change', page, pageSize.value)
}

// 行样式类名
const getRowClassName = (record: any) => {
  let className = ''

  // 高亮选中行
  const id = record[props.config.mapKeys.id]
  if (id === props.highlightedId) {
    className += 'highlighted-row '
  }

  // 异常值行设为灰色
  if (record.isInvalid && props.config.showInvalidRows) {
    className += 'invalid-row '
  }

  return className.trim()
}

// 自定义行事件
const customRow = (record: any, index?: number) => {
  return {
    onClick: () => {
      const globalIndex = (currentPage.value - 1) * pageSize.value + (index || 0)
      emit('item-select', record)
      emit('row-click', record, globalIndex)

      // 发送自定义事件给地图组件
      window.dispatchEvent(
        new CustomEvent('station-selected', {
          detail: record,
        }),
      )

      // 自动清除高亮
      const delay = props.config.externalEvents?.autoUnhighlightDelay || 3000
      setTimeout(() => {
        emit('item-unhighlight', record)
      }, delay)
    },
    onMouseenter: () => {
      emit('item-highlight', record)
    },
    onMouseleave: () => {
      emit('item-unhighlight', record)
    },
    style: {
      cursor: 'pointer',
    },
  }
}

// 格式化数值
const formatValue = (value: any) => {
  const num = Number(value)
  if (isNaN(num)) return value
  return num.toFixed(1)
}

// 外部事件监听
const setupExternalEventListeners = () => {
  const config = props.config.externalEvents
  if (!config) return

  const handleLegendClick = (event: CustomEvent) => {
    if (!config.enableLegendClick) return

    const { highlightedIndex } = event.detail
    const targetPage = Math.floor(highlightedIndex / pageSize.value) + 1

    if (targetPage !== currentPage.value) {
      currentPage.value = targetPage
    }

    // 滚动到表格区域
    const tableContainer = document.querySelector('.station-table-view')
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleMarkerClick = (event: CustomEvent) => {
    if (!config.enableMarkerClick) return

    const { tableIndex } = event.detail
    const targetPage = Math.floor(tableIndex / pageSize.value) + 1

    if (targetPage !== currentPage.value) {
      currentPage.value = targetPage
    }

    // 滚动到表格区域
    const tableContainer = document.querySelector('.station-table-view')
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (config.enableLegendClick) {
    window.addEventListener('legend-clicked', handleLegendClick as EventListener)
  }

  if (config.enableMarkerClick) {
    window.addEventListener('marker-clicked', handleMarkerClick as EventListener)
  }

  // 组件卸载时清理监听器
  onBeforeUnmount(() => {
    if (config.enableLegendClick) {
      window.removeEventListener('legend-clicked', handleLegendClick as EventListener)
    }
    if (config.enableMarkerClick) {
      window.removeEventListener('marker-clicked', handleMarkerClick as EventListener)
    }
  })
}

// 监听数据变化，重置分页
watch(
  () => props.data,
  () => {
    currentPage.value = 1
  },
)

// 组件挂载时设置监听器
onMounted(() => {
  setupExternalEventListeners()
})
</script>

<style lang="scss" scoped>
.station-table-view {
  width: 100%;

  .data-summary {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;

    .summary-text {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #f0f0f0;
    margin-bottom: 12px;
  }

  .observation-table {
    width: 100%;
    min-width: 250px;

    :deep(.ant-table) {
      font-size: 12px;
    }

    :deep(.ant-table-thead > tr > th) {
      background-color: #fafafa;
      font-weight: 500;
      font-size: 12px;
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }

    :deep(.ant-table-tbody > tr > td) {
      font-size: 12px;
      padding: 8px 12px;
      border-bottom: 1px solid #f9f9f9;
      cursor: pointer;
      transition: background-color 0.2s;
      color: #333;
    }

    :deep(.ant-table-tbody > tr:hover > td) {
      background-color: #fafafa;
    }

    :deep(.ant-table-tbody > tr:last-child > td) {
      border-bottom: none;
    }

    // 高亮行样式
    :deep(.highlighted-row) {
      background-color: #f0f0f0 !important;

      td {
        background-color: #f0f0f0 !important;
      }
    }

    :deep(.highlighted-row:hover td) {
      background-color: #e6e6e6 !important;
    }

    // 异常值行样式
    :deep(.invalid-row) {
      color: #bfbfbf !important;
      background-color: #fafafa !important;

      td {
        color: #bfbfbf !important;
        background-color: #fafafa !important;
      }
    }

    :deep(.invalid-row:hover) {
      background-color: #f5f5f5 !important;

      td {
        background-color: #f5f5f5 !important;
      }
    }

    .value-cell {
      font-weight: 500;
      color: #333;
    }

    .rank-cell {
      font-weight: 500;
      color: #8c8c8c;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 12px;

    :deep(.ant-pagination) {
      font-size: 12px;
    }

    :deep(.ant-pagination-item) {
      font-size: 12px;
      min-width: 24px;
      height: 24px;
      line-height: 22px;
    }

    :deep(.ant-pagination-item a) {
      font-size: 12px;
    }

    :deep(.ant-pagination-prev .ant-pagination-item-link),
    :deep(.ant-pagination-next .ant-pagination-item-link) {
      font-size: 12px;
    }
  }
}
</style>
