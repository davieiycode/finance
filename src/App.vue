<script setup>
import { ref, onMounted } from 'vue'
import './assets/style.css'
import StatusHub from './components/StatusHub.vue'
import BottomNav from './components/BottomNav.vue'
import LockScreen from './components/LockScreen.vue'
import { useFinanceStore } from './stores/finance'

const store = useFinanceStore()
const isLocked = ref(false)
const savedPin = ref('')

onMounted(() => {
  const prefs = JSON.parse(localStorage.getItem('user_prefs') || '{}')
  if (prefs.appLockEnabled && prefs.appPin) {
    savedPin.value = prefs.appPin
    isLocked.value = true
  }
})
</script>

<template>
  <div class="app-layout">
    <LockScreen v-if="isLocked" :savedPin="savedPin" @unlocked="isLocked = false" />
    <template v-else>
      <div v-if="store.isSyncing" class="md3-progress-container">
        <div class="md3-progress-indicator"></div>
      </div>
      <div class="main-content">
        <router-view />
      </div>
      <BottomNav />
      <StatusHub />
    </template>
  </div>
</template>

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
