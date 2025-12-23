import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { InlineConfig } from 'vitest'

interface ViteConfigWithVitest extends UserConfig {
  test?: InlineConfig
}

const config: ViteConfigWithVitest = {
  plugins: [react()],

  // GitHub Pages: precisa ser o nome do repositório entre barras
  base: '/front-teste-vms/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
