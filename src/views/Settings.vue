<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; align-items: center; gap: 1rem;">
        <button class="back-btn" @click="currentView === 'main' ? $router.push('/') : currentView = 'main'" style="background:none; border:none; color:var(--text-primary); cursor:pointer;">
          <i :data-lucide="currentView === 'main' ? 'chevron-left' : 'arrow-left'" style="width:24px;"></i>
        </button>
        <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">
          {{ currentView === 'main' ? 'Explorer Prefs' : subTitles[currentView] }}
        </h1>
      </header>
    </div>

    <!-- Main Settings Menu -->
    <div v-show="currentView === 'main'" style="animation: fadeIn 0.4s ease;">
      <div class="sett-card" style="margin: 1.5rem 0 2.5rem 0; padding: 1.75rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer;" @click="currentView = 'personal'">
        <div style="width:72px; height:72px; border-radius:36px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center; font-size: 2rem; border: 2px solid var(--accent);">
          {{ userPrefs.avatar || '👤' }}
        </div>
        <div style="flex:1;">
          <div class="sett-label">Active Identifier</div>
          <div class="sett-value" style="font-size: 1.5rem; margin: 0.25rem 0;">{{ userPrefs.name || 'User' }}</div>
          <div class="sett-sub">{{ userPrefs.email || 'No secure link established' }}</div>
        </div>
        <i data-lucide="chevron-right" style="opacity: 0.4;"></i>
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
        <div style="width: 100px; height: 1000px; max-height: 100px; border-radius: 50%; background: var(--bg-input); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; font-size: 3rem; margin-bottom: 1.5rem; box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);">
          {{ userPrefs.avatar || '👤' }}
        </div>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; max-width: 320px;">
           <button v-for="a in ['👤','🥷','👨‍🚀','🧗','🧘','🕵️','🧛','🧟','🤖','👽','🧙','🤴','🦊','🐺','🦁','🐉']" :key="a" @click="userPrefs.avatar = a" 
             style="width: 44px; height: 44px; border-radius: 12px; background: var(--bg-input); border: 1px solid var(--border); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;"
             :style="{ borderColor: userPrefs.avatar === a ? 'var(--accent)' : 'var(--border)', background: userPrefs.avatar === a ? 'rgba(139,92,246,0.1)' : 'var(--bg-input)' }">
             {{ a }}
           </button>
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
      <div class="settings-list-card" style="padding: 1.75rem;">
        <label class="sett-label" style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 1rem;">
           <i data-lucide="link" style="width:14px;"></i> CORE UPLINK COORDINATES
        </label>
        <div style="position: relative;">
          <input :type="showUrl ? 'text' : 'password'" v-model="cloudUrl" class="f-input" placeholder="https://..." style="padding-right: 3rem;">
          <button @click="showUrl = !showUrl" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-secondary); cursor: pointer;">
             <i :data-lucide="showUrl ? 'eye-off' : 'eye'" style="width: 18px;"></i>
          </button>
        </div>
        <p style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 0.75rem; line-height: 1.5; opacity: 0.6;">
           Connection established via Secure Jurney Access Key.
        </p>
      </div>

      <div class="settings-list-card" style="padding: 1.75rem;">
         <label class="sett-label" style="margin-bottom: 1.25rem; display: block;">Resonance Strategy</label>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-input); padding: 0.4rem; border-radius: 14px; border: 1px solid var(--border);">
            <button @click="syncMode = 'overwrite'" 
               style="padding: 0.75rem; border: none; border-radius: 10px; font-weight: 800; font-size: 0.65rem; cursor: pointer; transition: 0.2s;"
               :style="{ background: syncMode === 'overwrite' ? 'var(--accent)' : 'transparent', color: syncMode === 'overwrite' ? 'white' : 'var(--text-secondary)' }">
               FORCE OVERWRITE
            </button>
            <button @click="syncMode = 'merge'" 
               style="padding: 0.75rem; border: none; border-radius: 10px; font-weight: 800; font-size: 0.65rem; cursor: pointer; transition: 0.2s;"
               :style="{ background: syncMode === 'merge' ? 'var(--accent)' : 'transparent', color: syncMode === 'merge' ? 'white' : 'var(--text-secondary)' }">
               HYBRID MERGE
            </button>
         </div>
         <p style="font-size: 0.6rem; color: var(--text-secondary); margin-top: 1rem; text-align: center; opacity: 0.6;">
            {{ syncMode === 'overwrite' ? 'Warning: Local intelligence will be replaced by core state.' : 'Info: Duplicate signatures will be ignored; local vaults preserved.' }}
         </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <button class="sett-card" style="align-items: center; background: rgba(255,255,255,0.03); border-style: dashed;" @click="pullData" :disabled="syncing">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(14, 165, 233, 0.1); display: flex; align-items: center; justify-content: center; color: #0ea5e9; margin-bottom: 0.5rem;">
             <i data-lucide="download-cloud"></i>
          </div>
          <span class="sett-label" style="font-size: 0.75rem;">{{ syncing ? '...' : 'DESCEND CORE' }}</span>
        </button>
        <button class="sett-card" style="align-items: center; background: rgba(139, 92, 246, 0.05); border-color: var(--accent);" @click="pushData" :disabled="syncing">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; margin-bottom: 0.5rem; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);">
             <i data-lucide="upload-cloud"></i>
          </div>
          <span class="sett-label" style="font-size: 0.75rem; color: var(--accent);">{{ syncing ? '...' : 'ASCEND LOGS' }}</span>
        </button>
      </div>

      <!-- System Version Info -->
      <div style="margin-top: 3rem; text-align: center; opacity: 0.3;">
         <div style="font-size: 0.8rem; font-weight: 800; letter-spacing: 0.3em; margin-bottom: 4px;">JURNEY</div>
         <div style="font-size: 0.5rem; font-weight: 950; letter-spacing: 0.1em;">PROTOCOL v4.1.0</div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const currentView = ref('main')
const syncing = ref(false)
const syncMode = ref('overwrite')
const showUrl = ref(false)

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
