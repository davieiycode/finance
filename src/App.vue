<template>
  <div class="app-layout">
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
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: var(--bg-primary, #020617);
  position: relative;
  overflow: hidden; /* Prevent body scroll */
}
.main-content {
  flex: 1;
  overflow: hidden; /* Each view will handle its own scroll */
  padding-bottom: 0; /* Views have their own padding */
}
</style>
