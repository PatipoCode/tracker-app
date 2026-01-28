<script setup></script>

<template>
  <div class="base-container">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.base-container {
  width: 100%;
  padding: 0 $spacing-md;
  margin: 0 auto;

  @media (min-width: $screen-tablet) {
    max-width: $container-width-tablet;
  }

  @media (min-width: $screen-desktop) {
    max-width: $container-width-desktop;
  }
}
</style>
