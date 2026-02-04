import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ThemeToggle from '@/components/ThemeToggle.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import IconSun from '@/components/icons/IconSun.vue'

describe('ThemeToggle', () => {
  let pinia
  let wrapper

  beforeEach(() => {
    pinia = createPinia()
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    wrapper = mount(ThemeToggle, {
      global: {
        plugins: [pinia],
      },
    })
  })

  const getToggle = (wrapper) => wrapper.find('.theme-toggle')
  const getTrack = (wrapper) => wrapper.find('.theme-toggle__track')
  const getThumb = (wrapper) => wrapper.find('.theme-toggle__thumb')
  const getMoonIcon = (wrapper) => wrapper.findComponent(IconMoon)
  const getSunIcon = (wrapper) => wrapper.findComponent(IconSun)

  it('renders theme toggle component', () => {
    expect(getToggle(wrapper).exists()).toBe(true)
    expect(getTrack(wrapper).exists()).toBe(true)
  })

  it('displays both icons - moon and sun', () => {
    expect(getMoonIcon(wrapper).exists()).toBe(true)
    expect(getSunIcon(wrapper).exists()).toBe(true)
  })

  it('has thumb for visual toggle', () => {
    expect(getThumb(wrapper).exists()).toBe(true)
  })

  it('calls toggleTheme on click', async () => {
    const toggle = getToggle(wrapper)
    const initialClasses = toggle.classes()
    const hadLightClass = initialClasses.includes('theme-toggle--light')

    await toggle.trigger('click')
    await wrapper.vm.$nextTick()

    const newClasses = toggle.classes()
    const hasLightClass = newClasses.includes('theme-toggle--light')

    expect(hasLightClass).toBe(!hadLightClass)
  })

  it('updates display when theme changes', async () => {
    const toggle = getToggle(wrapper)
    const initialClasses = [...toggle.classes()]

    await toggle.trigger('click')
    await wrapper.vm.$nextTick()

    const updatedClasses = [...toggle.classes()]
    expect(initialClasses).not.toEqual(updatedClasses)
  })
})
