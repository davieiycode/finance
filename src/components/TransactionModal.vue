<template>
<Teleport to="body">
  <div v-if="tx" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(10px);">
    <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; position: relative; animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        <button @click="$emit('close')" style="position: absolute; top: 1.25rem; right: 1.25rem; background: rgba(255,255,255,0.05); border: none; color: white; cursor: pointer; width: 32px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center; z-index: 10;">
           <i data-lucide="x" style="width: 18px;"></i>
        </button>
        
        <div style="text-align: center; margin-bottom: 2rem; margin-top: 1rem;">
          <div :style="{ background: getTxColor(tx.type) + '15', color: getTxColor(tx.type) }" style="margin: 0 auto 0.75rem auto; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i :data-lucide="store.resolveIcon(tx.category, tx.type)" style="width: 28px;"></i>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0;">Expedition Summary</h2>
          <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-top: 0.25rem;">ID: {{ tx.transactionID }}</div>
        </div>

         <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
               <div style="font-size: 0.875rem; font-weight: 700; color: white; opacity: 0.9;">{{ tx.itemName }}</div>
            </div>

            <!-- Calculation Breakdown -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; border-bottom: 1px dashed var(--border); padding-bottom: 1.5rem;">
               <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                  <span style="color: var(--text-secondary);">Quantity</span>
                  <span style="font-weight: 700; color: white;">{{ formatQty(tx.quantity) }} {{ tx.unitScale }}</span>
               </div>
               <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                  <span style="color: var(--text-secondary);">Price/Unit</span>
                  <span style="font-weight: 700; color: white;">{{ (tx.amountPerUnit || 0).toLocaleString('id-ID') }}</span>
               </div>
               <div v-if="tx.discount" style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                  <span style="color: var(--success);">Discount (-)</span>
                  <span style="font-weight: 700; color: var(--success);">-{{ (tx.discount || 0).toLocaleString('id-ID') }}</span>
               </div>
               <div v-if="tx.fee" style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                  <span style="color: #ef4444;">Fee (+)</span>
                  <span style="font-weight: 700; color: #ef4444;">+{{ (tx.fee || 0).toLocaleString('id-ID') }}</span>
               </div>
               <div v-if="tx.currency !== 'IDR' || tx.exchangeRate !== 1" style="display: flex; justify-content: space-between; font-size: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); pt: 0.5rem;">
                  <span style="color: var(--text-secondary);">Currency / Rate</span>
                  <span style="font-weight: 700; color: white;">{{ tx.currency }} @ {{ tx.exchangeRate }}</span>
               </div>
            </div>

            <div style="text-align: center;">
               <div style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 0.25rem;">TOTAL AUTHORIZATION</div>
               <div style="font-size: 2.25rem; font-weight: 950; letter-spacing: -0.02em;" :style="{ color: getTxColor(tx.type) }">
                  Rp {{ formatCurrency(tx.total || (tx.amountPerUnit * tx.quantity)) }}
               </div>
            </div>
            
            <div style="margin-top: 1.5rem; border-top: 1px dashed var(--border); padding-top: 1.5rem; text-align: left; display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
               <div>
                 <label style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem;">CATEGORY</label>
                 <div style="font-weight: 700; font-size: 0.8125rem;">{{ tx.category || 'Unclassified' }}</div>
               </div>
               <div>
                 <label style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem;">MERCHANT</label>
                 <div style="font-weight: 700; font-size: 0.8125rem;">{{ tx.merchant || 'Unknown' }}</div>
               </div>
               <div v-if="tx.type !== 'Income'">
                 <label style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem;">SOURCE</label>
                 <div style="font-weight: 700; font-size: 0.8125rem;">{{ tx.paymentSourceAccount || '-' }}</div>
               </div>
               <div v-if="tx.type !== 'Expense'">
                 <label style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem;">BENEFICIARY</label>
                 <div style="font-weight: 700; font-size: 0.8125rem;">{{ tx.beneficiaryAccount || '-' }}</div>
               </div>
                <div style="grid-column: span 2;">
                  <label style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem;">TEMPORAL COORDINATES</label>
                  <div style="font-weight: 700; font-size: 0.8125rem;">{{ displayDate }} • {{ displayTime }}</div>
               </div>
               <div v-if="tx.description" style="grid-column: span 2;">
                 <label style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem;">LOG ENTRY</label>
                 <div style="font-weight: 500; font-size: 0.75rem; line-height: 1.5; color: var(--text-secondary);">{{ tx.description }}</div>
               </div>
            </div>
         </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
           <button @click="editTx" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <i data-lucide="edit-3" style="width: 14px;"></i> EDIT
           </button>
           <button @click="duplicateTx" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <i data-lucide="copy" style="width: 14px;"></i> DUPE
           </button>
           <button @click="mergeTx" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <i data-lucide="combine" style="width: 14px;"></i> MERGE
           </button>
           <button @click="deleteTx" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <i data-lucide="trash-2" style="width: 14px;"></i> DELETE
           </button>
        </div>
        <button @click="$emit('close')" style="width: 100%; margin-top: 1rem; padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">DISMISS</button>
    </div>

    <!-- Merge Selection Panel -->
    <div v-if="isMergePanelOpen" style="position: absolute; inset: 0; background: var(--bg-primary, #000); z-index: 3000; border-radius: 2rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid var(--border);">
       <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 800; font-size: 1rem;">Consolidation Target</span>
          <button @click="isMergePanelOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
       </div>
       <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">Select the mission log that will absorb the financial payload from this entry.</p>
       
       <div style="position: relative;">
          <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 14px; color: var(--text-secondary);"></i>
          <input type="text" v-model="mergeTargetSearch" placeholder="Search logs..." style="width: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; padding: 0.8rem 1rem 0.8rem 2.5rem; color: white; font-size: 0.8rem; outline: none;">
       </div>

       <div style="display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; flex: 1;">
          <div v-for="t in filteredMergeTargets" :key="t.transactionID" @click="performMerge(t)" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 0.8rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: 0.2s;">
             <div style="background: rgba(139, 92, 246, 0.1); color: var(--accent); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="history" style="width: 14px;"></i>
             </div>
             <div>
                <div style="font-weight: 700; font-size: 0.85rem;">{{ t.itemName }}</div>
                <div style="font-size: 0.6rem; opacity: 0.5;">{{ t.date }} • Rp {{ (t.total || 0).toLocaleString('id-ID') }}</div>
             </div>
          </div>
          <div v-if="filteredMergeTargets.length === 0" style="text-align: center; padding: 2rem; opacity: 0.4; font-size: 0.75rem;">No valid logs found in range.</div>
       </div>
       <button @click="isMergePanelOpen = false" style="width: 100%; padding: 0.8rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 12px; font-weight: 700; cursor: pointer;">Cancel Mission</button>
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

