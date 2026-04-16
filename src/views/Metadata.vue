<template>
  <div class="view-content metadata-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/settings')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Kategori & Label</h1>
          <button class="icon-btn" @click="showSearch = true">
            <span class="material-symbols-rounded">search</span>
          </button>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Cari data..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Data List -->
      <div class="registry-list">
        <div v-for="(item, i) in filteredList" :key="i" @click="openModal(item)" class="registry-item card-md3">
          <div class="registry-icon-box" :style="{ backgroundColor: colors[i % colors.length] + '15', color: colors[i % colors.length] }">
            <span class="material-symbols-rounded">{{ item.icon || getItemIcon(item) }}</span>
          </div>
          <div class="registry-info">
            <span class="registry-title">{{ getItemName(item) }}</span>
            <span class="registry-meta">{{ getItemSub(item) }}</span>
          </div>
          <span class="material-symbols-rounded chevron">chevron_right</span>
        </div>

        <div v-if="filteredList.length === 0" class="empty-state">
          <span class="material-symbols-rounded">inventory_2</span>
          <p>Data tidak ditemukan.</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation (Bottom Fixed above FAB) -->
    <div class="registry-tabs card-md3">
       <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id" :class="{ active: activeTab === t.id }" class="registry-tab-chip">
          <span class="material-symbols-rounded">{{ t.icon }}</span>
          <span class="tab-label">{{ t.label }}</span>
       </button>
    </div>

    <!-- FAB for New Entry -->
    <button @click="openModal(null)" class="fab">
      <span class="material-symbols-rounded">add</span>
    </button>

    <!-- MD3 Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ editingItem ? (modalMode === 'analysis' ? 'Detail Data' : 'Ubah Data') : 'Tambah Data Baru' }}</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <!-- MODE: ANALYSIS -->
                <div v-if="modalMode === 'analysis' && editingItem" class="analysis-view">
                   <div class="analysis-hero">
                      <div class="hero-icon" :style="{ backgroundColor: colors[0] + '15', color: colors[0] }">
                         <span class="material-symbols-rounded">{{ editingItem.icon || getItemIcon(editingItem) }}</span>
                      </div>
                      <div class="hero-text">
                         <span class="hero-title">{{ getItemName(editingItem) }}</span>
                         <span class="hero-sub">Data {{ activeTab }}</span>
                      </div>
                   </div>

                   <div class="briefing-card tonal">
                      <div class="briefing-header">
                         <span class="material-symbols-rounded">info</span>
                         <span class="briefing-label">Analisis Data</span>
                      </div>
                      <p>{{ getItemSub(editingItem) }}</p>
                   </div>

                   <div v-if="formData.description" class="description-card">
                      <span class="card-label">CATATAN</span>
                      <p>{{ formData.description }}</p>
                   </div>

                   <div class="action-grid">
                      <button @click="modalMode = 'edit'" class="tonal-btn-lg">
                         <span class="material-symbols-rounded">edit</span>
                         UBAH DATA
                      </button>
                      <button @click="isModalOpen = false" class="outline-btn-lg">
                         TUTUP
                      </button>
                   </div>
                </div>

                <!-- MODE: EDIT -->
                <div v-else class="edit-view">
                   <!-- Forms based on Tab -->
                   <div class="form-grid">
                      <template v-if="activeTab === 'categories'">
                         <div class="form-group">
                            <label>Nama Kategori</label>
                            <input type="text" v-model="formData.category" class="md-input">
                         </div>
                         <div class="form-group full">
                            <label>Pilih Ikon</label>
                            <div class="icon-picker card-md3">
                               <div class="icon-search-box">
                                  <span class="material-symbols-rounded">search</span>
                                  <input type="text" v-model="iconSearch" placeholder="Cari ikon...">
                               </div>
                               <div class="icon-grid-scroll">
                                  <button v-for="iconName in filteredIcons" :key="iconName" @click="formData.icon = iconName" 
                                    class="icon-select-btn" :class="{ active: formData.icon === iconName }">
                                     <span class="material-symbols-rounded">{{ iconName }}</span>
                                  </button>
                               </div>
                            </div>
                         </div>
                         <div class="form-group"><label>Grup</label><input type="text" v-model="formData.categoryGroup" class="md-input"></div>
                         <div class="form-group">
                            <label>Jenis</label>
                            <select v-model="formData.type" class="md-input">
                               <option value="Income">Pemasukan</option><option value="Expense">Pengeluaran</option>
                            </select>
                         </div>
                      </template>

                      <template v-if="activeTab === 'unitScales'">
                         <div class="form-group"><label>Kode Satuan</label><input type="text" v-model="formData.unitScale" class="md-input" :disabled="isEditing"></div>
                      </template>

                      <template v-if="activeTab === 'tags'">
                         <div class="form-group"><label>Nama Label</label><input type="text" v-model="formData.tagName" class="md-input"></div>
                         <div class="form-group"><label>Grup Label</label><input type="text" v-model="formData.tagGroup" class="md-input"></div>
                      </template>

                      <template v-if="activeTab === 'projects'">
                         <div class="form-group full"><label>Nama Proyek</label><input type="text" v-model="formData.projectName" class="md-input"></div>
                         <div class="form-group"><label>Mulai</label><input type="date" v-model="formData.startDate" class="md-input"></div>
                         <div class="form-group"><label>Selesai</label><input type="date" v-model="formData.endDate" class="md-input"></div>
                         <div class="form-group"><label>Target Anggaran</label><input type="number" v-model.number="formData.budgetAmount" class="md-input"></div>
                         <div class="form-group">
                            <label>Status</label>
                            <select v-model="formData.status" class="md-input">
                               <option>Berjalan</option><option>Selesai</option><option>Direncanakan</option>
                            </select>
                         </div>
                      </template>

                      <template v-if="activeTab === 'authors'">
                         <div class="form-group"><label>Nama Orang</label><input type="text" v-model="formData.authorName" class="md-input"></div>
                         <div class="form-group">
                            <label>Peran</label>
                            <select v-model="formData.roleType" class="md-input">
                               <option>Admin</option><option>Pengguna</option><option>Pemeriksa</option>
                            </select>
                         </div>
                      </template>

                      <div class="form-group full">
                         <label>Catatan</label>
                         <textarea v-model="formData.description" class="md-textarea"></textarea>
                      </div>
                   </div>

                   <div class="edit-actions">
                      <button @click="handleSave" class="filled-btn-lg">
                         <span class="material-symbols-rounded">save</span>
                         SIMPAN PERUBAHAN
                      </button>
                      <div v-if="isEditing" class="secondary-actions">
                         <button @click="handleDuplicate" class="tonal-btn">Duplikat</button>
                         <button @click="handleMerge" class="tonal-btn">Gabungkan</button>
                         <button @click="handleDelete" class="error-btn">Hapus</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Merge Panel (Simplified as Bottom Sheet) -->
    <Teleport to="body">
       <div v-if="isMergePanelOpen" class="modal-backdrop-full" @click.self="isMergePanelOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Pilih Target Penggabungan</h3>
                <button @click="isMergePanelOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             <div class="sheet-content">
                <p class="sheet-tip">Pilih data yang akan menerima semua catatan dari <b>{{ getItemName(editingItem) }}</b>.</p>
                <div class="search-box card-md3">
                   <span class="material-symbols-rounded">search</span>
                   <input type="text" v-model="mergeTargetSearch" placeholder="Cari data...">
                </div>
                <div class="target-list">
                   <div v-for="t in filteredMergeTargets" :key="getItemName(t)" @click="performMerge(t)" class="target-item card-md3">
                      <span class="material-symbols-rounded">{{ getItemIcon(t) }}</span>
                      <span>{{ getItemName(t) }}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const route = useRoute()
