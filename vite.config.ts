import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' && mode === 'production';
  const isAnalyze = mode === 'analyze';
  
  return {
    server: {
      host: "::",
      port: 3000,
    },
    plugins: [
      react(),
      // Add bundle analyzer in production builds or analyze mode
      (isProduction || isAnalyze) && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Production build optimizations
      target: 'es2018',
      // Use Vite's fast/safe default minifier
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: (id) => {
            // Vendor chunk for React
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor';
            }
            // Radix UI components
            if (id.includes('node_modules/@radix-ui')) {
              return 'radix';
            }
            // Forms and validation
            if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform/resolvers') || id.includes('node_modules/zod')) {
              return 'forms';
            }
            // Utilities
            if (id.includes('node_modules/date-fns') || id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge') || id.includes('node_modules/class-variance-authority')) {
              return 'utils';
            }
            // Router
            if (id.includes('node_modules/react-router-dom')) {
              return 'router';
            }
            // Icons
            if (id.includes('node_modules/lucide-react')) {
              return 'icons';
            }
            // Themes
            if (id.includes('node_modules/next-themes')) {
              return 'themes';
            }
            // Toast
            if (id.includes('node_modules/sonner')) {
              return 'toast';
            }
          },
          // Optimize chunk naming for better caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return 'assets/[name]-[hash].[ext]';
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name]-[hash].[ext]`;
            }
            if (/css/i.test(ext)) {
              return `css/[name]-[hash].[ext]`;
            }
            return `assets/[name]-[hash].[ext]`;
          },
        },
      },
      // CSS optimizations
      cssCodeSplit: true,
      // Asset optimizations
      assetsInlineLimit: 4096,
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
    },
    // Environment variable handling
    define: {
      __DEV__: command === 'serve',
      __PROD__: command === 'build',
      'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"',
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@vite/client', '@vite/env'],
    },
  };
});
