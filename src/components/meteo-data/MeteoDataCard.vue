<template>
  <div class="meteo-data-card">
    <!-- 标题 -->
    <div v-if="title" class="card-title">
      <h3>{{ title }}</h3>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <a-spin size="large" />
      <p class="loading-text">数据加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!data || data.length === 0" class="empty-container">
      <a-empty description="暂无数据" />
    </div>

    <!-- 动态视图渲染 -->
    <div v-else class="card-content">
      <!-- 视图A: 站点数据表格 -->
      <template v-if="config.type === 'station'">
        <StationTableView
          :config="config"
          :data="data"
          :highlighted-id="highlightedId"
          @item-select="$emit('item-select', $event)"
          @item-highlight="$emit('item-highlight', $event)"
          @item-unhighlight="$emit('item-unhighlight', $event)"
        />
      </template>

      <!-- 视图C: 格点数据摘要 -->
      <template v-else-if="config.type === 'grid'">
        <GridView :config="config" :data="data" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue'
import StationTableView from './StationTableView.vue'
import GridView from './GridView.vue'
import type {
  MeteoDataCardProps,
  MeteoDataCardEvents,
} from '../../types/meteo-data'

// 定义组件名称
defineOptions({
  name: 'MeteoDataCard',
})

// 定义 Props
withDefaults(defineProps<MeteoDataCardProps>(), {
  isLoading: false,
  title: '',
  highlightedId: undefined,
})

// 定义 Events
defineEmits<MeteoDataCardEvents>()
</script>

<style lang="scss" scoped>
.meteo-data-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .card-title {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    min-height: 200px;

    .loading-text {
      margin-top: 16px;
      color: #8c8c8c;
      font-size: 14px;
    }
  }

  .empty-container {
    padding: 60px 20px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-content {
    padding: 20px;
  }
}
</style>