const store = useFinanceStore()
const uiStore = useUIStore()
const activeTab = ref(route.query.tab || 'categories')
const showSearch = ref(false)
const searchQuery = ref('')
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const formData = ref({})
const iconSearch = ref('')
const editingItem = ref(null)

const iconList = [
  'payments', 'wallet', 'shopping_cart', 'restaurant', 'local_cafe', 
  'smart_toy', 'rocket_launch', 'home', 'directions_bus', 'flight', 'savings', 'receipt_long', 
  'medical_services', 'fitness_center', 'school', 'emoji_events', 'movie', 'sports_esports', 
  'bolt', 'water_drop', 'wifi', 'smartphone', 'handyman', 'construction',
  'shopping_bag', 'local_gas_station', 'pill', 'hospital', 'store', 'pizza',
  'cake', 'ice_cream', 'sports_bar', 'wine_bar', 'smoking_rooms', 'vaping_rooms',
  'directions_car', 'pedal_bike', 'train', 'directions_boat', 'local_shipping',
  'package', 'inventory_2', 'grid_view', 'layers', 'sell', 'confirmation_number',
  'description', 'table_chart', 'menu_book', 'edit', 'brush', 'edit_note',
  'monitor', 'laptop', 'keyboard', 'headphones', 'photo_camera', 'videocam',
  'palette', 'dashboard', 'science', 'biotech', 'psychology', 'memory',
  'favorite', 'star', 'diamond', 'redeem', 'celebration',
  'tent', 'apartment', 'account_balance', 'map', 'explore', 'terrain_chip',
  'child_care', 'pets', 'groups', 'person', 'person_add', 'support_agent',
  'lock', 'verified_user', 'key', 'fingerprint',
  'cloud', 'database', 'hub', 'router', 'code', 'terminal',
  'work', 'trending_up', 'pie_chart', 'sync', 'compare_arrows'
]

