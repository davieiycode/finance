<template>
  <div class="status-hub">
    <!-- Sync Progress Overlay -->
    <div v-if="store.isSyncing" class="sync-overlay">
       <div class="sync-modal">
          <div class="sync-header">
             <i data-lucide="cloud-sync" class="spin-slow" style="color: var(--accent);"></i>
             <span style="font-weight: 950; letter-spacing: 0.1em;">CORE RESONANCE ENGAGED</span>
          </div>
          <div class="progress-track">
             <div class="progress-fill" :style="{ width: store.syncProgress + '%' }"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.75rem;">
             <span style="font-size: 0.6rem; font-weight: 800; opacity: 0.5;">STABILIZING VORTEX</span>
             <span style="font-size: 0.7rem; font-weight: 950; color: var(--accent);">{{ store.syncProgress }}%</span>
          </div>
       </div>
    </div>

    <!-- Notification Toasts -->
    <div class="toast-container">
       <div v-for="n in store.notifications" :key="n.id" class="toast" :class="n.type">
          <i :data-lucide="getIcon(n.type)" style="width: 16px;"></i>
          <span>{{ n.message }}</span>
       </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()

const getIcon = (type) => {
  if (type === 'success') return 'check-circle'
  if (type === 'error') return 'alert-octagon'
  if (type === 'warning') return 'alert-triangle'
  return 'info'
}

watch(() => store.notifications.length, () => {
  if (window.lucide) window.lucide.createIcons()
})

watch(() => store.isSyncing, (val) => {
  if (val && window.lucide) {
     setTimeout(() => window.lucide.createIcons(), 50)
  }
})

onMounted(() => {
  if (window.lucide) window.lucide.createIcons()
})
</script>

<style scoped>
.sync-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(15px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.sync-modal {
  width: 100%;
  max-width: 400px;
  background: #000;
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 0 50px rgba(139, 92, 246, 0.2);
}

.sync-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #10b981);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px var(--accent);
}

.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  pointer-events: none;
  z-index: 10001;
}

.toast {
  background: rgba(0,0,0,0.9);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: toastSlideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.toast.success { border-color: #10b981; color: #10b981; }
.toast.error { border-color: #ef4444; color: #ef4444; }
.toast.warning { border-color: #f59e0b; color: #f59e0b; }

@keyframes toastSlideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spin-slow { animation: spin-slow 4s linear infinite; }
</style>
