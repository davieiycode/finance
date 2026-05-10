<template>
  <div class="view-content debts-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.back()">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>Pinjaman</h1>
        <div class="app-bar-actions">
          <button class="tonal-btn" @click="openAddModal">
            <span class="material-symbols-rounded">add</span>
            Baru
          </button>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Summary Cards -->
      <div class="stats-grid no-print">
        <div class="stat-card piutang-card card-md3">
          <div class="card-glow"></div>
          <div class="card-header-shp">
             <span class="card-label-shp">TOTAL PIUTANG</span>
             <div class="icon-shp"><span class="material-symbols-rounded">call_made</span></div>
          </div>
          <h2 class="card-value-shp">Rp {{ totalLending.toLocaleString('id-ID') }}</h2>
          <span class="card-sub-shp">Dana di orang lain</span>
        </div>
        <div class="stat-card hutang-card card-md3">
          <div class="card-glow"></div>
          <div class="card-header-shp">
             <span class="card-label-shp">TOTAL HUTANG</span>
             <div class="icon-shp"><span class="material-symbols-rounded">call_received</span></div>
          </div>
          <h2 class="card-value-shp">Rp {{ totalDebt.toLocaleString('id-ID') }}</h2>
          <span class="card-sub-shp">Kewajiban bayar</span>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="tabs-capsule no-print">
        <button @click="activeTab = 'piutang'" :class="{ active: activeTab === 'piutang' }">Piutang</button>
        <button @click="activeTab = 'hutang'" :class="{ active: activeTab === 'hutang' }">Hutang</button>
      </div>

      <!-- Debt List -->
      <div class="debt-list">
        <div v-for="d in filteredDebts" :key="d.debtID" class="debt-card card-md3" @click="openEditModal(d)">
          <div class="card-top">
             <div class="person-box">
                <div class="avatar-shp">{{ (d.person || '?')[0].toUpperCase() }}</div>
                <div class="person-details">
                   <span class="person-name">{{ d.person }}</span>
                   <span class="debt-meta">{{ formatDate(d.startDate) }} • {{ d.notes || 'Tanpa Catatan' }}</span>
                </div>
             </div>
             <div class="amount-box">
                <span class="rem-amount">Rp {{ (Number(d.remainingAmount) || 0).toLocaleString('id-ID') }}</span>
                <span class="rem-label">SISA SALDO</span>
             </div>
          </div>
          
          <div class="card-middle">
             <div class="progress-header">
                <span class="progress-text">{{ calculatePercent(d) }}% Terlunasi</span>
                <span class="total-text">Pokok: Rp {{ (Number(d.totalAmount) || 0).toLocaleString('id-ID') }}</span>
             </div>
             <div class="progress-track-shp"><div class="progress-bar-shp" :style="{ width: calculatePercent(d) + '%', backgroundColor: activeTab === 'piutang' ? 'var(--green)' : 'var(--red)' }"></div></div>
          </div>

          <div v-if="d.remainingAmount > 0" class="card-actions-shp" @click.stop>
             <button @click="openPaymentModal(d)" class="tonal-btn-sm-shp">
                <span class="material-symbols-rounded">payments</span>
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
             
             <div class="sheet-content">
                <section class="form-section-md3">
                   <div class="section-header">
                      <span class="material-symbols-rounded">person_search</span>
                      <h3>Informasi Pinjaman</h3>
                   </div>
                   
                   <div class="form-group">
                      <span class="field-label">Nama Orang / Lembaga *</span>
                      <input type="text" v-model="formData.person" placeholder="Misal: Budi, Bank Mandiri..." class="md-input">
                   </div>
                   
                   <div class="form-row-shp mt-16">
                      <div class="form-group" v-if="!isEditing">
                         <span class="field-label">Tipe</span>
                         <select v-model="formData.type" class="md-input">
                            <option value="piutang">Piutang (Peminjaman ke Orang)</option>
                            <option value="hutang">Hutang (Pinjaman dari Orang)</option>
                         </select>
                      </div>
                      <div class="form-group">
                         <span class="field-label">Jumlah Pinjaman (Rp)</span>
                         <input type="number" v-model="formData.totalAmount" @input="!isEditing ? formData.remainingAmount = formData.totalAmount : null" class="md-input">
                      </div>
                   </div>

                   <div class="form-group mt-16">
                      <span class="field-label">Catatan</span>
                      <input type="text" v-model="formData.notes" placeholder="Tujuan pinjaman..." class="md-input">
                   </div>
                   <div class="form-group mt-16">
                      <span class="field-label">Tanggal Mulai</span>
                      <input type="date" v-model="formData.startDate" class="md-input">
                   </div>
                </section>

                <div class="modal-actions-shp mt-24">
                   <button @click="saveDebt" class="filled-btn-lg">
                      <span class="material-symbols-rounded">verified</span>
                      {{ isEditing ? 'SIMPAN PERUBAHAN' : 'TAMBAHKAN CATATAN' }}
                   </button>
                   <button v-if="isEditing" @click="deleteDebt" class="danger-btn-text mt-12">
                      Hapus Catatan Ini
                   </button>
                </div>
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
             <div class="sheet-content">
                <p class="sheet-desc">Mencatat cicilan untuk <strong>{{ activeDebt?.person }}</strong>. Catatan ini akan otomatis masuk ke Riwayat Transaksi.</p>
                
                <section class="form-section-md3">
                   <div class="form-group">
                      <span class="field-label">Jumlah Bayar (Rp) *</span>
                      <input type="number" v-model="payAmount" class="md-input">
                   </div>
                   <div class="form-group mt-16">
                      <span class="field-label">Sumber / Tujuan Rekening</span>
                      <select v-model="payAccount" class="md-input">
                         <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
                      </select>
                   </div>
                </section>

                <button @click="confirmPayment" class="filled-btn-lg mt-24">
                   <span class="material-symbols-rounded">verified_user</span>
                   KONFIRMASI PEMBAYARAN
                </button>
             </div>
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

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.stat-card { padding: 20px; position: relative; overflow: hidden; border: none; }
.piutang-card { background: linear-gradient(135deg, var(--primary), #4facfe); color: white; }
.hutang-card { background: linear-gradient(135deg, var(--red), #f093fb); color: white; }
.card-glow { position: absolute; top: -50%; right: -20%; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; }

.card-header-shp { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-label-shp { font-size: 10px; font-weight: 800; letter-spacing: 1px; opacity: 0.8; }
.icon-shp { width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.card-value-shp { font-size: 18px; font-weight: 800; margin: 0; font-family: 'Outfit', sans-serif; }
.card-sub-shp { font-size: 10px; opacity: 0.7; }

.tabs-capsule { background: var(--bg-secondary); padding: 6px; border-radius: 18px; display: flex; margin-bottom: 24px; border: 1px solid var(--border); }
.tabs-capsule button { flex: 1; border: none; background: transparent; color: var(--on-surface-variant); padding: 10px; border-radius: 14px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px; }
.tabs-capsule button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

.debt-list { display: flex; flex-direction: column; gap: 16px; }
.debt-card { padding: 20px; cursor: pointer; border: 1px solid var(--border); transition: transform 0.2s; }
.debt-card:active { transform: scale(0.98); }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.person-box { display: flex; align-items: center; gap: 12px; }
.avatar-shp { width: 44px; height: 44px; background: var(--surface-variant); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
.person-details { display: flex; flex-direction: column; }
.person-name { font-size: 16px; font-weight: 700; color: var(--on-surface); }
.debt-meta { font-size: 11px; color: var(--on-surface-variant); opacity: 0.7; }

.amount-box { text-align: right; }
.rem-amount { display: block; font-size: 17px; font-weight: 800; color: var(--primary); }
.rem-label { font-size: 9px; font-weight: 800; opacity: 0.5; letter-spacing: 1px; }

.card-middle { margin-bottom: 16px; }
.progress-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.progress-text { color: var(--on-surface); }
.total-text { opacity: 0.5; }
.progress-track-shp { height: 8px; background: var(--surface-variant); border-radius: 4px; overflow: hidden; }
.progress-bar-shp { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }

.card-actions-shp { border-top: 1px dashed var(--border); padding-top: 16px; display: flex; justify-content: flex-end; }
.tonal-btn-sm-shp { height: 36px; padding: 0 16px; border-radius: 12px; background: var(--primary-container); color: var(--on-primary-container); border: none; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; cursor: pointer; }

.debt-modal { background: var(--bg-primary); }
.payment-modal { background: var(--bg-primary); }
.sheet-content { padding-bottom: 40px; }

.form-section-md3 { background-color: var(--bg-secondary); border-radius: 28px; padding: 24px; border: 1px solid var(--border); margin-top: 16px; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: var(--primary); }
.section-header h3 { font-size: 13px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 1px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-row-shp { display: flex; gap: 16px; }
.field-label { font-size: 11px; font-weight: 700; color: var(--primary); margin-left: 4px; opacity: 0.8; margin-bottom: 4px; letter-spacing: 0.5px; }

.modal-actions-shp { display: flex; flex-direction: column; align-items: center; }
.danger-btn-text { background: transparent; border: none; color: var(--red); font-size: 13px; font-weight: 700; cursor: pointer; opacity: 0.7; }

.sheet-desc { font-size: 13px; opacity: 0.7; margin-bottom: 12px; line-height: 1.6; }

.mt-24 { margin-top: 24px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }

@media (max-width: 480px) {
  .form-row-shp { flex-direction: column; }
}

.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
.empty-state .material-symbols-rounded { font-size: 64px; }
</style>