const filteredIcons = computed(() => {
  const q = iconSearch.value.toLowerCase()
  if (!q) return iconList
  return iconList.filter(i => i.toLowerCase().includes(q))
})

const tabs = [
  { id: 'categories', label: 'Kategori', icon: 'sell' },
  { id: 'unitScales', label: 'Satuan', icon: 'straighten' },
  { id: 'tags', label: 'Label', icon: 'tag' },
  { id: 'projects', label: 'Proyek', icon: 'layers' },
  { id: 'authors', label: 'Orang', icon: 'groups' }
]

const colors = ['#A8C7FA', '#BEC6DC', '#DEBCDF', '#B4E8A8', '#F2B8B5', '#82D3D0']
const isEditing = computed(() => !!editingItem.value)

const getItemIcon = (item) => {
  if (activeTab.value === 'categories' && item.icon) return item.icon
  const t = tabs.find(t => t.id === activeTab.value)
  return t ? t.icon : 'grid_view'
}

const getItemName = (item) => {
  if (activeTab.value === 'categories') return item.category || 'Tanpa Judul'
  if (activeTab.value === 'unitScales') return item.unitScale || 'pcs'
  if (activeTab.value === 'tags') return item.tagName || 'label'
  if (activeTab.value === 'projects') return item.projectName || 'Proyek'
  if (activeTab.value === 'authors') return item.authorName || 'Pengguna'
  return 'Tidak Diketahui'
}

const getItemSub = (item) => {
  if (activeTab.value === 'categories') return `${item.categoryGroup || 'Umum'} • ${item.type === 'Income' ? 'Pemasukan' : 'Pengeluaran'}`
  if (activeTab.value === 'projects') return `${item.status} • Rp ${(item.budgetAmount || 0).toLocaleString('id-ID')}`
  if (activeTab.value === 'tags') return item.tagGroup || 'Global'
  if (activeTab.value === 'authors') return item.roleType || 'Member'
  return 'Data Tercatat'
}

const currentList = computed(() => store[activeTab.value] || [])
const filteredList = computed(() => {
  if (!searchQuery.value) return currentList.value
  const q = searchQuery.value.toLowerCase()
  return currentList.value.filter(item => getItemName(item).toLowerCase().includes(q))
})

