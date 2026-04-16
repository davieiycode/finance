<template>
  <div class="view-content settings-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="currentView === 'main' ? $router.back() : currentView = 'main'">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>{{ currentView === 'main' ? 'Pengaturan' : subTitles[currentView] }}</h1>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Main Settings Menu -->
      <div v-if="currentView === 'main'" class="main-menu" animate-fade-in>
        <!-- Profile Hero -->
        <div class="profile-hero card-md3" @click="currentView = 'personal'">
          <div class="avatar-container">
            <img v-if="userPrefs.avatar && userPrefs.avatar.includes('.svg')" :src="resolvedAvatar" class="avatar-img">
            <span v-else class="avatar-emoji">{{ userPrefs.avatar || '👤' }}</span>
          </div>
          <div class="profile-info">
            <span class="profile-label">Profil Pengguna</span>
            <span class="profile-name">{{ userPrefs.name || 'Pengguna' }}</span>
            <span class="profile-meta">{{ userPrefs.email || 'Email belum diatur' }}</span>
          </div>
          <span class="material-symbols-rounded">chevron_right</span>
        </div>

        <div class="section-title">Sistem & Aplikasi</div>
        <div class="list-card card-md3">
          <div v-if="installPrompt" class="list-item" @click="installApp">
            <div class="list-icon-box tonal">
              <span class="material-symbols-rounded">download</span>
            </div>
            <div class="list-text">
              <span class="list-item-title">Pasang Aplikasi</span>
              <span class="list-item-sub">Instal ke layar depan perangkat</span>
            </div>
          </div>
          <div class="list-item" @click="updateApp">
            <div class="list-icon-box success">
              <span class="material-symbols-rounded">refresh</span>
            </div>
            <div class="list-text">
              <span class="list-item-title">Perbarui Aplikasi</span>
              <span class="list-item-sub">Sinkronkan versi terbaru</span>
            </div>
          </div>
        </div>

        <!-- Section removed as requested: Personalisasi -->

        <div class="section-title">Data & Cadangan</div>
        <div class="list-card card-md3">
          <div class="list-item" @click="currentView = 'cloud'">
            <div class="list-icon-box info">
              <span class="material-symbols-rounded">cloud_sync</span>
            </div>
            <div class="list-text">
              <span class="list-item-title">Simpan ke Cloud</span>
              <span class="list-item-sub">Sinkronisasi Google Sheet</span>
            </div>
            <span class="material-symbols-rounded">chevron_right</span>
          </div>
          <div class="list-item" @click="$router.push('/metadata')">
            <div class="list-icon-box secondary">
              <span class="material-symbols-rounded">database</span>
            </div>
            <div class="list-text">
              <span class="list-item-title">Kategori & Label</span>
              <span class="list-item-sub">Kelola Kategori, Satuan, Tag & Proyek</span>
            </div>
            <span class="material-symbols-rounded">chevron_right</span>
          </div>
        </div>

        <div class="section-title danger">Keamanan & Reset</div>
        <div class="list-card card-md3 danger-border">
          <div class="list-item" @click="clearData">
            <div class="list-icon-box error">
              <span class="material-symbols-rounded">delete_forever</span>
            </div>
            <div class="list-text">
              <span class="list-item-title danger">Reset Total</span>
              <span class="list-item-sub">Hapus semua data di aplikasi ini</span>
            </div>
          </div>
        </div>

        <div class="version-badge">
           <p>CATATAN KEUANGAN</p>
           <span>v5.0.2 • AKTIF</span>
        </div>
      </div>

      <!-- Sub-views -->
      <div v-else class="sub-view" animate-fade-in>
        
        <!-- Personalization View -->
        <div v-if="currentView === 'personal'" class="personalization">
          <div class="avatar-hero">
            <div class="avatar-large">
              <img v-if="userPrefs.avatar && userPrefs.avatar.includes('.svg')" :src="resolvedAvatar" class="avatar-img">
              <span v-else class="avatar-emoji-large">{{ userPrefs.avatar || '👤' }}</span>
            </div>
            
            <div class="avatar-search card-md3">
              <span class="material-symbols-rounded">search</span>
              <input type="text" v-model="avatarSearch" placeholder="Cari ikon...">
            </div>

            <div class="avatar-grid">
              <button v-for="a in filteredAvatars" :key="a.url" @click="userPrefs.avatar = a.url" 
                class="avatar-chip" :class="{ 'active': userPrefs.avatar === a.url }">
                <img v-if="a.url.includes('.svg')" :src="a.url" class="avatar-mini">
                <span v-else class="avatar-emoji-mini">{{ a.url }}</span>
              </button>
            </div>
          </div>

          <div class="list-card card-md3 field-group">
            <div class="field-item">
              <span class="field-label">Nama Pengguna</span>
              <input type="text" v-model="userPrefs.name" class="md-input-field" placeholder="Masukkan nama">
            </div>
            <div class="field-item">
              <span class="field-label">Alamat Email</span>
              <input type="email" v-model="userPrefs.email" class="md-input-field" placeholder="Masukkan email">
            </div>
          </div>

          <button class="filled-btn" @click="savePrefs">
            <span class="material-symbols-rounded">save</span>
            Simpan Profil
          </button>
        </div>

        <!-- Visual selection removed as requested -->

        <!-- Cloud View -->
        <div v-if="currentView === 'cloud'" class="cloud-settings">
          <div class="section-card card-md3">
            <span class="section-header-text">Tautan Google Sheet</span>
            <div class="input-with-button">
              <span class="material-symbols-rounded">key</span>
              <input :type="showUrl ? 'text' : 'password'" v-model="cloudUrl" placeholder="Masukkan URL Sheet...">
              <button @click="showUrl = !showUrl" class="icon-btn sm">
                <span class="material-symbols-rounded">{{ showUrl ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p class="section-tip">Pastikan URL Google Sheet Anda sudah disetel public/akses skrip.</p>
          </div>

          <div class="section-card card-md3">
            <span class="section-header-text">Mode Sinkronisasi</span>
            <div class="segmented-control">
               <button @click="syncMode = 'overwrite'" :class="{ active: syncMode === 'overwrite' }">TIMPA SEMUA</button>
               <button @click="syncMode = 'merge'" :class="{ active: syncMode === 'merge' }">GABUNG DATA</button>
            </div>
            <p class="mode-desc">{{ syncMode === 'overwrite' ? 'Peringatan: Data di HP akan diganti sepenuhnya.' : 'Aman: Menggabungkan data HP dan Cloud.' }}</p>
          </div>

          <div class="sync-actions">
            <button class="tonal-btn-lg" @click="pullData" :disabled="syncing">
              <span class="material-symbols-rounded">download</span>
              {{ syncing ? 'Mengambil...' : 'Ambil dari Cloud' }}
            </button>
            <button class="filled-btn-lg" @click="pushData" :disabled="syncing">
              <span class="material-symbols-rounded">upload</span>
              {{ syncing ? 'Mengirim...' : 'Kirim ke Cloud' }}
            </button>
          </div>
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
  { url: '🧗', tags: 'panjat tebing, gunung, olahraga' },
  { url: '🤖', tags: 'robot, bot, ai' },
  { url: '👻', tags: 'hantu, gelap, bayangan' }
])

