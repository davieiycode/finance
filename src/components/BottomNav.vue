<template>
  <nav class="nav-bar" :class="{ 'nav-hidden': isHidden }">
    <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" :class="{ 'active': isActive(item.path) }">
      <div class="icon-container">
        <span class="material-symbols-rounded">{{ item.icon }}</span>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const uiStore = useUIStore()
const isHidden = ref(false)

const menuItems = [
  { path: '/', label: 'Beranda', icon: 'dashboard' },
  { path: '/transaction', icon: 'add' },
  { path: '/history', label: 'Riwayat', icon: 'history' }
]

const isActive = (path) => {
  if (path === '/') return router.currentRoute.value.path === '/'
  return router.currentRoute.value.path.startsWith(path)
}

const handleScroll = (e) => {
  if (uiStore.isModalOpen) {
    isHidden.value = true
    return
  }
  
  const target = e.target
  if (target.scrollTop > 50) isHidden.value = true
  else isHidden.value = false
}

watch(() => uiStore.isModalOpen, (val) => {
  if (val) isHidden.value = true
  else isHidden.value = false
})

onMounted(() => {
  document.addEventListener('scroll', handleScroll, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll, true)
})

watch(() => route.path, () => {
  isHidden.value = false
})
</script>

<style scoped>
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--bg-secondary);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 2000;
  padding: 0 16px env(safe-area-inset-bottom) 16px;
  border-top: 1px solid var(--border);
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s ease;
}

.nav-hidden {
  transform: translateY(100%);
  opacity: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--on-surface-variant);
  text-decoration: none;
  flex: 1;
  transition: all 0.2s ease;
  position: relative;
  height: 100%;
}

.icon-container {
  padding: 2px 20px;
  border-radius: 16px;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 24px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-family);
  transition: all 0.2s ease;
}

.nav-item.active {
  color: var(--on-surface);
}

.nav-item.active .icon-container {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.nav-item.active .material-symbols-rounded {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.nav-item.active .nav-label {
  font-weight: 700;
  color: var(--primary);
}

.nav-item:active {
  transform: scale(0.95);
}
</style>
