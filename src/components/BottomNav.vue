<template>
  <div class="nav-container" :class="{ 'nav-hidden': isHidden }">
    <nav class="nav-bar glass-panel">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path" 
        class="nav-item" 
        :class="{ 'active': isActive(item.path) }"
        @click="uiStore.haptic('light')"
      >
        <div class="active-pill" v-if="isActive(item.path)"></div>
        <div class="icon-wrapper">
          <span class="material-symbols-rounded">{{ item.icon }}</span>
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
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
  { path: '/', icon: 'dashboard', label: 'Home' },
  { path: '/transaction', icon: 'add_circle', label: 'Add' },
  { path: '/history', icon: 'history', label: 'History' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

let lastScrollTop = 0
const handleScroll = (e) => {
  if (uiStore.isModalOpen) return
  
  const target = e.target
  if (!(target instanceof HTMLElement)) return
  
  const st = target.scrollTop
  if (st > lastScrollTop && st > 100) {
    isHidden.value = true
  } else {
    isHidden.value = false
  }
  lastScrollTop = st <= 0 ? 0 : st
}

watch(() => uiStore.isModalOpen, (val) => {
  isHidden.value = val
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
.nav-container {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 2000;
  padding: 0 24px;
  transition: all 0.5s var(--spring-easing);
  pointer-events: none;
}

.nav-bar {
  display: flex;
  background: rgba(22, 22, 24, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 8px 12px;
  gap: 8px;
  pointer-events: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
}

.nav-hidden {
  transform: translateY(120%) scale(0.9);
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
  height: 48px;
  border-radius: 24px;
  transition: all 0.3s var(--spring-easing);
  position: relative;
  overflow: hidden;
}

.icon-wrapper {
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s var(--spring-easing);
}

.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 24px;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  z-index: 2;
  opacity: 0.7;
}

.active-pill {
  position: absolute;
  inset: 4px;
  background: var(--primary-container);
  border-radius: 20px;
  z-index: 1;
  animation: pillPop 0.4s var(--spring-easing);
}

@keyframes pillPop {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.nav-item.active {
  color: var(--on-primary-container);
}

.nav-item.active .material-symbols-rounded {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  transform: translateY(-2px);
}

.nav-item.active .nav-label {
  opacity: 1;
  transform: translateY(-1px);
}

.nav-item:active {
  transform: scale(0.9);
}

.nav-item:active .icon-wrapper {
  transform: scale(0.8);
}
</style>
