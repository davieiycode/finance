<template>
  <div class="view-content vouchers-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Assets</h1>
          <button class="icon-btn" @click="showSearch = true">
            <span class="material-symbols-rounded">search</span>
          </button>
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
      <div class="vouchers-list">
        <div v-for="v in filteredVouchers" :key="v.voucherID" @click="openModal(v)" class="voucher-card card-md3">
           <div class="voucher-main">
              <div class="voucher-header">
                 <span class="voucher-provider">{{ v.provider }}</span>
                 <span class="status-badge" :class="v.status.toLowerCase()">{{ v.status }}</span>
              </div>
              <h2 class="voucher-name">{{ v.voucherName }}</h2>
           </div>
           <div class="voucher-footer">
              <div class="expiry-box">
                 <span class="footer-label">EXPIRY</span>
                 <span class="footer-value">{{ v.expiryDate || 'N/A' }}</span>
              </div>
              <div class="code-box">
                 {{ v.voucherCode }}
              </div>
           </div>
        </div>
      </div>

      <div v-if="filteredVouchers.length === 0" class="empty-state">
        <span class="material-symbols-rounded">confirmation_number</span>
        <p>No active assets found.</p>
      </div>
    </div>

    <!-- FAB -->
    <button @click="openModal(null)" class="fab">
      <span class="material-symbols-rounded">add</span>
    </button>

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ editingVoucher.voucherID ? (modalMode === 'analysis' ? 'Assest Intelligence' : 'Modify Asset') : 'New Asset' }}</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <!-- MODE: ANALYSIS -->
                <div v-if="modalMode === 'analysis' && editingVoucher.voucherID" class="analysis-view">
                   <div class="asset-hero-card">
                      <div class="hero-glow"></div>
                      <div class="hero-top">
                         <span class="hero-tag">ASSET PROTOCOL</span>
                         <span class="hero-status">{{ editingVoucher.status }}</span>
                      </div>
                      <h2 class="hero-title">{{ editingVoucher.voucherName }}</h2>
                      <p class="hero-code">{{ editingVoucher.voucherCode }}</p>
                      <span class="material-symbols-rounded hero-icon">confirmation_number</span>
                   </div>

                   <div class="analytics-grid">
                      <div class="stat-card card-md3 tonal">
                         <span class="stat-label">DISCOUNT POWER</span>
                         <span class="stat-value">
                            {{ editingVoucher.discountType === 'Percent' ? editingVoucher.discountValue + '%' : 'Rp ' + Number(editingVoucher.discountValue).toLocaleString('id-ID') }}
                         </span>
                      </div>
                      <div class="stat-card card-md3">
                         <span class="stat-label">REMAINING POTENCY</span>
                         <span class="stat-value">Rp {{ Number(editingVoucher.balance).toLocaleString('id-ID') }}</span>
                      </div>
                   </div>

                   <div class="action-grid">
                      <button @click="modalMode = 'edit'" class="tonal-btn-lg">
                         <span class="material-symbols-rounded">edit</span>
                         MODIFY
                      </button>
                      <button @click="isModalOpen = false" class="outline-btn-lg">
                         CLOSE
                      </button>
                   </div>
                </div>

                <!-- MODE: EDIT -->
                <div v-else class="edit-view">
                   <div class="form-grid">
                      <div class="form-group full"><label>Voucher Name</label><input type="text" v-model="formData.voucherName" class="md-input"></div>
                      <div class="form-group full"><label>Provider / Store</label><input type="text" v-model="formData.provider" class="md-input"></div>
                      <div class="form-group full"><label>Serial Code</label><input type="text" v-model="formData.voucherCode" class="md-input"></div>
                      <div class="form-group">
                         <label>Discount Type</label>
                         <select v-model="formData.discountType" class="md-input">
                            <option>Percent</option><option>Nominal</option>
                         </select>
                      </div>
                      <div class="form-group"><label>Value</label><input type="number" v-model.number="formData.discountValue" class="md-input"></div>
                      <div class="form-group"><label>Max Potency</label><input type="number" v-model.number="formData.balance" class="md-input"></div>
                      <div class="form-group"><label>Expiry Date</label><input type="date" v-model="formData.expiryDate" class="md-input"></div>
                      <div class="form-group">
                         <label>Status</label>
                         <select v-model="formData.status" class="md-input">
                            <option>Active</option><option>Used</option><option>Expired</option><option>Exhausted</option>
                         </select>
                      </div>
                      <div class="form-group checkbox-group">
                         <input type="checkbox" v-model="formData.isSingleUse" id="chkSingle">
                         <label for="chkSingle">Single Use Only</label>
                      </div>
                      <div class="form-group full"><label>Notes</label><textarea v-model="formData.notes" class="md-textarea"></textarea></div>
                   </div>

                   <div class="modal-actions">
                      <button @click="saveVou" class="filled-btn-lg">
                         <span class="material-symbols-rounded">save</span>
                         SAVE ASSET
                      </button>
                      <div v-if="editingVoucher.voucherID" class="secondary-actions">
                         <button @click="handleDuplicate" class="tonal-btn">Duplicate</button>
                         <button @click="deleteVou" class="error-btn">Purge</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
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
const modalMode = ref('analysis')
const editingVoucher = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')

