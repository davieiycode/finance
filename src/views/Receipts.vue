<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="width: 92%; margin: 0 auto; padding: calc(0.2rem + env(safe-area-inset-top)) 1rem 0.2rem 1rem; border: 1px solid var(--border); border-top: none; border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem; position: sticky; top: 0; background: rgba(15, 15, 25, 0.8); backdrop-filter: blur(20px); z-index: 100; box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative; padding: 0.35rem 0;">
        <div style="display: flex; align-items: center; gap: 0.8rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:20px;"></i></button>
          <h1 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin:0;">Evidence</h1>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button @click="showSearch = true" style="background:none; border:none; color:var(--text-primary); cursor:pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="search" style="width: 18px;"></i>
          </button>
          <button @click="openModal(null)" style="background: var(--accent); color: white; border: none; border-radius: 10px; height: 32px; padding: 0 0.75rem; font-size: 0.75rem; font-weight: 700; display:flex; align-items:center; gap: 0.3rem; cursor:pointer;">
            <i data-lucide="plus" style="width: 14px;"></i> New
          </button>
        </div>

        <!-- Expanding Search Bar -->
        <div :style="{ width: showSearch ? '100%' : '0px', opacity: showSearch ? 1 : 0, pointerEvents: showSearch ? 'auto' : 'none' }" style="position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: flex-end; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
           <div style="position: relative; width: 100%; height: 34px; display: flex; align-items: center; min-width: 250px;">
              <i data-lucide="search" style="position: absolute; left: 1rem; width: 16px; color: var(--text-secondary);"></i>
              <input type="text" v-model="searchQuery" placeholder="Search archive..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 14px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="receipt-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
      <div v-for="r in filteredReceipts" :key="r.receiptID" @click="openModal(r)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1rem; overflow: hidden; cursor: pointer; transition: 0.2s; aspect-ratio: 3/4; display: flex; flex-direction: column;">
         <div style="flex: 1; position: relative; background: #111; overflow: hidden;">
            <img v-if="r['foto/dokumen']" :src="r['foto/dokumen']" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7;">
            <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); opacity: 0.2;">
               <i data-lucide="file-text" style="width: 48px;"></i>
            </div>
            <div style="position: absolute; bottom: 0.5rem; left: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); border-radius: 8px; padding: 0.5rem;">
               <div style="font-size: 0.7rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ r.merchant }}</div>
               <div style="font-size: 0.6rem; opacity: 0.7;">{{ r.date }}</div>
            </div>
         </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary);">
            <span style="font-weight: 800;">Evidence Detail</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>
         <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: rgba(255,255,255,0.02); border: 2px dashed var(--border); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; position: relative;" @click="$refs.fileInput.click()">
               <img v-if="formData['foto/dokumen']" :src="formData['foto/dokumen']" style="max-height: 200px; border-radius: 8px; margin-bottom: 0.5rem;">
               <div v-else style="color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                  <i data-lucide="camera" style="width: 32px;"></i>
                  <span style="font-weight: 700; font-size: 0.75rem;">UPLOAD OR CAPTURE RECEIPT</span>
               </div>
               <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" capture="environment" style="display: none;">
            </div>

            <div><label class="f-label">Merchant *</label><input type="text" v-model="formData.merchant" list="mch-list" class="f-input"></div>
            <div>
               <label class="f-label">Payment Account</label>
               <select v-model="formData.account" class="f-input">
                  <option value="">Select Account...</option>
                  <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
               </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Date</label><input type="date" v-model="formData.date" class="f-input"></div>
               <div><label class="f-label">Time</label><input type="time" v-model="formData.time" class="f-input"></div>
            </div>

            <div v-if="suggestedTransactions.length > 0" style="background: rgba(139, 92, 246, 0.05); border: 1px solid var(--accent); border-radius: 12px; padding: 1rem; margin-top: 0.5rem;">
               <div style="font-size: 0.65rem; font-weight: 800; color: var(--accent); margin-bottom: 0.75rem;">DETECTED SIMILAR TRANSACTIONS</div>
               <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <div v-for="st in suggestedTransactions" :key="st.transactionID" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border);">
                     <div style="font-size: 0.75rem;">
                        <div style="font-weight: 800;">{{ st.itemName }}</div>
                        <div style="opacity: 0.6; font-size: 0.6rem;">{{ st.date }} • {{ (st.total || 0).toLocaleString('id-ID') }}</div>
                     </div>
                     <button @click="linkTransaction(st.transactionID)" style="background: var(--accent); color: white; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; font-weight: 800; font-size: 0.6rem; cursor: pointer;">
                        LINK
                     </button>
                  </div>
               </div>
            </div>

            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveReceipt" style="padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE EVIDENCE
               </button>
               <button v-if="editingReceipt.receiptID" @click="handleDuplicate" style="padding: 1rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingReceipt.receiptID" @click="deleteReceipt" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="trash-2" style="width: 14px;"></i> DELETE
               </button>
            </div>
         </div>
         <datalist id="mch-list">
            <option v-for="m in store.merchants" :key="m.merchantID" :value="m.merchantName" />
         </datalist>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const editingReceipt = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const filteredReceipts = computed(() => {
  if (!searchQuery.value) return store.receipts
  const q = searchQuery.value.toLowerCase()
  return store.receipts.filter(r => 
    (r.merchant || '').toLowerCase().includes(q) ||
    (r.account || '').toLowerCase().includes(q) ||
    (r.notes || '').toLowerCase().includes(q)
  )
})

const openModal = (r) => {
  if (r) { 
    editingReceipt.value = { ...r }
    formData.value = { ...r } 
  }
  else { 
    editingReceipt.value = {}
    formData.value = { merchant: '', account: '', date: '', time: '', notes: '', transactions: '', 'foto/dokumen': '' } 
  }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (f) => { formData.value['foto/dokumen'] = f.target.result }
  reader.readAsDataURL(file)
}

const suggestedTransactions = computed(() => {
  if (!formData.value.merchant && !formData.value.date) return []
  return store.transactions.filter(t => {
     const alreadyLinked = (formData.value.transactions || '').includes(t.transactionID)
     if (alreadyLinked) return false

     const sameMerchant = t.merchant === formData.value.merchant
     const sameDate = t.date === formData.value.date
     const sameAccount = t.paymentSourceAccount === formData.value.account
     
     return (sameMerchant && sameDate) || (sameMerchant && sameAccount)
  }).slice(0, 3)
})

const linkTransaction = (id) => {
  let existing = formData.value.transactions ? formData.value.transactions.split(',').map(s => s.trim()) : []
  if (!existing.includes(id)) {
     existing.push(id)
     formData.value.transactions = existing.join(', ')
  }
}

const saveReceipt = () => {
  if (!formData.value.merchant) return alert('Merchant required')
  if (editingReceipt.value.receiptID) store.updateReceipt({ ...formData.value })
  else store.addReceipt({ ...formData.value })
  isModalOpen.value = false
}

const deleteReceipt = () => { 
  if (confirm('Delete this receipt?')) { 
    store.deleteReceipt(editingReceipt.value.receiptID)
    isModalOpen.value = false 
  } 
}

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.receiptID
  editingReceipt.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

// Visibility & Class Sync
watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('receipts')
  else uiStore.unregisterModal('receipts')
})

// Lifecycle Management
onMounted(() => {
  if (window.lucide) window.lucide.createIcons()
})

onBeforeUnmount(() => {
  uiStore.unregisterModal('receipts')
})

// Icon Re-rendering
watch(isModalOpen, () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
