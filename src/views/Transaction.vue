<template>
  <div class="view-content transaction-view">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.push('/')">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>{{ route.query.id ? 'Ubah Catatan' : 'Catatan Baru' }}</h1>
        <div class="app-bar-actions">
          <button class="tonal-btn" @click="saveTransaction">
            <span class="material-symbols-rounded">verified_user</span>
            Simpan
          </button>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <form @submit.prevent="saveTransaction" class="md-form">
        
        <!-- 1. Temporal -->
        <section class="form-section-md3">
           <div class="section-header">
              <span class="material-symbols-rounded">schedule</span>
              <h3>Waktu & Penulis</h3>
           </div>
           
           <div class="form-row">
              <div class="form-group">
                 <span class="field-label">Tanggal</span>
                 <input type="date" v-model="form.date" class="md-input">
              </div>
              <div class="form-group">
                 <span class="field-label">Jam</span>
                 <input type="time" v-model="form.time" class="md-input">
              </div>
           </div>
           
           <div class="form-group mt-12">
              <span class="field-label">Penulis/Pemilik</span>
              <select v-model="form.author" class="md-input">
                 <option v-for="a in store.authors" :key="a.authorID" :value="a.authorName">{{ a.authorName }}</option>
                 <option value="Self">Saya Sendiri</option>
              </select>
           </div>
        </section>

        <!-- 2. Identity -->
        <section class="form-section-md3">
           <div class="section-header">
              <span class="material-symbols-rounded">fingerprint</span>
              <h3>Detail Barang/Toko</h3>
           </div>
           
           <button type="button" @click="startScanner" class="scan-button">
              <span class="material-symbols-rounded">barcode_scanner</span>
              BUKA SCANNER BARCODE
           </button>

           <div class="form-group">
              <span class="field-label">Nama Barang *</span>
              <div class="dropdown-wrapper">
                 <input type="text" v-model="itemSearch" @focus="showItemDropdown = true" @blur="hideDropdown('item')" placeholder="Cari nama barang..." required class="md-input">
                 <div v-if="showItemDropdown && filteredItems.length" class="dropdown-panel">
                    <div v-for="i in filteredItems" :key="i.itemID" @mousedown="selectItem(i)" class="dropdown-item">
                       <span class="item-main">{{ i.itemName }}</span>
                       <span class="item-sub">{{ i.itemCategory }} • {{ i.notes }}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div class="form-row">
              <div class="form-group">
                 <span class="field-label">Toko/Vendor</span>
                 <div class="dropdown-wrapper">
                    <input type="text" v-model="merchantSearch" @focus="showMerchantDropdown = true" @blur="hideDropdown('merchant')" placeholder="Cari toko..." class="md-input">
                    <div v-if="showMerchantDropdown && filteredMerchants.length" class="dropdown-panel">
                       <div v-for="m in filteredMerchants" :key="m.merchantID" @mousedown="selectMerchant(m)" class="dropdown-item">
                          <span class="item-main">{{ m.merchantName }}</span>
                          <span class="item-sub">{{ m.location }}</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div class="form-group">
                 <span class="field-label">Kategori</span>
                 <div class="dropdown-wrapper">
                    <input type="text" v-model="categorySearch" @focus="showCategoryDropdown = true" @blur="hideDropdown('category')" placeholder="Umum" class="md-input">
                    <div v-if="showCategoryDropdown && filteredCategories.length" class="dropdown-panel">
                       <div v-for="c in filteredCategories" :key="c.categoryID" @mousedown="selectCategory(c)" class="dropdown-item">
                          <span class="item-main">{{ c.category }}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div class="form-group mt-12">
              <span class="field-label">Catatan Tambahan</span>
              <textarea v-model="form.description" placeholder="Tambahkan detail atau informasi tambahan jika ada..." class="md-input" style="min-height: 100px;"></textarea>
           </div>
        </section>

        <!-- 3. Essence -->
        <section class="form-section-md3">
           <div class="section-header">
              <span class="material-symbols-rounded">sync_alt</span>
              <h3>Jenis Transaksi</h3>
           </div>
           
           <div class="protocol-switcher">
              <button v-for="t in [['Income', 'Pemasukan'], ['Expense', 'Pengeluaran'], ['Transfer', 'Transfer'], ['Investment', 'Investasi'], ['Savings', 'Tabungan']]" :key="t[0]" type="button" @click="form.type = t[0]" :class="{ active: form.type === t[0] }" class="protocol-chip">
                 {{ t[1] }}
              </button>
           </div>
           
           <div class="form-row mt-16">
              <div v-show="form.type !== 'Income'" class="form-group">
                 <span class="field-label">Dari Rekening *</span>
                 <select v-model="form.paymentSourceAccount" class="md-input">
                    <option value="">Pilih Rekening Sumber...</option>
                    <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
                 </select>
              </div>
              <div v-show="form.type !== 'Expense'" class="form-group">
                 <span class="field-label">Ke Rekening *</span>
                 <select v-model="form.beneficiaryAccount" class="md-input">
                    <option value="">Pilih Rekening Tujuan...</option>
                    <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
                 </select>
              </div>
           </div>

           <div class="receipt-section mt-16">
              <span class="field-label">Foto Nota / Bukti</span>
              <div class="receipt-actions">
                 <select v-model="form.receipt" class="md-input">
                    <option value="">Tidak ada nota tertaut</option>
                    <option v-for="r in store.receipts" :key="r.receiptID" :value="r.receiptID">{{ r.merchant }} - {{ r.date }}</option>
                 </select>
                 <button type="button" @click="$refs.txPhoto.click()" class="icon-btn-outlined">
                    <span class="material-symbols-rounded">photo_camera</span>
                 </button>
                 <input type="file" ref="txPhoto" @change="onTxPhotoChange" accept="image/*" capture="environment" style="display: none;">
              </div>
              
              <div v-if="form.localPhoto" class="receipt-preview">
                 <img :src="form.localPhoto">
                 <button type="button" @click="form.localPhoto = ''" class="remove-evidence">
                    <span class="material-symbols-rounded">close</span>
                 </button>
              </div>
              
              <div v-if="suggestedReceipts.length > 0" class="suggestion-banner">
                 <div class="suggestion-header">
                    <span class="material-symbols-rounded">lightbulb</span>
                    <span>Ada nota yang mungkin cocok</span>
                 </div>
                 <div v-for="sr in suggestedReceipts" :key="sr.receiptID" @click="linkReceipt(sr)" class="suggestion-item">
                    <span>{{ sr.merchant }} • {{ sr.date }}</span>
                    <span class="material-symbols-rounded">link</span>
                 </div>
              </div>

              <button type="button" @click="form.cleared = (form.cleared === 'yes' ? 'no' : 'yes')" class="clearance-toggle" :class="{ verified: form.cleared === 'yes' }">
                 <div class="toggle-info">
                    <span class="toggle-label">Status Cek/Verifikasi</span>
                    <span class="toggle-status">{{ form.cleared === 'yes' ? 'SUDAH DICEK' : 'BELUM DICEK' }}</span>
                 </div>
                 <span class="material-symbols-rounded">{{ form.cleared === 'yes' ? 'check_circle' : 'pending' }}</span>
              </button>
           </div>
        </section>

        <!-- 4. Pricing -->
        <section class="form-section-md3 highlight">
           <div class="section-header">
              <span class="material-symbols-rounded">payments</span>
              <h3>Rincian Harga</h3>
           </div>

           <div class="form-row">
              <div class="form-group">
                 <span class="field-label">Mata Uang</span>
                 <input type="text" v-model="form.currency" class="md-input" placeholder="IDR">
              </div>
              <div v-if="form.currency.toUpperCase() !== 'IDR'" class="form-group">
                 <span class="field-label">Kurs (ke IDR)</span>
                 <input type="number" v-model.number="form.exchangeRate" step="any" class="md-input">
              </div>
           </div>

           <div class="form-row">
              <div class="form-group">
                 <span class="field-label">Jumlah</span>
                 <div class="unit-input-group">
                    <input type="number" v-model.number="form.quantity" step="any" class="md-input">
                    <div class="unit-dropdown">
                       <input type="text" v-model="unitSearch" @focus="showUnitDropdown = true" @blur="hideDropdown('unit')" placeholder="SATUAN" class="unit-search-field">
                       <div v-if="showUnitDropdown && filteredUnits.length" class="dropdown-panel top">
                          <div v-for="u in filteredUnits" :key="u.unitScale" @mousedown="selectUnit(u)" class="dropdown-item">
                             <span class="item-main">{{ u.unitScale }}</span>
                             <span class="item-sub" v-if="u.description">{{ u.description }}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div class="form-group">
                 <span class="field-label">Harga Satuan</span>
                 <input type="number" v-model.number="form.amountPerUnit" step="any" class="md-input large-text">
              </div>
           </div>

           <div class="form-row dashed-top">
              <div class="form-group">
                 <span class="field-label success-text">Diskon/Potongan (-)</span>
                 <input type="number" :value="calculatedDiscount" readonly class="md-input success-bg" style="color: var(--green);">
              </div>
              <div class="form-group">
                 <span class="field-label">Biaya Tambahan (+)</span>
                 <input type="number" v-model.number="form.fee" step="any" class="md-input">
              </div>
           </div>

           <div class="form-row surface-group">
              <div class="form-group">
                 <span class="field-label">Privilege</span>
                 <select v-model="form.membershipID" class="md-select-minimal">
                    <option value="">Tanpa Member</option>
                    <option v-for="m in store.members" :key="m.memberID" :value="m.memberID">{{ m.memberName }}</option>
                 </select>
              </div>
              <div class="form-group border-left">
                 <span class="field-label">Voucher</span>
                 <select v-model="form.voucherID" class="md-select-minimal">
                    <option value="">Tanpa Kupon</option>
                    <option v-for="v in store.vouchers" :key="v.voucherID" :value="v.voucherID" :disabled="v.status === 'Terpakai' || v.status === 'Habis'">
                       {{ v.voucherName }}
                    </option>
                 </select>
              </div>
           </div>

           <div class="final-settlement-card">
              <div class="settlement-label">TOTAL AKHIR</div>
              <div class="settlement-value">
                 <span class="currency-symbol">Rp</span>
                 <span class="amount-integer">{{ calculatedTotal.toLocaleString('id-ID') }}</span>
              </div>
           </div>
        </section>

        <!-- 5. Metadata -->
        <section class="form-section-md3">
           <div class="section-header">
              <span class="material-symbols-rounded">label</span>
              <h3>Label & Proyek</h3>
           </div>
           
           <div class="metadata-group">
              <div class="meta-header">
                 <span class="field-label">Label / Tag</span>
                 <button type="button" @click="handleQuickAdd('tag')" class="text-action">+ Tambah</button>
              </div>
              <div class="chip-grid">
                 <button v-for="t in store.tags" :key="t.tagID" type="button" @click="form.tags = toggleValue(form.tags, t.tagName)" :class="{ active: isSelected(form.tags, t.tagName) }" class="filter-chip">
                    {{ t.tagName }}
                 </button>
              </div>
           </div>

           <div class="metadata-group mt-16">
              <div class="meta-header">
                 <span class="field-label">Proyek / Kegiatan</span>
                 <button type="button" @click="handleQuickAdd('project')" class="text-action">+ Tambah</button>
              </div>
              <div class="chip-grid">
                 <button v-for="p in store.projects" :key="p.projectID" type="button" @click="form.projects = toggleValue(form.projects, p.projectName)" :class="{ active: isSelected(form.projects, p.projectName) }" class="filter-chip">
                    {{ p.projectName }}
                 </button>
              </div>
           </div>
        </section>

        <div class="bottom-actions">
           <button type="submit" class="primary-btn lg full">
              <span class="material-symbols-rounded">verified</span>
              SIMPAN TRANSAKSI
           </button>
        </div>
      </form>
    </div>

    <!-- Scanner Overlay -->
    <Teleport to="body">
      <div v-if="showScanner" class="scanner-overlay">
         <div class="scanner-header">
            <h3>Scan Barcode</h3>
            <button @click="stopScanner" class="icon-btn">
               <span class="material-symbols-rounded">close</span>
            </button>
         </div>
         <div class="scanner-container">
            <div id="txn-reader"></div>
            <div class="scan-frame">
               <div class="corner tl"></div><div class="corner tr"></div>
               <div class="corner bl"></div><div class="corner br"></div>
               <div class="scan-line"></div>
            </div>
         </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const store = useFinanceStore()
