<template>
  <div class="setup-container">
     <div v-if="!scanning && !syncing && !showManual" class="welcome-screen">
        <div class="logo-orb" style="overflow: hidden; padding: 0;">
           <img src="/logo.png" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <h1 style="font-weight: 1000; letter-spacing: -0.05em; margin: 2rem 0 0.5rem 0;">INITIALIZE CORE</h1>
        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; max-width: 280px; margin-bottom: 3rem;">
           Establish a secure resonance with your Universal Core infrastructure to begin the journey.
        </p>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 320px;">
          <button @click="startSetup" class="setup-btn">
             <i data-lucide="qr-code"></i>
             SCAN CORE UPLINK
          </button>
          
          <button @click="showManual = true" style="background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid var(--border); padding: 1rem; border-radius: 1.25rem; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
             ENTER COORDINATE MANUALLY
          </button>
        </div>
        
        <p style="font-size: 0.6rem; opacity: 0.4; margin-top: 2rem; letter-spacing: 0.1em; font-weight: 800;">INTELLIGENCE CORE V5.3.0 • BUILT 2026-04-13</p>
     </div>

     <!-- Manual Entry View -->
     <div v-if="showManual && !syncing" class="welcome-screen">
         <div class="logo-orb" style="overflow: hidden; padding: 1.5rem; background: white;">
            <img src="/logo.png" style="width: 100%; height: 100%; object-fit: contain;">
         </div>
        <h1 style="font-weight: 1000; letter-spacing: -0.05em; margin: 2rem 0 0.5rem 0;">MANUAL UPLINK</h1>
        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 2rem;">Paste your Bridge Nexus URL (Core Protocol) below.</p>
        
        <div style="width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 1rem;">
          <input 
            v-model="manualUrl" 
            type="text" 
            placeholder="https://script.google.com/macros/s/..." 
            style="width: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 1rem; padding: 1rem; color: white; outline: none; font-size: 0.8rem;"
          >
          
          <div style="display: flex; gap: 0.75rem;">
            <button @click="showManual = false" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; padding: 1rem; border-radius: 1rem; font-weight: 700;">BACK</button>
            <button @click="submitManual" :disabled="!manualUrl.startsWith('http')" style="flex: 2; background: var(--accent); color: white; border: none; padding: 1rem; border-radius: 1rem; font-weight: 700; cursor: pointer;" :style="{ opacity: manualUrl.startsWith('http') ? 1 : 0.5 }">CONNECT</button>
          </div>
        </div>
     </div>

    <!-- QR Scanner View -->
    <div v-if="scanning" class="scanner-wrap">
       <div class="scanner-header">
          <button @click="scanning = false" style="background:none; border:none; color:white;"><i data-lucide="arrow-left"></i></button>
          <span style="font-weight: 800; font-size: 0.8rem; letter-spacing: 0.1em;">LOCATING CORE UPLINK</span>
          <div style="width: 24px;"></div>
       </div>
       <div id="setup-reader" class="scanner-preview"></div>
       <div class="scanner-overlay">
          <div class="scan-frame"></div>
       </div>
       <p style="color: var(--text-secondary); font-size: 0.75rem; padding: 2rem; text-align: center;">Point camera at your Secure Jurney Access Key (QR)</p>
    </div>

    <!-- Post-Scan Sync State -->
    <div v-if="syncing" class="sync-state">
       <div class="pulse-loader"></div>
       <h2 style="font-weight: 950; letter-spacing: 0.1em; margin-top: 2rem;">INGESTING DATA...</h2>
       <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Allocating local vault resources</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'

const router = useRouter()
const store = useFinanceStore()
const scanning = ref(false)
const syncing = ref(false)
const showManual = ref(false)
const manualUrl = ref('')
let html5QrCode = null

const startSetup = () => {
  scanning.value = true
  nextTick(() => {
    initScanner()
  })
}

const initScanner = async () => {
  if (window.lucide) window.lucide.createIcons()
  try {
    html5QrCode = new window.Html5Qrcode("setup-reader")
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (decodedText.startsWith('http')) {
           await stopScanner()
           completeSetup(decodedText)
        }
      },
      () => {}
    )
  } catch (err) {
    console.error(err)
    alert("Camera access denied.")
    scanning.value = false
  }
}

const stopScanner = async () => {
  if (html5QrCode) {
     try {
        await html5QrCode.stop()
        await html5QrCode.clear()
     } catch (e) { console.warn(e) }
     html5QrCode = null
  }
}

const completeSetup = async (url) => {
  localStorage.setItem('cloud_sheet_url', url)
  scanning.value = false
  showManual.value = false
  syncing.value = true
  
  const success = await store.pullFromCloud('overwrite')
  if (success) {
     store.notify('System Initialized', 'success')
     router.push('/')
  } else {
     store.notify('Sync Failure', 'error')
     localStorage.removeItem('cloud_sheet_url')
     syncing.value = false
  }
}

const submitManual = () => {
  if (manualUrl.value.startsWith('http')) {
    completeSetup(manualUrl.value.trim())
  }
}

onBeforeUnmount(() => { stopScanner() })

// Re-render icons on state changes
watch([scanning, syncing, showManual], () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})

onMounted(() => {
  if (window.lucide) window.lucide.createIcons()
})
</script>

<style scoped>
.setup-container {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  overflow: hidden;
}

.welcome-screen, .sync-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  animation: fadeIn 0.8s ease;
}

.logo-orb {
  width: 120px;
  height: 120px;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 50px rgba(139, 92, 246, 0.1);
}

.setup-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 1.5rem;
  font-weight: 1000;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
}

.scanner-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #000;
}

.scanner-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.scanner-preview {
  flex: 1;
  width: 100%;
}

.scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scan-frame {
  width: 250px;
  height: 250px;
  border: 2px solid var(--accent);
  border-radius: 2rem;
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.6);
}

.pulse-loader {
  width: 80px;
  height: 80px;
  border: 4px solid var(--accent);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