const openModal = (item) => {
  editingItem.value = item ? { ...item } : null
  if (item) {
     formData.value = { icon: 'sell', ...item }
     iconSearch.value = ''
     modalMode.value = 'analysis'
  } else {
     modalMode.value = 'edit'
     if (activeTab.value === 'categories') formData.value = { category: '', categoryGroup: '', type: 'Expense', description: '', icon: 'sell' }
     else if (activeTab.value === 'unitScales') formData.value = { unitScale: '', description: '' }
     else if (activeTab.value === 'tags') formData.value = { tagName: '', tagGroup: '', description: '' }
     else if (activeTab.value === 'projects') formData.value = { projectName: '', startDate: '', endDate: '', budgetAmount: 0, status: 'Berjalan', author: 'Saya Sendiri', description: '' }
     else if (activeTab.value === 'authors') formData.value = { authorName: '', roleType: 'Pengguna' }
  }
  isModalOpen.value = true
}

const handleSave = () => {
   const data = { ...formData.value }
   if (activeTab.value === 'categories') {
      if (isEditing.value) store.updateCategory(data)
      else store.addCategory(data)
   } else if (activeTab.value === 'unitScales') {
      if (isEditing.value) {
         const idx = store.unitScales.findIndex(u => u.unitScale === editingItem.value.unitScale)
         if (idx !== -1) store.unitScales[idx] = data
      } else store.addUnitScale(data)
   } else if (activeTab.value === 'tags') {
      if (isEditing.value) store.updateTag(data)
      else store.addTag(data)
   } else if (activeTab.value === 'projects') {
      if (isEditing.value) store.updateProject(data)
      else store.addProject(data)
   } else if (activeTab.value === 'authors') {
      if (isEditing.value) store.updateAuthor(data)
      else store.addAuthor(data)
   }
   store.saveAll()
   isModalOpen.value = false
}

const handleDuplicate = () => {
   const data = { ...formData.value }
   delete data.categoryID; delete data.tagID; delete data.projectID; delete data.authorID
   if (activeTab.value === 'unitScales') data.unitScale = data.unitScale + '_v2'
   editingItem.value = null
   formData.value = data
}

const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return currentList.value.filter(item => 
    getItemName(item) !== getItemName(editingItem.value) &&
    getItemName(item).toLowerCase().includes(q)
  )
})

const handleMerge = () => { isMergePanelOpen.value = true }

const performMerge = (target) => {
   const sourceName = getItemName(editingItem.value)
   const targetName = getItemName(target)
   if (!confirm(`Pindahkan SEMUA catatan dari "${sourceName}" ke "${targetName}"?`)) return
   store.mergeEntities(activeTab.value, sourceName, targetName)
   if (activeTab.value === 'categories') store.deleteCategory(editingItem.value.categoryID)
   else if (activeTab.value === 'unitScales') store.deleteUnitScale(editingItem.value.unitScale)
   else if (activeTab.value === 'tags') store.deleteTag(editingItem.value.tagID)
   else if (activeTab.value === 'projects') store.deleteProject(editingItem.value.projectID)
   else if (activeTab.value === 'authors') store.deleteAuthor(editingItem.value.authorID)
   isMergePanelOpen.value = false
   isModalOpen.value = false
}

const handleDelete = () => {
   if (!confirm('Hapus data ini secara permanen?')) return
   if (activeTab.value === 'categories') store.deleteCategory(editingItem.value.categoryID)
   else if (activeTab.value === 'unitScales') store.deleteUnitScale(editingItem.value.unitScale)
   else if (activeTab.value === 'tags') store.deleteTag(editingItem.value.tagID)
   else if (activeTab.value === 'projects') store.deleteProject(editingItem.value.projectID)
   else if (activeTab.value === 'authors') store.deleteAuthor(editingItem.value.authorID)
   isModalOpen.value = false
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('metadata')
  else uiStore.unregisterModal('metadata')
})

onBeforeUnmount(() => { uiStore.unregisterModal('metadata') })
</script>

<style scoped>
.metadata-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.top-app-bar {
  padding-top: max(env(safe-area-inset-top), 16px);
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
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

.search-input-field { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 16px; outline: none; }

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 160px 16px;
}

.card-md3 { background-color: var(--bg-secondary); border-radius: 24px; border: 1px solid var(--border); }

.registry-list { display: flex; flex-direction: column; gap: 12px; }

.registry-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.registry-item:active { transform: scale(0.98); }

