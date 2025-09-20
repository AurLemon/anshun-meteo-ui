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
    minify: false, // 禁用代码压缩
    rollupOptions: {
      external: ['vue', 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          dayjs: 'dayjs',
        },
        exports: 'named',
        // 禁用变量重命名和代码压缩
        compact: false,
        minifyInternalExports: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