const uiStore = useUIStore()

const now = new Date()
const form = ref({
  transactionID: '',
  date: now.toISOString().split('T')[0],
  time: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'),
  category: '',
  merchant: '',
  itemName: '',
  amountPerUnit: 0,
  quantity: 1,
  unitScale: 'pcs',
  type: 'Expense',
  cleared: 'yes',
  paymentSourceAccount: '',
  beneficiaryAccount: '',
  receipt: '',
  membershipID: '',
  voucherID: '',
  localPhoto: '',
  tags: '',
  projects: '',
  author: 'Saya Sendiri',
  discount: 0,
  fee: 0,
  total: 0,
  description: '',
  currency: 'IDR',
  exchangeRate: 1
})

const itemSearch = ref('')
const showItemDropdown = ref(false)
const categorySearch = ref('')
const showCategoryDropdown = ref(false)
const merchantSearch = ref('')
const showMerchantDropdown = ref(false)
const unitSearch = ref('')
const showUnitDropdown = ref(false)

watch(itemSearch, (val) => { 
  if (val !== form.value.itemName) {
    form.value.itemName = val
    onItemChange()
  }
})
watch(categorySearch, (val) => { if (val !== form.value.category) form.value.category = val })
watch(merchantSearch, (val) => { if (val !== form.value.merchant) form.value.merchant = val })
watch(unitSearch, (val) => { if (val !== form.value.unitScale) form.value.unitScale = val })

