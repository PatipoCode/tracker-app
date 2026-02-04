<script lang="js" setup>
import { computed, ref, useAttrs } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { EXPENSE_CATEGORIES } from '@/constants'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    validator: (value) => typeof value === 'string',
  },
  required: {
    type: Boolean,
    default: true,
  },
  id: {
    type: String,
    default: '',
  },
})

const attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'change'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const options = EXPENSE_CATEGORIES
const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  inputValue.value = option
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
  return inputValue.value || 'Оберіть категорію'
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="custom-select"
    :class="[{ 'custom-select--open': isOpen }, attrs.class]"
  >
    <div
      :id="id"
      class="custom-select__trigger"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      role="button"
      tabindex="0"
      :aria-expanded="isOpen"
    >
      <span :class="{ 'custom-select__placeholder': !inputValue }">{{ displayValue }}</span>
      <IconArrowDown class="custom-select__arrow" />
    </div>
    <div v-if="isOpen" class="custom-select__dropdown">
      <div
        v-if="!required"
        class="custom-select__option"
        :class="{ 'custom-select__option--selected': !inputValue }"
        @click="selectOption('')"
      >
        Оберіть категорію
      </div>
      <div
        v-for="(option, index) in options"
        :key="index"
        class="custom-select__option"
        :class="{ 'custom-select__option--selected': inputValue === option }"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-select {
  @include custom-select-base;

  &__trigger {
    @include custom-select-trigger;
  }

  &--open &__trigger {
    @include custom-select-trigger-open;
  }

  &__placeholder {
    color: var(--color-text-muted);
    opacity: 0.7;
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
