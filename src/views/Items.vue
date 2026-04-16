<template>
  <div class="view-content items-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.back()">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Catalog</h1>
          <div class="app-bar-actions">
            <button class="icon-btn" @click="showSearch = true">
              <span class="material-symbols-rounded">search</span>
            </button>
            <button class="tonal-btn" @click="openModal(null)">
              <span class="material-symbols-rounded">add</span>
              Baru
            </button>
          </div>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Cari aset..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div class="filter-strip">
       <button @click="selectedCategory = ''" :class="{ active: selectedCategory === '' }" class="filter-chip">ALL</button>
       <button v-for="cat in uniqueCategories" :key="cat" @click="selectedCategory = cat" :class="{ active: selectedCategory === cat }" class="filter-chip">
          {{ cat }}
       </button>
    </div>

    <div class="content-scroll">
      <div class="item-grid">
        <div v-for="item in filteredItems" :key="item.itemID" @click="openModal(item)" class="item-card card-md3">
          <div class="item-avatar">
            <img v-if="item.itemImage" :src="item.itemImage" class="avatar-img">
            <span v-else class="initial">{{ (item.itemName || 'I')[0].toUpperCase() }}</span>
          </div>
          <div class="item-info">
            <div class="info-top">
               <span class="item-name">{{ item.itemName }}</span>
               <span class="item-price">{{ item.currency }} {{ (item.amountPerUnit || 0).toLocaleString('id-ID') }}</span>
            </div>
            <span class="item-meta">{{ item.itemCategory || 'General' }} • {{ item.unitScale || 'pcs' }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="material-symbols-rounded">inventory_2</span>
        <p>No inventory signatures detected.</p>
      </div>
    </div>

    <!-- Scanner Layer -->
    <Teleport to="body">
       <div v-if="showScanner" class="scanner-layer">
          <div class="scanner-header">
             <span class="scanner-title">SCALING SKU ARTIFACT</span>
             <button @click="stopScanner" class="icon-btn-plain">
                <span class="material-symbols-rounded">close</span>
             </button>
          </div>
          <div class="scanner-portal">
             <div id="reader" class="qr-target"></div>
             <div class="portal-overlay">
                <div class="focus-box">
                   <div class="corner tl"></div><div class="corner tr"></div>
                   <div class="corner bl"></div><div class="corner br"></div>
                   <div class="laser-line"></div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- FAB Removed -->

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ editingItem.itemID ? (modalMode === 'analysis' ? 'Informasi Barang' : 'Ubah Barang' ) : 'Tambah Barang' }}</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <!-- MODE: ANALYSIS -->
                <div v-if="modalMode === 'analysis' && editingItem.itemID" class="analysis-view">
                   <div class="item-hero">
                      <div class="hero-avatar card-md3">
                         <img v-if="editingItem.itemImage" :src="editingItem.itemImage" class="hero-img">
                         <span v-else class="material-symbols-rounded">package</span>
                      </div>
                      <div class="hero-text">
                         <h2 class="hero-title">{{ editingItem.itemName }}</h2>
                         <span class="hero-meta">{{ editingItem.itemCategory }} • {{ editingItem.SKU || 'NOSKU' }}</span>
                      </div>
                   </div>

                   <div class="analytics-grid">
                      <div class="stat-card card-md3 tonal">
                         <span class="stat-label">HARGA TERAKHIR</span>
                         <span class="stat-value info">Rp {{ (itemAnalysis.lastPrice || 0).toLocaleString('id-ID') }}</span>
                      </div>
                      <div class="stat-card card-md3">
                         <span class="stat-label">TOTAL PENGELUARAN</span>
                         <span class="stat-value error">Rp {{ (itemAnalysis.totalSpend || 0).toLocaleString('id-ID') }}</span>
                      </div>

                      <div v-if="itemAnalysis.bestPrice" class="stat-card card-md3 span-2">
                         <div class="best-value-header">
                            <span class="stat-label success">BEST HISTORICAL VALUE</span>
                            <span class="best-merchant">{{ itemAnalysis.bestMerchant }}</span>
                         </div>
                         <span class="stat-value success">Rp {{ itemAnalysis.bestPrice.toLocaleString('id-ID') }}</span>
                         <p class="best-desc">Secured on {{ itemAnalysis.bestDate }}. Save potential: {{ (((itemAnalysis.lastPrice - itemAnalysis.bestPrice) / itemAnalysis.lastPrice) * 100).toFixed(1) }}%</p>
                      </div>

                      <div class="stat-card card-md3">
                         <span class="stat-label">JUMLAH BELI</span>
                         <span class="stat-value">{{ itemAnalysis.totalQty }} {{ editingItem.unitScale }}</span>
                      </div>
                      <div class="stat-card card-md3">
                         <span class="stat-label">BIAYA RATA-RATA</span>
                         <span class="stat-value">Rp {{ Math.round(itemAnalysis.avgPrice).toLocaleString('id-ID') }}</span>
                      </div>
                   </div>

                   <p v-if="itemAnalysis.insight" class="insight-box">
                      <span class="material-symbols-rounded">bolt</span>
                      {{ itemAnalysis.insight }}
                   </p>

                   <div class="action-grid">
                      <button @click="modalMode = 'edit'" class="tonal-btn-lg">
                         <span class="material-symbols-rounded">edit</span>
                         UBAH
                      </button>
                      <button @click="isModalOpen = false" class="outline-btn-lg">CLOSE</button>
                   </div>
                </div>

                <!-- MODE: EDIT -->
                <div v-else class="edit-view">
                   <div class="form-grid">
                      <div class="form-group full"><label>Nama Barang</label><input type="text" v-model="formData.itemName" class="md-input"></div>
                      <div class="form-group">
                         <label>Kategori</label>
                         <select v-model="formData.itemCategory" class="md-input">
                            <option v-for="c in store.categories" :key="c.categoryID" :value="c.category">{{ c.category }}</option>
                         </select>
                      </div>
                      <div class="form-group">
                         <label>Satuan</label>
                         <select v-model="formData.unitScale" class="md-input">
                            <option v-for="u in store.unitScales" :key="u.unitScale" :value="u.unitScale">{{ u.unitScale }}</option>
                         </select>
                      </div>
                      <div class="form-group"><label>Harga</label><input type="number" v-model.number="formData.amountPerUnit" class="md-input"></div>
                      <div class="form-group"><label>Mata Uang</label><input type="text" v-model="formData.currency" class="md-input"></div>
                      <div class="form-group full">
                         <label>Kode SKU</label>
                         <div class="input-with-action">
                            <input type="text" v-model="formData.SKU" class="md-input" placeholder="Ketik atau pindai...">
                            <button @click="startScanner" class="action-btn-sm">
                               <span class="material-symbols-rounded">scan</span>
                            </button>
                         </div>
                      </div>
                      <div class="form-group"><label>Produsen</label><input type="text" v-model="formData.manufacturer" class="md-input"></div>
                      <div class="form-group"><label>Model</label><input type="text" v-model="formData.model" class="md-input"></div>
                      <div class="form-group full"><label>URL Logo</label><input type="text" v-model="formData.itemImage" class="md-input"></div>
                      <div class="form-group full"><label>Catatan</label><textarea v-model="formData.notes" class="md-textarea"></textarea></div>
                   </div>

                   <div class="modal-actions">
                      <button @click="saveItem" class="filled-btn-lg">
                         <span class="material-symbols-rounded">save</span>
                         SAVE ITEM
                      </button>
                      <div v-if="editingItem.itemID" class="secondary-actions">
                         <button @click="handleDuplicate" class="tonal-btn">Duplikat</button>
                         <button @click="handleMerge" class="tonal-btn">Gabung</button>
                         <button @click="deleteItem" class="error-btn">Hapus</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Merge Overlay -->
    <Teleport to="body">
       <div v-if="isMergePanelOpen" class="modal-backdrop-full" @click.self="isMergePanelOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Target Consolidation</h3>
                <button @click="isMergePanelOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             <div class="sheet-content">
                <div class="search-box card-md3">
                   <span class="material-symbols-rounded">search</span>
                   <input v-model="mergeTargetSearch" type="text" placeholder="Search item catalog...">
                </div>
                <div class="target-list">
                   <div v-for="t in filteredMergeTargets" :key="t.itemID" @click="performMerge(t)" class="target-item card-md3">
                      <div class="target-initial">{{ String(t.itemName)[0] }}</div>
                      <div class="target-text">
                         <span class="target-name">{{ t.itemName }}</span>
                         <span class="target-cat">{{ t.itemCategory }}</span>
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
import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const editingItem = ref({})
const formData = ref({})
const selectedCategory = ref('')
const showSearch = ref(false)
const searchQuery = ref('')
const showScanner = ref(false)
const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
let html5QrCode = null

