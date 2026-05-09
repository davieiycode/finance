<template>
  <div class="view-content debts-container">
    <!-- Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.push('/')">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>Hutang & Piutang</h1>
        <button class="icon-btn" @click="openAddModal">
          <span class="material-symbols-rounded">add</span>
        </button>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Summary Grid -->
      <div class="stats-grid no-print">
        <div class="stat-card success">
          <div class="card-icon"><span class="material-symbols-rounded">call_made</span></div>
          <span class="card-title">Total Piutang</span>
          <span class="card-value">Rp {{ totalLending.toLocaleString('id-ID') }}</span>
          <span class="card-sub">Dipinjam orang lain</span>
        </div>
        <div class="stat-card danger">
          <div class="card-icon"><span class="material-symbols-rounded">call_received</span></div>
          <span class="card-title">Total Hutang</span>
          <span class="card-value">Rp {{ totalDebt.toLocaleString('id-ID') }}</span>
          <span class="card-sub">Kewajiban Anda</span>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="tabs-capsule no-print">
        <button @click="activeTab = 'piutang'" :class="{ active: activeTab === 'piutang' }">Piutang</button>
        <button @click="activeTab = 'hutang'" :class="{ active: activeTab === 'hutang' }">Hutang</button>
      </div>

      <!-- Debt List -->
      <div class="debt-list">
        <div v-for="d in filteredDebts" :key="d.debtID" class="debt-item card-md3" @click="openEditModal(d)">
          <div class="debt-header">
             <div class="person-info">
                <span class="person-name">{{ d.person }}</span>
                <span class="debt-date">{{ formatDate(d.startDate) }} • {{ d.notes || 'Tanpa Catatan' }}</span>
             </div>
             <div class="amount-info">
                <span class="total-val">Rp {{ (Number(d.remainingAmount) || 0).toLocaleString('id-ID') }}</span>
                <span class="total-label">Sisa</span>
             </div>
          </div>
          <div class="debt-progress">
             <div class="progress-info">
                <span>{{ calculatePercent(d) }}% Terbayar</span>
                <span>Total: Rp {{ (Number(d.totalAmount) || 0).toLocaleString('id-ID') }}</span>
             </div>
             <div class="progress-bg"><div class="progress-fill" :style="{ width: calculatePercent(d) + '%', backgroundColor: activeTab === 'piutang' ? 'var(--green)' : 'var(--red)' }"></div></div>
          </div>
          <div v-if="d.remainingAmount > 0" class="debt-actions" @click.stop>
             <button @click="openPaymentModal(d)" class="tonal-btn sm">
                <span class="material-symbols-rounded" style="font-size: 16px;">payments</span>
                Cicil / Bayar
             </button>
          </div>
        </div>

        <div v-if="filteredDebts.length === 0" class="empty-state">
          <span class="material-symbols-rounded">account_balance</span>
          <p>Tidak ada catatan {{ activeTab }} aktif.</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
       <div v-if="showModal" class="modal-backdrop-full" @click.self="showModal = false">
          <div class="bottom-sheet debt-modal">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ isEditing ? 'Detail Hutang' : 'Tambah Catatan Baru' }}</h3>
                <button @click="showModal = false" class="icon-btn">
                   <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="form-grid">
                <div class="form-group full">
                   <label>Nama Orang / Lembaga</label>
                   <input type="text" v-model="formData.person" placeholder="Misal: Budi, Bank Mandiri..." class="md-input">
                </div>
                <div class="form-group" v-if="!isEditing">
                   <label>Tipe</label>
                   <select v-model="formData.type" class="md-input">
                      <option value="piutang">Piutang (Orang lain pinjam ke Anda)</option>
                      <option value="hutang">Hutang (Anda pinjam ke orang lain)</option>
                   </select>
                </div>
                <div class="form-group">
                   <label>Jumlah Pinjaman (Rp)</label>
                   <input type="number" v-model="formData.totalAmount" @input="!isEditing ? formData.remainingAmount = formData.totalAmount : null" class="md-input">
                </div>
                <div class="form-group full">
                   <label>Catatan</label>
                   <input type="text" v-model="formData.notes" placeholder="Tujuan pinjaman..." class="md-input">
                </div>
                <div class="form-group full">
                   <label>Tanggal Mulai</label>
                   <input type="date" v-model="formData.startDate" class="md-input">
                </div>
             </div>

             <div class="modal-actions mt-24">
                <button v-if="isEditing" @click="deleteDebt" class="danger-btn">Hapus</button>
                <div class="flex-spacer"></div>
                <button @click="saveDebt" class="primary-btn">Simpan</button>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Payment Modal -->
    <Teleport to="body">
       <div v-if="showPaymentModal" class="modal-backdrop-full" @click.self="showPaymentModal = false">
          <div class="bottom-sheet payment-modal">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Catat Pembayaran</h3>
                <button @click="showPaymentModal = false" class="icon-btn">
                   <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             <p class="sheet-desc">Mencatat cicilan untuk <strong>{{ activeDebt?.person }}</strong>. Catatan ini akan otomatis masuk ke Riwayat Transaksi.</p>
             
             <div class="form-grid">
                <div class="form-group full">
                   <label>Jumlah Bayar (Rp)</label>
                   <input type="number" v-model="payAmount" class="md-input">
                </div>
                <div class="form-group full">
                   <label>Sumber / Tujuan Rekening</label>
                   <select v-model="payAccount" class="md-input">
                      <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
                   </select>
                </div>
             </div>

             <button @click="confirmPayment" class="primary-btn mt-24 w-100">Konfirmasi Pembayaran</button>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const activeTab = ref('piutang')