const hideDropdown = (type) => {
  setTimeout(() => {
    if (type === 'item') showItemDropdown.value = false
    else if (type === 'category') showCategoryDropdown.value = false
    else if (type === 'merchant') showMerchantDropdown.value = false
    else if (type === 'unit') showUnitDropdown.value = false
  }, 200)
}

const filteredItems = computed(() => {
  const q = itemSearch.value.toLowerCase()
  if (!q && !showItemDropdown.value) return []
  return store.items.filter(i => 
    (i.itemName || '').toLowerCase().includes(q) || 
    (i.notes || '').toLowerCase().includes(q) ||
    (i.itemCategory || '').toLowerCase().includes(q)
  ).slice(0, 5)
})

const filteredCategories = computed(() => {
  const q = categorySearch.value.toLowerCase()
  const list = store.categories.filter(c => !form.value.type || c.type === form.value.type)
  if (!q && !showCategoryDropdown.value) return list.slice(0, 5)
  return list.filter(c => (c.category || '').toLowerCase().includes(q)).slice(0, 5)
})

const filteredUnits = computed(() => {
  const q = unitSearch.value.toLowerCase()
  const list = store.unitScales || []
  if (!q && !showUnitDropdown.value) return list.slice(0, 8)
  return list.filter(u => 
    (u.unitScale || '').toLowerCase().includes(q) || 
    (u.description || '').toLowerCase().includes(q)
  ).slice(0, 10)
})

