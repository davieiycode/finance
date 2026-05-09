<template>
  <div class="view-content shopping-container">
    <!-- Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.push('/')">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <h1>Daftar Belanja</h1>
        <button class="icon-btn" @click="clearList" v-if="store.shoppingList.length > 0">
          <span class="material-symbols-rounded">delete_sweep</span>
        </button>
      </div>
    </div>

    <div class="content-scroll">
      <!-- Add Item Input -->
      <div class="add-item-box card-md3">
        <input type="text" v-model="newItemName" placeholder="Tambah barang..." @keyup.enter="addItem" class="md-input">
        <input type="number" v-model="newItemPrice" placeholder="Rp 0" @keyup.enter="addItem" class="md-input price-input">
        <button @click="addItem" class="icon-btn primary-bg">
          <span class="material-symbols-rounded">add</span>
        </button>
      </div>

      <!-- Summary Info -->
      <div class="shopping-stats" v-if="store.shoppingList.length > 0">
         <div class="stat-item">
            <span class="stat-label">Total Barang</span>
            <span class="stat-val">{{ store.shoppingList.length }}</span>
         </div>
         <div class="stat-item">
            <span class="stat-label">Estimasi Terpilih</span>
            <span class="stat-val primary-text">Rp {{ checkedTotal.toLocaleString('id-ID') }}</span>
         </div>
      </div>

      <!-- List -->
      <div class="shopping-list">
        <div v-for="item in store.shoppingList" :key="item.id" class="shopping-item" :class="{ 'is-checked': item.checked }">
          <label class="item-main">
            <div class="checkbox-wrapper">
               <input type="checkbox" :checked="item.checked" @change="store.toggleShoppingItem(item.id)">
               <span class="checkbox-custom"></span>
            </div>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">Rp {{ (Number(item.price) || 0).toLocaleString('id-ID') }}</span>
            </div>
          </label>
          <button @click="store.deleteShoppingItem(item.id)" class="icon-btn delete-btn">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <div v-if="store.shoppingList.length === 0" class="empty-state">
          <span class="material-symbols-rounded">shopping_cart</span>
          <p>Daftar belanja masih kosong.</p>
          <span class="empty-sub">Rencanakan belanja Anda di sini.</span>
        </div>
      </div>
    </div>

    <!-- Floating Checkout Action -->
    <div v-if="checkedItems.length > 0" class="checkout-bar no-print">
       <div class="checkout-content">
          <div class="checkout-info">
             <span class="checkout-label">{{ checkedItems.length }} barang terpilih</span>
             <span class="checkout-total">Rp {{ checkedTotal.toLocaleString('id-ID') }}</span>
          </div>
          <button @click="checkout" class="primary-btn checkout-btn">
             <span class="material-symbols-rounded">shopping_basket</span>
             Checkout
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

const checkedItems = computed(() => store.shoppingList.filter(i => i.checked))
const checkedTotal = computed(() => checkedItems.value.reduce((sum, i) => sum + (Number(i.price) || 0), 0))

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
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 16px 140px 16px; }

.add-item-box { display: flex; gap: 8px; padding: 12px; margin-bottom: 24px; background: var(--bg-secondary); }
.add-item-box .md-input { background: var(--surface-variant); }
.price-input { width: 100px; }
.primary-bg { background: var(--primary); color: white; border-radius: 12px; }

.shopping-stats { display: flex; justify-content: space-around; margin-bottom: 24px; padding: 16px; background: var(--surface-variant); border-radius: 20px; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; opacity: 0.6; }
.stat-val { font-size: 16px; font-weight: 700; }
.primary-text { color: var(--primary); }

.shopping-list { display: flex; flex-direction: column; gap: 4px; }
.shopping-item { display: flex; align-items: center; padding: 12px 16px; background: var(--bg-secondary); border-radius: 16px; transition: all 0.2s; border: 1px solid transparent; }
.shopping-item.is-checked { opacity: 0.5; background: var(--surface-variant); }
.shopping-item.is-checked .item-name { text-decoration: line-through; }

.item-main { flex: 1; display: flex; align-items: center; gap: 16px; cursor: pointer; }
.item-info { display: flex; flex-direction: column; }
.item-name { font-size: 15px; font-weight: 600; }
.item-price { font-size: 12px; opacity: 0.6; }

/* Custom Checkbox */
.checkbox-wrapper { position: relative; width: 24px; height: 24px; }
.checkbox-wrapper input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkbox-custom { position: absolute; top: 0; left: 0; height: 24px; width: 24px; background-color: var(--surface-variant); border-radius: 6px; border: 2px solid var(--border); transition: all 0.2s; }
.checkbox-wrapper input:checked ~ .checkbox-custom { background-color: var(--primary); border-color: var(--primary); }
.checkbox-custom:after { content: ""; position: absolute; display: none; left: 8px; top: 3px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.checkbox-wrapper input:checked ~ .checkbox-custom:after { display: block; }

.delete-btn { color: var(--red); opacity: 0.4; }
.delete-btn:hover { opacity: 1; }

.empty-sub { font-size: 12px; opacity: 0.5; margin-top: 4px; }

.checkout-bar { position: fixed; bottom: 84px; left: 16px; right: 16px; z-index: 1000; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.checkout-content { background: var(--primary-container); border-radius: 24px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid var(--primary); }
.checkout-info { display: flex; flex-direction: column; }
.checkout-label { font-size: 11px; font-weight: 700; color: var(--on-primary-container); opacity: 0.7; }
.checkout-total { font-size: 18px; font-weight: 700; color: var(--on-primary-container); }
.checkout-btn { height: 48px; padding: 0 24px; border-radius: 16px; gap: 8px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

@keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
