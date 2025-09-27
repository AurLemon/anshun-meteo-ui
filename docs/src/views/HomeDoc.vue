<template>
  <div class="home-doc">
    <h1>Anshun Meteo UI</h1>

    <section id="introduction">
      <h2>简介</h2>
      <p>
        Anshun Meteo UI 是一个专为气象数据展示和交互设计的 Vue 3 组件库。
        提供了时间轴、图例、气象数据等专业组件，帮助开发者快速构建气象相关的应用界面。
      </p>
    </section>

    <section id="installation">
      <h2>安装</h2>
      <p>使用 pnpm 安装：</p>
      <pre class="code-block"><code>pnpm add anshun-meteo-ui</code></pre>

      <p>或使用 npm：</p>
      <pre class="code-block"><code>npm install anshun-meteo-ui</code></pre>

      <p>或使用 yarn：</p>
      <pre class="code-block"><code>yarn add anshun-meteo-ui</code></pre>
    </section>

    <section id="configuration">
      <h2>配置</h2>
      <p>在你的 Vue 3 项目中配置 Anshun Meteo UI：</p>

      <h3>完整引入</h3>
      <p>在 <code>main.ts</code> 或 <code>main.js</code> 文件中：</p>
      <pre class="code-block"><code>import { createApp } from 'vue'
import App from './App.vue'

// 引入 Anshun Meteo UI
import AnshunMeteoUI from 'anshun-meteo-ui'
import 'anshun-meteo-ui/dist/anshun-meteo-ui.css'

const app = createApp(App)

// 使用插件
app.use(AnshunMeteoUI)

app.mount('#app')</code></pre>

      <h3>按需引入</h3>
      <p>你也可以按需引入特定的组件：</p>
      <pre class="code-block"><code>import { 
  TimelineContainer, 
  TimelineData, 
  TimelinePicker, 
  TimelineScale,
  Legend,
  MeteoData
} from 'anshun-meteo-ui'
import 'anshun-meteo-ui/dist/anshun-meteo-ui.css'</code></pre>
    </section>

    <section id="components">
      <h2>组件列表</h2>
      <div class="component-grid">
        <div class="component-card">
          <h3>
            <router-link to="/timeline">时间轴组件 (Timeline)</router-link>
          </h3>
          <p>
            用于时间选择和展示的交互式组件，支持时间点选择、时间段选择等多种模式。
          </p>
        </div>

        <div class="component-card">
          <h3>
            <router-link to="/legend">图例组件 (Legend)</router-link>
          </h3>
          <p>用于展示数据图例的组件，支持多种样式和交互功能。</p>
        </div>

        <div class="component-card">
          <h3>
            <router-link to="/meteo-data">气象数据组件 (MeteoData)</router-link>
          </h3>
          <p>专门用于气象数据展示的组件，提供丰富的数据可视化功能。</p>
        </div>
      </div>
    </section>

    <section id="quick-start">
      <h2>快速开始</h2>
      <p>配置完成后，你就可以在组件中使用 Anshun Meteo UI 的组件了：</p>
      <pre class="code-block"><code>&lt;template&gt;
  &lt;div&gt;
    &lt;TimelineContainer v-model="selectedTime" mode="point"&gt;
      &lt;TimelineData point&gt;
        &lt;TimelinePicker /&gt;
      &lt;/TimelineData&gt;
      &lt;TimelineScale /&gt;
    &lt;/TimelineContainer&gt;
    
    &lt;Legend :items="legendItems" /&gt;
    
    &lt;MeteoData :data="meteoData" /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'

const selectedTime = ref(new Date())
const legendItems = ref([
  { label: '晴天', color: '#FFD700' },
  { label: '多云', color: '#87CEEB' },
  { label: '雨天', color: '#4682B4' }
])
const meteoData = ref({
  temperature: 25,
  humidity: 60,
  pressure: 1013
})
&lt;/script&gt;</code></pre>
    </section>

    <section id="typescript">
      <h2>TypeScript 支持</h2>
      <p>Anshun Meteo UI 完全支持 TypeScript，提供了完整的类型定义。</p>
      <p>
        如果你在使用 TypeScript 时遇到类型问题，请确保在
        <code>tsconfig.json</code> 中包含了正确的类型声明：
      </p>
      <pre class="code-block"><code>{
  "compilerOptions": {
    "types": ["anshun-meteo-ui"]
  }
}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.home-doc {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

.home-doc h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 30px;
}

.home-doc h2 {
  color: #34495e;
  margin-top: 40px;
  margin-bottom: 20px;
}

.home-doc h3 {
  color: #7f8c8d;
  margin-top: 30px;
  margin-bottom: 15px;
}

.code-block {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.component-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.component-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.component-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.component-card h3 a {
  color: #3498db;
  text-decoration: none;
}

.component-card h3 a:hover {
  text-decoration: underline;
}

.component-card p {
  color: #666;
  margin: 0;
}

section {
  margin-bottom: 40px;
}

p {
  margin-bottom: 15px;
}
</style>
