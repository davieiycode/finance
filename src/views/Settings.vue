<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="width: 92%; margin: 0 auto; padding: calc(0.2rem + env(safe-area-inset-top)) 1rem 0.2rem 1rem; border: 1px solid var(--border); border-top: none; border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem; position: sticky; top: 0; background: rgba(15, 15, 25, 0.8); backdrop-filter: blur(20px); z-index: 100; box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
      <header style="display: flex; align-items: center; gap: 0.8rem; padding: 0.35rem 0;">
        <button class="back-btn" @click="currentView === 'main' ? $router.push('/') : currentView = 'main'" style="background:none; border:none; color:var(--text-primary); cursor:pointer;">
          <i :data-lucide="currentView === 'main' ? 'chevron-left' : 'arrow-left'" style="width:20px;"></i>
        </button>
        <h1 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin:0;">
          {{ currentView === 'main' ? 'Settings' : subTitles[currentView] }}
        </h1>
      </header>
    </div>

    <!-- Main Settings Menu -->
    <div v-show="currentView === 'main'" style="animation: fadeIn 0.4s ease;">
      <div class="sett-card" style="margin: 1.5rem 0 2.5rem 0; padding: 1.75rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer;" @click="currentView = 'personal'">
        <div style="width:72px; height:72px; border-radius:36px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center; border: 2px solid var(--accent); overflow: hidden;">
          <img v-if="userPrefs.avatar && userPrefs.avatar.includes('.svg')" :src="resolvedAvatar" style="width: 70%; height: 70%; object-fit: contain;">
          <span v-else style="font-size: 2rem;">{{ userPrefs.avatar || '👤' }}</span>
        </div>
        <div style="flex:1;">
          <div class="sett-label">Active Identifier</div>
          <div class="sett-value" style="font-size: 1.5rem; margin: 0.25rem 0;">{{ userPrefs.name || 'User' }}</div>
          <div class="sett-sub">{{ userPrefs.email || 'No secure link established' }}</div>
        </div>
        <i data-lucide="chevron-right" style="opacity: 0.4;"></i>
      </div>

      <div class="section-title">System Status</div>
      <div class="settings-list-card">
        <div v-if="installPrompt" class="sett-list-item" @click="installApp">
          <div class="sett-icon" style="color: var(--accent); border-color: var(--accent);"><i data-lucide="download"></i></div>
          <div style="flex:1;">
            <div class="sett-value">Install Protocol</div>
            <div class="sett-sub">Deploy Jurney to your local desktop/mobile</div>
          </div>
        </div>
        <div class="sett-list-item" @click="updateApp">
          <div class="sett-icon" style="color: #10b981;"><i data-lucide="refresh-cw"></i></div>
          <div style="flex:1;">
            <div class="sett-value">Update Explorer</div>
            <div class="sett-sub">Check for latest version and refresh</div>
          </div>
        </div>
      </div>

      <div class="section-title">Visual Layout</div>
      <div class="settings-grid" style="grid-template-columns: 1fr;">
        <div class="sett-card" @click="currentView = 'visual'">
           <div class="sett-icon" style="color: var(--accent);"><i data-lucide="swatch-book"></i></div>
           <div class="sett-label">Interface</div>
           <div class="sett-value">Aesthetics & Geometry</div>
        </div>
      </div>

      <div class="section-title">Data Architect</div>
      <div class="settings-list-card">
        <div class="sett-list-item" @click="currentView = 'cloud'">
          <div class="sett-icon" style="color: #0ea5e9;"><i data-lucide="cloud-cog"></i></div>
          <div style="flex:1;">
            <div class="sett-value">Chronicle Vault</div>
            <div class="sett-sub">Pulse with the Universal Core</div>
          </div>
          <i data-lucide="chevron-right" style="opacity: 0.2;"></i>
        </div>
        <div class="sett-list-item" @click="$router.push('/metadata')">
          <div class="sett-icon" style="color: var(--accent);"><i data-lucide="database"></i></div>
          <div style="flex:1;">
            <div class="sett-value">Metadata Registry</div>
            <div class="sett-sub">Manage Categories, Units, Tags & Projects</div>
          </div>
          <i data-lucide="chevron-right" style="opacity: 0.2;"></i>
        </div>
      </div>

      <div class="section-title" style="color:#ef4444;">Destructive Operations</div>
      <div class="settings-list-card" style="border-color: rgba(239, 68, 68, 0.15);">
        <div class="sett-list-item" @click="clearData">
          <div class="sett-icon" style="color: #ef4444;"><i data-lucide="trash-2"></i></div>
          <div style="flex:1;">
            <div class="sett-value" style="color: #ef4444;">Abandon Journey</div>
            <div class="sett-sub">Factory reset all local intelligence</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal View -->
    <div v-show="currentView === 'personal'" class="sub-view">
      <div style="display: flex; flex-direction: column; align-items: center; margin: 1rem 0 2rem 0;">
        <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--bg-input); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 0 30px rgba(139, 92, 246, 0.2); overflow: hidden;">
          <img v-if="userPrefs.avatar && userPrefs.avatar.includes('.svg')" :src="resolvedAvatar" style="width: 60%; height: 60%; object-fit: contain;">
          <span v-else style="font-size: 3rem;">{{ userPrefs.avatar || '👤' }}</span>
        </div>

        <!-- Avatar Search -->
        <div style="width: 100%; max-width: 320px; margin-bottom: 1.5rem; position: relative;">
          <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 14px; color: var(--text-secondary); opacity: 0.5;"></i>
          <input type="text" v-model="avatarSearch" placeholder="Search avatar keywords..." 
            style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; font-size: 0.75rem; outline: none;">
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; max-width: 320px; max-height: 250px; overflow-y: auto; padding-right: 0.5rem; scrollbar-width: none;">
           <button v-for="a in filteredAvatars" :key="a.url" @click="userPrefs.avatar = a.url" 
             style="width: 100%; aspect-ratio: 1/1; border-radius: 12px; background: var(--bg-input); border: 1px solid var(--border); overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; padding: 0;"
             :style="{ borderColor: userPrefs.avatar === a.url ? 'var(--accent)' : 'var(--border)', background: userPrefs.avatar === a.url ? 'rgba(139,92,246,0.1)' : 'var(--bg-input)' }">
             <template v-if="a.url.includes('.svg')">
               <img :src="a.url" style="width: 80%; height: 80%; object-fit: contain;">
             </template>
             <template v-else>
               <span style="font-size: 1.5rem;">{{ a.url }}</span>
             </template>
           </button>
           <div v-if="filteredAvatars.length === 0" style="grid-column: span 4; text-align: center; padding: 2rem; opacity: 0.4; font-size: 0.7rem;">No matching identifiers.</div>
        </div>
      </div>

      <div class="settings-list-card" style="padding: 1.5rem; gap: 1.5rem;">
        <div class="form-group">
          <label class="sett-label">Expedition Callsign (Name)</label>
          <input type="text" v-model="userPrefs.name" class="f-input" placeholder="Your Name" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; color: white;">
        </div>
        <div class="form-group">
          <label class="sett-label">Secure Comm-Link (Email)</label>
          <input type="email" v-model="userPrefs.email" class="f-input" placeholder="your@email.com" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; color: white;">
        </div>
      </div>
      <button class="action-btn" @click="savePrefs" style="background: var(--accent); color: white; padding: 1.25rem; border-radius: 14px; border: none; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);">Update Profile Protocol</button>
    </div>

    <!-- Visual View -->
    <div v-show="currentView === 'visual'" class="sub-view">
      <div class="settings-list-card" style="padding: 1.5rem;">
        <label class="sett-label">Atmospheric Theme</label>
        <div class="theme-scroll">
          <div v-for="t in themes" :key="t.id" class="theme-card" :class="{ active: userPrefs.theme === t.id }" @click="userPrefs.theme = t.id; applyThemeToRoot()">
            <div class="theme-preview" :style="{ background: t.bg, borderColor: t.border }"></div>
            <span class="sett-label">{{ t.name }}</span>
          </div>
        </div>
      </div>
      <div class="settings-list-card" style="padding: 1.5rem;">
        <label class="sett-label">Corner Geometry ({{ userPrefs.radius }}px)</label>
        <input type="range" min="0" max="24" v-model="userPrefs.radius" class="radius-slider" @input="applyThemeToRoot">
      </div>
      <button class="action-btn" @click="savePrefs">Apply & Save Aesthetics</button>
    </div>

    <div v-show="currentView === 'cloud'" class="sub-view">
      <div class="settings-list-card" style="padding: 1.75rem; background: rgba(255,255,255,0.02); border-radius: 1.5rem;">
        <label class="sett-label" style="display:flex; align-items:center; gap:0.6rem; margin-bottom: 1.25rem;">
           <i data-lucide="shield-check" style="width:14px; color: var(--accent);"></i> CORE UPLINK COORDINATES
        </label>
        <div style="position: relative;">
          <input :type="showUrl ? 'text' : 'password'" v-model="cloudUrl" class="f-input" placeholder="Coordinate String..." style="padding-right: 3.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border2);">
          <button @click="showUrl = !showUrl" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px;">
             <i :data-lucide="showUrl ? 'eye-off' : 'eye'" style="width: 18px;"></i>
          </button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 1rem;">
           <div style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite;"></div>
           <p style="font-size: 0.65rem; color: var(--text-secondary); line-height: 1.5; opacity: 0.6; margin: 0;">
              Secure comm-link established via Jurney Encryption Protocol.
           </p>
        </div>
      </div>

      <div class="settings-list-card" style="padding: 1.75rem; background: rgba(255,255,255,0.02); border-radius: 1.5rem;">
         <label class="sett-label" style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="zap" style="width: 14px; color: var(--accent);"></i> Resonance Strategy
         </label>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: rgba(0,0,0,0.3); padding: 0.4rem; border-radius: 16px; border: 1px solid var(--border2);">
            <button @click="syncMode = 'overwrite'" 
               style="padding: 0.85rem; border: none; border-radius: 12px; font-weight: 850; font-size: 0.65rem; cursor: pointer; transition: 0.3s; letter-spacing: 0.05em;"
               :style="{ background: syncMode === 'overwrite' ? 'var(--accent)' : 'transparent', color: syncMode === 'overwrite' ? 'white' : 'var(--text-secondary)', boxShadow: syncMode === 'overwrite' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none' }">
               FORCE OVERWRITE
            </button>
            <button @click="syncMode = 'merge'" 
               style="padding: 0.85rem; border: none; border-radius: 12px; font-weight: 850; font-size: 0.65rem; cursor: pointer; transition: 0.3s; letter-spacing: 0.05em;"
               :style="{ background: syncMode === 'merge' ? 'var(--accent)' : 'transparent', color: syncMode === 'merge' ? 'white' : 'var(--text-secondary)', boxShadow: syncMode === 'merge' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none' }">
               HYBRID MERGE
            </button>
         </div>
         <p style="font-size: 0.6rem; color: var(--text-secondary); margin-top: 1.25rem; text-align: center; opacity: 0.5; line-height: 1.4;">
            {{ syncMode === 'overwrite' ? 'DANGER: Universal Core state will completely rewrite local vaults.' : 'SAFE: Incoming chronicles will merge seamlessly with existing local logs.' }}
         </p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
        <button class="sett-card" style="align-items: center; justify-content: center; background: rgba(14, 165, 233, 0.03); border: 1px dashed rgba(14, 165, 233, 0.3); padding: 2rem 1.25rem; min-height: 140px; margin: 0;" @click="pullData" :disabled="syncing">
          <div style="width: 52px; height: 52px; border-radius: 16px; background: rgba(14, 165, 129, 0.1); display: flex; align-items: center; justify-content: center; color: #10b981; margin-bottom: 0.75rem;">
             <i data-lucide="download-cloud" style="width: 24px;"></i>
          </div>
          <span class="sett-label" style="font-size: 0.7rem; letter-spacing: 0.1em; color: #10b981;">{{ syncing ? 'SYNCING...' : 'PULL CORE' }}</span>
        </button>
        <button class="sett-card" style="align-items: center; justify-content: center; background: rgba(139, 92, 246, 0.03); border: 1px solid rgba(139, 92, 246, 0.2); padding: 2rem 1.25rem; min-height: 140px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin: 0;" @click="pushData" :disabled="syncing">
          <div style="width: 52px; height: 52px; border-radius: 16px; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; margin-bottom: 0.75rem; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);">
             <i data-lucide="upload-cloud" style="width: 24px;"></i>
          </div>
          <span class="sett-label" style="font-size: 0.7rem; letter-spacing: 0.1em; color: var(--accent);">{{ syncing ? 'PUSHING...' : 'PUSH LOGS' }}</span>
        </button>
      </div>

       <!-- System Version Info -->
       <div style="margin-top: 5rem; text-align: center; border-top: 1px solid var(--border); padding-top: 2.5rem; margin-bottom: 3rem;">
          <div style="font-size: 1.1rem; font-weight: 1000; letter-spacing: 0.5em; color: white; opacity: 0.9; margin-bottom: 0.6rem;">JURNEY</div>
          <div style="font-size: 0.6rem; font-weight: 950; letter-spacing: 0.15em; color: var(--text-secondary); opacity: 0.5;">INTELLIGENCE CORE v5.3.0 • BUILT 2026-04-13</div>
          <div style="display: flex; justify-content: center; gap: 1.25rem; margin-top: 2rem; opacity: 0.2;">
             <div style="width: 4px; height: 4px; background: white; border-radius: 50%;"></div>
             <div style="width: 4px; height: 4px; background: white; border-radius: 50%;"></div>
             <div style="width: 4px; height: 4px; background: white; border-radius: 50%;"></div>
          </div>
       </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const currentView = ref('main')
