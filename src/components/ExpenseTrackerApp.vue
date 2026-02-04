<script lang="js" setup>
import { ref, computed, onMounted } from 'vue'
import AddExpense from '@/components/AddExpense.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import ExpenseStatistics from './ExpenseStatistics.vue'
import CategoryFilter from './CategoryFilter.vue'
import BaseContainer from './BaseContainer.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'
import { useExpensesStore } from '@/stores/expenses'

const themeStore = useThemeStore()
const expensesStore = useExpensesStore()

themeStore.initialize()

const selectedCategory = ref('all')

const getExpense = (value) => {
  expensesStore.addExpense(value)
}

const deleteExpense = (id) => {
  expensesStore.deleteExpense(id)

  if (selectedCategory.value !== 'all') {
    const categoryExists = expensesStore.expenses.some(
      (expense) => expense.category === selectedCategory.value
    )
    if (!categoryExists) {
      selectedCategory.value = 'all'
    }
  }
}

const filteredExpenses = computed(() => {
  if (selectedCategory.value === 'all') {
    return expensesStore.expenses
  }
  return expensesStore.expenses.filter(
    (expense) => expense.category === selectedCategory.value
  )
})

onMounted(() => {
  expensesStore.loadFromStorage()
})
</script>

<template>
  <BaseContainer>
    <div class="expense-tracker">
      <div class="expense-tracker__header">
        <div class="expense-tracker__theme-toggle">
          <ThemeToggle />
        </div>
        <img src="/images/logo.png" alt="Logo" class="expense-tracker__logo" />
        <h1 class="expense-tracker__title">Візьми фінанси під контроль!</h1>
      </div>

      <div class="expense-tracker__form">
        <AddExpense @add-expense="getExpense" />
      </div>

      <div v-if="expensesStore.expenses.length > 0" class="expense-tracker__filter">
        <CategoryFilter
          v-model="selectedCategory"
          :categories="expensesStore.availableCategories"
        />
      </div>

      <div class="expense-tracker__list">
        <ExpenseList :items="filteredExpenses" @delete-expense="deleteExpense" />
      </div>

      <div v-if="expensesStore.expenses.length > 0" class="expense-tracker__statistics">
        <ExpenseStatistics
          :total="expensesStore.totalExpenses"
          :categoryStats="expensesStore.statsByCategories"
        />
      </div>
    </div>
  </BaseContainer>
</template>

<style lang="scss" scoped>
.expense-tracker {
  padding: 2rem 0;

  &__header {
    position: relative;
    margin-bottom: $spacing-sm;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__theme-toggle {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__logo {
    width: 100px;
    height: 100px;
    object-fit: contain;
    animation: fadeIn 0.5s ease-in;

    @media (min-width: $screen-tablet) {
      width: 110px;
      height: 110px;
    }
  }

  &__title {
    font-size: $font-size-title;
    font-weight: bold;
    color: var(--color-text-primary);

    @media (min-width: $screen-tablet) {
      font-size: $font-size-title-tablet;
    }
  }

  &__form {
    margin-bottom: $spacing-lg;
  }

  &__filter {
    margin-bottom: $spacing-lg;
  }

  &__list {
    margin-bottom: $spacing-lg;
  }

  &__statistics {
    margin-top: $spacing-lg;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
