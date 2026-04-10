<template>
  <div class="app-layout">
    <router-view />
    <BottomNav v-if="showNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import './assets/style.css' // Import CSS Global

const route = useRoute()
const showNav = computed(() => route.meta.hideNav !== true)
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: var(--bg-primary, #020617);
}
</style>