const syncing = ref(false)
const syncMode = ref('overwrite')
const showUrl = ref(false)
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const avatarSearch = ref('')
const avatarList = ref([
  { url: `${base}/avatars/avatar1.svg`, tags: 'male, boy, short hair, glasses' },
  { url: `${base}/avatars/avatar2.svg`, tags: 'female, girl, long hair, smile' },
  { url: `${base}/avatars/avatar3.svg`, tags: 'male, young, cap, hat' },
  { url: `${base}/avatars/avatar4.svg`, tags: 'female, professional, suit' },
  { url: `${base}/avatars/avatar5.svg`, tags: 'male, beard, mustache' },
  { url: `${base}/avatars/avatar6.svg`, tags: 'female, glasses, smart' },
  { url: `${base}/avatars/avatar7.svg`, tags: 'male, casual, hoodie' },
  { url: `${base}/avatars/avatar8.svg`, tags: 'female, casual, t-shirt' },
  { url: `${base}/avatars/avatar9.svg`, tags: 'male, athletic, gym' },
  { url: `${base}/avatars/avatar10.svg`, tags: 'female, blonde, bright' },
  { url: `${base}/avatars/avatar11.svg`, tags: 'male, older, mature' },
  { url: `${base}/avatars/avatar12.svg`, tags: 'female, older, mature' },
  { url: '👤', tags: 'user, default, shadow' },
  { url: '🥷', tags: 'ninja, spy, black' },
  { url: '👨‍🚀', tags: 'astronaut, space, rocket' },
  { url: '🧗', tags: 'climbing, explorer, mountain' },
  { url: '🤖', tags: 'robot, bot, ai' },
  { url: '👻', tags: 'ghost, dark, hollow' }
])