const mergeTx = () => {
  isMergePanelOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const performMerge = (target) => {
  if (!confirm(`Relocate financial payload from this log to "${target.itemName}" (${target.date})? This will delete the current log.`)) return
  
  const updatedTarget = { ...target }
  // Logic: either add total or just decommission source.
  // For simplicity, we add the totals if currencies match.
  if (target.currency === props.tx.currency) {
    updatedTarget.total = (Number(updatedTarget.total) || 0) + (Number(props.tx.total) || 0)
    updatedTarget.quantity = (Number(updatedTarget.quantity) || 0) + (Number(props.tx.quantity) || 0)
    updatedTarget.description = (updatedTarget.description || '') + ` (Merged from ID: ${props.tx.transactionID})`
    store.updateTransaction(updatedTarget)
  }
  
  store.deleteTransaction(props.tx.transactionID)
  isMergePanelOpen.value = false
  emit('close')
}

const deleteTx = () => {
  if (confirm('Permanently delete this expedition log?')) {
    store.deleteTransaction(props.tx.transactionID)
    emit('close')
  }
}

const formatCurrency = (val) => {
  if (!val) return '0'
  const s = String(val).replace(/[^0-9.-]+/g,"")
  const num = Number(s)
  return isNaN(num) ? '0' : num.toLocaleString('id-ID')
}

const formatQty = (val) => {
  if (val === undefined || val === null) return '0'
  const num = Number(val)
  if (isNaN(num)) return val
  // Gunakan presisi hingga 8 desimal agar akurat untuk bensin/investasi
  return parseFloat(num.toFixed(8)).toLocaleString('id-ID', { maximumFractionDigits: 8 })
}

const displayDate = computed(() => {
  if (!props.tx.date) return 'Unknown Cycle'
  try {
    const d = new Date(props.tx.date)
    if (isNaN(d.getTime())) return props.tx.date
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
  } catch (e) { return props.tx.date }
})

const displayTime = computed(() => {
  if (!props.tx.time) return '--:--'
  const t = String(props.tx.time)
  if (t.includes('1899-12-30')) {
    const parts = t.split('T')
    if (parts[1]) return parts[1].substring(0, 5)
  }
  return t
})

const getTxColor = (type) => {
  if (type === 'Income') return '#10b981'
  if (type === 'Expense') return '#ef4444'
  return '#3b82f6' // Transfer, Investment, Savings
}

onMounted(() => {
  uiStore.registerModal('transaction-detail')
  if (window.lucide) window.lucide.createIcons()
})

onUnmounted(() => {
  uiStore.unregisterModal('transaction-detail')
})
</script>

<style scoped>
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
