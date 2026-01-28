import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseContainer from '@/components/BaseContainer.vue'

describe('BaseContainer', () => {
  const mountContainer = (slotContent) => {
    if (slotContent === undefined) {
      return mount(BaseContainer)
    }
    return mount(BaseContainer, {
      slots: {
        default: slotContent,
      },
    })
  }

  it('renders container component', () => {
    const wrapper = mountContainer()

    expect(wrapper.find('.base-container').exists()).toBe(true)
  })

  it('renders content through slot', () => {
    const wrapper = mountContainer('<div class="test-content">Тестовий контент</div>')

    const content = wrapper.find('.test-content')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe('Тестовий контент')
  })

  it('renders multiple elements in slot', () => {
    const wrapper = mountContainer(`
          <h1>Заголовок</h1>
          <p>Параграф</p>
          <div>Блок</div>
        `)

    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Заголовок')
    expect(wrapper.find('p').text()).toBe('Параграф')
  })

  it('displays empty container when there is no slot', () => {
    const wrapper = mountContainer()

    const container = wrapper.find('.base-container')

    expect(container.exists()).toBe(true)
    expect(container.text()).toBe('')
  })

  it('has base-container class', () => {
    const wrapper = mountContainer()

    expect(wrapper.classes()).toContain('base-container')
  })
})
