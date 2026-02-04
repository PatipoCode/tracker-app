import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ExpenseTrackerApp from '@/components/ExpenseTrackerApp.vue'
import AddExpense from '@/components/AddExpense.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import ExpenseStatistics from '@/components/ExpenseStatistics.vue'
import { useExpensesStore } from '@/stores/expenses'

describe('ExpenseTrackerApp', () => {
  let pinia
  let wrapper

  const mountWithPinia = (component, options = {}) => {
    return mount(component, {
      global: {
        plugins: [pinia],
      },
      ...options,
    })
  }

  const getAddExpense = (wrapper) => wrapper.findComponent(AddExpense)
  const getExpenseList = (wrapper) => wrapper.findComponent(ExpenseList)
  const getThemeToggle = (wrapper) => wrapper.findComponent(ThemeToggle)
  const getBaseContainer = (wrapper) => wrapper.findComponent(BaseContainer)
  const getCategoryFilter = (wrapper) => wrapper.findComponent(CategoryFilter)
  const getStatistics = (wrapper) => wrapper.findComponent(ExpenseStatistics)

  const addExpenseToApp = async (wrapper, expense) => {
    const addExpense = getAddExpense(wrapper)
    await addExpense.vm.$emit('add-expense', expense)
    await wrapper.vm.$nextTick()
  }

  const createExpense = (customFields = {}) => ({
    description: 'Тестова витрата',
    amount: 100,
    category: 'food (їжа)',
    date: new Date(),
    ...customFields,
  })

  beforeEach(() => {
    pinia = createPinia()
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    wrapper = mountWithPinia(ExpenseTrackerApp)
  })

  it('renders main application component', () => {
    expect(wrapper.find('.expense-tracker').exists()).toBe(true)
  })

  it('contains all main components', () => {
    expect(getBaseContainer(wrapper).exists()).toBe(true)
    expect(getAddExpense(wrapper).exists()).toBe(true)
    expect(getExpenseList(wrapper).exists()).toBe(true)
    expect(getThemeToggle(wrapper).exists()).toBe(true)
  })

  it('displays title and logo', () => {
    const title = wrapper.find('.expense-tracker__title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Візьми фінанси під контроль!')

    const logo = wrapper.find('.expense-tracker__logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe('/images/logo.png')
  })

  it('adds new expense when form is filled', async () => {
    await addExpenseToApp(wrapper, {
      description: 'Тестова витрата',
      amount: 100,
      category: 'food (їжа)',
      date: new Date(),
    })

    const expenseList = getExpenseList(wrapper)
    const items = expenseList.props('items')
    expect(items.length).toBeGreaterThan(0)
    expect(items.some((item) => item.description === 'Тестова витрата')).toBe(true)
  })

  it('has correct section structure', () => {
    expect(wrapper.find('.expense-tracker__header').exists()).toBe(true)
    expect(wrapper.find('.expense-tracker__form').exists()).toBe(true)
    expect(wrapper.find('.expense-tracker__list').exists()).toBe(true)
  })

  it('displays theme toggle in header', () => {
    const themeToggleContainer = wrapper.find('.expense-tracker__theme-toggle')
    expect(themeToggleContainer.exists()).toBe(true)

    const themeToggle = getThemeToggle(wrapper)
    expect(themeToggle.exists()).toBe(true)
  })

  it('always displays ExpenseList - even when empty', () => {
    const expenseList = getExpenseList(wrapper)
    expect(expenseList.exists()).toBe(true)
    expect(expenseList.props('items')).toEqual([])
  })

  it('shows CategoryFilter after adding expense', async () => {
    expect(getCategoryFilter(wrapper).exists()).toBe(false)

    await addExpenseToApp(wrapper, createExpense())

    expect(getCategoryFilter(wrapper).exists()).toBe(true)
  })

  it('shows Statistics after adding expense', async () => {
    expect(getStatistics(wrapper).exists()).toBe(false)

    await addExpenseToApp(wrapper, createExpense())

    expect(getStatistics(wrapper).exists()).toBe(true)
  })

  it('adds expense through store', async () => {
    const expensesStore = useExpensesStore(pinia)
    const initialCount = expensesStore.expenses.length

    await addExpenseToApp(wrapper, createExpense({ description: 'Новий тест' }))

    expect(expensesStore.expenses.length).toBe(initialCount + 1)
    expect(expensesStore.expenses[expensesStore.expenses.length - 1].description).toBe('Новий тест')
  })

  it('deletes expense from store', async () => {
    const expensesStore = useExpensesStore(pinia)

    await addExpenseToApp(wrapper, createExpense())

    const expenseList = getExpenseList(wrapper)
    const itemId = expenseList.props('items')[0].id

    await expenseList.vm.$emit('delete-expense', itemId)
    await wrapper.vm.$nextTick()

    expect(expensesStore.expenses.find((e) => e.id === itemId)).toBeUndefined()
  })

  it('filters expenses by category', async () => {
    await addExpenseToApp(wrapper, createExpense({ category: 'food (їжа)' }))
    await addExpenseToApp(wrapper, createExpense({ category: 'transport (транспорт)' }))

    const categoryFilter = getCategoryFilter(wrapper)
    await categoryFilter.vm.$emit('update:modelValue', 'food (їжа)')
    await wrapper.vm.$nextTick()

    const expenseList = getExpenseList(wrapper)
    const filteredItems = expenseList.props('items')

    expect(filteredItems.every((item) => item.category === 'food (їжа)')).toBe(true)
  })

  it('resets filter to "all" when last expense of category is deleted', async () => {
    await addExpenseToApp(wrapper, createExpense({ category: 'food (їжа)' }))
    await addExpenseToApp(wrapper, createExpense({ category: 'transport (транспорт)' }))

    const categoryFilter = getCategoryFilter(wrapper)
    await categoryFilter.vm.$emit('update:modelValue', 'food (їжа)')
    await wrapper.vm.$nextTick()

    const expenseList = getExpenseList(wrapper)
    const foodItemId = expenseList.props('items')[0].id

    await expenseList.vm.$emit('delete-expense', foodItemId)
    await wrapper.vm.$nextTick()

    const updatedItems = getExpenseList(wrapper).props('items')
    expect(updatedItems[0].category).toBe('transport (транспорт)')
  })

  it('passes correct categories to CategoryFilter', async () => {
    await addExpenseToApp(wrapper, createExpense({ category: 'food (їжа)' }))
    await addExpenseToApp(wrapper, createExpense({ category: 'transport (транспорт)' }))

    const categoryFilter = getCategoryFilter(wrapper)
    const categories = categoryFilter.props('categories')

    expect(categories).toContain('food (їжа)')
    expect(categories).toContain('transport (транспорт)')
  })

  it('passes correct total to Statistics', async () => {
    await addExpenseToApp(wrapper, createExpense({ amount: 100 }))
    await addExpenseToApp(wrapper, createExpense({ amount: 50 }))

    const statistics = getStatistics(wrapper)
    expect(statistics.props('total')).toBe(150)
  })

  it('passes correct category stats to Statistics', async () => {
    await addExpenseToApp(wrapper, createExpense({ amount: 100, category: 'food (їжа)' }))
    await addExpenseToApp(wrapper, createExpense({ amount: 50, category: 'food (їжа)' }))
    await addExpenseToApp(wrapper, createExpense({ amount: 30, category: 'transport (транспорт)' }))

    const statistics = getStatistics(wrapper)
    const categoryStats = statistics.props('categoryStats')

    expect(categoryStats['food (їжа)']).toBe(150)
    expect(categoryStats['transport (транспорт)']).toBe(30)
  })

  it('correctly calculates total expenses and available categories', async () => {
    const expensesStore = useExpensesStore(pinia)

    await addExpenseToApp(wrapper, createExpense({ amount: 100, category: 'food (їжа)' }))
    await addExpenseToApp(wrapper, createExpense({ amount: 50, category: 'transport (транспорт)' }))

    expect(expensesStore.totalExpenses).toBe(150)
    expect(expensesStore.availableCategories).toContain('food (їжа)')
    expect(expensesStore.availableCategories).toContain('transport (транспорт)')
  })
})
