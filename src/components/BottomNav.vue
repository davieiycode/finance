<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" active-class="active">
      <i data-lucide="layout-dashboard"></i>
      <span>Dashboard</span>
    </router-link>
    <router-link to="/transaction" class="nav-item" active-class="active">
      <div class="plus-icon">
        <i data-lucide="plus"></i>
      </div>
      <span>New Entry</span>
    </router-link>
    <router-link to="/history" class="nav-item" active-class="active">
      <i data-lucide="scroll"></i>
      <span>Logbook</span>
    </router-link>
  </nav>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const initIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

onMounted(initIcons)
watch(() => route.path, () => {
  setTimeout(initIcons, 50)
})
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  user-select: none;
}

.nav-item:active {
  transform: scale(0.9);
}

.nav-item:active .plus-icon {
  transform: scale(0.9);
}

.nav-item i {
  width: 20px;
  height: 20px;
  stroke-width: 2px;
}

.nav-item.active {
  color: var(--accent, #8b5cf6);
}

.nav-item.active i {
  color: var(--accent, #8b5cf6);
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
  fill: currentColor;
}

.plus-icon {
  width: 32px;
  height: 32px;
  background: var(--accent, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 2px;
  transition: all 0.3s;
}

.nav-item.active .plus-icon {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
}

.nav-item .plus-icon i {
  color: white;
  width: 20px;
  height: 20px;
}
</style>
