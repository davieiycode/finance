<template>
  <div ref="scrollContainer" class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 0 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(100px + env(safe-area-inset-bottom)); position: relative;">
    <div class="sticky-nav" style="padding: 1.5rem 0 1rem 0; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg-primary, #000); z-index: 100;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0; white-space: nowrap;">Expedition Logbook</h1>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button @click="showSearch = true" class="back-btn" style="background:none; border:none; color:var(--text-primary); cursor:pointer;">
            <i data-lucide="search" style="width: 18px;"></i>
          </button>
          <button @click="showFilter = !showFilter" class="back-btn" style="border-radius: 12px; height: 36px; padding: 0 0.75rem; width: auto; font-size: 0.75rem; font-weight: 600; display:flex; align-items:center; gap: 0.4rem; background:rgba(255,255,255,0.05); color:white; border:1px solid var(--border); cursor:pointer;">
            <i data-lucide="filter" style="width: 16px;"></i> Filter
          </button>
        </div>

        <!-- Expanding Search Bar -->
        <div :style="{ width: showSearch ? '100%' : '0px', opacity: showSearch ? 1 : 0, pointerEvents: showSearch ? 'auto' : 'none' }" style="position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: flex-end; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
           <div style="position: relative; width: 100%; height: 36px; display: flex; align-items: center; min-width: 250px;">
              <i data-lucide="search" style="position: absolute; left: 1rem; width: 16px; color: var(--text-secondary);"></i>
              <input type="text" v-model="searchQuery" placeholder="Search merchant, item, or category..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div v-show="showFilter" class="filter-panel" style="padding: 1.5rem; background: var(--glass, rgba(30,30,40,0.8)); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 1.5rem; margin-top: 1rem; display: flex; flex-direction: column; gap: 1.25rem; box-shadow: 0 15px 35px rgba(0,0,0,0.3); animation: slideDown 0.3s ease-out; transform-origin: top;">
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
               <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-bottom: 0.5rem; display: block;">From</label>
               <input type="date" v-model="filter.from" class="f-input">
            </div>
            <div>
               <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-bottom: 0.5rem; display: block;">To</label>
               <input type="date" v-model="filter.to" class="f-input">
            </div>
         </div>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
               <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-bottom: 0.5rem; display: block;">Type</label>
               <select v-model="filter.type" class="f-input">
                  <option value="">All Types</option>
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                  <option value="Transfer">Transfer</option>
               </select>
            </div>
            <div>
               <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-bottom: 0.5rem; display: block;">Status</label>
               <select v-model="filter.status" class="f-input">
                  <option value="">All Status</option>
                  <option value="yes">Cleared</option>
                  <option value="no">Uncleared</option>
               </select>
            </div>
         </div>
         <div style="display: flex; gap: 1rem;">
            <button @click="resetFilter" style="flex: 1; padding: 0.75rem; font-weight: 800; border-radius: 1rem; border: 1px solid var(--border); cursor: pointer; background:transparent; color:white;">Reset</button>
            <button @click="applyFilter" style="flex: 2; padding: 0.75rem; font-weight: 800; border-radius: 1rem; background: var(--accent); color: white; border: none; cursor: pointer; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);">Apply</button>
         </div>
    </div>

    <div class="transaction-list" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
       <template v-for="(group, dateRaw) in groupedTransactions" :key="dateRaw">
          <div class="date-group-header" style="font-size: 0.725rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; margin: 2rem 0.5rem 1rem 0.5rem; display: flex; align-items: center; gap: 1rem;">
            <span style="flex-shrink: 0; opacity: 0.6;">{{ group.dateFormatted }}</span>
            <div style="flex: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); opacity: 0.5;"></div>
            <div style="flex-shrink: 0; font-size: 0.75rem; background: rgba(255, 255, 255, 0.03); padding: 2px 10px; border-radius: 20px; border: 1px solid var(--border);" :style="{ color: group.net > 0 ? '#10b981' : (group.net < 0 ? '#ef4444' : '#3b82f6') }">
              {{ group.net > 0 ? '+' : (group.net < 0 ? '-' : '') }}Rp {{ Math.abs(group.net).toLocaleString('id-ID') }}
            </div>
          </div>
          
          <div v-for="t in group.items" :key="t.transactionID" @click="openTx(t)" class="card-hover" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: 1rem; cursor: pointer;">
            <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--border);" :style="{ color: getTxColor(t.type) }">
               <i :data-lucide="store.resolveIcon(t.category, t.type)" style="width: 20px;" stroke-width="1.5"></i>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 0.9375rem; color: var(--text-primary);">{{ t.itemName || t.merchant || 'Unknown Loot' }}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">{{ t.merchant ? t.merchant + ' • ' : '' }}{{ t.category || 'General' }} • {{ formatTime(t.time) }}</div>
            </div>
            <div style="text-align: right; font-weight: 700; font-size: 0.9375rem;" :style="{ color: getTxColor(t.type) }">
              {{ getTxSign(t.type) }}Rp {{ (Number(t.total) || (Number(t.quantity || 0) * Number(t.amountPerUnit || 0)) || 0).toLocaleString('id-ID') }}
            </div>
          </div>
       </template>
       
       <div v-if="Object.keys(groupedTransactions).length === 0" style="text-align:center; padding:4rem; opacity:0.5; font-size:0.875rem;">
         No records found in this sector.
       </div>
    </div>

    <TransactionModal v-if="selectedTx" :tx="selectedTx" @close="selectedTx = null" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'
