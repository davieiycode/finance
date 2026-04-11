<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">Merchants</h1>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button @click="showSearch = true" style="background:none; border:none; color:var(--text-primary); cursor:pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="search" style="width: 18px;"></i>
          </button>
          <button @click="openModal(null)" style="background: var(--accent); color: white; border: none; border-radius: 12px; height: 36px; padding: 0 1rem; font-weight: 700; display:flex; align-items:center; gap: 0.4rem; cursor:pointer;">
            <i data-lucide="plus" style="width: 16px;"></i> New
          </button>
        </div>

        <!-- Expanding Search Bar -->
        <div :style="{ width: showSearch ? '100%' : '0px', opacity: showSearch ? 1 : 0, pointerEvents: showSearch ? 'auto' : 'none' }" style="position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: flex-end; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
           <div style="position: relative; width: 100%; height: 36px; display: flex; align-items: center; min-width: 250px;">
              <i data-lucide="search" style="position: absolute; left: 1rem; width: 16px; color: var(--text-secondary);"></i>
              <input type="text" v-model="searchQuery" placeholder="Search merchant name, category, or address..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="merchant-list" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
      <div v-for="m in filteredMerchants" :key="m.merchantID" @click="openModal(m)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; background: rgba(139,92,246,0.1); color: var(--accent); font-weight: 800; font-size: 1.25rem; flex-shrink: 0;">
           {{ (m.merchantName || 'M')[0].toUpperCase() }}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 700; color: white;">{{ m.merchantName }}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">{{ m.category || 'General' }} • {{ m.address || 'No Address' }}</div>
        </div>
        <div style="font-size: 0.7rem; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); color: var(--text-secondary);">{{ m.status }}</div>
      </div>
    </div>

    <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary);">
            <span style="font-weight: 800;">Merchant Detail</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>
         <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div><label class="f-label">Merchant Name</label><input type="text" v-model="formData.merchantName" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Category</label><input type="text" v-model="formData.category" class="f-input"></div>
               <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>Active</option><option>Inactive</option></select></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">

         <!-- MODE: ANALYSIS -->
         <div v-if="modalMode === 'analysis' && editingMerchant.merchantID" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; gap: 1.5rem; align-items: center;">
               <div style="width: 70px; height: 70px; border-radius: 18px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
                  <img v-if="editingMerchant.merchantImage" :src="editingMerchant.merchantImage" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  <i v-else data-lucide="building-2" style="width: 28px; color: var(--accent);"></i>
               </div>
               <div>
                  <div style="font-size: 1.25rem; font-weight: 950; letter-spacing: -0.02em;">{{ editingMerchant.merchantName }}</div>
                  <div style="font-size: 0.75rem; opacity: 0.5; margin-top: 0.2rem;">{{ editingMerchant.website || 'No Digital Identity' }}</div>
               </div>
            </div>

            <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 1.25rem; padding: 1.25rem;">
               <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <i data-lucide="activity" style="width: 14px; color: var(--accent);"></i>
                  <span style="font-size: 0.7rem; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Merchant Economics</span>
               </div>
               <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                  <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Total Flow-Through</div>
                     <div style="font-size: 1.25rem; font-weight: 950; color: #ef4444; margin-top: 0.25rem;">Rp {{ merchantSpend.toLocaleString('id-ID') }}</div>
                  </div>
               </div>
            </div>

            <div v-if="editingMerchant.address" style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 14px; border: 1px solid var(--border);">
               <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">Coordinates</div>
               <div style="font-size: 0.8rem; opacity: 0.8;">{{ editingMerchant.address }}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
               <button @click="modalMode = 'edit'" style="padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 14px; font-weight: 950; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="edit-3" style="width: 14px;"></i> MODIFY MERCHANT
               </button>
               <button @click="isModalOpen = false" style="padding: 1rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 14px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">
                  CLOSE INTEL
               </button>
            </div>
         </div>

         <!-- MODE: EDIT -->
         <div v-else style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            <div><label class="f-label">Merchant Name</label><input type="text" v-model="formData.merchantName" class="f-input"></div>
            <div><label class="f-label">Address</label><textarea v-model="formData.address" class="f-input" style="min-height: 60px;"></textarea></div>
            <div><label class="f-label">Website</label><input type="text" v-model="formData.website" class="f-input" placeholder="https://..."></div>
            <div><label class="f-label">Logo URL</label><input type="text" v-model="formData.merchantImage" class="f-input"></div>
            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveMerchant" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE MERCHANT
               </button>
               <button v-if="editingMerchant.merchantID" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingMerchant.merchantID" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="combine" style="width: 14px;"></i> MERGE
               </button>
               <button v-if="editingMerchant.merchantID" @click="deleteMerchant" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="trash-2" style="width: 14px;"></i> DELETE
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const editingMerchant = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const merchantSpend = computed(() => {
  if (!editingMerchant.value.merchantID) return 0
  return store.transactions
    .filter(t => t.merchant === editingMerchant.value.merchantName)
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0)
})

const filteredMerchants = computed(() => {
  if (!searchQuery.value) return store.merchants
  const q = searchQuery.value.toLowerCase()
  return store.merchants.filter(m => 
    (m.merchantName || '').toLowerCase().includes(q) ||
    (m.category || '').toLowerCase().includes(q) ||
    (m.address || '').toLowerCase().includes(q) ||
    (m.email || '').toLowerCase().includes(q)
  )
})

const openModal = (m) => {
  if (m) { 
    editingMerchant.value = { ...m }
    formData.value = { ...m } 
    modalMode.value = 'analysis'
  }
  else { 
    editingMerchant.value = {}
    formData.value = { merchantName: '', address: '', website: '', notes: '', merchantImage: '' } 
    modalMode.value = 'edit'
  }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const saveMerchant = () => {
  if (!formData.value.merchantName) return alert('Name required')
  if (editingMch.value.merchantID) store.updateMerchant({ ...formData.value })
  else store.addMerchant({ ...formData.value })
  isModalOpen.value = false
}

const deleteMch = () => { if (confirm('Delete this merchant?')) { store.deleteMerchant(editingMch.merchantID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.merchantID
  editingMch.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const handleMerge = () => {
  alert('MERCHANT Merge Engine coming soon.')
}

onMounted(() => { if (window.lucide) window.lucide.createIcons() })
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
