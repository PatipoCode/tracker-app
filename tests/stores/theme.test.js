import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { THEME_KEY } from '@/constants'

describe('useThemeStore', () => {
  let originalMatchMedia

  const initializeStore = () => {
    const store = useThemeStore()
    store.initialize()
    return store
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')

    originalMatchMedia = window.matchMedia

    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('initializes theme `light` by default', () => {
    const store = initializeStore()

    expect(store.theme).toBe('light')
    expect(store.isInitialized).toBe(true)
  })

  it('toggleTheme() toogles theme from `light` to `dark`', () => {
    const store = initializeStore()

    expect(store.theme).toBe('light')

    store.toggleTheme()

    expect(store.theme).toBe('dark')
  })

  it('toggleTheme() toogles theme a few times in a row', () => {
    const store = initializeStore()

    const initialTheme = store.theme

    store.toggleTheme()
    const firstToggle = store.theme

    store.toggleTheme()
    const secondToggle = store.theme

    expect(firstToggle).not.toBe(initialTheme)
    expect(secondToggle).toBe(initialTheme)
  })

  it('saves theme to localStorage when initializing', () => {
    const store = initializeStore()

    const saved = localStorage.getItem(THEME_KEY)
    expect(saved).toBeTruthy()
    expect(saved).toBe(store.theme)
    expect(['light', 'dark']).toContain(saved)
  })

  it('sets data-theme attribute for `dark` theme', () => {
    const store = initializeStore()

    store.theme = 'dark'
    store.applyTheme()

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('deleted data-theme attribute for `light` theme', () => {
    const store = initializeStore()

    store.theme = 'dark'
    store.applyTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    store.theme = 'light'
    store.applyTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('loads theme from localStorage when initializing', () => {
    localStorage.setItem(THEME_KEY, 'dark')

    const store = initializeStore()

    expect(store.theme).toBe('dark')
    expect(store.isInitialized).toBe(true)
  })

  it('executes initialization only once', () => {
    const store = useThemeStore()

    store.initialize()

    store.theme = 'dark'

    store.initialize()

    expect(store.theme).toBe('dark')
    expect(store.isInitialized).toBe(true)
  })

  it('uses system preferences if no saved theme', () => {
    window.matchMedia = (query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })

    const store = initializeStore()

    expect(store.theme).toBe('dark')
  })
})