const filteredAvatars = computed(() => {
  if (!avatarSearch.value) return avatarList.value
  const q = avatarSearch.value.toLowerCase()
  return avatarList.value.filter(a => a.tags.toLowerCase().includes(q) || a.url.toLowerCase().includes(q))
})

const subTitles = {
  personal: 'Profile Details',
  visual: 'App Aesthetics',
  security: 'Privacy Lab',
  cloud: 'Cloud Node',
  metadata: 'Metadata Lab'
}

const isSafe = typeof localStorage !== 'undefined'
const userPrefs = ref(isSafe ? JSON.parse(localStorage.getItem('user_prefs') || '{"name":"Explorer","email":"","theme":"obsidian","radius":16,"color":"#8b5cf6"}') : {"name":"Explorer","email":"","theme":"obsidian","radius":16,"color":"#8b5cf6"})
const cloudUrl = ref(isSafe ? (localStorage.getItem('cloud_sheet_url') || '') : '')

const themes = [
  { id: 'dark', name: 'Midnight', bg: '#0D0D0D', border: '#1A1A1A' },
  { id: 'obsidian', name: 'Obsidian', bg: '#000000', border: '#121212' },
  { id: 'explorer', name: 'Deep Teal', bg: '#051614', border: '#0A2522' },
  { id: 'light', name: 'Arctic', bg: '#FFFFFF', border: '#E7E5E4' }
]

