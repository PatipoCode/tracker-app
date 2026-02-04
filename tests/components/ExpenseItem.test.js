import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseItem from '@/components/ExpenseItem.vue'
import BaseButton from '@/components/BaseButton.vue'

describe('ExpenseItem', () => {
  const testExpense = {
    id: 1,
    description: 'Покупка продуктів',
    amount: 150.75,
    category: 'food (їжа)',
    date: new Date('2026-01-01'),
  }

  let wrapper

  const mountExpenseItem = (expense) =>
    mount(ExpenseItem, {
      props: { expense },
    })
  const getTitleElement = (wrapper) => wrapper.find('.expense-item__title')
  const getAmountElement = (wrapper) => wrapper.find('.expense-item__amount')
  const getCategoryElement = (wrapper) => wrapper.find('.expense-item__category')
  const getDateElement = (wrapper) => wrapper.find('.expense-item__date')
  const getDeleteButton = (wrapper) => wrapper.findComponent(BaseButton)

  beforeEach(() => {
    wrapper = mountExpenseItem(testExpense)
  })

  it('renders expense component', () => {
    expect(wrapper.find('.expense-item').exists()).toBe(true)
  })

  it('displays expense description', () => {
    const title = getTitleElement(wrapper)
    expect(title.text()).toBe('Покупка продуктів')
  })

  it('formats amount with 2 decimal places', () => {
    const amount = getAmountElement(wrapper)
    expect(amount.text()).toBe('150.75 грн')
  })

  it('formats integer with .00', () => {
    const expenseWithWholeNumber = {
      ...testExpense,
      amount: 100,
    }
    const wrapper = mountExpenseItem(expenseWithWholeNumber)
    const amount = getAmountElement(wrapper)

    expect(amount.text()).toBe('100.00 грн')
  })

  it('displays expense category', () => {
    const category = getCategoryElement(wrapper)
    expect(category.text()).toContain('food (їжа)')
  })

  it('formats date in UK date format', () => {
    const dateElement = getDateElement(wrapper)
    expect(dateElement.text()).toContain('01.01.2026')
  })

  it('displays "Delete/Видалити" button', () => {
    const deleteButton = getDeleteButton(wrapper)

    expect(deleteButton.exists()).toBe(true)
    expect(deleteButton.props('title')).toBe('Видалити')
    expect(deleteButton.props('variant')).toBe('danger')
  })

  it('emits delete-expense with correct id on button click', async () => {
    const deleteButton = getDeleteButton(wrapper)
    await deleteButton.vm.$emit('on-btn-click')

    expect(wrapper.emitted('delete-expense')).toBeTruthy()
    expect(wrapper.emitted('delete-expense')[0]).toEqual([1])
  })
})
