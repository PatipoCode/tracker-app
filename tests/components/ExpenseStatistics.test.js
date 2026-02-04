import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseStatistics from '@/components/ExpenseStatistics.vue'

describe('ExpenseStatistics', () => {
  const testCategoryStats = {
    'food (їжа)': 500,
    'transport (транспорт)': 150,
    'entertainment (розваги)': 250,
  }

  const extractCategoryElements = (elements) => {
    const food = elements[0]
    const entertainment = elements[1]
    const transport = elements[2]
    return [food, entertainment, transport]
  }

  let wrapper

  const mountStatistics = (props) => mount(ExpenseStatistics, { props })
  const getTitleElement = (wrapper) => wrapper.find('.statistics__title')
  const getTotalElement = (wrapper) => wrapper.find('.statistics__total')
  const getCategoriesElement = (wrapper) => wrapper.find('.statistics__categories')
  const getSubtitleElement = (wrapper) => wrapper.find('.statistics__subtitle')
  const getCategoryItems = (wrapper) => wrapper.findAll('.statistics__item')
  const getCategoryAmounts = (wrapper) => wrapper.findAll('.statistics__category-amount')
  const getProgressBars = (wrapper) => wrapper.findAll('.progress-bar')

  beforeEach(() => {
    wrapper = mountStatistics({
      total: 900,
      categoryStats: testCategoryStats,
    })
  })

  it('renders statistics component', () => {
    expect(getTitleElement(wrapper).text()).toBe('Статистика витрат')
    expect(getTotalElement(wrapper).exists()).toBe(true)
  })

  it('displays total amount with 2 decimal places', () => {
    const wrapper = mountStatistics({
      total: 1234.56,
      categoryStats: {},
    })

    const totalText = getTotalElement(wrapper).text()
    expect(totalText).toContain('1234.56 грн')
  })

  it('formats integer with .00', () => {
    const wrapper = mountStatistics({
      total: 123,
      categoryStats: {},
    })

    const totalText = getTotalElement(wrapper).text()
    expect(totalText).toContain('123.00 грн')
  })

  it('does not show categories list when categoryStats is empty', () => {
    const wrapper = mountStatistics({
      total: 100,
      categoryStats: {},
    })

    expect(getCategoriesElement(wrapper).exists()).toBe(false)
    expect(getSubtitleElement(wrapper).exists()).toBe(false)
  })

  it('displays categories list when there is data', () => {
    expect(getCategoriesElement(wrapper).exists()).toBe(true)
    expect(getSubtitleElement(wrapper).text()).toBe('За категоріями:')

    const categoryItems = getCategoryItems(wrapper)
    expect(categoryItems).toHaveLength(3)
  })

  it('displays amounts for each category with 2 decimal places', () => {
    const categoryAmounts = getCategoryAmounts(wrapper)
    const [foodAmount, entertainmentAmount, transportAmount] =
      extractCategoryElements(categoryAmounts)

    expect(foodAmount.text()).toBe('500.00 грн')
    expect(entertainmentAmount.text()).toBe('250.00 грн')
    expect(transportAmount.text()).toBe('150.00 грн')
  })

  it('correctly calculates percentages for each category', () => {
    const progressBars = getProgressBars(wrapper)
    const [foodProgressBar, entertainmentProgressBar, transportProgressBar] =
      extractCategoryElements(progressBars)

    expect(foodProgressBar.text()).toBe('55.6%') // food: 500/900 * 100 = 55.6%
    expect(entertainmentProgressBar.text()).toBe('27.8%') // entertainment: 250/900 * 100 = 27.8%
    expect(transportProgressBar.text()).toBe('16.7%') // transport: 150/900 * 100 = 16.7%
  })
})
