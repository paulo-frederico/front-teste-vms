import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { InlineConfig } from 'vitest'

interface ViteConfigWithVitest extends UserConfig {
  test?: InlineConfig
}

// https://vite.dev/config/
const config: ViteConfigWithVitest = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        if (process.env.NODE_ENV === 'production') {
          return id.includes('/fixtures/') || id.includes('\\fixtures\\')
        }
        return false
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/contexts/**/*.{ts,tsx}', 'src/components/auth/**/*.{ts,tsx}'],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
}

export default defineConfig(config)
