<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true,
    default: 0,
    validator: (value) => value >= 0,
  },
  categoryStats: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const getPercentage = (amount) => {
  if (props.total === 0) return '0.0'
  return ((amount / props.total) * 100).toFixed(1)
}

const formatAmount = (amount) => {
  return amount.toFixed(2)
}

const sortedCategoryStats = computed(() => {
  return Object.entries(props.categoryStats).sort(([, amountA], [, amountB]) => amountB - amountA)
})

const hasCategories = computed(() => {
  return sortedCategoryStats.value.length > 0
})
</script>

<template>
  <div class="statistics card shadow-sm">
    <div class="card-body">
      <h3 class="statistics__title card-title">Статистика витрат</h3>

      <div class="statistics__total alert alert-info">
        <strong>Загальні витрати:</strong> {{ formatAmount(total) }} грн
      </div>

      <div v-if="hasCategories" class="statistics__categories">
        <h5 class="statistics__subtitle">За категоріями:</h5>
        <div class="statistics__list">
          <div
            v-for="[category, amount] in sortedCategoryStats"
            :key="category"
            class="statistics__item"
          >
            <div class="statistics__category-info">
              <span class="statistics__category-name">{{ category }}</span>
              <span class="statistics__category-amount">{{ formatAmount(amount) }} грн</span>
            </div>
            <div class="progress statistics__progress">
              <div
                class="progress-bar"
                role="progressbar"
                :style="{ width: `${getPercentage(amount)}%` }"
                :aria-valuenow="getPercentage(amount)"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ getPercentage(amount) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.statistics {
  &__title {
    margin-bottom: $spacing-lg;
    font-size: $font-size-heading;
    font-weight: 700;
    color: $color-primary;

    @media (min-width: $screen-tablet) {
      font-size: $font-size-heading-tablet;
    }
  }

  &__total {
    font-size: 1.1rem;
    margin-bottom: $spacing-lg;
    padding: 0.75rem 1rem;
    background: linear-gradient(
      135deg,
      rgba($color-primary, 0.1) 0%,
      rgba($color-primary-light, 0.1) 100%
    );
    border-left: 4px solid $color-primary;
    border-radius: $border-radius;

    strong {
      color: $color-primary;
    }

    @media (min-width: $screen-tablet) {
      font-size: 1.25rem;
      padding: 1rem 1.5rem;
    }
  }

  &__subtitle {
    font-size: $font-size-medium;
    font-weight: 600;
    margin-bottom: $spacing-md;
    color: $color-primary-dark;

    @media (min-width: $screen-tablet) {
      font-size: 1.2rem;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__item {
    padding: 0.75rem;
    background-color: var(--color-bg-primary);
    border-radius: $border-radius;
    border: 2px solid rgba($color-primary, 0.2);
    transition:
      border-color $transition,
      transform $transition;

    &:hover {
      border-color: rgba($color-primary, 0.4);
      transform: translateX(4px);
    }
  }

  &__category-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
    font-weight: 500;
    font-size: $font-size-small;

    @media (min-width: $screen-tablet) {
      font-size: $font-size-base;
    }
  }

  &__category-name {
    color: $color-primary;
    font-weight: 600;
  }

  &__category-amount {
    color: darken($color-accent, 15%);
    font-weight: 700;
  }

  &__progress {
    height: $spacing-lg;
    background-color: rgba($color-primary, 0.1);
    border-radius: $border-radius;
    overflow: hidden;
  }
}

:deep(.progress-bar) {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  font-weight: 600;
  color: #ffffff;
  transition: width 0.6s ease;
}
</style>
