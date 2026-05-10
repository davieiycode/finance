<template>
  <div class="view-content receipts-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar glass-panel" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.back(); uiStore.haptic('light')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Nota</h1>
          <div class="app-bar-actions">
            <button class="icon-btn" @click="showSearch = true; uiStore.haptic('light')">
              <span class="material-symbols-rounded">search</span>
            </button>
            <button class="tonal-btn" @click="openModal(null); uiStore.haptic('medium')">
              <span class="material-symbols-rounded">add_a_photo</span>
              Baru
            </button>
          </div>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''; uiStore.haptic('light')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Cari nota..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''; uiStore.haptic('light')">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="receipt-grid">
        <div 
          v-for="(r, index) in filteredReceipts" 
          :key="r.receiptID" 
          @click="openModal(r); uiStore.haptic('light')" 
          class="receipt-card stagger-item"
          :style="{ '--delay': (index * 0.05) + 's' }"
        >
          <div class="receipt-preview glass-panel">
            <img v-if="r['foto/dokumen']" :src="store.unwrapImage(r['foto/dokumen'])" class="preview-img">
            <div v-else class="preview-placeholder">
               <span class="material-symbols-rounded">description</span>
            </div>
            <div class="receipt-overlay">
               <span class="receipt-merchant">{{ r.merchant }}</span>
               <span class="receipt-date">{{ r.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredReceipts.length === 0" class="empty-state stagger-1">
        <span class="material-symbols-rounded">receipt_long</span>
        <p>Tidak ada nota ditemukan.</p>
      </div>
    </div>

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <transition name="sheet">
         <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
            <div class="bottom-sheet glass-panel">
               <div class="sheet-drag-handle"></div>
               <div class="sheet-header">
                  <h3 class="sheet-title">{{ isEditing ? 'Edit Nota' : 'Detail Nota' }}</h3>
                  <button @click="isModalOpen = false; uiStore.haptic('light')" class="icon-btn">
                    <span class="material-symbols-rounded">close</span>
                  </button>
               </div>
               
               <div class="sheet-content">
                  <!-- VIEW MODE -->
                  <div v-if="!isEditing" class="view-mode-content">
                     <div class="preview-hero card-md3" @click="showFullscreen = true; uiStore.haptic('medium')">
                        <img v-if="formData['foto/dokumen']" :src="store.unwrapImage(formData['foto/dokumen'])" class="hero-img">
                        <div v-else class="hero-placeholder">
                           <span class="material-symbols-rounded">no_photography</span>
                           <p>Gambar tidak tersedia</p>
                        </div>
                        <div v-if="formData['foto/dokumen']" class="hero-actions">
                           <button @click.stop="downloadPhoto(); uiStore.haptic('light')" class="fab-sm tonal">
                              <span class="material-symbols-rounded">download</span>
                           </button>
                        </div>
                        <div class="view-hint" v-if="formData['foto/dokumen']">
                           <span class="material-symbols-rounded">zoom_in</span>
                           Ketuk untuk memperbesar
                        </div>
                     </div>

                     <div class="insight-card card-md3">
                        <div class="insight-item">
                           <span class="material-symbols-rounded">store</span>
                           <div class="ii-text">
                              <span class="ii-label">Merchant</span>
                              <span class="ii-val">{{ formData.merchant || '-' }}</span>
                           </div>
                        </div>
                        <div class="insight-item">
                           <span class="material-symbols-rounded">calendar_today</span>
                           <div class="ii-text">
                              <span class="ii-label">Tanggal</span>
                              <span class="ii-val">{{ formData.date || '-' }} {{ formData.time || '' }}</span>
                           </div>
                        </div>
                     </div>

                     <div class="modal-actions mt-24">
                        <button @click="isEditing = true; uiStore.haptic('light')" class="filled-btn">
                           <span class="material-symbols-rounded">edit</span>
                           EDIT NOTA
                        </button>
                     </div>
                  </div>

                  <!-- EDIT MODE -->
                  <div v-else class="edit-mode-content">
                     <div class="form-group full">
                        <label>URL Gambar</label>
                        <input type="text" v-model="formData['foto/dokumen']" placeholder="Paste image link..." class="md-input">
                     </div>

                     <div class="form-grid">
                        <div class="form-group full">
                           <label>Merchant</label>
                           <input type="text" v-model="formData.merchant" class="md-input">
                        </div>
                        <div class="form-group"><label>Tanggal</label><input type="date" v-model="formData.date" class="md-input"></div>
                        <div class="form-group"><label>Jam</label><input type="time" v-model="formData.time" class="md-input"></div>
                     </div>

                     <div class="modal-actions mt-24">
                        <button @click="saveReceipt(); uiStore.haptic('success')" class="filled-btn">
                           <span class="material-symbols-rounded">check</span>
                           SIMPAN
                        </button>
                        <div class="secondary-actions">
                           <button @click="isEditing = false; uiStore.haptic('light')" class="tonal-btn">Batal</button>
                           <button v-if="editingReceipt.receiptID" @click="deleteReceipt(); uiStore.haptic('heavy')" class="danger-btn">Hapus</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       </transition>
    </Teleport>

    <!-- Fullscreen Viewer -->
    <Teleport to="body">
       <transition name="fade">
         <div v-if="showFullscreen" class="fullscreen-viewer" @click="showFullscreen = false">
            <div class="viewer-header">
               <span class="viewer-title">{{ formData.merchant }}</span>
               <button class="icon-btn close-viewer">
                  <span class="material-symbols-rounded">close</span>
               </button>
            </div>
            <div class="viewer-content">
               <img :src="store.unwrapImage(formData['foto/dokumen'])" class="viewer-img">
            </div>
         </div>
       </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingReceipt = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')
const showFullscreen = ref(false)

const filteredReceipts = computed(() => {
  if (!searchQuery.value) return store.receipts
  const q = searchQuery.value.toLowerCase()
  return store.receipts.filter(r => 
    (r.merchant || '').toLowerCase().includes(q) ||
    (r.notes || '').toLowerCase().includes(q)
  )
})

const openModal = (r) => {
  if (r) { 
    editingReceipt.value = { ...r }
    formData.value = { ...r } 
    isEditing.value = false
  } else { 
    editingReceipt.value = {}
    formData.value = { merchant: '', account: '', date: '', time: '', notes: '', transactions: '', 'foto/dokumen': '' } 
    isEditing.value = true
  }
  isModalOpen.value = true
}

const downloadPhoto = () => {
   const url = store.unwrapImage(formData.value['foto/dokumen'])
   if (!url) return
   const link = document.createElement('a')
   link.href = url
   link.download = `receipt-${formData.value.merchant || 'detail'}.jpg`
   document.body.appendChild(link)
   link.click()
   document.body.removeChild(link)
}

const saveReceipt = () => {
  if (!formData.value.merchant) return alert('Merchant wajib diisi')
  if (editingReceipt.value.receiptID) store.updateReceipt({ ...formData.value })
  else store.addReceipt({ ...formData.value })
  isModalOpen.value = false
}

const deleteReceipt = () => { 
  if (confirm('Hapus nota ini?')) { 
    store.deleteReceipt(editingReceipt.value.receiptID)
    isModalOpen.value = false 
  } 
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('receipts')
  else uiStore.unregisterModal('receipts')
})

onBeforeUnmount(() => { uiStore.unregisterModal('receipts') })
</script>

<style scoped>
.receipts-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 140px 20px;
}

