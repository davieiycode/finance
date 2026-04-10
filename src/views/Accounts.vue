<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 2rem; overflow-y: auto; height: 100%; padding-bottom: 6rem; position: relative;">
    <div class="sticky-nav" style="margin-bottom: 1.5rem; position: sticky; top: 0; background: var(--bg-primary, #020617); z-index: 10; padding-top: 1rem;">
      <header class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;">
            <i data-lucide="chevron-left" style="width:24px;"></i>
          </button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0;">Outpost Roster</h1>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button @click="toggleSearch" style="background:none; border:none; color:var(--text-primary); cursor:pointer;">
            <i data-lucide="search" style="width: 18px;"></i>
          </button>
          <button @click="openModal(null)" style="background: var(--accent); border-radius: 50%; width:32px; height:32px; border:none; color: white; display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <i data-lucide="plus" style="width:18px;"></i>
          </button>
        </div>
      </header>

      <div v-show="showSearch" style="position: relative; margin-top: 1rem; animation: slideDown 0.3s ease-out; transform-origin: top;">
        <i data-lucide="search" style="position: absolute; left: 1rem; top: 0.8rem; width: 18px; color: var(--text-secondary);"></i>
        <input type="text" v-model="searchQuery" placeholder="Scan outposts..." style="width: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 0.75rem; padding: 0.75rem 1rem 0.75rem 2.75rem; color: var(--text-primary); outline: none; box-sizing: border-box;">
      </div>
    </div>

    <!-- Account List -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
      <div v-for="acc in filteredAccounts" :key="acc.id" class="bank-card" :style="{ background: `linear-gradient(135deg, ${acc.color || '#1e293b'}, ${acc.color || '#1e293b'}88)` }" @click="openModal(acc)">
           <div class="card-top">
              <div class="card-logo">
                 <img v-if="acc.logo" :src="acc.logo" alt="Bank Logo" style="max-width: 85%; max-height: 85%; object-fit: contain;">
                 <span v-else class="card-logo-placeholder">{{ (acc.name || 'Un').substring(0,2) }}</span>
              </div>
              <div class="card-meta">
                 <div class="card-status-label" :style="{ color: acc.status === 'Active' ? '#10b981' : '#f87171' }">{{ acc.status }}</div>
                 <div class="card-type-label">{{ acc.type }}</div>
              </div>
           </div>
           
           <div class="card-middle">
              <div class="card-number">{{ acc.number || '**** **** **** ****' }}</div>
           </div>
           
           <div class="card-bottom">
              <div class="card-holder">{{ acc.name || 'Unnamed Account' }}</div>
              <div class="card-balance">Rp {{ (acc.netBalance || 0).toLocaleString('id-ID') }}</div>
           </div>
      </div>
      
      <div v-if="filteredAccounts.length === 0" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No accounts found.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()

const showSearch = ref(false)
const searchQuery = ref('')
const activeModalAccount = ref(null)

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
}

const openModal = (acc) => {
  activeModalAccount.value = acc
  // We will build the full modal later. For now, let's keep it simple.
  alert(`Migrating detailed view for ${acc ? acc.name : 'New Account'}... Coming soon!`)
}

const enrichedAccounts = computed(() => {
  const defaultAccounts = [
    { id: 1, name: 'Bank Mandiri', type: 'Savings', balance: 25750800, number: '124-00-****', status: 'Active', color: '#053d71', logo: '' },
    { id: 2, name: 'BCA Private', type: 'Savings', balance: 12400500, number: '802-11-****', status: 'Active', color: '#00479b', logo: '' },
    { id: 3, name: 'Gopay', type: 'E-Wallet', balance: 500000, number: '0812-****', status: 'Frozen', color: '#009dcc', logo: '' }
  ]
  
  const sources = store.accounts.length > 0 ? store.accounts : defaultAccounts

  return sources.map(acc => {
    const accName = (acc.name || 'Unnamed Account').toLowerCase()
    
    // Calculate real-time balance
    const inSum = store.transactions
      .filter(t => (t.accountReceived || '').toLowerCase() === accName)
      .reduce((s, t) => s + (t.total || t.amount || 0), 0)
      
    const outSum = store.transactions
      .filter(t => (t.accountPayment || '').toLowerCase() === accName)
      .reduce((s, t) => s + (t.total || t.amount || 0), 0)
      
    return {
      ...acc,
      netBalance: (acc.balance || 0) + inSum - outSum
    }
  })
})

const filteredAccounts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  let result = enrichedAccounts.value
  
  if (q) {
    result = result.filter(acc => 
      (acc.name || '').toLowerCase().includes(q) || 
      (acc.number || '').toLowerCase().includes(q)
    )
  }
  
  return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
})

onMounted(() => {
  nextTick(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  })
})
</script>

<style scoped>
.bank-card {
  position: relative;
  height: 190px;
  border-radius: 1.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 12px 24px rgba(0,0,0,0.25);
  box-sizing: border-box;
}

.bank-card::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -10%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.bank-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  border-color: rgba(255,255,255,0.4);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 1;
}

.card-logo {
  width: 64px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;
}

.card-logo-placeholder {
  font-weight: 800;
  font-size: 0.85rem;
  color: white;
  letter-spacing: -0.02em;
}

.card-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.card-status-label {
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 30px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.15);
  letter-spacing: 0.05em;
}

.card-type-label {
  font-size: 0.65rem;
  font-weight: 700;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.card-middle {
  z-index: 1;
  margin: 1.5rem 0 auto;
}

.card-number {
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: 0.12em;
  opacity: 0.95;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 1;
}

.card-holder {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-balance {
  font-size: 1.25rem;
  font-weight: 800;
  text-align: right;
}

@keyframes slideDown { 
  from { opacity: 0; transform: scaleY(0); } 
  to { opacity: 1; transform: scaleY(1); } 
}
</style>
