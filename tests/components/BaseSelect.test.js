import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '@/components/BaseSelect.vue'

describe('BaseSelect', () => {
  const mountSelect = (props) => mount(BaseSelect, { props })
  const getTrigger = (wrapper) => wrapper.find('.custom-select__trigger')
  const getDropdown = (wrapper) => wrapper.find('.custom-select__dropdown')
  const openDropdown = async (wrapper) => {
    await getTrigger(wrapper).trigger('click')
  }
  const getFirstRealOption = (wrapper) => {
    const options = wrapper.findAll('.custom-select__option')
    return options.find((option) => option.text() !== 'Оберіть категорію')
  }

  it('renders dropdown list', () => {
    const wrapper = mountSelect({ modelValue: '' })

    expect(getTrigger(wrapper).exists()).toBe(true)
  })

  it('shows placeholder when nothing is selected', () => {
    const wrapper = mountSelect({ modelValue: '' })

    expect(getTrigger(wrapper).text()).toBe('Оберіть категорію')
  })

  it('displays selected value', () => {
    const wrapper = mountSelect({ modelValue: 'food (їжа)' })

    expect(getTrigger(wrapper).text()).toBe('food (їжа)')
  })

  it('opens and closes dropdown on click', async () => {
    const wrapper = mountSelect({ modelValue: '' })

    expect(getDropdown(wrapper).exists()).toBe(false)

    await openDropdown(wrapper)

    expect(getDropdown(wrapper).exists()).toBe(true)

    await getTrigger(wrapper).trigger('click')

    expect(getDropdown(wrapper).exists()).toBe(false)
  })

  it('emits update:modelValue when option is selected', async () => {
    const wrapper = mountSelect({
      modelValue: '',
      'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
    })

    await openDropdown(wrapper)

    const options = wrapper.findAll('.custom-select__option')

    expect(options.length).toBeGreaterThan(0)

    const firstOption = getFirstRealOption(wrapper)
    await firstOption.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('displays all available categories', async () => {
    const wrapper = mountSelect({ modelValue: '' })

    await openDropdown(wrapper)

    const text = wrapper.text()
    expect(text).toContain('food (їжа)')
    expect(text).toContain('transport (транспорт)')
    expect(text).toContain('entertainment (розваги)')
    expect(text).toContain('utilities (комунальні послуги)')
    expect(text).toContain('other (інше)')
  })

  it('opens list on Enter or Space key press', async () => {
    const wrapper = mountSelect({ modelValue: '' })

    const trigger = getTrigger(wrapper)

    await trigger.trigger('keydown', { key: 'Enter' })
    expect(getDropdown(wrapper).exists()).toBe(true)

    await trigger.trigger('click')

    await trigger.trigger('keydown', { key: ' ' })
    expect(getDropdown(wrapper).exists()).toBe(true)
  })

  it('closes list after option selection', async () => {
    const wrapper = mountSelect({ modelValue: '' })

    await openDropdown(wrapper)
    expect(getDropdown(wrapper).exists()).toBe(true)

    const firstOption = getFirstRealOption(wrapper)
    await firstOption.trigger('click')

    expect(getDropdown(wrapper).exists()).toBe(false)
  })
})
