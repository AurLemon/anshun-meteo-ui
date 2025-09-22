<template>
  <a-layout class="doc-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      width="280"
      class="sider-fixed"
    >
      <div class="logo">
        <h2>Anshun Meteo UI</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
        <a-menu-item key="timeline">
          <router-link to="/timeline">
            <ClockCircleOutlined />
            <span>时间轴组件</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="legend">
          <router-link to="/legend">
            <BgColorsOutlined />
            <span>图例条组件</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout
      :style="{
        marginLeft: collapsed ? '80px' : '280px',
        transition: 'margin-left 0.2s',
      }"
    >
      <a-layout-header class="layout-header">
        <a-breadcrumb>
          <a-breadcrumb-item>组件</a-breadcrumb-item>
          <a-breadcrumb-item>{{ currentComponent }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-layout-header>

      <a-layout-content class="layout-content">
        <div class="content-wrapper">
          <div class="main-content">
            <router-view />
          </div>

          <div class="anchor-nav" v-if="anchors.length > 0">
            <a-anchor :offsetTop="100">
              <a-anchor-link
                v-for="anchor in anchors"
                :key="anchor.id"
                :href="`#${anchor.id}`"
                :title="anchor.title"
              />
            </a-anchor>
          </div>
        </div>
      </a-layout-content>

      <a-layout-footer class="layout-footer">
        <div class="footer-content">
          <p>&copy; 2025 AurLemon. All rights reserved.</p>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ClockCircleOutlined, BgColorsOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const collapsed = ref(false)
const selectedKeys = ref(['timeline'])
const anchors = ref<Array<{ id: string; title: string }>>([])

const currentComponent = computed(() => {
  switch (route.name) {
    case 'Timeline':
      return '时间轴组件'
    case 'Legend':
      return '图例条组件'
    default:
      return '组件'
  }
})

// 监听路由变化，更新选中菜单
watch(
  () => route.name,
  (newName) => {
    selectedKeys.value = [newName?.toString().toLowerCase() || 'timeline']
  },
)

// 监听内容变化，更新锚点
watch(
  () => route.path,
  async () => {
    await nextTick()
    updateAnchors()
  },
)

const updateAnchors = () => {
  const headings = document.querySelectorAll('h2, h3')
  anchors.value = Array.from(headings).map((heading, index) => ({
    id: heading.id || `heading-${index}`,
    title: heading.textContent || '',
  }))

  // 确保标题有ID
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`
    }
  })
}
</script>

<style scoped>
.doc-layout {
  min-height: 100vh;
}

.sider-fixed {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 10;
  overflow: auto;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-bottom: 1px solid #303030;
}

.logo h2 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.layout-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.layout-content {
  margin: 24px;
  background: #fff;
  min-height: auto;
}

.content-wrapper {
  display: flex;
  min-height: calc(100vh - 64px - 48px - 48px);
}

.main-content {
  flex: 1;
  padding: 24px;
  min-width: 0;
}

.anchor-nav {
  width: 200px;
  padding: 24px 16px;
  border-left: 1px solid #f0f0f0;
  background: #fafafa;
}

.layout-footer {
  background: #f0f2f5;
  padding: 24px 50px;
  text-align: center;
}

.footer-content {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

@media (max-width: 768px) {
  .anchor-nav {
    display: none;
  }

  .content-wrapper {
    flex-direction: column;
  }
}
</style>
