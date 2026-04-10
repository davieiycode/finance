<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item">
      <i data-lucide="home"></i>
      <span>Home</span>
    </router-link>
    <router-link to="/accounts" class="nav-item">
      <i data-lucide="wallet"></i>
      <span>Accounts</span>
    </router-link>
    <router-link to="/history" class="nav-item">
      <i data-lucide="book-open"></i>
      <span>History</span>
    </router-link>
    <router-link to="/analysis" class="nav-item">
      <i data-lucide="bar-chart-2"></i>
      <span>Analysis</span>
    </router-link>
    <router-link to="/settings" class="nav-item">
      <i data-lucide="settings"></i>
      <span>Settings</span>
    </router-link>
  </nav>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  if (window.lucide) window.lucide.createIcons()
})

watch(() => route.path, () => {
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons()
  }, 100)
})
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--bg-secondary, #0a0f25);
  border-top: 1px solid var(--border, #1e293b);
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0 1.5rem 0;
  z-index: 100;
}
.nav-item {
  color: var(--text-secondary, #94a3b8);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7rem;
  gap: 0.3rem;
  transition: 0.3s;
}
.nav-item.router-link-active {
  color: var(--accent, #a78bfa);
}
.nav-item.router-link-active i {
  color: var(--accent, #a78bfa);
}
</style>