.receipt-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.receipt-card {
  border-radius: var(--card-radius);
  overflow: hidden;
  aspect-ratio: 1/1;
  cursor: pointer;
  transition: all 0.3s var(--spring-easing);
  animation: entrance 0.5s var(--spring-easing) both;
  animation-delay: var(--delay);
}

.receipt-card:active { transform: scale(0.95); }

.receipt-preview { width: 100%; height: 100%; position: relative; background-color: var(--bg-secondary); }
.preview-img { width: 100%; height: 100%; object-fit: cover; }
.preview-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.1; }

.receipt-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
}

.receipt-merchant { font-size: 14px; font-weight: 700; display: block; }
.receipt-date { font-size: 10px; opacity: 0.7; }

.bottom-sheet {
  width: 100%;
  background-color: rgba(22, 22, 24, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 32px 32px 0 0;
  padding: 12px 20px 40px 20px;
  max-height: 90vh;
  animation: slideUp 0.5s var(--spring-easing);
}

.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 700; margin: 0; }

.insight-card { padding: 20px; background: var(--bg-secondary); border-radius: var(--card-radius); display: flex; flex-direction: column; gap: 16px; border: 1px solid var(--border); }
.insight-item { display: flex; gap: 16px; align-items: center; }
.insight-item .material-symbols-rounded { color: var(--primary); }
.ii-label { font-size: 10px; font-weight: 700; opacity: 0.6; text-transform: uppercase; }
.ii-val { font-size: 16px; font-weight: 600; }