const itemAnalysis = computed(() => {
  if (!editingItem.value.itemID) return { totalSpend: 0, totalQty: 0, avgPrice: 0, lastPrice: 0, bestPrice: 0, bestMerchant: '', bestDate: '', insight: '' }
  const txs = store.transactions.filter(t => t.itemName === editingItem.value.itemName && t.type === 'Expense')
  if (txs.length === 0) return { totalSpend: 0, totalQty: 0, avgPrice: 0, lastPrice: 0, bestPrice: 0, bestMerchant: '', bestDate: '', insight: 'Belum ada data transaksi tercatat.' }
  const sortedTxs = [...txs].sort((a,b) => b.date.localeCompare(a.date))
  const lastPrice = sortedTxs[0].amountPerUnit || 0
  const totalSpend = txs.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const totalQty = txs.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0)
  const avgPrice = totalQty > 0 ? totalSpend / totalQty : 0
  const best = txs.reduce((min, t) => (t.amountPerUnit < min.amountPerUnit) ? t : min, txs[0])
  return { totalSpend, totalQty, avgPrice, lastPrice, bestPrice: best.amountPerUnit, bestMerchant: best.merchant, bestDate: best.date, insight: lastPrice > avgPrice * 1.1 ? 'Terdeteksi lonjakan harga pasar.' : 'Nilai aset stabil.' }
})

