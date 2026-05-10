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
</style>
