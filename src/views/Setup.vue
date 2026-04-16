<template>
  <div class="setup-container">
    <!-- Welcome Screen -->
    <div v-if="!scanning && !syncing && !showManual" class="welcome-screen" animate-fade-in>
      <div class="hero-orb">
        <img src="/logo.png" class="hero-logo">
      </div>
      <h1 class="setup-title">INITIALIZE CORE</h1>
      <p class="setup-desc">Establish a secure resonance with your Universal Core infrastructure to begin the journey.</p>
      
      <div class="setup-actions">
        <button @click="startSetup" class="setup-btn-filled">
          <span class="material-symbols-rounded">qr_code_scanner</span>
          SCAN CORE UPLINK
        </button>
        
        <button @click="showManual = true" class="setup-btn-text">
          <span class="material-symbols-rounded">edit_note</span>
          ENTER COORDINATES MANUALLY
        </button>
      </div>
      
      <div class="version-info">
        <span>INTELLIGENCE CORE V5.4.0</span>
        <span>PRODUCTION GRADE • BUILT 2026-04-16</span>
      </div>
    </div>

    <!-- Manual Entry -->
    <div v-if="showManual && !syncing" class="welcome-screen" animate-fade-in>
      <div class="hero-orb small">
        <img src="/logo.png" class="hero-logo">
      </div>
      <h1 class="setup-title">MANUAL UPLINK</h1>
      <p class="setup-desc">Enter your Bridge Nexus URL (Core Protocol) to establish a link.</p>
      
      <div class="input-container card-md3">
        <span class="material-symbols-rounded">link</span>
        <input v-model="manualUrl" type="text" placeholder="https://script.google.com/..." class="md-input-raw">
      </div>
      
      <div class="setup-actions row">
        <button @click="showManual = false" class="setup-btn-outline">CANCEL</button>
        <button @click="submitManual" :disabled="!manualUrl.startsWith('http')" class="setup-btn-filled primary">
          CONNECT
        </button>
      </div>
    </div>

    <!-- QR Scanner -->
    <div v-if="scanning" class="scanner-view">
      <div class="scanner-top-bar">
        <button @click="scanning = false" class="icon-btn-lit">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <span class="scanner-status">LOCATING CORE UPLINK</span>
        <div style="width: 48px;"></div>
      </div>
      
      <div class="scanner-body">
        <div id="setup-reader" class="qr-reader-window"></div>
        <div class="scanner-vignette">
           <div class="scan-target-frame">
              <div class="corner tl"></div><div class="corner tr"></div>
              <div class="corner bl"></div><div class="corner br"></div>
           </div>
        </div>
      </div>

      <div class="scanner-footer">
        <p>Align the access key QR code within the frame</p>
      </div>
    </div>

    <!-- Syncing State -->
    <div v-if="syncing" class="syncing-view">
       <div class="core-loader">
          <div class="ring outer"></div>
          <div class="ring inner"></div>
          <span class="material-symbols-rounded pulse">hub</span>
       </div>
       <h2 class="sync-title">INGESTING DATA...</h2>
       <p class="sync-desc">Allocating local vault resources and optimizing indices.</p>
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
  nextTick(() => { initScanner() })
}

const initScanner = async () => {
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
    alert("Biometric or camera access denied.")
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
     store.notify('System Online', 'success')
     router.push('/')
  } else {
     store.notify('Protocol Error', 'error')
     localStorage.removeItem('cloud_sheet_url')
     syncing.value = false
  }
}

const submitManual = () => {
  if (manualUrl.value.startsWith('http')) completeSetup(manualUrl.value.trim())
}

onBeforeUnmount(() => { stopScanner() })
</script>

<style scoped>
.setup-container {
  position: fixed;
  inset: 0;
  background-color: #000;
  color: #fff;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.welcome-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.hero-orb {
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background: radial-gradient(circle, rgba(168, 199, 250, 0.1) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.hero-orb.small { width: 80px; height: 80px; margin-bottom: 32px; }

.hero-logo { width: 80%; height: 80%; object-fit: contain; }

.setup-title { font-size: 32px; font-weight: 700; letter-spacing: -1px; margin: 0 0 12px 0; }
.setup-desc { font-size: 16px; color: var(--on-surface-variant); line-height: 1.5; max-width: 320px; opacity: 0.7; }

.setup-actions { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 16px; margin-top: 48px; }
.setup-actions.row { flex-direction: row; }

.setup-btn-filled {
  height: 56px; border-radius: 16px; background-color: var(--primary); color: var(--on-primary);
  border: none; font-weight: 600; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 12px;
  cursor: pointer; box-shadow: 0 8px 24px rgba(168, 199, 250, 0.3);
}

.setup-btn-filled.primary { flex: 2; }
.setup-btn-outline { flex: 1; height: 56px; border-radius: 16px; background: transparent; border: 1px solid var(--outline); color: #fff; font-weight: 600; cursor: pointer; }
.setup-btn-text { height: 56px; border-radius: 16px; background: rgba(255,255,255,0.05); border: none; color: var(--on-surface-variant); font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

.version-info { position: absolute; bottom: 40px; display: flex; flex-direction: column; gap: 4px; opacity: 0.3; }
.version-info span { font-size: 10px; font-weight: 700; letter-spacing: 2px; }

.input-container { width: 100%; max-width: 320px; height: 56px; display: flex; align-items: center; gap: 12px; padding: 0 16px; background-color: #111; }
.md-input-raw { flex: 1; background: transparent; border: none; color: #fff; font-size: 14px; outline: none; }

.scanner-view { flex: 1; display: flex; flex-direction: column; background: #000; }
.scanner-top-bar { height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; }
.icon-btn-lit { width: 48px; height: 48px; border-radius: 24px; border: none; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.scanner-status { font-size: 12px; font-weight: 700; letter-spacing: 2px; opacity: 0.8; }

.scanner-body { flex: 1; position: relative; }
.qr-reader-window { width: 100%; height: 100%; }
.scanner-vignette { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.scan-target-frame { width: 250px; height: 250px; position: relative; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); }

.corner { position: absolute; width: 32px; height: 32px; border: 4px solid var(--primary); }
.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; border-radius: 16px 0 0 0; }
.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; border-radius: 0 16px 0 0; }
.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; border-radius: 0 0 0 16px; }
.br { bottom: -2px; right: -2px; border-left: none; border-top: none; border-radius: 0 0 16px 0; }

.scanner-footer { height: 100px; display: flex; align-items: center; justify-content: center; padding: 0 40px; text-align: center; }
.scanner-footer p { font-size: 14px; opacity: 0.6; }

.syncing-view { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
.core-loader { width: 120px; height: 120px; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
.ring { position: absolute; border-radius: 50%; border: 4px solid transparent; }
.ring.outer { width: 100%; height: 100%; border-top-color: var(--primary); animation: spin 2s linear infinite; }
.ring.inner { width: 70%; height: 70%; border-bottom-color: var(--secondary); animation: spin 1.5s linear reverse infinite; }
.pulse { font-size: 40px; color: var(--primary); animation: glow 1.5s ease-in-out infinite; }

.sync-title { font-size: 24px; font-weight: 700; letter-spacing: 1px; margin: 0; }
.sync-desc { font-size: 14px; opacity: 0.6; margin-top: 8px; max-width: 250px; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
</style>