const filteredVouchers = computed(() => {
  if (!searchQuery.value) return store.vouchers
  const q = searchQuery.value.toLowerCase()
  return store.vouchers.filter(v => 
    (v.voucherName || '').toLowerCase().includes(q) ||
    (v.provider || '').toLowerCase().includes(q) ||
    (v.voucherCode || '').toLowerCase().includes(q)
  )
})

const openModal = (v) => {
  if (v) { 
    editingVoucher.value = { ...v }
    formData.value = { 
      ...v,
      balance: Number(v.balance) || 0,
      discountValue: Number(v.discountValue) || 0
    } 
    modalMode.value = 'analysis'
  } else { 
    editingVoucher.value = {}
    formData.value = { voucherName: '', provider: '', voucherCode: '', discountType: 'Nominal', discountValue: 0, balance: 0, expiryDate: '', status: 'Active', isSingleUse: false, notes: '' } 
    modalMode.value = 'edit'
  }
  isModalOpen.value = true
}

const saveVou = () => {
  if (!formData.value.voucherName) return alert('Name required')
  if (editingVoucher.value.voucherID) store.updateVoucher({ ...formData.value })
  else store.addVoucher({ ...formData.value })
  isModalOpen.value = false
}

const deleteVou = () => { if (confirm('Purge this asset?')) { store.deleteVoucher(editingVoucher.value.voucherID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }; delete data.voucherID
  editingVoucher.value = {}; formData.value = data
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('vouchers')
  else uiStore.unregisterModal('vouchers')
})

onBeforeUnmount(() => { uiStore.unregisterModal('vouchers') })
</script>

<style scoped>
.vouchers-container {
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

.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 22px; font-weight: 400; margin: 0; }

.icon-btn {
  width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent;
  color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer;
}

.search-input-field { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 16px; outline: none; }

.content-scroll { flex: 1; overflow-y: auto; padding: 16px; }

.vouchers-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

.voucher-card { overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s; }
.voucher-card:active { transform: scale(0.98); }

.voucher-main { padding: 20px; flex: 1; border-bottom: 1px dashed var(--border); }
.voucher-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.voucher-provider { font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
.status-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; }
.status-badge.active { background-color: rgba(180, 232, 168, 0.2); color: var(--green); }
.status-badge.used { background-color: var(--surface-variant); color: var(--on-surface-variant); }

.voucher-name { font-size: 20px; font-weight: 500; margin: 0; }

.voucher-footer { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; background-color: rgba(255,255,255,0.02); }
.footer-label { font-size: 10px; font-weight: 700; opacity: 0.5; margin-right: 8px; }
.footer-value { font-size: 13px; font-weight: 500; }
.code-box { font-family: monospace; font-size: 14px; font-weight: 700; color: var(--primary); background: var(--primary-container); padding: 4px 12px; border-radius: 8px; }

.fab {
  position: fixed; bottom: 32px; right: 32px; width: 56px; height: 56px; border-radius: 16px;
  background-color: var(--primary); color: var(--on-primary); border: none;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 1000; cursor: pointer;
}

.modal-backdrop-full { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 4000; display: flex; align-items: flex-end; }

.bottom-sheet {
  width: 100%; background-color: var(--bg-primary); border-radius: 28px 28px 0 0;
  padding: 8px 16px 32px 16px; max-height: 90vh; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 24px; }

.asset-hero-card {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  padding: 24px; border-radius: 24px; color: var(--on-primary); position: relative; overflow: hidden;
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}

.hero-glow { position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); }
.hero-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.hero-tag { font-size: 11px; font-weight: 700; letter-spacing: 2px; }
.hero-status { font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 20px; }
.hero-title { font-size: 28px; font-weight: 600; margin: 0; }
.hero-code { font-family: monospace; font-size: 18px; margin-top: 8px; opacity: 0.9; letter-spacing: 1px; }
.hero-icon { position: absolute; bottom: -10px; right: -10px; font-size: 120px; opacity: 0.1; }

.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-card { padding: 16px; display: flex; flex-direction: column; gap: 4px; }
.stat-card.tonal { background-color: var(--primary-container); border: none; }
.stat-label { font-size: 10px; font-weight: 700; opacity: 0.6; }
.stat-value { font-size: 18px; font-weight: 600; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }
.checkbox-group { flex-direction: row; align-items: center; gap: 12px; padding: 12px 0; }

.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.modal-actions { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
