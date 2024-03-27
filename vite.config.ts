import react from '@vitejs/plugin-react';
import path from "path";
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, '/src'),
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        module: true,
        additionalData: '@import "./src/asset/global.less";',
        modifyVars: {
          hack: `true; @import "./src/asset/variable.less";`,
        },
      },
    },
  },
})
