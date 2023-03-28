import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';


export default () => {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        // Allows `import * from @/fluroapi
        '@': path.resolve(__dirname, './src'),
      }
    },

 })
}