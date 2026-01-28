<script setup>
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import IconMoon from '../../public/icons/IconMoon.vue'
import IconSun from '../../public/icons/IconSun.vue'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<template>
  <div class="theme-toggle" :class="`theme-toggle--${theme}`" @click="toggleTheme">
    <div class="theme-toggle__track">
      <div class="theme-toggle__option">
        <IconMoon class="theme-toggle__icon" />
      </div>
      <div class="theme-toggle__option">
        <IconSun class="theme-toggle__icon" />
      </div>
      <div
        class="theme-toggle__thumb"
        :class="{ 'theme-toggle__thumb--light': theme === 'light' }"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-toggle {
  cursor: pointer;
  user-select: none;

  &__track {
    position: relative;
    width: 5rem;
    height: 2.5rem;
    background: linear-gradient(
      135deg,
      $color-primary-dark 0%,
      $color-primary 50%,
      $color-accent 100%
    );
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem;
    box-shadow: $shadow-sm;
    transition: all $transition;

    &:hover {
      box-shadow: $shadow-hover;
    }
  }

  &__option {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: opacity $transition;
  }

  &__icon {
    width: 1.3rem;
    height: 1.3rem;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
  }

  &--dark {
    .theme-toggle__icon {
      color: $color-primary-dark;
    }
  }

  &--light {
    .theme-toggle__icon {
      color: $color-accent;
    }
  }

  &__thumb {
    position: absolute;
    left: 0.25rem;
    width: 2rem;
    height: 2rem;
    background: #fff;
    opacity: 0.5;
    border-radius: 50%;
    transition: transform $transition;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &--light {
      transform: translateX(2.5rem);
    }
  }
}
</style>
