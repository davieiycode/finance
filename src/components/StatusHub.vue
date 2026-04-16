<template>
  <div class="status-hub">
    <!-- MD3 Linear Progress Indicator (Syncing) -->
    <div v-if="store.isSyncing" class="sync-overlay">
       <div class="sync-container-md3">
          <div class="sync-header">
             <span class="material-symbols-rounded spin">sync</span>
             <span class="sync-title">Synchronizing Archive</span>
          </div>
          <div class="md-progress-bar">
             <div class="progress-track">
                <div class="progress-fill" :style="{ width: store.syncProgress + '%' }"></div>
             </div>
          </div>
          <div class="sync-footer">
             <span class="sync-status">STABILIZING RECORDS</span>
             <span class="sync-percent">{{ store.syncProgress }}%</span>
          </div>
       </div>
    </div>

    <!-- MD3 Snackbars -->
    <div class="snackbar-container">
       <TransitionGroup name="snackbar">
          <div v-for="n in store.notifications" :key="n.id" class="md-snackbar" :class="n.type">
             <span class="material-symbols-rounded snack-icon">{{ getIcon(n.type) }}</span>
             <span class="snack-message">{{ n.message }}</span>
          </div>
       </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()

const getIcon = (type) => {
  if (type === 'success') return 'check_circle'
  if (type === 'error') return 'error'
  if (type === 'warning') return 'warning'
  return 'info'
}
</script>

<style scoped>
.sync-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sync-container-md3 {
  width: 280px;
  background-color: var(--bg-secondary);
  padding: 24px;
  border-radius: 28px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.sync-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: var(--primary); }
.sync-title { font-size: 14px; font-weight: 500; font-family: 'Outfit', sans-serif; }

.md-progress-bar { width: 100%; height: 4px; background: var(--surface-variant); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; }

.sync-footer { display: flex; justify-content: space-between; margin-top: 12px; }
.sync-status { font-size: 10px; font-weight: 600; opacity: 0.5; letter-spacing: 1px; }
.sync-percent { font-size: 11px; font-weight: 700; color: var(--primary); }

.snackbar-container {
  position: fixed;
  bottom: 100px; /* Above BottomNav */
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  z-index: 10001;
  padding: 0 16px;
}

.md-snackbar {
  background-color: var(--on-surface-variant);
  color: var(--surface-variant);
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  pointer-events: auto;
}

.md-snackbar.success { background-color: #2e312e; color: #b4e8a8; border-left: 4px solid var(--green); }
.md-snackbar.error { background-color: #312e2e; color: #f2b8b5; border-left: 4px solid var(--red); }
.md-snackbar.warning { background-color: #31302e; color: #f9ddaf; border-left: 4px solid var(--orange); }

.snack-icon { font-size: 20px; }
.snack-message { font-size: 14px; font-weight: 500; }

.spin { animation: spin 2s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* TRANSITIONS */
.snackbar-enter-active, .snackbar-leave-active { transition: all 0.3s cubic-bezier(0.2, 0, 0, 1); }
.snackbar-enter-from { transform: translateY(20px); opacity: 0; }
.snackbar-leave-to { transform: scale(0.9); opacity: 0; }
</style>