const showModal = ref(false)
const showPaymentModal = ref(false)
const isEditing = ref(false)
const activeDebt = ref(null)
const payAmount = ref(0)
const payAccount = ref('')

const formData = ref({ debtID: '', person: '', type: 'piutang', totalAmount: 0, remainingAmount: 0, startDate: '', notes: '' })

const totalLending = computed(() => store.debts.filter(d => d.type === 'piutang').reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0))
const totalDebt = computed(() => store.debts.filter(d => d.type === 'hutang').reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0))

const filteredDebts = computed(() => {
  return store.debts.filter(d => d.type === activeTab.value).sort((a,b) => new Date(b.startDate) - new Date(a.startDate))
})

const openAddModal = () => {
  isEditing.value = false
  formData.value = { debtID: '', person: '', type: activeTab.value, totalAmount: 0, remainingAmount: 0, startDate: new Date().toISOString().split('T')[0], notes: '' }
  showModal.value = true
}

const openEditModal = (d) => {
  isEditing.value = true
  formData.value = { ...d }
  showModal.value = true
}

const openPaymentModal = (d) => {
  activeDebt.value = d
  payAmount.value = d.remainingAmount
  payAccount.value = store.accounts[0]?.accountName || ''
  showPaymentModal.value = true
}

const saveDebt = () => {
  if (!formData.value.person || !formData.value.totalAmount) return
  if (isEditing.value) store.updateDebt(formData.value)
  else store.addDebt(formData.value)
  showModal.value = false
}

const deleteDebt = () => {
  if (confirm('Hapus catatan ini?')) {
    store.deleteDebt(formData.value.debtID)
    showModal.value = false
  }
}

const confirmPayment = () => {
  if (!payAmount.value || !payAccount.value) return
  
  const d = activeDebt.value
  const amount = Number(payAmount.value)
  
  // 1. Create Transaction
  const tx = {
    transactionID: 'TX-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    itemName: (d.type === 'piutang' ? 'Penerimaan Piutang: ' : 'Pembayaran Hutang: ') + d.person,
    type: d.type === 'piutang' ? 'Income' : 'Expense',
    category: d.type === 'piutang' ? 'Lainnya' : 'Hutang',
    total: amount,
    cleared: 'yes',
    paymentSourceAccount: d.type === 'hutang' ? payAccount.value : '',
    beneficiaryAccount: d.type === 'piutang' ? payAccount.value : '',
    description: `Pembayaran cicilan untuk ${d.person}`,
    currency: 'IDR',
    exchangeRate: 1
  }
  
  // Use store's transaction management (assuming direct access or using store.addTransaction)
  store.transactions.push(tx)
  
  // 2. Update Debt
  d.remainingAmount = Math.max(0, (Number(d.remainingAmount) || 0) - amount)
  if (d.remainingAmount === 0) d.status = 'closed'
  store.updateDebt(d)
  store.saveAll()
  
  showPaymentModal.value = false
  store.notify('Pembayaran berhasil dicatat!', 'success')
}

const calculatePercent = (d) => {
  const total = Number(d.totalAmount) || 1
  const remaining = Number(d.remainingAmount) || 0
  return Math.round(((total - remaining) / total) * 100)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.debts-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 120px 16px; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.stat-card { background: var(--bg-secondary); padding: 16px; border-radius: 24px; display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); }
.card-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.stat-card.success .card-icon { background: rgba(180, 232, 168, 0.2); color: var(--green); }
.stat-card.danger .card-icon { background: rgba(242, 184, 181, 0.2); color: var(--red); }
.card-title { font-size: 11px; font-weight: 600; color: var(--on-surface-variant); }
.card-value { font-size: 16px; font-weight: 700; }
.card-sub { font-size: 10px; opacity: 0.6; }

.tabs-capsule { background: var(--surface-variant); padding: 4px; border-radius: 16px; display: flex; margin-bottom: 24px; }
.tabs-capsule button { flex: 1; border: none; background: transparent; color: var(--on-surface-variant); padding: 8px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
.tabs-capsule button.active { background: var(--bg-primary); color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

.debt-list { display: flex; flex-direction: column; gap: 12px; }
.debt-item { padding: 16px; cursor: pointer; }
.debt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.person-name { display: block; font-size: 16px; font-weight: 600; }
.debt-date { font-size: 11px; opacity: 0.6; }
.amount-info { text-align: right; }
.total-val { display: block; font-size: 16px; font-weight: 700; color: var(--primary); }
.total-label { font-size: 10px; opacity: 0.5; }

.debt-progress { margin-bottom: 12px; }
.progress-info { display: flex; justify-content: space-between; font-size: 11px; font-weight: 500; margin-bottom: 4px; opacity: 0.8; }
.progress-bg { height: 6px; background: var(--surface-variant); border-radius: 3px; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

.debt-actions { border-top: 1px dashed var(--border); padding-top: 12px; display: flex; justify-content: flex-end; }
.tonal-btn.sm { height: 32px; padding: 0 12px; font-size: 12px; gap: 6px; }

.sheet-desc { font-size: 13px; opacity: 0.7; margin-bottom: 20px; line-height: 1.5; }
.w-100 { width: 100%; }
</style>
