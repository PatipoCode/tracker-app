<script lang="js" setup>
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  expence: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value &&
        typeof value.id !== 'undefined' &&
        typeof value.description === 'string' &&
        typeof value.amount === 'number' &&
        typeof value.category === 'string' &&
        value.date
      )
    },
  },
})

const emit = defineEmits(['delete-expense'])

const handleDelete = () => {
  emit('delete-expense', props.expence.id)
}

const formattedDate = computed(() => {
  const date =
    props.expence.date instanceof Date ? props.expence.date : new Date(props.expence.date)
  return date.toLocaleDateString('uk-UA')
})

const formattedAmount = computed(() => {
  return props.expence.amount.toFixed(2)
})
</script>

<template>
  <div class="expense-item card shadow-sm">
    <div class="card-body expense-item__body">
      <div class="expense-item__header">
        <h4 class="expense-item__title">{{ expence.description }}</h4>
        <span class="expense-item__amount">{{ formattedAmount }} грн</span>
      </div>
      <div class="expense-item__details">
        <span class="expense-item__category">
          <strong>Категорія:</strong> {{ expence.category }}
        </span>
        <span class="expense-item__date"> <strong>Дата:</strong> {{ formattedDate }} </span>
      </div>
      <div class="expense-item__actions">
        <BaseButton title="Видалити" variant="danger" @on-btn-click="handleDelete" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.expense-item {
  cursor: default;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-hover !important;
  }

  &:focus-within {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
    border-color: $color-primary !important;
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }

  &__title {
    font-size: $font-size-medium;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    line-height: 1.4;
    max-height: 2.8em;

    @media (min-width: $screen-tablet) {
      font-size: $font-size-large;
      max-height: 3.5em;
    }
  }

  &__amount {
    font-size: $font-size-base;
    padding: $spacing-sm;
    background: $color-accent;
    color: #333;
    font-weight: 700;
    border-radius: $border-radius;
    box-shadow: $shadow-sm;
    display: inline-block;
    white-space: nowrap;
    transition: all $transition;

    &:hover {
      transform: scale(1.05);
      box-shadow: $shadow-hover;
    }

    @media (min-width: $screen-tablet) {
      font-size: $font-size-medium;
    }
  }

  &__details {
    display: flex;
    justify-content: space-between;
    gap: $spacing-lg;
    font-size: 0.85rem;
    color: var(--color-text-muted);

    @media (min-width: $screen-tablet) {
      font-size: $font-size-small;
    }
  }

  &__category,
  &__date {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    strong {
      color: $color-primary;
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
    margin-top: auto;
    padding-top: $spacing-md;
  }
}
</style>
