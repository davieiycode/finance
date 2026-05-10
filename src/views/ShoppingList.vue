<template>
  <div class="view-content shopping-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.back()">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>Belanja</h1>
        <div class="app-bar-actions">
          <button v-if="store.shoppingList.length > 0" class="icon-btn" @click="clearList">
            <span class="material-symbols-rounded">delete_sweep</span>
          </button>
          <button class="tonal-btn" @click="addItemPrompt">
             <span class="material-symbols-rounded">add</span>
             Baru
          </button>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Stats Banner -->
      <div class="shopping-stats card-md3" v-if="store.shoppingList.length > 0">
         <div class="stat-main">
            <span class="stat-label">ESTIMASI TOTAL</span>
            <h2 class="stat-value">Rp {{ checkedTotal.toLocaleString('id-ID') }}</h2>
            <span class="stat-sub">{{ checkedItems.length }} dari {{ store.shoppingList.length }} barang terpilih</span>
         </div>
         <div class="stat-icon-box">
            <span class="material-symbols-rounded">shopping_cart_checkout</span>
         </div>
      </div>



      <!-- List -->
      <div class="shopping-list">
        <div v-for="item in store.shoppingList" :key="item.id" class="shopping-card card-md3" :class="{ 'is-checked': item.checked }">
          <label class="card-inner">
            <div class="check-container">
               <input type="checkbox" :checked="item.checked" @change="store.toggleShoppingItem(item.id)">
               <div class="check-mark">
                  <span class="material-symbols-rounded">check</span>
               </div>
            </div>
            <div class="item-details">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">Rp {{ (Number(item.price) || 0).toLocaleString('id-ID') }}</span>
            </div>
          </label>
          <button @click="store.deleteShoppingItem(item.id)" class="icon-btn-sm delete-action">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>

        <div v-if="store.shoppingList.length === 0" class="empty-state">
          <span class="material-symbols-rounded">shopping_cart</span>
          <p>Daftar belanja masih kosong.</p>
          <span class="empty-sub">Rencanakan belanja Anda di sini.</span>
        </div>
      </div>
    </div>

    <!-- Floating Action Modal (Add) -->
    <Teleport to="body">
       <div v-if="showAddModal" class="modal-backdrop-full" @click.self="showAddModal = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">Tambah Barang Belanja</h3>
                <button @click="showAddModal = false" class="icon-btn">
                   <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             <div class="sheet-content">
                <div class="form-grid-shp">
                   <div class="form-group-shp"><label>Nama Barang</label><input type="text" v-model="newItemName" placeholder="Contoh: Susu, Beras..." class="md-input-shp" autofocus></div>
                   <div class="form-group-shp"><label>Estimasi Harga (Rp)</label><input type="number" v-model="newItemPrice" placeholder="0" class="md-input-shp"></div>
                </div>
                <button @click="addItem" class="filled-btn mt-24">TAMBAHKAN KE DAFTAR</button>
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Floating Checkout Action -->
    <div v-if="checkedItems.length > 0" class="checkout-bar no-print">
       <div class="checkout-content">
          <div class="checkout-info">
             <span class="checkout-label">{{ checkedItems.length }} BARANG TERPILIH</span>
             <span class="checkout-total">Rp {{ checkedTotal.toLocaleString('id-ID') }}</span>
          </div>
          <button @click="checkout" class="filled-btn checkout-btn">
             <span class="material-symbols-rounded">shopping_basket</span>
             CHECKOUT
          </button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()
const newItemName = ref('')
const newItemPrice = ref('')
const showAddModal = ref(false)

const checkedItems = computed(() => store.shoppingList.filter(i => i.checked))
const checkedTotal = computed(() => checkedItems.value.reduce((sum, i) => sum + (Number(i.price) || 0), 0))

const addItemPrompt = () => {
  showAddModal.value = true
}

const addItem = () => {
  if (!newItemName.value.trim()) return
  store.addShoppingItem({
    id: 'SHP-' + Date.now(),
    name: newItemName.value,
    price: newItemPrice.value || 0,
    checked: false
  })
  newItemName.value = ''
  newItemPrice.value = ''
  showAddModal.value = false
}

const clearList = () => {
  if (confirm('Kosongkan seluruh daftar belanja?')) {
    store.shoppingList = []
    store.saveAll()
  }
}

