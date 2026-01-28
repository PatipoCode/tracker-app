import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExpensesStore } from '@/stores/expenses'
import { STORAGE_KEY } from '@/constants'

describe('useExpensesStore', () => {
  const createExpense = (description, amount, category) => ({
    description,
    amount,
    category,
    date: new Date(),
  })

  const initializeStore = () => {
    const store = useExpensesStore()
    store.isInitialized = true
    return store
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('has empty expenses array on initialization', () => {
    const store = useExpensesStore()

    expect(store.expences).toEqual([])
    expect(store.isInitialized).toBe(false)
  })

  it('adds new expense', () => {
    const store = initializeStore()

    store.addExpense(createExpense('Тестова витрата', 100, 'food (їжа)'))

    expect(store.expences).toHaveLength(1)
    expect(store.expences[0].description).toBe('Тестова витрата')
    expect(store.expences[0].amount).toBe(100)
    expect(store.expences[0].id).toBeDefined()
  })

  it('deletes expense by id', () => {
    const store = initializeStore()

    store.addExpense(createExpense('Тестова витрата', 100, 'food (їжа)'))

    expect(store.expences).toHaveLength(1)

    const expenseId = store.expences[0].id
    store.deleteExpense(expenseId)

    expect(store.expences).toHaveLength(0)
  })

  it('correctly calculates total expenses amount', () => {
    const store = initializeStore()

    store.addExpense(createExpense('Тестова витрата 1', 50, 'food (їжа)'))
    store.addExpense(createExpense('Тестова витрата 2', 100, 'transport (транспорт)'))
    store.addExpense(createExpense('Тестова витрата 3', 125.56, 'entertainment (розваги)'))

    expect(store.totalExpenses).toBe(275.56)
  })

  it('correctly calculates statistics per category', () => {
    const store = initializeStore()

    store.addExpense(createExpense('Продукти', 100, 'food (їжа)'))
    store.addExpense(createExpense('Нові продукти', 50, 'food (їжа)'))
    store.addExpense(createExpense('Проїзд', 30, 'transport (транспорт)'))

    expect(store.statsByCategories['food (їжа)']).toBe(150)
    expect(store.statsByCategories['transport (транспорт)']).toBe(30)
  })

  it('returns list of unique categories', () => {
    const store = initializeStore()

    store.addExpense(createExpense('Продукти', 100, 'food (їжа)'))
    store.addExpense(createExpense('Нові продукти', 50, 'food (їжа)'))
    store.addExpense(createExpense('Проїзд', 30, 'transport (транспорт)'))

    expect(store.availableCategories).toHaveLength(2)
    expect(store.availableCategories).toContain('food (їжа)')
    expect(store.availableCategories).toContain('transport (транспорт)')
  })

  it('saves expenses to localStorage', () => {
    const store = initializeStore()

    store.addExpense(createExpense('Тестова витрата', 100, 'food (їжа)'))

    const saved = localStorage.getItem(STORAGE_KEY)
    expect(saved).not.toBeNull()

    const parsed = JSON.parse(saved)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].description).toBe('Тестова витрата')
  })

  it('loads expenses from localStorage', () => {
    const testData = [
      {
        id: 1,
        description: 'Збережена витрата',
        amount: 200,
        category: 'food (їжа)',
        date: new Date('2024-01-01').toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testData))

    const store = useExpensesStore()
    store.loadFromStorage()

    expect(store.expences).toHaveLength(1)
    expect(store.expences[0].description).toBe('Збережена витрата')
    expect(store.expences[0].amount).toBe(200)
    expect(store.expences[0].date).toBeInstanceOf(Date)
    expect(store.isInitialized).toBe(true)
  })
})
