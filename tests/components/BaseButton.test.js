import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/BaseButton.vue'

describe('BaseButton', () => {
  const mountButton = (props) => mount(BaseButton, { props })

  it('renders button with correct text', () => {
    const wrapper = mountButton({ title: 'Натисни мене' })

    expect(wrapper.find('button').text()).toBe('Натисни мене')
  })

  it('has correct type attribute', () => {
    const wrapper = mountButton({ title: 'Кнопка', type: 'submit' })

    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('applies correct style variant', () => {
    const wrapper = mountButton({ title: 'Видалити', variant: 'danger' })

    expect(wrapper.find('button').classes()).toContain('btn-danger')
  })

  it('emits on-btn-click event on click', async () => {
    const mockClickHandler = vi.fn()
    const wrapper = mountButton({ title: 'Клікни', 'onOn-btn-click': mockClickHandler })

    await wrapper.find('button').trigger('click')

    expect(mockClickHandler).toHaveBeenCalled()
    expect(mockClickHandler).toHaveBeenCalledTimes(1)
  })
})
