import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddExpense from '@/components/AddExpense.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { MIN_DESCRIPTION_LENGTH, MAX_AMOUNT } from '@/constants'

describe('AddExpense', () => {
  const getFormFields = (wrapper) => {
    const inputs = wrapper.findAllComponents(BaseInput)
    return {
      descriptionInput: inputs[0],
      amountInput: inputs[1],
      categorySelect: wrapper.findComponent(BaseSelect),
    }
  }

  const fillForm = async (wrapper, { description, amount, category }) => {
    const { descriptionInput, amountInput, categorySelect } = getFormFields(wrapper)

    if (description !== undefined) {
      await descriptionInput.vm.$emit('update:modelValue', description)
    }
    if (amount !== undefined) {
      await amountInput.vm.$emit('update:modelValue', amount)
    }
    if (category !== undefined) {
      await categorySelect.vm.$emit('update:modelValue', category)
    }

    await wrapper.vm.$nextTick()
  }

  const findErrorByText = (wrapper, searchText) => {
    const errors = wrapper.findAll('.add-expense__field-error')
    return errors.find((error) => error.text().includes(searchText))
  }

  const submitForm = async (wrapper) => {
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
  }

  it('renders form with all fields', () => {
    const wrapper = mount(AddExpense)

    expect(wrapper.find('.add-expense__title').text()).toBe('Додати нову витрату')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAllComponents(BaseInput)).toHaveLength(2)
    expect(wrapper.findComponent(BaseSelect).exists()).toBe(true)
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true)
  })

  it('shows error when description is empty after blur', async () => {
    const wrapper = mount(AddExpense)
    const { descriptionInput } = getFormFields(wrapper)

    await descriptionInput.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    const error = findErrorByText(wrapper, 'Опис')
    expect(error).toBeTruthy()
    expect(error.text()).toBe("Опис обов'язковий")
  })

  it('shows error when description is shorter than minimum length', async () => {
    const wrapper = mount(AddExpense)
    const { descriptionInput } = getFormFields(wrapper)

    await descriptionInput.vm.$emit('update:modelValue', 'ab')
    await descriptionInput.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    const error = findErrorByText(wrapper, 'мінімум')
    expect(error).toBeTruthy()
    expect(error.text()).toContain(`мінімум ${MIN_DESCRIPTION_LENGTH} символи`)
  })

  it('does not show error for valid description', async () => {
    const wrapper = mount(AddExpense)

    await fillForm(wrapper, { description: 'Продукти' })

    const { descriptionInput } = getFormFields(wrapper)
    await descriptionInput.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    const hasDescriptionError = findErrorByText(wrapper, 'Опис')
    expect(hasDescriptionError).toBeFalsy()
  })

  it('shows error when amount is empty after blur', async () => {
    const wrapper = mount(AddExpense)
    const { amountInput } = getFormFields(wrapper)

    await amountInput.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    const error = findErrorByText(wrapper, 'Сума')
    expect(error).toBeTruthy()
    expect(error.text()).toBe("Сума обов'язкова")
  })

  it('shows error when amount exceeds maximum', async () => {
    const wrapper = mount(AddExpense)

    await fillForm(wrapper, { amount: (MAX_AMOUNT + 1).toString() })

    const { amountInput } = getFormFields(wrapper)
    await amountInput.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    const error = findErrorByText(wrapper, 'Максимальна сума')
    expect(error).toBeTruthy()
    expect(error.text()).toContain(MAX_AMOUNT.toLocaleString('uk-UA'))
  })

  it('does not show error for valid amount', async () => {
    const wrapper = mount(AddExpense)

    await fillForm(wrapper, { amount: '150.50' })

    const { amountInput } = getFormFields(wrapper)
    await amountInput.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    const errors = wrapper.findAll('.add-expense__field-error')
    const amountError = errors.find(
      (error) => error.text().includes('Сума') && !error.text().includes('Категорія'),
    )
    expect(amountError).toBeFalsy()
  })

  it('shows error when category is not selected', async () => {
    const wrapper = mount(AddExpense)
    const { categorySelect } = getFormFields(wrapper)

    await categorySelect.vm.$emit('update:modelValue', '')
    await categorySelect.vm.$emit('change')
    await wrapper.vm.$nextTick()

    const error = findErrorByText(wrapper, 'категорію')
    expect(error).toBeTruthy()
  })

  it('emits add-expence with correct data when valid form is submitted', async () => {
    const wrapper = mount(AddExpense)

    await fillForm(wrapper, {
      description: 'Тестова витрата',
      amount: '100.00',
      category: 'food (їжа)',
    })

    await submitForm(wrapper)

    expect(wrapper.emitted('add-expence')).toBeTruthy()

    const emittedData = wrapper.emitted('add-expence')[0][0]
    expect(emittedData.description).toBe('Тестова витрата')
    expect(emittedData.amount).toBe(100.0)
    expect(emittedData.category).toBe('food (їжа)')
    expect(emittedData.date).toBeInstanceOf(Date)
  })

  it('does not emit add-expence when invalid form is submitted', async () => {
    const wrapper = mount(AddExpense)

    await submitForm(wrapper)

    expect(wrapper.emitted('add-expence')).toBeFalsy()

    const errors = wrapper.findAll('.add-expense__field-error')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('clears form after successful submission', async () => {
    const wrapper = mount(AddExpense)

    await fillForm(wrapper, {
      description: 'Тестова витрата',
      amount: '100.00',
      category: 'food (їжа)',
    })

    await submitForm(wrapper)

    expect(wrapper.emitted('add-expence')).toBeTruthy()

    await submitForm(wrapper)

    expect(wrapper.emitted('add-expence')).toHaveLength(1)
  })

  it('converts amount to number (float) on submission', async () => {
    const wrapper = mount(AddExpense)

    await fillForm(wrapper, {
      description: 'Тест',
      amount: '100.00',
      category: 'food (їжа)',
    })

    await submitForm(wrapper)

    const emittedData = wrapper.emitted('add-expence')[0][0]
    expect(typeof emittedData.amount).toBe('number')
    expect(emittedData.amount).toBe(100.0)
  })

  it('marks all fields as touched on submit attempt', async () => {
    const wrapper = mount(AddExpense)

    await submitForm(wrapper)

    const errors = wrapper.findAll('.add-expense__field-error')
    expect(errors.length).toBe(3)
  })
})