const filteredAvatars = computed(() => {
  if (!avatarSearch.value) return avatarList.value
  const q = avatarSearch.value.toLowerCase()
  return avatarList.value.filter(a => a.tags.toLowerCase().includes(q) || a.url.toLowerCase().includes(q))
})

const subTitles = {
  personal: 'Profil Pengguna',
  visual: 'Atur Tampilan',
  cloud: 'Sinkronisasi Cloud',
  metadata: 'Kategori & Label'
}

const isSafe = typeof localStorage !== 'undefined'
const defaultPrefs = { name: "Pengguna", email: "", avatar: "👤", theme: "obsidian", radius: 24, color: "#A8C7FA" }
const storedPrefs = isSafe ? JSON.parse(localStorage.getItem('user_prefs') || '{}') : {}
const userPrefs = ref({ ...defaultPrefs, ...storedPrefs })
const cloudUrl = ref(isSafe ? (localStorage.getItem('cloud_sheet_url') || '') : '')

const themes = [
  { id: 'dark', name: 'Midnight', bg: '#1c1c1e', border: '#44474E' },
  { id: 'obsidian', name: 'Obsidian', bg: '#1c1c1e', border: '#2c2c2e' },
  { id: 'explorer', name: 'Deep Teal', bg: '#051614', border: '#0A2522' },
  { id: 'arctic', name: 'Arctic', bg: '#F8F9FA', border: '#DEE2E6' }
]

const installPrompt = ref(null)

const installApp = async () => {
  if (!installPrompt.value) return
  installPrompt.value.prompt()
  const { outcome } = await installPrompt.value.userChoice
  if (outcome === 'accepted') installPrompt.value = null
}

const updateApp = () => {
  if (confirm('Perbarui aplikasi sekarang?')) {
     window.location.reload()
  }
}

const resolvedAvatar = computed(() => {
  const av = userPrefs.value.avatar
  if (!av || !av.includes('.svg')) return av
  if (av.startsWith('http') || av.startsWith('data:')) return av
  const b = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (av.startsWith('/avatars') && b && !av.startsWith(b)) return b + av
  return av
})

const savePrefs = () => {
  if (isSafe) localStorage.setItem('user_prefs', JSON.stringify(userPrefs.value))
  alert('Pengaturan berhasil disimpan.')
}

const pullData = async () => {
  if (!cloudUrl.value) return alert('URL Cloud belum diatur.')
  syncing.value = true
  const success = await store.pullFromCloud(syncMode.value)
  syncing.value = false
  if (success) alert('Sinkronisasi selesai.')
}

const pushData = async () => {
  if (!cloudUrl.value) return alert('URL Cloud belum diatur.')
  syncing.value = true
  const success = await store.pushToCloud()
  syncing.value = false
  if (success) alert('Data berhasil dikirim ke Cloud.')
}