const filteredMerchants = computed(() => {
  const q = merchantSearch.value.toLowerCase()
  if (!q && !showMerchantDropdown.value) return store.merchants.slice(0, 5)
  return store.merchants.filter(m => (m.merchantName || '').toLowerCase().includes(q)).slice(0, 5)
})

const selectItem = (i) => {
  form.value.itemName = i.itemName
  itemSearch.value = i.itemName
  onItemChange()
  showItemDropdown.value = false
}
const selectCategory = (c) => {
  form.value.category = c.category
  categorySearch.value = c.category
  showCategoryDropdown.value = false
}
const selectMerchant = (m) => {
  form.value.merchant = m.merchantName
  merchantSearch.value = m.merchantName
  showMerchantDropdown.value = false
}
const selectUnit = (u) => {
  form.value.unitScale = u.unitScale
  unitSearch.value = u.unitScale
  showUnitDropdown.value = false
}

const showScanner = ref(false)
let html5QrCode = null

const onItemChange = () => {
  const item = store.items.find(i => i.itemName === form.value.itemName)
  if (item) {
    if (item.amountPerUnit) form.value.amountPerUnit = Number(item.amountPerUnit)
    if (item.itemCategory) {
      form.value.category = item.itemCategory
      categorySearch.value = item.itemCategory
    }
    if (item.unitScale) {
       form.value.unitScale = item.unitScale
       unitSearch.value = item.unitScale
    }
    if (item.currency) form.value.currency = item.currency
    if (!form.value.quantity) form.value.quantity = 1
  }
}

