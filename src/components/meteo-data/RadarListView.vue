<template>
  <div class="radar-list-view">
    <!-- 数据统计信息 -->
    <div v-if="data.length > 0" class="data-summary">
      <span class="summary-text">共 {{ data.length }} 张雷达图片</span>
    </div>

    <!-- 覆盖范围信息 -->
    <div v-if="config.bounds" class="radar-bounds">
      <div class="bounds-title">覆盖范围</div>
      <div class="bounds-info">
        <div class="bounds-item">西南角: {{ config.bounds.southwest.join(', ') }}</div>
        <div class="bounds-item">东北角: {{ config.bounds.northeast.join(', ') }}</div>
      </div>
    </div>

    <!-- 雷达图片列表 -->
    <div v-if="processedImages.length === 0" class="empty-state">
      <a-empty description="暂无雷达图片" />
    </div>
    <div v-else class="radar-list">
      <div class="list-title">图片列表</div>
      <div class="image-table">
        <table class="radar-table">
          <tbody>
            <tr
              v-for="(image, index) in displayImages"
              :key="index"
              class="image-row"
              :class="{ active: index === selectedImageIndex }"
              @click="selectImage(image, index)"
            >
              <td class="index-cell">{{ index + 1 }}</td>
              <td class="filename-cell">{{ image.filename }}</td>
              <td class="time-cell">{{ image.timeDisplay }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 更多图片提示 -->
      <div v-if="hasMoreImages" class="more-info">
        还有 {{ data.length - displayImages.length }} 张图片
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Empty as AEmpty } from 'ant-design-vue'
import dayjs from 'dayjs'
import type { ProcessedRadarImage, RadarListProps } from '../../types/meteo-data'

// 定义组件名称
defineOptions({
  name: 'RadarListView',
})

// 定义 Props
const props = defineProps<RadarListProps>()

// 定义 Events
const emit = defineEmits<{
  'radar-image-select': [imageInfo: ProcessedRadarImage]
}>()

// 选中的图片索引
const selectedImageIndex = ref(0)

// 处理图片数据
const processedImages = computed(() => {
  if (!props.data || props.data.length === 0) return []

  const processed = props.data.map((url, originalIndex) => {
    const filename = url.split('/').pop() || url
    const timeInfo = extractTimeFromFilename(filename)

    return {
      url,
      filename,
      timeDisplay: timeInfo.display,
      timestamp: timeInfo.timestamp,
      originalIndex,
    }
  }).filter(item => item.timestamp > 0) // 过滤无效时间

  // 按时间戳降序排列（最新的在前）
  return processed.sort((a, b) => b.timestamp - a.timestamp)
})

// 显示的图片（限制数量）
const displayImages = computed(() => {
  const maxCount = props.config.imageDisplay?.maxDisplayCount || 10
  return processedImages.value.slice(0, maxCount)
})

// 是否有更多图片
const hasMoreImages = computed(() => {
  const maxCount = props.config.imageDisplay?.maxDisplayCount || 10
  return props.data.length > maxCount
})

// 从文件名提取时间信息（支持多种格式）
const extractTimeFromFilename = (filename: string) => {
  try {
    // 尝试主要格式
    const mainRegex = new RegExp(props.config.timeParsing.regex)
    const mainMatch = filename.match(mainRegex)

    if (mainMatch) {
      const timeStr = mainMatch[1]
      const format = props.config.timeParsing.format
      const parsed = dayjs(timeStr, format)

      if (parsed.isValid()) {
        return {
          display: parsed.format('MM-DD HH:mm'),
          timestamp: parsed.valueOf(),
        }
      }
    }

    // 尝试备用格式
    if (props.config.timeParsing.fallbackFormats) {
      for (const fallback of props.config.timeParsing.fallbackFormats) {
        const fallbackRegex = new RegExp(fallback.regex)
        const fallbackMatch = filename.match(fallbackRegex)

        if (fallbackMatch) {
          const timeStr = fallbackMatch[1]
          const parsed = dayjs(timeStr, fallback.format)

          if (parsed.isValid()) {
            return {
              display: parsed.format('MM-DD HH:mm'),
              timestamp: parsed.valueOf(),
            }
          }
        }
      }
    }

    // 尝试新格式：Z_RADR_I_Z9853_20250712182756_O_DOR_SAD_CAP_FMT.png
    const newFormatMatch = filename.match(/_(\d{14})_/)
    if (newFormatMatch && newFormatMatch[1]) {
      const timeStr = newFormatMatch[1]
      const year = timeStr.substring(0, 4)
      const month = timeStr.substring(4, 6)
      const day = timeStr.substring(6, 8)
      const hour = timeStr.substring(8, 10)
      const minute = timeStr.substring(10, 12)
      const second = timeStr.substring(12, 14)

      const timestamp = dayjs(`${year}-${month}-${day} ${hour}:${minute}:${second}`).valueOf()
      const display = dayjs(timestamp).format('MM-DD HH:mm')

      return { timestamp, display }
    }

    // 兼容旧格式：20250421_1703.png
    const oldFormatMatch = filename.match(/(\d{8})_(\d{4})/)
    if (oldFormatMatch && oldFormatMatch[1] && oldFormatMatch[2]) {
      const dateStr = oldFormatMatch[1]
      const timeStr = oldFormatMatch[2]
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      const hour = timeStr.substring(0, 2)
      const minute = timeStr.substring(2, 4)

      const timestamp = dayjs(`${year}-${month}-${day} ${hour}:${minute}`).valueOf()
      const display = dayjs(timestamp).format('MM-DD HH:mm')

      return { timestamp, display }
    }

    return { display: '未知时间', timestamp: Date.now() }
  } catch (error) {
    console.warn('解析文件名时间失败:', filename, error)
    return { display: '解析失败', timestamp: Date.now() }
  }
}

// 选择图片
const selectImage = (image: ProcessedRadarImage, index: number) => {
  selectedImageIndex.value = index

  // 发送事件给地图组件切换雷达图片
  window.dispatchEvent(
    new CustomEvent('radar-image-selected', {
      detail: {
        url: image.url,
        index: image.originalIndex,
      },
    }),
  )

  emit('radar-image-select', image)
}
</script>

<style lang="scss" scoped>
.radar-list-view {
  background: #fff;

  .data-summary {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;

    .summary-text {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .radar-bounds {
    margin-bottom: 12px;

    .bounds-title {
      font-size: 12px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }

    .bounds-info {
      .bounds-item {
        font-size: 11px;
        color: #8c8c8c;
        margin: 2px 0;
        font-family: monospace;
      }
    }
  }

  .radar-list {
    .list-title {
      font-size: 12px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .image-table {
      .radar-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border: 1px solid #f0f0f0;

        tbody {
          .image-row {
            border-bottom: 1px solid #f9f9f9;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: #fafafa;
            }

            &.active {
              background: #f0f0f0;
            }

            td {
              padding: 6px 8px;
              font-size: 11px;

              &.index-cell {
                width: 30px;
                text-align: center;
                color: #8c8c8c;
                font-weight: 500;
              }

              &.filename-cell {
                color: #333;
                font-family: monospace;
                word-break: break-all;
              }

              &.time-cell {
                width: 80px;
                text-align: right;
                color: #8c8c8c;
                font-family: monospace;
              }
            }
          }
        }
      }
    }

    .more-info {
      text-align: center;
      padding: 8px;
      color: #8c8c8c;
      font-size: 11px;
      border-top: 1px solid #f0f0f0;
      margin-top: 8px;
    }
  }

  .empty-state {
    padding: 40px;
    text-align: center;
  }
}
</style>
