<template>
  <nav class="nav-island" :class="{ 'nav-hidden': isHidden }">
    <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" :class="{ 'active': isActive(item.path), 'action-item': item.path === '/transaction' }">
      <div :class="item.path === '/transaction' ? 'plus-hex' : 'icon-box'">
        <i :data-lucide="item.icon"></i>
      </div>
      <span>{{ item.label }}</span>
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
  { path: '/', label: 'Dash', icon: 'layout-grid' },
  { path: '/transaction', label: '+', icon: 'plus' },
  { path: '/history', label: 'Log', icon: 'scroll-text' }
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

const initIcons = () => {
  if (window.lucide) window.lucide.createIcons()
}

// Watch for global modal state changes
watch(() => uiStore.isModalOpen, (val) => {
  if (val) isHidden.value = true
  else isHidden.value = false
})

onMounted(() => {
  initIcons()
  document.addEventListener('scroll', handleScroll, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll, true)
})

watch(() => route.path, () => {
  setTimeout(initIcons, 50)
  isHidden.value = false // Show nav on route change
})
</script>

<style scoped>
.nav-island {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 240px;
  max-width: 85vw;
  height: 52px;
  background: rgba(15, 15, 25, 0.7);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 2000;
  padding: 0 1.25rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: env(safe-area-inset-bottom);
}

.nav-hidden {
  bottom: -100px;
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.95);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  flex: 1;
  padding: 0 0.5rem;
}

.icon-box {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.nav-item i {
  width: 18px;
  height: 18px;
  stroke-width: 2px;
}

.nav-item.active {
  color: white;
}

.nav-item.active .icon-box i {
  color: var(--accent, #8b5cf6);
  fill: rgba(139, 92, 246, 0.3); /* Subtle fill to make it 'solid' */
  filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.8));
  stroke-width: 2.5px;
  transform: scale(1.1);
}

.nav-item.active span {
  color: white;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.plus-hex {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent) 0%, #6d28d9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 4px;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.action-item:active .plus-hex {
  transform: scale(0.85) rotate(-15deg);
}

.nav-item.active .plus-hex {
  transform: translateY(-8px) scale(1.1);
  box-shadow: 0 12px 25px rgba(139, 92, 246, 0.5);
}

.action-item i {
  color: white;
  width: 18px;
  height: 18px;
  stroke-width: 3px;
}
</style>
