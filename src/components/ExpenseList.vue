<script lang="js" setup>
import ExpenseItem from './ExpenseItem.vue'
import EmptyState from './EmptyState.vue'

const emptyStateImage = `${import.meta.env.BASE_URL}images/empty-state.png`

defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['delete-expense'])

const handleDelete = (id) => {
  emit('delete-expense', id)
}
</script>

<template>
  <div class="expense-list">
    <EmptyState
      v-if="items.length === 0"
      class="expense-list__empty"
      :image-src="emptyStateImage"
      title="Витрат не знайдено"
      description="Додайте свою першу витрату, щоб почати відстежувати фінанси"
    />
    <ExpenseItem
      v-else
      v-for="item in items"
      :key="item.id"
      :expence="item"
      @delete-expense="handleDelete"
    />
  </div>
</template>

<style lang="scss" scoped>
.expense-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;

  @media (min-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }

  &__empty {
    grid-column: 1 / -1;
  }
}
</style>
