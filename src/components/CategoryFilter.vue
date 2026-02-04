<script setup>
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return Array.isArray(value) && value.every((cat) => typeof cat === 'string')
    },
  },
  modelValue: {
    type: String,
    default: 'all',
    validator: (value) => {
      return typeof value === 'string'
    },
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (value) => {
  inputValue.value = value
  isOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleDropdown()
  }
}

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

const displayValue = computed(() => {
  return inputValue.value === 'all' ? 'Всі категорії' : inputValue.value
})
</script>

<template>
  <div class="category-filter card shadow-sm">
    <div class="card-body">
      <label for="category-filter" class="category-filter__label form-label"
        >Фільтр за категорією:</label
      >
      <div ref="dropdownRef" class="custom-select" :class="{ 'custom-select--open': isOpen }">
        <div
          id="category-filter"
          class="custom-select__trigger"
          @click="toggleDropdown"
          @keydown="handleKeydown"
          role="button"
          tabindex="0"
          :aria-expanded="isOpen"
        >
          <span>{{ displayValue }}</span>
          <IconArrowDown class="custom-select__arrow" />
        </div>
        <div v-if="isOpen" class="custom-select__dropdown">
          <div
            class="custom-select__option"
            :class="{ 'custom-select__option--selected': inputValue === 'all' }"
            @click="selectOption('all')"
          >
            Всі категорії
          </div>
          <div
            v-for="category in categories"
            :key="category"
            class="custom-select__option"
            :class="{ 'custom-select__option--selected': inputValue === category }"
            @click="selectOption(category)"
          >
            {{ category }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-filter {
  &__label {
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-bottom: $spacing-sm;
  }
}

.custom-select {
  @include custom-select-base;

  &__trigger {
    @include custom-select-trigger;
  }

  &--open &__trigger {
    @include custom-select-trigger-open;
  }

  &__arrow {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-secondary);
    transition: transform $transition;
  }

  &--open &__arrow {
    transform: rotate(180deg);
  }

  &__dropdown {
    @include custom-select-dropdown;
  }

  &__option {
    @include custom-select-option;

    &--selected {
      @include custom-select-option-selected;
    }
  }
}

@include slideDown-animation;
</style>