const linkReceipt = (r) => {
  form.value.receipt = r.receiptID
  if (r.date) form.value.date = r.date
  if (r.time) form.value.time = String(r.time).includes(':') ? String(r.time).split(':').slice(0, 2).join(':') : String(r.time)
  if (r.merchant) form.value.merchant = r.merchant
  if (r.account) form.value.paymentSourceAccount = r.account
}

const suggestedReceipts = computed(() => {
  if (!form.value.merchant && !form.value.date) return []
  return store.receipts.filter(r => {
    if (form.value.receipt === r.receiptID) return false
    return r.merchant === form.value.merchant || r.date === form.value.date
  }).slice(0, 2)
})

const onTxPhotoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (f) => { form.value.localPhoto = f.target.result }
  reader.readAsDataURL(file)
}

const calculatedDiscount = computed(() => {
  let disc = 0
  const sub = (Number(form.value.quantity) * Number(form.value.amountPerUnit)) || 0
  if (form.value.voucherID) {
     const v = store.vouchers.find(v => v.voucherID === form.value.voucherID)
     if (v) {
        if (v.discountType === 'Percent') disc += (sub * (Number(v.discountValue) / 100))
        else disc += Number(v.discountValue || 0)
        if (!v.isSingleUse && v.balance > 0 && disc > v.balance) disc = v.balance
     }
  }
  if (form.value.membershipID) {
     const m = store.members.find(m => m.memberID === form.value.membershipID)
     if (m && m.membershipDiscount) disc += (sub * (Number(m.membershipDiscount) / 100))
  }
  return disc
})

const calculatedTotal = computed(() => {
  const sub = (Number(form.value.quantity) * Number(form.value.amountPerUnit)) || 0
  return (sub - calculatedDiscount.value + Number(form.value.fee || 0)) * Number(form.value.exchangeRate || 1)
})

const saveTransaction = () => {
  if (!form.value.itemName) return alert("Nama barang wajib diisi.")
  form.value.discount = calculatedDiscount.value
  form.value.total = calculatedTotal.value
  form.value.updateTime = new Date().toISOString()
  if (route.query.id) store.updateTransaction({ ...form.value })
  else {
    const payload = { ...form.value }
    if (route.query.duplicate) {
      delete payload.transactionID
      payload.transactionID = 'TX-' + Date.now()
    }
    store.addTransaction(payload)
  }
  router.push('/')
}

const toggleValue = (current, value) => {
  const arr = current ? String(current).split(',').map(s => s.trim()).filter(Boolean) : []
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
  return arr.join(', ')
}
const isSelected = (current, value) => {
  const arr = current ? String(current).split(',').map(s => s.trim()).filter(Boolean) : []
  return arr.includes(value)
}
const handleQuickAdd = (type) => {
  const name = prompt(`Masukkan nama ${type === 'tag' ? 'label' : 'proyek'} baru:`)
  if (!name) return
  if (type === 'tag') store.addTag({ tagName: name })
  else store.addProject({ projectName: name })
}

const startScanner = async () => {
  showScanner.value = true
  nextTick(async () => {
    try {
      html5QrCode = new window.Html5Qrcode("txn-reader")
      await html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 180 } }, (text) => {
        const item = store.items.find(i => i.SKU === text)
        if (item) {
          form.value.itemName = item.itemName
          itemSearch.value = item.itemName
          onItemChange()
        }
        stopScanner()
      }, () => {})
    } catch (err) { alert("Gagal membuka kamera."); showScanner.value = false }
  })
}
const stopScanner = async () => {
  if (html5QrCode) {
    try { await html5QrCode.stop(); await html5QrCode.clear() } catch (err) {}
    html5QrCode = null
  }
  showScanner.value = false
}