const installPrompt = ref(null)

const installApp = async () => {
  if (!installPrompt.value) return
  installPrompt.value.prompt()
  const { outcome } = await installPrompt.value.userChoice
  if (outcome === 'accepted') {
    installPrompt.value = null
  }
}

const updateApp = () => {
  if (confirm('Verify and initiate system update? This will refresh the explorer.')) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.update()
        }
        window.location.reload()
      })
    } else {
      window.location.reload()
    }
  }
}

const resolvedAvatar = computed(() => {
  const av = userPrefs.value.avatar
  if (!av || !av.includes('.svg')) return av
  if (av.startsWith('http') || av.startsWith('data:')) return av
  // If it starts with /avatars but missing base, add it
  const b = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (av.startsWith('/avatars') && b && !av.startsWith(b)) {
     return b + av
  }
  return av
})

const savePrefs = () => {
  if (isSafe) localStorage.setItem('user_prefs', JSON.stringify(userPrefs.value))
  applyThemeToRoot()
  alert('Preferences saved!')
}

const applyThemeToRoot = () => {
  const root = document.documentElement
  const themeMap = {
    dark: { bg: '#000000', card: '#0D0D0D', input: '#050505', text: '#F5F5F0', text2: '#9CA3AF', border: '#1A1A1A', accent: '#EAB308', glass: 'rgba(255,255,255,0.02)' },
    obsidian: { bg: '#000000', card: '#080808', input: '#000000', text: '#ffffff', text2: '#94A3B8', border: '#121212', accent: '#6366f1', glass: 'rgba(255,255,255,0.01)' },
    explorer: { bg: '#051614', card: '#0A2522', input: '#051614', text: '#E2E8F0', text2: '#94A3B8', border: 'rgba(255,255,255,0.05)', accent: '#10B981', glass: 'rgba(16, 185, 129, 0.05)' },
    light: { bg: '#FFFFF0', card: '#FFFFFF', input: '#F8F8F0', text: '#1C1917', text2: '#57534E', border: '#E7E5E4', accent: '#78350F', glass: 'rgba(0,0,0,0.02)' }
  }
  const t = themeMap[userPrefs.value.theme] || themeMap.obsidian
  root.style.setProperty('--bg-primary', t.bg)
  root.style.setProperty('--bg-secondary', t.card)
  root.style.setProperty('--bg-input', t.input)
  root.style.setProperty('--text-primary', t.text)
  root.style.setProperty('--text-secondary', t.text2)
  root.style.setProperty('--border', t.border)
  root.style.setProperty('--accent', t.accent)
  root.style.setProperty('--glass', t.glass)
  root.style.setProperty('--card-radius', userPrefs.value.radius + 'px')
  
  // Update Lucide icons if any
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const pullData = async () => {
  if (!cloudUrl.value) return alert('Enter Cloud URL first')
  localStorage.setItem('cloud_sheet_url', cloudUrl.value)
  syncing.value = true
  const success = await store.pullFromCloud(syncMode.value)
  syncing.value = false
  if (success) alert('Sync Pull Success!')
  else alert('Sync Pull Failed. Check URL.')
}

const pushData = async () => {
  if (!cloudUrl.value) return alert('Enter Cloud URL first')
  localStorage.setItem('cloud_sheet_url', cloudUrl.value)
  syncing.value = true
  const success = await store.pushToCloud()
  syncing.value = false
  if (success) alert('Sync Push Dispatched!')
  else alert('Sync Push Failed.')
}

const clearData = () => {
  if (confirm('DANGER: This will delete everything in your local ledger. Proceed?')) {
    localStorage.clear()
    window.location.reload()
  }
}

watch(userPrefs, () => {
  applyThemeToRoot()
}, { deep: true })

watch(currentView, () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installPrompt.value = e
  })
  applyThemeToRoot()
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})
</script>

<style scoped>
.section-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--text-secondary);
  margin: 2rem 0 0.75rem 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.6;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.sett-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  transition: 0.3s;
}
.sett-card:hover { border-color: var(--accent); }

.sett-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
}

.sett-label { font-size: 0.65rem; color: var(--text-secondary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
.sett-value { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
.sett-sub { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; }

.settings-list-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.sett-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  border-bottom: 1px solid var(--border);
}
.sett-list-item:last-child { border-bottom: none; }
.sett-list-item:hover { background: rgba(255,255,255,0.03); }

.sub-view { 
  animation: fadeIn 0.4s ease;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.theme-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  scrollbar-width: none;
}
.theme-card { text-align: center; cursor: pointer; transition: 0.3s; }
.theme-preview {
  width: 90px;
  height: 120px;
  border-radius: 1rem;
  border: 2px solid var(--border);
  margin-bottom: 0.5rem;
}
.theme-card.active .theme-preview { border-color: var(--accent); transform: translateY(-4px); }

.action-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 800;
  cursor: pointer;
}

.radius-slider {
  width: 100%;
  margin: 1rem 0;
  accent-color: var(--accent);
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
