import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  build: {
    // Reduce chunk depth and optimize loading
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        // Manual chunks to reduce critical path depth
        manualChunks: {
          // Core React libraries (loaded first, cached)
          'react-core': ['react', 'react-dom'],
          
          // UI framework (separate chunk, parallel load)
          'ui-framework': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
          ],
          
          // Layout utilities (needed early)
          'layout-utils': [
            'react-resizable-panels',
            'react-hotkeys-hook',
          ],
          
          // Heavy data processing (lazy loaded)
          'data-processing': [
            'papaparse',
            '@tanstack/react-virtual',
          ],
          
          // Code editor (only needed in QueryEditor)
          'code-editor': [
            '@uiw/react-textarea-code-editor',
          ],
        },
      },
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    // No sourcemaps in production
    sourcemap: false,
  },
  
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-resizable-panels',
      'react-hotkeys-hook',
      'clsx',
      'tailwind-merge',
    ],
  },
  
  // Performance optimizations
  server: {
    // Faster dev server warm-up
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/components/HeaderBar.tsx',
        './src/components/QueryEditor.tsx',
        './src/components/NormalTabView.tsx',
      ],
    },
  },
})

