<template>
  <div class="app-layout">
    <router-view />
    <StatusHub />
  </div>
</template>

<script setup>
import './assets/style.css' // Import CSS Global
import StatusHub from './components/StatusHub.vue'
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
