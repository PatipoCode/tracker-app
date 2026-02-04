<script lang="js" setup>
import { reactive, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import { MIN_DESCRIPTION_LENGTH, MAX_AMOUNT, MAX_DECIMAL_PLACES } from '@/constants'

const emit = defineEmits(['add-expense'])

const expense = reactive({
  description: '',
  amount: '',
  category: '',
})

const touched = reactive({
  description: false,
  amount: false,
  category: false,
})

const errors = reactive({
  description: '',
  amount: '',
  category: '',
})

const validateDescription = () => {
  const trimmed = expense.description.trim()

  if (!trimmed) {
    errors.description = "Опис обов'язковий"
    return false
  }

  if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `Опис повинен містити мінімум ${MIN_DESCRIPTION_LENGTH} символи`
    return false
  }

  errors.description = ''
  return true
}

const validateAmount = () => {
  if (!expense.amount) {
    errors.amount = "Сума обов'язкова"
    return false
  }

  const amount = parseFloat(expense.amount)

  if (isNaN(amount)) {
    errors.amount = 'Введіть коректне число'
    return false
  }

  if (amount <= 0) {
    errors.amount = 'Сума повинна бути більше 0'
    return false
  }

  if (amount > MAX_AMOUNT) {
    errors.amount = `Максимальна сума: ${MAX_AMOUNT.toLocaleString('uk-UA')}`
    return false
  }

  const parts = expense.amount.toString().split('.')
  const hasDecimal = parts.length === 2
  const decimalTooLong = hasDecimal && parts[1].length > MAX_DECIMAL_PLACES

  if (decimalTooLong) {
    errors.amount = `Максимум ${MAX_DECIMAL_PLACES} знаки після коми`
    return false
  }

  errors.amount = ''
  return true
}

const validateCategory = () => {
  if (!expense.category) {
    errors.category = "Оберіть категорію"
    return false
  }
  errors.category = ''
  return true
}

const onDescriptionBlur = () => {
  touched.description = true
  validateDescription()
}

const onAmountBlur = () => {
  touched.amount = true
  validateAmount()
}

const onCategoryChange = () => {
  touched.category = true
  validateCategory()
}

const isFormValid = computed(() => {
  return validateDescription() && validateAmount() && validateCategory()
})

const clearForm = () => {
  expense.description = ''
  expense.category = ''
  expense.amount = ''

  touched.description = false
  touched.amount = false
  touched.category = false

  errors.description = ''
  errors.amount = ''
  errors.category = ''
}

const handleSubmit = () => {
  touched.description = true
  touched.amount = true
  touched.category = true

  validateDescription()
  validateAmount()
  validateCategory()

  if (isFormValid.value) {
    emit('add-expense', {
      description: expense.description.trim(),
      amount: parseFloat(expense.amount),
      category: expense.category,
      date: new Date(),
    })
    clearForm()
  }
}
</script>

<template>
  <div class="add-expense card shadow-sm">
    <div class="card-body">
      <h3 class="add-expense__title card-title">Додати нову витрату</h3>
      <form @submit.prevent="handleSubmit" class="add-expense__form">
        <div class="add-expense__field mb-3">
          <label for="expense-description" class="add-expense__label form-label">Опис витрати</label>
          <BaseInput
            id="expense-description"
            v-model="expense.description"
            :type="'text'"
            :placeholder="'Наприклад: Продукти в супермаркеті'"
            :class="{ 'is-invalid': touched.description && errors.description }"
            @blur="onDescriptionBlur"
          />
          <div v-if="touched.description && errors.description" class="add-expense__field-error">
            {{ errors.description }}
          </div>
        </div>

        <div class="add-expense__field mb-3">
          <label for="expense-amount" class="add-expense__label form-label">Сума</label>
          <BaseInput
            id="expense-amount"
            v-model="expense.amount"
            :type="'number'"
            :placeholder="'0.00'"
            :step="'0.01'"
            :class="{ 'is-invalid': touched.amount && errors.amount }"
            @blur="onAmountBlur"
          />
          <div v-if="touched.amount && errors.amount" class="add-expense__field-error">
            {{ errors.amount }}
          </div>
        </div>

        <div class="add-expense__field mb-3">
          <label for="expense-category" class="add-expense__label form-label">Категорія</label>
          <BaseSelect
            id="expense-category"
            v-model="expense.category"
            :class="{ 'is-invalid': touched.category && errors.category }"
            @change="onCategoryChange"
          />
          <div v-if="touched.category && errors.category" class="add-expense__field-error">
            {{ errors.category }}
          </div>
        </div>

        <BaseButton :title="'Додати витрату'" :type="'submit'" class="mt-3"/>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-expense {
  &__title {
    margin-bottom: $spacing-lg;
    font-size: $font-size-heading;
    font-weight: 700;
    color: $color-primary;

    @media (min-width: $screen-tablet) {
      font-size: $font-size-heading-tablet;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-weight: 600;
    color: $color-primary;
  }

  &__field-error {
    color: $color-danger;
    font-size: $font-size-small;
    margin-top: 0.25rem;
    display: block;
    animation: slideIn 0.2s ease-out;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
