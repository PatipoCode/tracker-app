import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/BaseInput.vue'

describe('BaseInput', () => {
  const mountInput = (props) => mount(BaseInput, { props })

  it('renders input element', () => {
    const wrapper = mountInput({ modelValue: '' })

    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('displays correct placeholder', () => {
    const wrapper = mountInput({
      modelValue: '',
      placeholder: 'Введіть текст',
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('Введіть текст')
  })

  it('sets correct input type', () => {
    const wrapper = mountInput({
      modelValue: '',
      type: 'email',
    })

    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('updates modelValue on text input', async () => {
    const wrapper = mountInput({
      modelValue: '',
      'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
    })

    const input = wrapper.find('input')

    await input.setValue('Тестовий текст')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Тестовий текст'])
  })

  it('formats number on blur', async () => {
    const wrapper = mountInput({
      modelValue: '5',
      type: 'number',
    })

    const input = wrapper.find('input')

    await input.trigger('blur')

    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('sets step attribute for number input', () => {
    const wrapper = mountInput({
      modelValue: '',
      type: 'number',
      step: '0.01',
    })

    expect(wrapper.find('input').attributes('step')).toBe('0.01')
  })
})