const initForm = () => {
  const txID = route.query.id || route.query.duplicate
  if (txID) {
    const tx = store.transactions.find(t => String(t.transactionID) === String(txID))
    if (tx) {
      let ft = tx.time || ''
      if (ft.includes(':')) ft = ft.includes('1899-12-30') ? ft.split('T')[1]?.substring(0, 5) : ft.split(':').slice(0, 2).join(':')
      let fd = tx.date || ''
      if (fd.includes('T')) fd = fd.split('T')[0]
      form.value = { ...tx, date: fd, time: ft, amountPerUnit: Number(tx.amountPerUnit) || 0, quantity: Number(tx.quantity) || 1, total: Number(tx.total) || 0, discount: Number(tx.discount) || 0, fee: Number(tx.fee) || 0, exchangeRate: Number(tx.exchangeRate) || 1 }
      itemSearch.value = form.value.itemName || ''
      categorySearch.value = form.value.category || ''
      merchantSearch.value = form.value.merchant || ''
      unitSearch.value = form.value.unitScale || ''
      return
    }
  }
  // Default values
}

onMounted(() => { initForm(); uiStore.registerModal('transaction-form') })
onBeforeUnmount(() => { stopScanner(); uiStore.unregisterModal('transaction-form') })
watch(() => route.query, () => initForm(), { deep: true })
</script>

<style scoped>
.transaction-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--on-surface);
  overflow: hidden;
}

/* TOP APP BAR */
.top-app-bar {
  padding: env(safe-area-inset-top) 16px 8px 16px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}
.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 20px; font-weight: 400; font-family: 'Outfit', sans-serif; margin: 0; }

/* CONTENT */
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 120px 16px; }
.md-form { display: flex; flex-direction: column; gap: 24px; max-width: 600px; margin: 0 auto; }

/* SECTIONS */
.form-section-md3 { background-color: var(--bg-secondary); border-radius: 28px; padding: 24px; border: 1px solid var(--border); }
.form-section-md3.highlight { background-color: var(--surface-variant); border: none; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: var(--primary); }
.section-header h3 { font-size: 14px; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 1px; }

/* GROUPS & INPUTS */
.form-group { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.field-label { font-size: 12px; font-weight: 500; color: var(--on-surface-variant); margin-left: 4px; }
.md-input.large-text { font-size: 20px; font-weight: 700; height: 56px; }

/* DROPDOWN */
.dropdown-wrapper { position: relative; }
.dropdown-panel { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 16px; z-index: 200; margin-top: 4px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); max-height: 200px; overflow-y: auto; }
.dropdown-panel.top { top: auto; bottom: 100%; margin-top: 0; margin-bottom: 4px; }
.dropdown-item { padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; flex-direction: column; }
.dropdown-item:last-child { border-bottom: none; }
.item-main { font-weight: 500; }
.item-sub { font-size: 11px; color: var(--on-surface-variant); }

/* SCANNER */
.scan-button { width: 100%; background: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 16px; padding: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; cursor: pointer; }