const clearData = () => {
  if (confirm('PERINGATAN: Ini akan menghapus SEMUA data Anda secara permanen. Lanjutkan?')) {
    localStorage.clear()
    window.location.reload()
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installPrompt.value = e
  })
})
</script>

<style scoped>
.settings-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.top-app-bar {
  padding: env(safe-area-inset-top) 16px 8px 16px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.app-bar-content {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-bar-content h1 {
  flex: 1;
  font-size: 22px;
  font-weight: 400;
  margin: 0;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn.sm { width: 32px; height: 32px; }

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 80px 16px;
}

.card-md3 {
  background-color: var(--bg-secondary);
  border-radius: 24px;
  border: 1px solid var(--border);
}

.profile-hero {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  cursor: pointer;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: var(--primary-container);
  border: 2px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img { width: 70%; height: 70%; object-fit: contain; }
.avatar-emoji { font-size: 32px; }

.profile-info { flex: 1; display: flex; flex-direction: column; }
.profile-label { font-size: 11px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
.profile-name { font-size: 20px; font-weight: 600; color: var(--on-surface); }
.profile-meta { font-size: 13px; color: var(--on-surface-variant); }

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 24px 8px 12px 8px;
}

.section-title.danger { color: var(--error); }

.list-card { display: flex; flex-direction: column; overflow: hidden; }
.list-card.danger-border { border-color: rgba(242, 184, 181, 0.2); }

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
}

.list-item:last-child { border-bottom: none; }
.list-item:active { background-color: rgba(255, 255, 255, 0.05); }

.list-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-icon-box.tonal { background-color: var(--surface-variant); color: var(--on-surface-variant); }
.list-icon-box.success { background-color: rgba(180, 232, 168, 0.1); color: var(--green); }
.list-icon-box.primary { background-color: var(--primary-container); color: var(--on-primary-container); }
.list-icon-box.info { background-color: rgba(168, 199, 250, 0.1); color: var(--blue); }
.list-icon-box.secondary { background-color: var(--secondary-container); color: var(--on-secondary-container); }
.list-icon-box.error { background-color: rgba(242, 184, 181, 0.1); color: var(--error); }

.list-text { flex: 1; display: flex; flex-direction: column; }
.list-item-title { font-size: 16px; font-weight: 500; color: var(--on-surface); }
.list-item-title.danger { color: var(--error); }
.list-item-sub { font-size: 12px; color: var(--on-surface-variant); }

.version-badge {
  margin-top: 48px;
  text-align: center;
  opacity: 0.35;
}

.version-badge p { font-size: 14px; font-weight: 700; letter-spacing: 4px; margin: 0; }
.version-badge span { font-size: 10px; font-weight: 500; }

.sub-view { display: flex; flex-direction: column; gap: 24px; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: var(--primary-container);
  border: 3px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  overflow: hidden;
}

.avatar-emoji-large { font-size: 48px; }

.avatar-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 48px;
  margin-bottom: 16px;
}

.avatar-search input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--on-surface);
  font-size: 14px;
  outline: none;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.avatar-chip {
  aspect-ratio: 1/1;
  border-radius: 12px;
  background-color: var(--surface-variant);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.avatar-chip.active { border: 2px solid var(--primary); background-color: var(--primary-container); }
.avatar-mini { width: 70%; height: 70%; object-fit: contain; }

.field-group { padding: 8px 0; }
.field-item { display: flex; flex-direction: column; padding: 16px; border-bottom: 1px solid var(--border); }
.field-item:last-child { border-bottom: none; }
.field-label { font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
.md-input-field { background: transparent; border: none; font-size: 16px; color: var(--on-surface); outline: none; }

.filled-btn {
  background-color: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 28px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(168, 199, 250, 0.4);
}

.section-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.section-header-text { font-size: 14px; font-weight: 700; color: var(--primary); text-transform: uppercase; }

.theme-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.theme-item { display: flex; flex-direction: column; gap: 8px; cursor: pointer; }
.theme-preview-box { height: 80px; border-radius: 16px; border: 2px solid var(--border); position: relative; }
.theme-item.active .theme-preview-box { border-color: var(--primary); }
.theme-check { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: var(--primary); color: var(--on-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; scale: 0.8; }
.theme-name { font-size: 12px; text-align: center; font-weight: 500; }

.slider-container { display: flex; align-items: center; gap: 16px; padding: 0 8px; }
.md-slider { flex: 1; accent-color: var(--primary); height: 4px; }

.input-with-button {
  background-color: var(--surface-variant);
  border-radius: 16px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}

.input-with-button input { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 14px; outline: none; }
.section-tip { font-size: 11px; color: var(--on-surface-variant); margin: 0; opacity: 0.7; }

.segmented-control {
  background-color: var(--surface-variant);
  padding: 4px;
  border-radius: 16px;
  display: flex;
  gap: 4px;
}

.segmented-control button {
  flex: 1;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  font-size: 12px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
}

.segmented-control button.active { background-color: var(--secondary-container); color: var(--on-secondary-container); }
.mode-desc { font-size: 11px; text-align: center; color: var(--secondary); margin: 0; }

.sync-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tonal-btn-lg { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 20px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }

@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