.registry-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.registry-info { flex: 1; display: flex; flex-direction: column; }
.registry-title { font-size: 16px; font-weight: 500; color: var(--on-surface); }
.registry-meta { font-size: 12px; color: var(--on-surface-variant); }
.chevron { opacity: 0.3; }

.registry-tabs {
  position: fixed;
  bottom: 88px;
  left: 16px;
  right: 16px;
  padding: 8px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  z-index: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.registry-tabs::-webkit-scrollbar { display: none; }

.registry-tab-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  background: transparent;
  color: var(--on-surface-variant);
  white-space: nowrap;
  font-weight: 500;
  cursor: pointer;
}

.registry-tab-chip.active { background-color: var(--primary-container); color: var(--on-primary-container); }
.tab-label { font-size: 13px; }

.fab {
  position: fixed;
  bottom: 104px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: var(--primary);
  color: var(--on-primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  z-index: 1000;
  cursor: pointer;
}

/* MODAL / BOTTOM SHEET */
.modal-backdrop-full {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  z-index: 4000;
  display: flex;
  align-items: flex-end;
}

.bottom-sheet {
  width: 100%;
  background-color: var(--bg-primary);
  border-radius: 28px 28px 0 0;
  padding: 8px 16px 32px 16px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; }

.analysis-view { display: flex; flex-direction: column; gap: 24px; }
.analysis-hero { display: flex; align-items: center; gap: 20px; }
.hero-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.hero-icon .material-symbols-rounded { font-size: 32px; }
.hero-text { display: flex; flex-direction: column; }
.hero-title { font-size: 24px; font-weight: 500; }
.hero-sub { font-size: 12px; color: var(--primary); font-weight: 700; }

.briefing-card { padding: 16px; border-radius: 16px; display: flex; flex-direction: column; gap: 8px; }
.briefing-card.tonal { background-color: var(--primary-container); color: var(--on-primary-container); }
.briefing-header { display: flex; align-items: center; gap: 8px; }
.briefing-label { font-size: 12px; font-weight: 700; text-transform: uppercase; }

.description-card { display: flex; flex-direction: column; gap: 8px; }
.card-label { font-size: 11px; font-weight: 700; color: var(--on-surface-variant); opacity: 0.6; }

.action-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-top: 16px; }

.edit-view { display: flex; flex-direction: column; gap: 24px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }

.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.icon-picker { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.icon-search-box { display: flex; align-items: center; gap: 12px; padding: 0 8px; }
.icon-search-box input { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 13px; outline: none; }
.icon-grid-scroll { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); 
  gap: 8px; 
  max-height: 240px; 
  overflow-y: auto; 
  padding: 8px;
}
.icon-select-btn { 
  aspect-ratio: 1/1; 
  border-radius: 12px; 
  border: 1px solid var(--border); 
  background: var(--surface-variant); 
  color: var(--on-surface-variant); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  transition: all 0.2s;
}
.icon-select-btn .material-symbols-rounded { font-size: 24px; }
.icon-select-btn:hover { background-color: var(--primary-container); color: var(--on-primary-container); }
.icon-select-btn.active { background-color: var(--primary); color: var(--on-primary); border-color: var(--primary); transform: scale(1.1); z-index: 1; }

.edit-actions { display: flex; flex-direction: column; gap: 20px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

.tonal-btn-lg { background-color: var(--primary-container); color: var(--on-primary-container); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; }
.outline-btn-lg { background-color: transparent; border: 1px solid var(--outline); color: var(--on-surface); border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(168, 199, 250, 0.4); }
.tonal-btn { background-color: var(--surface-variant); color: var(--on-surface-variant); border: none; border-radius: 12px; height: 40px; font-size: 12px; font-weight: 600; cursor: pointer; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 40px; font-size: 12px; font-weight: 600; cursor: pointer; }

.target-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.target-item { display: flex; align-items: center; gap: 12px; padding: 12px; cursor: pointer; }
.search-box { display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 48px; margin-bottom: 12px; }
.search-box input { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 14px; outline: none; }
.sheet-tip { font-size: 12px; color: var(--on-surface-variant); margin-bottom: 16px; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 48px; display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.5; }
</style>
