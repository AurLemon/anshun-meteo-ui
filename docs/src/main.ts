import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import router from './router'
import DocLayout from './layout/DocLayout.vue'

import './assets/styles/global.scss'

import AnshunMeteoUI from 'anshun-meteo-ui'
import 'anshun-meteo-ui/dist/anshun-meteo-ui.css'

createApp(DocLayout).use(router).use(Antd).use(AnshunMeteoUI).mount('#app')