/* PROTOCOLS */
.protocol-switcher { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
.protocol-chip { background: var(--bg-primary); border: 1px solid var(--border); color: var(--on-surface-variant); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; }
.protocol-chip.active { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }

/* RECEIPT */
.receipt-actions { display: flex; gap: 8px; }
.receipt-preview { margin-top: 16px; position: relative; width: fit-content; }
.receipt-preview img { max-height: 120px; border-radius: 12px; }
.remove-evidence { position: absolute; top: -8px; right: -8px; background: var(--red); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.suggestion-banner { background: rgba(180, 232, 168, 0.1); border-radius: 16px; padding: 12px; margin-top: 16px; }
.suggestion-header { display: flex; align-items: center; gap: 8px; color: var(--green); font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.suggestion-item { display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; }

.clearance-toggle { width: 100%; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 16px; padding: 12px 16px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; color: var(--red); cursor: pointer; }
.clearance-toggle.verified { color: var(--green); }
.toggle-info { display: flex; flex-direction: column; align-items: flex-start; }
.toggle-label { font-size: 10px; font-weight: 600; opacity: 0.7; }
.toggle-status { font-size: 14px; font-weight: 700; }

/* CALCULATION */
.unit-input-group { position: relative; display: flex; }
.unit-dropdown { position: absolute; right: 8px; top: 8px; width: 60px; }
.unit-search-field { width: 100%; background: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 700; text-align: center; outline: none; }

.dashed-top { border-top: 1px dashed var(--border); padding-top: 16px; }
.success-bg { background-color: rgba(180, 232, 168, 0.1) !important; border-color: var(--green) !important; }

.surface-group { background: var(--bg-primary); border-radius: 16px; padding: 12px; border: 1px solid var(--border); }
.md-select-minimal { background: transparent; border: none; color: var(--on-surface); font-weight: 600; width: 100%; outline: none; }
.border-left { border-left: 1px solid var(--border); padding-left: 16px; }

.final-settlement-card { background: linear-gradient(135deg, var(--primary) 0%, #475ad7 100%); border-radius: 24px; padding: 24px; color: var(--on-primary); margin-top: 24px; }
.settlement-label { font-size: 12px; font-weight: 600; opacity: 0.8; letter-spacing: 1px; margin-bottom: 8px; }
.settlement-value { display: flex; align-items: baseline; gap: 8px; }
.currency-symbol { font-size: 20px; font-weight: 400; opacity: 0.7; }
.amount-integer { font-size: 40px; font-weight: 700; }

/* METADATA */
.metadata-group { display: flex; flex-direction: column; gap: 12px; }
.meta-header { display: flex; justify-content: space-between; align-items: center; }
.text-action { background: transparent; border: none; color: var(--primary); font-weight: 600; font-size: 12px; cursor: pointer; }
.chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-chip { background: var(--bg-primary); border: 1px solid var(--border); color: var(--on-surface-variant); padding: 6px 12px; border-radius: 12px; font-size: 12px; cursor: pointer; }
.filter-chip.active { background: var(--primary-container); color: var(--on-primary-container); border-color: var(--primary); }

/* SCANNER OVERLAY */
.scanner-overlay { position: fixed; inset: 0; background: #000; z-index: 5000; display: flex; flex-direction: column; }
.scanner-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; }
.scanner-header h3 { margin: 0; font-weight: 400; }
.scanner-container { flex: 1; position: relative; background: #000; }
#txn-reader { width: 100%; height: 100%; }
.scan-frame { position: absolute; inset: 0; margin: auto; width: 280px; height: 180px; box-shadow: 0 0 0 4000px rgba(0,0,0,0.6); pointer-events: none; }
.corner { position: absolute; width: 40px; height: 40px; border-color: var(--primary); border-style: solid; }
.tl { top: 0; left: 0; border-width: 4px 0 0 4px; border-top-left-radius: 16px; }
.tr { top: 0; right: 0; border-width: 4px 4px 0 0; border-top-right-radius: 16px; }
.bl { bottom: 0; left: 0; border-width: 0 0 4px 4px; border-bottom-left-radius: 16px; }
.br { bottom: 0; right: 0; border-width: 0 4px 4px 0; border-bottom-right-radius: 16px; }
.scan-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; animation: scanMove 2s linear infinite; box-shadow: 0 0 12px var(--primary); }
@keyframes scanMove { from { top: 0; } to { top: 100%; } }

.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.success-text { color: var(--green); }
.full { width: 100%; }
.lg { padding: 16px; border-radius: 20px; }

/* Standard buttons used from global stylesheet */
.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-btn-outlined { width: 48px; height: 48px; border-radius: 16px; border: 1px solid var(--border); background: var(--bg-primary); color: var(--primary); display: flex; align-items: center; justify-content: center; cursor: pointer; }

@media (max-width: 480px) {
  .form-row { flex-direction: column; }
  .border-left { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 16px; }
}
</style>
