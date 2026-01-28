<script lang="js" setup>

defineProps({
  title: {
    type: String,
    required: true,
    validator: (value) => {
      return value && value.trim().length > 0
    },
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => {
      return ['button', 'submit', 'reset'].includes(value)
    },
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => {
      return ['primary', 'danger'].includes(value)
    },
  },
})

const emit = defineEmits(['on-btn-click'])

const handleClick = () => {
  emit('on-btn-click')
}
</script>

<template>
  <button :type="type" @click="handleClick" :class="['btn', `btn-${variant}`]">
    {{ title }}
  </button>
</template>

<style lang="scss" scoped>
.btn {
  padding: 0.75rem 1.5rem;
  font-size: $font-size-base;
  font-weight: 600;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all $transition;
  box-shadow: $shadow-sm;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-hover;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: $opacity-disabled;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.3);
  }

  &-primary {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: #ffffff;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, $color-primary-light 0%, $color-primary 100%);
    }
  }

  &-danger {
    background: linear-gradient(135deg, $color-danger 0%, darken($color-danger, 10%) 100%);
    color: #ffffff;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, lighten($color-danger, 5%) 0%, $color-danger 100%);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba($color-danger, 0.3);
    }
  }
}
</style>
