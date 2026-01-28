import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/EmptyState.vue'

describe('EmptyState', () => {
  const testProps = {
    imageSrc: '/images/empty-state.png',
    title: 'Немає витрат',
    description: 'Додайте першу витрату',
  }

  let wrapper
  
  const mountEmptyState = (props) => mount(EmptyState, { props })
  const getImage = (wrapper) => wrapper.find('.empty-state__icon')
  const getTitle = (wrapper) => wrapper.find('.empty-state__title')
  const getDescription = (wrapper) => wrapper.find('.empty-state__description')

  beforeEach(() => {
    wrapper = mountEmptyState(testProps)
  })

  it('renders empty state component', () => {
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('displays image with correct src', () => {
    const img = getImage(wrapper)
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/empty-state.png')
  })

  it('displays title', () => {
    const title = getTitle(wrapper)
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Немає витрат')
  })

  it('displays description', () => {
    const description = getDescription(wrapper)
    expect(description.exists()).toBe(true)
    expect(description.text()).toBe('Додайте першу витрату')
  })
})
