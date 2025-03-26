<template>
  <div class="layout-wrapper">
    <PublicTopBar />

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>

    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
  <PrimeToast />
</template>

<style lang="scss" scoped></style>
<script setup lang="ts">
import PublicTopBar from '@/shared/layouts/public/PublicTopBar.vue'
</script>