.md-input { background: var(--surface-variant); border: 1px solid var(--border); border-radius: 16px; height: 52px; padding: 0 16px; color: var(--on-surface); width: 100%; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--primary); margin-left: 4px; display: block; margin-bottom: 4px; }

.filled-btn { background: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; width: 100%; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 24px; }

@keyframes entrance {
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.sheet-enter-active, .sheet-leave-active { transition: transform 0.5s var(--spring-easing); }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); }

</style>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingReceipt = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')
const fileInput = ref(null)
const showFullscreen = ref(false)

const filteredReceipts = computed(() => {
  if (!searchQuery.value) return store.receipts
  const q = searchQuery.value.toLowerCase()
  return store.receipts.filter(r => 
    (r.merchant || '').toLowerCase().includes(q) ||
    (r.account || '').toLowerCase().includes(q) ||
    (r.notes || '').toLowerCase().includes(q)
  )
})

const openModal = (r) => {
  if (r) { 
    editingReceipt.value = { ...r }
    formData.value = { ...r } 
    isEditing.value = false
  } else { 
    editingReceipt.value = {}
    formData.value = { merchant: '', account: '', date: '', time: '', notes: '', transactions: '', 'foto/dokumen': '' } 
    isEditing.value = true
  }
  isModalOpen.value = true
}

const downloadPhoto = () => {
   const url = store.unwrapImage(formData.value['foto/dokumen'])
   if (!url) return
   
   const link = document.createElement('a')
   link.href = url
   link.download = `receipt-${formData.value.merchant || 'detail'}-${formData.value.date || 'file'}.jpg`
   document.body.appendChild(link)
   link.click()
   document.body.removeChild(link)
}

const suggestedTransactions = computed(() => {
  if (!formData.value.merchant && !formData.value.date) return []
  return store.transactions.filter(t => {
     const alreadyLinked = (formData.value.transactions || '').includes(t.transactionID)
     if (alreadyLinked) return false
     const sameMerchant = t.merchant === formData.value.merchant
     const sameDate = t.date === formData.value.date
     const sameAccount = t.paymentSourceAccount === formData.value.account
     return (sameMerchant && sameDate) || (sameMerchant && sameAccount)
  }).slice(0, 3)
})

const linkTransaction = (id) => {
  let existing = formData.value.transactions ? formData.value.transactions.split(',').map(s => s.trim()) : []
  if (!existing.includes(id)) {
     existing.push(id)
     formData.value.transactions = existing.join(', ')
  }
}

const saveReceipt = () => {
  if (!formData.value.merchant) return alert('Penerbit/Merchant wajib diisi')
  if (editingReceipt.value.receiptID) store.updateReceipt({ ...formData.value })
  else store.addReceipt({ ...formData.value })
  isModalOpen.value = false
}

const deleteReceipt = () => { 
  if (confirm('Hapus bukti ini secara permanen?')) { 
    store.deleteReceipt(editingReceipt.value.receiptID)
    isModalOpen.value = false 
  } 
}

const handleDuplicate = () => {
  const data = { ...formData.value }; delete data.receiptID
  editingReceipt.value = {}; formData.value = data
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('receipts')
  else uiStore.unregisterModal('receipts')
})

