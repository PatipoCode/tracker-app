<script lang="js" setup>
import { ref } from 'vue'

defineProps({
  imageSrc: {
    type: String,
    required: true,
    validator: (value) => value && value.length > 0,
  },
  title: {
    type: String,
    required: true,
    validator: (value) => value && value.trim().length > 0,
  },
  description: {
    type: String,
    required: true,
    validator: (value) => value && value.trim().length > 0,
  },
})

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
  console.warn('Failed to load empty state image')
}
</script>

<template>
  <div class="empty-state card">
    <div class="card-body">
      <div v-if="imageError" class="empty-state__icon-fallback">📋</div>
      <img
        v-else
        :src="imageSrc"
        :alt="title"
        class="empty-state__icon"
        @error="handleImageError"
      />
      <p class="empty-state__title">{{ title }}</p>
      <p class="empty-state__description">{{ description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba($color-primary, 0.05) 0%,
    rgba($color-accent, 0.05) 100%
  );
  border: 2px dashed rgba($color-primary, 0.3);
  border-radius: $border-radius;
  padding: $spacing-lg;
  transition: all $transition;

  &:hover {
    border-color: rgba($color-primary, 0.5);
    background: linear-gradient(
      135deg,
      rgba($color-primary, 0.08) 0%,
      rgba($color-accent, 0.08) 100%
    );
  }

  @media (min-width: $screen-tablet) {
    padding: $spacing-lg;
  }

  &__icon {
    width: 100px;
    height: 80px;
    color: $color-primary;
    margin: 0 auto $spacing-sm;
    opacity: 0.8;

    @media (min-width: $screen-tablet) {
      width: 110px;
      height: 90px;
    }
  }

  &__icon-fallback {
    width: 100px;
    height: 80px;
    margin: 0 auto $spacing-sm;
    font-size: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;

    @media (min-width: $screen-tablet) {
      width: 110px;
      height: 90px;
      font-size: 4.5rem;
    }
  }

  &__title {
    font-size: $font-size-large;
    font-weight: 600;
    color: $color-primary;
    margin-bottom: $spacing-sm;

    @media (min-width: $screen-tablet) {
      font-size: $font-size-heading;
    }
  }

  &__description {
    font-size: $font-size-small;
    color: var(--color-text-muted);
    margin: 0;

    @media (min-width: $screen-tablet) {
      font-size: $font-size-base;
    }
  }
}
</style>