const uniqueCategories = computed(() => [...new Set(store.items.map(i => i.itemCategory).filter(Boolean))].sort())

const filteredItems = computed(() => {
  let list = store.items
  if (selectedCategory.value) list = list.filter(i => i.itemCategory === selectedCategory.value)
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(i => (i.itemName || '').toLowerCase().includes(q))
})

const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.items.filter(i => i.itemID !== editingItem.value.itemID && (i.itemName || '').toLowerCase().includes(q)).slice(0, 10)
})

const openModal = (item) => {
  if (item) { editingItem.value = { ...item }; formData.value = { ...item }; modalMode.value = 'analysis' }
  else { editingItem.value = {}; formData.value = { itemName: '', itemCategory: 'Food & Groceries', unitScale: 'pcs', amountPerUnit: 0, currency: 'IDR', SKU: '', notes: '', itemImage: '' }; modalMode.value = 'edit' }
  isModalOpen.value = true
}

const saveItem = () => {
  if (!formData.value.itemName) return alert('Nama wajib diisi')
  if (editingItem.value.itemID) store.updateItem({ ...formData.value })
  else store.addItem({ ...formData.value })
  isModalOpen.value = false
}

const deleteItem = () => { if (confirm('Hapus catatan ini secara permanen?')) { store.deleteItem(editingItem.value.itemID); isModalOpen.value = false } }
const handleDuplicate = () => { const data = { ...formData.value }; delete data.itemID; editingItem.value = {}; formData.value = data }
const handleMerge = () => isMergePanelOpen.value = true
const performMerge = (target) => {
  if (confirm(`Gabungkan riwayat transaksi dari "${editingItem.value.itemName}" ke "${target.itemName}"?`)) {
    store.mergeEntities('items', editingItem.value.itemName, target.itemName)
    isMergePanelOpen.value = false; isModalOpen.value = false
  }
}

const startScanner = async () => {
  showScanner.value = true
  nextTick(async () => {
    html5QrCode = new window.Html5Qrcode("reader")
    await html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 180 } }, (txt) => { formData.value.SKU = txt; stopScanner() }, () => {})
  })
}

const stopScanner = async () => {
  if (html5QrCode) { await html5QrCode.stop(); html5QrCode = null }
  showScanner.value = false
}

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('items')
  else uiStore.unregisterModal('items')
})

onBeforeUnmount(() => { stopScanner(); uiStore.unregisterModal('items') })
</script>

<style scoped>
.items-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.top-app-bar {
  padding-top: max(env(safe-area-inset-top), 16px);
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}
.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 22px; font-weight: 400; margin: 0; }
.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.search-input-field { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 16px; outline: none; }

.filter-strip { display: flex; gap: 8px; padding: 8px 16px; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid var(--border); }
.filter-chip { height: 32px; padding: 0 16px; border-radius: 16px; border: 1px solid var(--outline); background: transparent; color: var(--on-surface-variant); font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.filter-chip.active { background-color: var(--primary-container); color: var(--on-primary-container); border: none; }

.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 120px 16px; }
.item-grid { display: flex; flex-direction: column; gap: 12px; }
.item-card { display: flex; align-items: center; gap: 16px; padding: 16px; cursor: pointer; }
.item-avatar { width: 48px; height: 48px; border-radius: 12px; background: var(--surface-variant); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-size: 20px; font-weight: 800; color: var(--primary); }