import TransactionModal from '../components/TransactionModal.vue'

const store = useFinanceStore()
const scrollContainer = ref(null)
const showSearch = ref(false)
const showFilter = ref(false)
const searchQuery = ref('')
const filter = ref({ from: '', to: '', type: '', status: '' })
const selectedTx = ref(null)

const groupedTransactions = computed(() => {
  let list = [...store.transactions]
  const q = searchQuery.value.toLowerCase()
  if (q) {
    list = list.filter(t => 
      (t.itemName || '').toLowerCase().includes(q) || 
      (t.merchant || '').toLowerCase().includes(q) || 
      (t.category || '').toLowerCase().includes(q)
    )
  }
  if (filter.value.from) list = list.filter(t => t.date >= filter.value.from)
  if (filter.value.to) list = list.filter(t => t.date <= filter.value.to)
  if (filter.value.type) list = list.filter(t => t.type === filter.value.type)
  if (filter.value.status) list = list.filter(t => t.cleared === filter.value.status)

  list.sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time))

  const groups = {}
  list.forEach(t => {
    const amount = Number(t.total) || (Number(t.quantity || 0) * Number(t.amountPerUnit || 0)) || 0
    const type = (t.type || '').toLowerCase()
    
    if (!groups[t.date]) {
       // Create human-readable date
       let label = t.date
       try {
         const d = new Date(t.date)
         if (!isNaN(d)) {
           label = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
         }
       } catch (e) {}
       groups[t.date] = { dateFormatted: label, net: 0, items: [] }
    }
    
    if (type === 'income') groups[t.date].net += amount
    else if (type === 'expense' || type === 'savings' || type === 'investment') groups[t.date].net -= amount
    
    groups[t.date].items.push(t)
  })
  return groups
})

const openTx = (t) => { selectedTx.value = t }
const getTxColor = (type) => {
  if (type === 'Income') return '#10b981'
  if (type === 'Expense') return '#ef4444'
  return '#3b82f6' // Transfer, Investment, Savings
}

const formatTime = (time) => {
  if (!time) return '00:00'
  const t = String(time)
  if (t.includes('1899-12-30')) {
    const parts = t.split('T')
    if (parts[1]) return parts[1].substring(0, 5)
  }
  return t.length > 5 ? t.substring(0, 5) : t
}

const getTxSign = (type) => {
  if (type === 'Income') return '+'
  if (type === 'Expense') return '-'
  return ''
}

onMounted(() => { 
  if (scrollContainer.value) scrollContainer.value.scrollTo(0, 0)
  if (window.lucide) window.lucide.createIcons() 
})
</script>

<style scoped>
.f-input { width:100%; padding:0.875rem; background:var(--bg-input); border:1px solid var(--border); border-radius:12px; color:white; outline:none; }
</style>
