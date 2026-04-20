<template>
<Teleport to="body">
  <div v-if="tx" class="modal-backdrop-full" @click.self="$emit('close')">
      <div class="bottom-sheet transaction-summary">
        <div class="sheet-drag-handle"></div>
        
        <div class="sheet-header">
           <div class="summary-icon-container" :style="{ color: getTxColor(tx.type), backgroundColor: getTxColor(tx.type) + '15' }">
              <span class="material-symbols-rounded">{{ store.resolveIcon(tx.category, tx.type) }}</span>
           </div>
           <div class="header-info">
             <div v-if="accountInfo" class="account-watermark" :style="{ color: accountInfo.color || 'var(--primary)' }">
               <span class="material-symbols-rounded" v-if="accountInfo.icon">{{ store.sanitizeIcon(accountInfo.icon) }}</span>
               <span>{{ accountInfo.accountName }}</span>
             </div>
             <h2 class="sheet-title">Ringkasan Transaksi</h2>
             <span class="tx-id">LOG ID: {{ tx.transactionID }}</span>
           </div>
           <button @click="$emit('close')" class="icon-btn">
              <span class="material-symbols-rounded">close</span>
           </button>
        </div>

         <div class="sheet-content">
            <div class="hero-card">
               <div class="item-name">{{ tx.itemName }}</div>
               <div class="main-amount" :style="{ color: getTxColor(tx.type) }">
                  <span class="currency">Rp</span>
                  <span class="hero-value">{{ formatCurrency(tx.total || (tx.amountPerUnit * tx.quantity)) }}</span>
               </div>
            </div>

            <div class="details-section">
               <div class="detail-row">
                  <span class="label">Jumlah</span>
                  <span class="value">{{ formatQty(tx.quantity) }} {{ tx.unitScale }}</span>
               </div>
               <div class="detail-row">
                  <span class="label">Harga Satuan</span>
                  <span class="value">{{ (tx.amountPerUnit || 0).toLocaleString('id-ID') }}</span>
               </div>
               <div v-if="tx.discount" class="detail-row success">
                  <span class="label">Diskon/Bonus (-)</span>
                  <span class="value">-{{ (tx.discount || 0).toLocaleString('id-ID') }}</span>
               </div>
               <div v-if="tx.fee" class="detail-row danger">
                  <span class="label">Biaya Layanan (+)</span>
                  <span class="value">+{{ (tx.fee || 0).toLocaleString('id-ID') }}</span>
               </div>
               <div v-if="tx.currency !== 'IDR' || tx.exchangeRate !== 1" class="detail-row outline">
                  <span class="label">Info Kurs</span>
                  <span class="value">{{ tx.currency }} @ {{ tx.exchangeRate }}</span>
               </div>
            </div>

            <div class="info-grid">
               <div class="info-item">
                 <span class="label">Kategori</span>
                 <span class="value">{{ tx.category || 'Tanpa Kategori' }}</span>
               </div>
               <div class="info-item">
                 <span class="label">Toko/Merchant</span>
                 <span class="value">{{ tx.merchant || 'Tidak Diketahui' }}</span>
               </div>
               <div v-if="tx.type !== 'Income'" class="info-item">
                 <span class="label">Rekening Sumber</span>
                 <span class="value">{{ tx.paymentSourceAccount || '-' }}</span>
               </div>
               <div v-if="tx.type !== 'Expense'" class="info-item">
                 <span class="label">Rekening Tujuan</span>
                 <span class="value">{{ tx.beneficiaryAccount || '-' }}</span>
               </div>
               <div class="info-item full">
                  <span class="label">Waktu & Tanggal</span>
                  <span class="value">{{ displayDate }} • {{ displayTime }}</span>
               </div>
               <div v-if="tx.description" class="info-item full description">
                 <span class="label">Catatan</span>
                 <span class="value">{{ tx.description }}</span>
               </div>
            </div>

            <div class="action-grid mt-24">
               <button @click="editTx" class="tonal-btn">
                  <span class="material-symbols-rounded" style="font-size: 20px;">edit</span>
                  Ubah
               </button>
               <button @click="duplicateTx" class="tonal-btn">
                  <span class="material-symbols-rounded" style="font-size: 20px;">content_copy</span>
                  Duplikat
               </button>
               <button @click="mergeTx" class="tonal-btn">
                  <span class="material-symbols-rounded" style="font-size: 20px;">merge</span>
                  Gabung
               </button>
               <button @click="deleteTx" class="danger-btn">
                  <span class="material-symbols-rounded" style="font-size: 20px;">delete</span>
                  Hapus
               </button>
            </div>
         </div>
    </div>

    <!-- Merge Panel (Nested Sheet) -->
    <div v-if="isMergePanelOpen" class="merge-sheet-overlay">
       <div class="bottom-sheet merge-panel">
          <div class="sheet-drag-handle"></div>
          <div class="sheet-header">
             <h3 class="sheet-title">Gabungkan Transaksi</h3>
             <button @click="isMergePanelOpen = false" class="icon-btn">
               <span class="material-symbols-rounded">close</span>
             </button>
          </div>
          <p class="sheet-desc">Pilih transaksi untuk menjadi tujuan penggabungan data ini.</p>
          
          <div class="search-box">
             <span class="material-symbols-rounded">search</span>
             <input type="text" v-model="mergeTargetSearch" placeholder="Cari riwayat transaksi...">
          </div>

          <div class="target-list">
             <div v-for="t in filteredMergeTargets" :key="t.transactionID" @click="performMerge(t)" class="target-item">
                <div class="target-icon">
                   <span class="material-symbols-rounded">history</span>
                </div>
                <div class="target-info">
                   <span class="target-name">{{ t.itemName }}</span>
                   <span class="target-meta">{{ t.date }} • Rp {{ (t.total || 0).toLocaleString('id-ID') }}</span>
                </div>
                <span class="material-symbols-rounded">chevron_right</span>
             </div>
             <div v-if="filteredMergeTargets.length === 0" class="empty-state">Tidak ada transaksi yang cocok ditemukan.</div>
          </div>
          <button @click="isMergePanelOpen = false" class="outline-btn mt-24">Batalkan</button>
       </div>
    </div>
  </div>
</Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const router = useRouter()
const props = defineProps({
  tx: Object
})
const emit = defineEmits(['close'])

const editTx = () => {
  router.push(`/transaction?id=${props.tx.transactionID}`)
  emit('close')
}

const duplicateTx = () => {
  router.push(`/transaction?duplicate=${props.tx.transactionID}`)
  emit('close')
}

const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.transactions
    .filter(t => t.transactionID !== props.tx.transactionID)
    .filter(t => 
      (t.itemName || '').toLowerCase().includes(q) ||
      (t.merchant || '').toLowerCase().includes(q) ||
      (t.date || '').toLowerCase().includes(q)
    ).slice(0, 10)
})

const accountInfo = computed(() => {
  const name = props.tx.type === 'Income' ? props.tx.beneficiaryAccount : props.tx.paymentSourceAccount
  return store.getAccount(name)
})

const mergeTx = () => { isMergePanelOpen.value = true }

const performMerge = (target) => {
  if (!confirm(`Pindahkan data finansial dari catatan ini ke "${target.itemName}"?`)) return
  
  const updatedTarget = { ...target }
  if (target.currency === props.tx.currency) {
    updatedTarget.total = (Number(updatedTarget.total) || 0) + (Number(props.tx.total) || 0)
    updatedTarget.quantity = (Number(updatedTarget.quantity) || 0) + (Number(props.tx.quantity) || 0)
    updatedTarget.description = (updatedTarget.description || '') + ` (Gabungan dari ID: ${props.tx.transactionID})`
    store.updateTransaction(updatedTarget)
  }
  
  store.deleteTransaction(props.tx.transactionID)
  isMergePanelOpen.value = false
  emit('close')
}

const deleteTx = () => {
  if (confirm('Hapus catatan transaksi ini secara permanen?')) {
    store.deleteTransaction(props.tx.transactionID)
    emit('close')
  }
}

const formatCurrency = (val) => {
  if (!val) return '0'
  const num = Number(String(val).replace(/[^0-9.-]+/g,""))
  return isNaN(num) ? '0' : num.toLocaleString('id-ID')
}

const formatQty = (val) => {
  if (val === undefined || val === null) return '0'
  const num = Number(val)
  if (isNaN(num)) return val
  return parseFloat(num.toFixed(8)).toLocaleString('id-ID', { maximumFractionDigits: 8 })
}

