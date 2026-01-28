import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseList from '@/components/ExpenseList.vue'
import ExpenseItem from '@/components/ExpenseItem.vue'
import EmptyState from '@/components/EmptyState.vue'

describe('ExpenseList', () => {
  const testExpenses = [
    {
      id: 1,
      description: 'Продукти',
      amount: 150.75,
      category: 'food (їжа)',
      date: new Date('2026-01-01'),
    },
    {
      id: 2,
      description: 'Метро',
      amount: 30.00,
      category: 'transport (транспорт)',
      date: new Date('2026-01-02'),
    },
    {
      id: 3,
      description: 'Кіно',
      amount: 200.00,
      category: 'entertainment (розваги)',
      date: new Date('2026-01-03'),
    },
  ]

  let wrapper

  const mountExpenseList = (items) =>
    mount(ExpenseList, {
      props: { items },
    })
  const getExpenseItems = (wrapper) => wrapper.findAllComponents(ExpenseItem)
  const getEmptyState = (wrapper) => wrapper.findComponent(EmptyState)

  beforeEach(() => {
    wrapper = mountExpenseList(testExpenses)
  })

  it('renders EmptyState when expenses list is empty', () => {
    wrapper = mountExpenseList([])

    expect(getEmptyState(wrapper).exists()).toBe(true)
    expect(getExpenseItems(wrapper)).toHaveLength(0)
  })

  it('renders ExpenseItem components when there are expenses', () => {
    const expenseItems = getExpenseItems(wrapper)

    expect(expenseItems).toHaveLength(3)
    expect(getEmptyState(wrapper).exists()).toBe(false)
  })

  it('passes correct data to each ExpenseItem', () => {
    const expenseItems = getExpenseItems(wrapper)

    expect(expenseItems[0].props('expence')).toEqual(testExpenses[0])
    expect(expenseItems[1].props('expence')).toEqual(testExpenses[1])
    expect(expenseItems[2].props('expence')).toEqual(testExpenses[2])
  })

  it('emits delete-expense when ExpenseItem emits delete-expense', async () => {
    const firstExpenseItem = getExpenseItems(wrapper)[0]

    await firstExpenseItem.vm.$emit('delete-expense', 1)

    expect(wrapper.emitted('delete-expense')).toBeTruthy()
    expect(wrapper.emitted('delete-expense')[0]).toEqual([1])
  })

  it('updates display when expenses list changes', async () => {
    wrapper = mountExpenseList([])

    expect(getEmptyState(wrapper).exists()).toBe(true)
    expect(getExpenseItems(wrapper)).toHaveLength(0)

    await wrapper.setProps({ items: testExpenses })

    expect(getEmptyState(wrapper).exists()).toBe(false)
    expect(getExpenseItems(wrapper)).toHaveLength(3)

    await wrapper.setProps({ items: [] })

    expect(getEmptyState(wrapper).exists()).toBe(true)
    expect(getExpenseItems(wrapper)).toHaveLength(0)
  })
})
