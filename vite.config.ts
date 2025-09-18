import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AnshunMeteoUI',
      fileName: (format) => `anshun-meteo-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          dayjs: 'dayjs',
        },
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
