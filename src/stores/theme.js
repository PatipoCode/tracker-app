import { defineStore } from 'pinia'
import { watch } from 'vue'
import { THEME_KEY } from '@/constants'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light',
    isInitialized: false,
  }),

  actions: {
    initialize() {
      if (this.isInitialized) return

      const saved = localStorage.getItem(THEME_KEY)

      if (saved) {
        this.theme = saved
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.theme = prefersDark ? 'dark' : 'light'
      }

      localStorage.setItem(THEME_KEY, this.theme)

      this.applyTheme()
      this.isInitialized = true

      watch(
        () => this.theme,
        (newTheme) => {
          this.applyTheme()
          localStorage.setItem(THEME_KEY, newTheme)
        },
      )
    },

    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
})
