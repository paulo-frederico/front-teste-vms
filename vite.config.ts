import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [react()],
    // GitHub Pages precisa do nome do repositório aqui.
    // Local (dev/preview) deve ser "/"
    base: isProd ? '/front-teste-vms/' : '/',

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
})
