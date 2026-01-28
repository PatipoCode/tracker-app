import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Використовуємо happy-dom для симуляції браузерного середовища
      environment: 'happy-dom',
      // Шукаємо тести в папці tests
      include: ['tests/**/*.test.js'],
      // Виключаємо node_modules з тестів
      exclude: [...configDefaults.exclude, 'e2e/**'],
      // Папка з тестами
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
)
