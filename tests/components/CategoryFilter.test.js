import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryFilter from '@/components/CategoryFilter.vue'

describe('CategoryFilter', () => {
  const testCategories = ['food (їжа)', 'transport (транспорт)', 'entertainment (розваги)']

  const mountFilter = (props) => mount(CategoryFilter, { props })
  const getTrigger = (wrapper) => wrapper.find('.custom-select__trigger')
  const getDropdown = (wrapper) => wrapper.find('.custom-select__dropdown')
  const openDropdown = async (wrapper) => {
    await getTrigger(wrapper).trigger('click')
  }
  const getOptions = (wrapper) => wrapper.findAll('.custom-select__option')

  it('renders filter component', () => {
    const wrapper = mountFilter({
      categories: testCategories,
      modelValue: 'all',
    })

    expect(wrapper.find('.category-filter__label').exists()).toBe(true)
    expect(wrapper.find('.category-filter__label').text()).toBe('Фільтр за категорією:')
  })

  it('shows correct text when all is selected', () => {
    const wrapper = mountFilter({
      categories: testCategories,
      modelValue: 'all',
    })

    expect(getTrigger(wrapper).text()).toBe('Всі категорії')
  })

  it('shows selected category', () => {
    const wrapper = mountFilter({
      categories: testCategories,
      modelValue: 'food (їжа)',
    })

    expect(getTrigger(wrapper).text()).toBe('food (їжа)')
  })

  it('opens list on click', async () => {
    const wrapper = mountFilter({
      categories: testCategories,
      modelValue: 'all',
    })

    expect(getDropdown(wrapper).exists()).toBe(false)

    await openDropdown(wrapper)

    expect(getDropdown(wrapper).exists()).toBe(true)
  })

  it('emits update:modelValue when category is selected', async () => {
    const wrapper = mountFilter({
      categories: testCategories,
      modelValue: 'all',
    })

    await openDropdown(wrapper)

    const options = getOptions(wrapper)
    const firstCategoryOption = options[1]

    await firstCategoryOption.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['food (їжа)'])
  })

  it('closes list after option selection', async () => {
    const wrapper = mountFilter({
      categories: testCategories,
      modelValue: 'all',
    })

    await openDropdown(wrapper)
    expect(getDropdown(wrapper).exists()).toBe(true)

    const options = getOptions(wrapper)
    await options[1].trigger('click')

    expect(getDropdown(wrapper).exists()).toBe(false)
  })
})