const checkout = () => {
  if (!confirm(`Konfirmasi checkout ${checkedItems.value.length} barang? Ini akan membuat satu catatan transaksi pengeluaran.`)) return
  
  const itemsText = checkedItems.value.map(i => `${i.name} (Rp ${Number(i.price).toLocaleString('id-ID')})`).join(', ')
  
  // Create Transaction
  const tx = {
    transactionID: 'TX-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    itemName: 'Belanja: ' + (checkedItems.value.length > 1 ? `${checkedItems.value[0].name} +${checkedItems.value.length - 1} lainnya` : checkedItems.value[0].name),
    type: 'Expense',
    category: 'Belanja',
    merchant: 'Multi-Store',
    total: checkedTotal.value,
    cleared: 'yes',
    paymentSourceAccount: store.accounts[0]?.accountName || 'Cash',
    beneficiaryAccount: '',
    description: 'Daftar: ' + itemsText,
    currency: 'IDR',
    exchangeRate: 1
  }
  
  store.transactions.push(tx)
  store.clearCheckedItems()
  store.saveAll()
  
  store.notify('Belanja berhasil dicatatkan!', 'success')
  router.push('/history')
}
</script>

<style scoped>
.shopping-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 160px 16px; }

.shopping-stats { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 24px; 
  margin-bottom: 24px; 
  background: linear-gradient(135deg, var(--primary-container), var(--bg-secondary));
  border: none;
}
.stat-label { font-size: 11px; font-weight: 700; color: var(--primary); opacity: 0.8; letter-spacing: 1px; }
.stat-value { font-size: 24px; font-weight: 700; margin: 4px 0; font-family: 'Outfit', sans-serif; }
.stat-sub { font-size: 11px; opacity: 0.6; }
.stat-icon-box { width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; }

.shopping-list { display: flex; flex-direction: column; gap: 12px; }
.shopping-card { 
  display: flex; 
  align-items: center; 
  padding: 16px; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
}
.shopping-card.is-checked { 
  opacity: 0.6; 
  background-color: var(--surface-variant); 
  transform: scale(0.98);
}
.shopping-card.is-checked .item-name { text-decoration: line-through; opacity: 0.5; }

.card-inner { flex: 1; display: flex; align-items: center; gap: 16px; cursor: pointer; }
.check-container { position: relative; width: 28px; height: 28px; }
.check-container input { position: absolute; opacity: 0; cursor: pointer; }
.check-mark { 
  position: absolute; inset: 0; 
  background: var(--surface-variant); 
  border-radius: 8px; 
  border: 2px solid var(--outline); 
  display: flex; align-items: center; justify-content: center; 
  transition: all 0.2s;
}
.check-mark .material-symbols-rounded { font-size: 18px; color: white; opacity: 0; transform: scale(0.5); transition: all 0.2s; }
.check-container input:checked ~ .check-mark { background: var(--primary); border-color: var(--primary); }
.check-container input:checked ~ .check-mark .material-symbols-rounded { opacity: 1; transform: scale(1); }

.item-details { display: flex; flex-direction: column; }
.item-name { font-size: 16px; font-weight: 600; color: var(--on-surface); }
.item-price { font-size: 13px; font-weight: 700; color: var(--primary); opacity: 0.8; }

.delete-action { color: var(--error); opacity: 0.2; transition: opacity 0.2s; }
.shopping-card:hover .delete-action { opacity: 1; }

.checkout-bar { position: fixed; bottom: 84px; left: 16px; right: 16px; z-index: 1000; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.checkout-content { background: var(--primary-container); border-radius: 24px; padding: 12px 16px 12px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 12px 32px rgba(0,0,0,0.3); border: 1px solid var(--primary); }
.checkout-info { display: flex; flex-direction: column; }
.checkout-label { font-size: 10px; font-weight: 800; color: var(--primary); letter-spacing: 1px; }
.checkout-total { font-size: 20px; font-weight: 800; color: var(--on-primary-container); font-family: 'Outfit', sans-serif; }
.checkout-btn { height: 52px; padding: 0 24px; border-radius: 18px; gap: 8px; font-weight: 800; }

.form-grid-shp { display: flex; flex-direction: column; gap: 16px; }
.form-group-shp { display: flex; flex-direction: column; gap: 6px; }
.form-group-shp label { font-size: 12px; font-weight: 700; color: var(--primary); }
.md-input-shp { background: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 52px; padding: 0 16px; color: var(--on-surface); font-size: 15px; outline: none; }

.mt-24 { margin-top: 24px; }
@keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.3; }
.empty-state .material-symbols-rounded { font-size: 64px; }
</style>
