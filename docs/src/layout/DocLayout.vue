<template>
  <a-layout class="doc-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      width="280"
      :collapsed-width="isMobile ? 0 : 80"
      class="sider-fixed"
      :class="{
        'sider-mobile': isMobile,
        'sider-mobile-open': isMobile && !collapsed,
      }"
    >
      <div class="logo">
        <h2>Anshun Meteo UI</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
        <a-menu-item key="home">
          <router-link to="/">
            <HomeOutlined />
            <span>首页</span>
          </router-link>
        </a-menu-item>
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
        <a-menu-item key="meteodata">
          <router-link to="/meteo-data">
            <TableOutlined />
            <span>气象数据卡片</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 移动端遮罩层 -->
    <div
      v-if="isMobile && !collapsed"
      class="mobile-overlay"
      @click="collapsed = true"
    ></div>

    <a-layout
      :style="{
        marginLeft: isMobile ? '0px' : collapsed ? '80px' : '280px',
        transition: 'margin-left 0.2s',
      }"
    >
      <a-layout-header class="layout-header">
        <div class="header-content">
          <!-- 移动端菜单按钮 -->
          <button
            v-if="isMobile"
            class="mobile-menu-btn"
            @click="toggleMobileMenu"
          >
            <span class="menu-icon">☰</span>
          </button>

          <a-breadcrumb>
            <a-breadcrumb-item v-if="route.name !== 'Home'">
              <router-link to="/">首页</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-if="route.name !== 'Home'"
              >组件</a-breadcrumb-item
            >
            <a-breadcrumb-item>{{ currentComponent }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ClockCircleOutlined,
  BgColorsOutlined,
  TableOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const collapsed = ref(false)
const selectedKeys = ref(['home'])
const anchors = ref<Array<{ id: string; title: string }>>([])
const isMobile = ref(false)

const currentComponent = computed(() => {
  switch (route.name) {
    case 'Home':
      return 'Anshun Meteo UI'
    case 'Timeline':
      return '时间轴组件'
    case 'Legend':
      return '图例条组件'
    case 'MeteoData':
      return '气象数据卡片'
    default:
      return '组件'
  }
})

// 监听路由变化，更新选中菜单
watch(
  () => route.name,
  (newName) => {
    const routeKeyMap: Record<string, string> = {
      Home: 'home',
      Timeline: 'timeline',
      Legend: 'legend',
      MeteoData: 'meteodata',
    }
    selectedKeys.value = [routeKeyMap[newName as string] || 'home']
  },
  { immediate: true },
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
  // 只获取 h2 标题，不包含 h3 等子级标题
  const headings = document.querySelectorAll('h2')
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

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  // 移动端默认收起侧边栏
  if (isMobile.value) {
    collapsed.value = true
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 移动端菜单切换
const toggleMobileMenu = () => {
  collapsed.value = !collapsed.value
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

.sider-mobile {
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sider-mobile-open {
  transform: translateX(0) !important;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 999;
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

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.mobile-menu-btn {
  background: none;
  border: none;
  font-size: 18px;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.mobile-menu-btn:hover {
  background-color: #f5f5f5;
}

.menu-icon {
  display: inline-block;
  font-size: 20px;
  color: #666;
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

  .layout-content {
    margin: 12px;
  }

  .main-content {
    padding: 16px;
  }

  .layout-header {
    padding: 0 16px;
  }

  .logo h2 {
    font-size: 16px;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