onBeforeUnmount(() => { uiStore.unregisterModal('receipts') })
</script>

<style scoped>
.receipts-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 120px 16px;
}

.receipt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.receipt-card {
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 3/4;
  cursor: pointer;
}

.receipt-preview { width: 100%; height: 100%; position: relative; background-color: #000; }
.preview-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
.preview-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.2; }
.preview-placeholder .material-symbols-rounded { font-size: 64px; }

.receipt-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  display: flex;
  flex-direction: column;
}

.receipt-merchant { font-size: 14px; font-weight: 600; color: white; }
.receipt-date { font-size: 10px; color: rgba(255,255,255,0.7); }


.view-mode-content { display: flex; flex-direction: column; gap: 20px; }
.preview-hero { height: 300px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 20px; }
.hero-img { width: 100%; height: 100%; object-fit: contain; }
.hero-placeholder { display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.3; color: white; }
.hero-placeholder .material-symbols-rounded { font-size: 64px; }
.hero-actions { position: absolute; bottom: 16px; right: 16px; z-index: 2; }
.fab-sm { width: 48px; height: 48px; border-radius: 16px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
.fab-sm.tonal { background: var(--secondary-container); color: var(--on-secondary-container); }

.view-hint { position: absolute; bottom: 16px; left: 16px; font-size: 10px; color: white; display: flex; align-items: center; gap: 4px; opacity: 0.6; pointer-events: none; }
.view-hint .material-symbols-rounded { font-size: 14px; }

.url-input-container { position: relative; display: flex; align-items: center; }
.url-input-container .md-input { padding-right: 84px; width: 100%; }
.url-actions { position: absolute; right: 8px; display: flex; align-items: center; gap: 4px; }
.icon-btn-sm { background: transparent; border: none; color: var(--on-surface-variant); cursor: pointer; padding: 8px; display: flex; align-items: center; border-radius: 50%; }
.icon-btn-sm:active { background: var(--surface-variant); }
.primary-text { color: var(--primary); }

.insight-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.insight-item { display: flex; gap: 16px; align-items: center; }
.insight-item .material-symbols-rounded { color: var(--primary); font-size: 24px; }
.ii-text { display: flex; flex-direction: column; }
.ii-label { font-size: 11px; font-weight: 700; opacity: 0.6; text-transform: uppercase; }
.ii-val { font-size: 16px; font-weight: 500; }

.upload-area { height: 200px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed var(--outline); position: relative; overflow: hidden; }
.upload-preview { width: 100%; height: 100%; object-fit: contain; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.5; }
.upload-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.hidden-input { display: none; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }

.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.suggestion-panel { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.suggestion-panel.tonal { background-color: var(--primary-container); color: var(--on-primary-container); }
.panel-label { font-size: 11px; font-weight: 700; opacity: 0.7; }
.suggestion-list { display: flex; flex-direction: column; gap: 8px; }
.suggestion-item { padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); border: none; }
.st-info { display: flex; flex-direction: column; }
.st-title { font-size: 14px; font-weight: 600; }
.st-meta { font-size: 11px; opacity: 0.6; }
.link-btn { background: var(--primary); color: var(--on-primary); border: none; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; }

.modal-actions { display: flex; flex-direction: column; gap: 16px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.filled-btn { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; width: 100%; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.danger-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }

/* FULLSCREEN VIEWER */
.fullscreen-viewer { position: fixed; inset: 0; background-color: #000; z-index: 5000; display: flex; flex-direction: column; animation: fadeIn 0.2s ease-out; }
.viewer-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); position: absolute; top: 0; left: 0; right: 0; z-index: 2; }
.viewer-title { font-weight: 500; color: white; }
.close-viewer { color: white !important; }
.viewer-content { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.viewer-img { max-width: 100%; max-height: 100%; object-fit: contain; }
.viewer-footer { padding: 24px 16px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); position: absolute; bottom: 0; left: 0; right: 0; color: white; text-align: center; }
.viewer-footer p { margin: 0; font-size: 14px; opacity: 0.8; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
