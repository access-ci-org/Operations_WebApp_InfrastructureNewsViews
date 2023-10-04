import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import hypothetical from 'rollup-plugin-hypothetical'
import postprocess from '@stadtlandnetz/rollup-plugin-postprocess'

const env = loadEnv(
  'mock',
  process.cwd(),
  ''
);


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
      hypothetical({
            allowFallthrough: true,
            files: {
                'bootstrap/': ""
            }
        }),
        // postprocess([
        //     [/import[^;]*/, '']
        // ])
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      //  lib: {
      //   // Could also be a dictionary or array of multiple entry points
      //   entry: 'src/main.js',
      //   name: 'MyLib',
      //   // the proper extensions will be added
      //   fileName: 'my-lib',
      // },
      external: ['bootstrap'],
      output: {
        assetFileNames: "assets/[name][extname]", // "assets/[name]-[hash][extname]",
        chunkFileNames: 'assets/[name].js', //assets/[name]-[hash].js
        entryFileNames: 'assets/[name].js', //assets/[name]-[hash].js,

        // Provide global variables to use in the UMD build
        // for externalized deps
        // globals: {
        //   vue: 'bootstrap',
        // },
      }
    }
  }
})