.item-info { flex: 1; display: flex; flex-direction: column; }
.info-top { display: flex; justify-content: space-between; align-items: center; }
.item-name { font-size: 16px; font-weight: 500; }
.item-price { font-size: 14px; font-weight: 700; color: var(--primary); }
.item-meta { font-size: 12px; color: var(--on-surface-variant); }

.fab { position: fixed; bottom: 32px; right: 32px; width: 56px; height: 56px; border-radius: 16px; background-color: var(--primary); color: var(--on-primary); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 1000; cursor: pointer; }

.modal-backdrop-full { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 4000; display: flex; align-items: flex-end; }
.bottom-sheet { width: 100%; background-color: var(--bg-primary); border-radius: 28px 28px 0 0; padding: 8px 16px 32px 16px; max-height: 90vh; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 24px; }

.item-hero { display: flex; align-items: center; gap: 20px; }
.hero-avatar { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: var(--surface-variant); overflow: hidden; }
.hero-img { width: 100%; height: 100%; object-fit: cover; }
.hero-title { font-size: 24px; font-weight: 600; margin: 0; }
.hero-meta { font-size: 13px; color: var(--on-surface-variant); }

.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-card { padding: 16px; display: flex; flex-direction: column; gap: 4px; }
.stat-card.tonal { background-color: var(--primary-container); color: var(--on-primary-container); border: none; }
.stat-card.span-2 { grid-column: span 2; }
.stat-label { font-size: 10px; font-weight: 700; opacity: 0.6; }
.stat-value { font-size: 18px; font-weight: 700; }
.stat-value.info { color: var(--primary); }
.stat-value.error { color: var(--error); }
.stat-value.success { color: var(--green); }

.best-value-header { display: flex; justify-content: space-between; align-items: center; }
.best-merchant { font-size: 11px; font-weight: 700; opacity: 0.5; }
.best-desc { font-size: 11px; opacity: 0.6; margin-top: 8px; }

.insight-box { font-size: 13px; color: var(--on-surface-variant); display: flex; align-items: center; gap: 8px; padding: 16px; background: var(--surface-variant); border-radius: 12px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }
.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.input-with-action { display: flex; gap: 12px; }
.action-btn-sm { width: 48px; height: 48px; border-radius: 12px; border: none; background: var(--primary-container); color: var(--on-primary-container); cursor: pointer; }

.modal-actions { display: flex; flex-direction: column; gap: 16px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; width: 100%; }
.tonal-btn-lg { background-color: var(--primary-container); color: var(--on-primary-container); border: none; border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; }
.outline-btn-lg { background-color: transparent; border: 1px solid var(--outline); color: var(--on-surface); border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.scanner-layer { position: fixed; inset: 0; background: #000; z-index: 5000; display: flex; flex-direction: column; }
.scanner-header { height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #333; }
.scanner-title { font-size: 12px; font-weight: 700; letter-spacing: 2px; }
.icon-btn-plain { background: none; border: none; color: white; cursor: pointer; }
.scanner-portal { flex: 1; position: relative; }
.qr-target { width: 100%; height: 100%; }
.portal-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.focus-box { width: 250px; height: 180px; position: relative; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); }
.laser-line { position: absolute; left: 0; top: 0; width: 100%; height: 2px; background: var(--primary); animation: scanline 2s linear infinite; box-shadow: 0 0 15px var(--primary); }

.search-box { display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px; margin-bottom: 20px; }
.search-box input { flex: 1; background: transparent; border: none; color: white; outline: none; }
.target-list { display: flex; flex-direction: column; gap: 12px; max-height: 300px; overflow-y: auto; }
.target-item { display: flex; align-items: center; gap: 16px; padding: 12px; }
.target-initial { width: 40px; height: 40px; border-radius: 8px; background: var(--primary-container); color: var(--on-primary-container); display: flex; align-items: center; justify-content: center; font-weight: 800; }
.target-text { display: flex; flex-direction: column; }
.target-name { font-size: 14px; font-weight: 600; }
.target-cat { font-size: 11px; opacity: 0.5; }

@keyframes scanline { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