const displayDate = computed(() => {
  if (!props.tx.date) return 'Waktu Tidak Diketahui'
  try {
    const parts = String(props.tx.date).split('-')
    if (parts.length === 3) {
      // Create date without timezone shift: March is index 2, etc.
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
    }
    return props.tx.date
  } catch (e) { return props.tx.date }
})

const displayTime = computed(() => {
  if (!props.tx.time) return '--:--'
  const t = String(props.tx.time)
  if (t.includes('T')) return t.split('T')[1].substring(0, 5)
  if (t.includes(':')) {
    const parts = t.split(':')
    return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0')
  }
  return t
})

const getTxColor = (type) => {
  if (type === 'Income') return 'var(--green)'
  if (type === 'Expense') return 'var(--red)'
  return 'var(--primary)'
}

onMounted(() => { uiStore.registerModal('transaction-detail') })
onUnmounted(() => { uiStore.unregisterModal('transaction-detail') })
</script>

<style scoped>
.modal-backdrop-full {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  z-index: 4000;
  display: flex;
  align-items: flex-end;
  backdrop-filter: blur(8px);
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

.sheet-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.summary-icon-container { width: 48px; height: 48px; border-radius: 24px; display: flex; align-items: center; justify-content: center; }
.header-info { flex: 1; display: flex; flex-direction: column; position: relative; }
.account-watermark { position: absolute; top: -16px; left: 0; display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; }
.account-watermark .material-symbols-rounded { font-size: 14px; }
.sheet-title { font-size: 22px; font-weight: 400; margin: 0; font-family: 'Outfit', sans-serif; }
.tx-id { font-size: 10px; font-weight: 700; opacity: 0.5; letter-spacing: 1px; }

.sheet-content { overflow-y: auto; flex: 1; }

.hero-card { background: var(--surface-variant); padding: 24px; border-radius: 24px; text-align: center; margin-bottom: 24px; }
.item-name { font-size: 16px; font-weight: 500; opacity: 0.8; margin-bottom: 8px; }
.main-amount { display: flex; align-items: baseline; justify-content: center; gap: 8px; }
.currency { font-size: 20px; font-weight: 400; opacity: 0.7; }
.hero-value { font-size: 32px; font-weight: 700; }

.details-section { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; border-bottom: 1px dashed var(--border); padding-bottom: 24px; }
.detail-row { display: flex; justify-content: space-between; font-size: 14px; }
.detail-row .label { color: var(--on-surface-variant); }
.detail-row .value { font-weight: 600; font-size: 14px; }
.detail-row.success .value { color: var(--green); }
.detail-row.danger .value { color: var(--red); }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.info-item { display: flex; flex-direction: column; gap: 4px; }
.info-item.full { grid-column: span 2; }
.info-item .label { font-size: 11px; font-weight: 600; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 1px; }
.info-item .value { font-size: 14px; font-weight: 500; }
.info-item.description .value { line-height: 1.5; opacity: 0.9; white-space: pre-wrap; word-break: break-word; }

.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Global MD3 Buttons are used */

/* MERGE PANEL */
.merge-sheet-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); border-radius: 28px 28px 0 0; z-index: 4500; display: flex; align-items: flex-end; }
.merge-panel { background: var(--bg-secondary); border-top: 1px solid var(--border); }
.sheet-desc { font-size: 14px; color: var(--on-surface-variant); margin-bottom: 16px; }
.search-box { display: flex; align-items: center; gap: 12px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 16px; padding: 10px 16px; margin-bottom: 16px; }
.search-box input { background: transparent; border: none; color: var(--on-surface); outline: none; flex: 1; }
.target-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.target-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 16px; background: var(--bg-primary); cursor: pointer; }
.target-icon { width: 40px; height: 40px; border-radius: 20px; background: var(--secondary-container); color: var(--on-secondary-container); display: flex; align-items: center; justify-content: center; }
.target-name { font-size: 14px; font-weight: 600; display: block; }
.target-meta { font-size: 11px; opacity: 0.6; }
.empty-state { text-align: center; padding: 32px; opacity: 0.5; font-size: 14px; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.mt-24 { margin-top: 24px; }
</style>
