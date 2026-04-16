<template>
  <div class="view-content receipts-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Bukti Transaksi</h1>
          <div class="app-bar-actions">
            <button class="icon-btn" @click="showSearch = true">
              <span class="material-symbols-rounded">search</span>
            </button>
            <button class="tonal-btn" @click="openModal(null)">
              <span class="material-symbols-rounded">add_a_photo</span>
              Baru
            </button>
          </div>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Search archive..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="receipt-grid">
        <div v-for="r in filteredReceipts" :key="r.receiptID" @click="openModal(r)" class="receipt-card card-md3">
          <div class="receipt-preview">
            <img v-if="r['foto/dokumen']" :src="r['foto/dokumen']" class="preview-img">
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

      <div v-if="filteredReceipts.length === 0" class="empty-state">
        <span class="material-symbols-rounded">receipt_long</span>
        <p>No evidence logs detected.</p>
      </div>
    </div>

    <!-- FAB Removed -->

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Evidence Detail</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <div class="upload-area card-md3" @click="$refs.fileInput.click()">
                   <img v-if="formData['foto/dokumen']" :src="formData['foto/dokumen']" class="upload-preview">
                   <div v-else class="upload-placeholder">
                      <span class="material-symbols-rounded">add_a_photo</span>
                      <span class="upload-label">UPLOAD OR CAPTURE</span>
                   </div>
                   <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" capture="environment" class="hidden-input">
                </div>

                <div class="form-grid">
                   <div class="form-group full">
                      <label>Merchant</label>
                      <input type="text" v-model="formData.merchant" list="mch-list" class="md-input">
                   </div>
                   <div class="form-group full">
                      <label>Payment Source</label>
                      <select v-model="formData.account" class="md-input">
                         <option value="">Select Account...</option>
                         <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
                      </select>
                   </div>
                   <div class="form-group"><label>Date</label><input type="date" v-model="formData.date" class="md-input"></div>
                   <div class="form-group"><label>Time</label><input type="time" v-model="formData.time" class="md-input"></div>
                </div>

                <!-- Linked Transactions -->
                <div v-if="suggestedTransactions.length > 0" class="suggestion-panel card-md3 tonal">
                   <span class="panel-label">DETECTED SIMILAR TRANSACTIONS</span>
                   <div class="suggestion-list">
                      <div v-for="st in suggestedTransactions" :key="st.transactionID" class="suggestion-item card-md3">
                         <div class="st-info">
                            <span class="st-title">{{ st.itemName }}</span>
                            <span class="st-meta">{{ st.date }} • Rp {{ (st.total || 0).toLocaleString('id-ID') }}</span>
                         </div>
                         <button @click="linkTransaction(st.transactionID)" class="link-btn">LINK</button>
                      </div>
                   </div>
                </div>

                <div class="form-group full">
                   <label>Notes</label>
                   <textarea v-model="formData.notes" class="md-textarea"></textarea>
                </div>

                <div class="modal-actions">
                   <button @click="saveReceipt" class="filled-btn-lg">
                      <span class="material-symbols-rounded">save</span>
                      SAVE EVIDENCE
                   </button>
                   <div v-if="editingReceipt.receiptID" class="secondary-actions">
                      <button @click="handleDuplicate" class="tonal-btn">Duplicate</button>
                      <button @click="deleteReceipt" class="error-btn">Purge</button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <datalist id="mch-list">
       <option v-for="m in store.merchants" :key="m.merchantID" :value="m.merchantName" />
    </datalist>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const editingReceipt = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')
const fileInput = ref(null)

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
  } else { 
    editingReceipt.value = {}
    formData.value = { merchant: '', account: '', date: '', time: '', notes: '', transactions: '', 'foto/dokumen': '' } 
  }
  isModalOpen.value = true
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (f) => { formData.value['foto/dokumen'] = f.target.result }
  reader.readAsDataURL(file)
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

.fab {
  position: fixed;
  bottom: 32px;
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
.sheet-content { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px; }

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

.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(168, 199, 250, 0.4); width: 100%; }
.tonal-btn-lg { background-color: var(--primary-container); color: var(--on-primary-container); border: none; border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; }
.outline-btn-lg { background-color: transparent; border: 1px solid var(--outline); color: var(--on-surface); border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
