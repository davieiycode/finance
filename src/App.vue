<template>
  <div class="app-layout">
    <div v-if="store.isSyncing" class="md3-progress-container">
      <div class="md3-progress-indicator"></div>
    </div>
    <div class="main-content">
      <router-view />
    </div>
    <BottomNav />
    <StatusHub />
  </div>
</template>

<script setup>
import './assets/style.css'
import StatusHub from './components/StatusHub.vue'
import BottomNav from './components/BottomNav.vue'
import { useFinanceStore } from './stores/finance'

const store = useFinanceStore()
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: var(--bg-primary, #1c1c1e);
  position: relative;
  overflow: hidden; /* Prevent body scroll */
}
.main-content {
  flex: 1;
  overflow: hidden; /* Each view will handle its own scroll */
  padding-bottom: 0; /* Views have their own padding */
}
</style>
