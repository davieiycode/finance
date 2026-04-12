<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">Vouchers</h1>
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
              <input type="text" v-model="searchQuery" placeholder="Search voucher name, provider, or code..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="vouchers-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; margin-top: 1.5rem;">
      <div v-for="v in filteredVouchers" :key="v.voucherID" @click="openModal(v)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.5rem; overflow: hidden; cursor: pointer; transition: 0.2s;">
         <div style="padding: 1.5rem; border-bottom: 1px dashed var(--border); position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
               <div style="font-size: 0.7rem; font-weight: 800; color: var(--accent); text-transform: uppercase;">{{ v.provider }}</div>
               <div style="font-size: 0.65rem; background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 2px 8px; border-radius: 10px; font-weight: 800;">{{ v.status }}</div>
            </div>
            <div style="font-size: 1.125rem; font-weight: 800; line-height: 1.3;">{{ v.voucherName }}</div>
         </div>
         <div style="padding: 1.25rem; background: rgba(255,255,255,0.01); display: flex; justify-content: space-between; align-items: center;">
            <div>
               <div style="font-size: 0.6rem; opacity: 0.5; text-transform: uppercase; font-weight: 700;">Expiry Date</div>
               <div style="font-size: 0.8rem; font-weight: 700;">{{ v.expiryDate || 'N/A' }}</div>
            </div>
            <div style="font-family: monospace; font-weight: 800; color: var(--accent); border: 1px dashed var(--accent); padding: 4px 8px; border-radius: 6px;">
               {{ v.voucherCode }}
            </div>
         </div>
      </div>
    </div>

    <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary); z-index: 5;">
            <span style="font-weight: 800;">{{ editingVoucher.voucherID ? (modalMode === 'analysis' ? 'Voucher Intelligence' : 'Modify Asset') : 'New Asset' }}</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>

         <!-- MODE: ANALYSIS -->
         <div v-if="modalMode === 'analysis' && editingVoucher.voucherID" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 1.5rem; border-radius: 20px; color: white; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); position: relative; overflow: hidden;">
               <div style="position: absolute; right: -20px; top: -20px; opacity: 0.2;"><i data-lucide="ticket" style="width: 120px; height: 120px;"></i></div>
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; position: relative; z-index: 1;">
                  <span style="font-size: 0.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em;">Asset Protocol</span>
                  <div style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 0.6rem; font-weight: 800;">{{ editingVoucher.status }}</div>
               </div>
               <div style="font-size: 1.5rem; font-weight: 950; position: relative; z-index: 1;">{{ editingVoucher.voucherName }}</div>
               <div style="font-family: monospace; font-size: 0.9rem; margin-top: 0.5rem; letter-spacing: 0.1em; position: relative; z-index: 1;">{{ editingVoucher.voucherCode }}</div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 1.25rem; padding: 1.25rem;">
               <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <i data-lucide="bar-chart-3" style="width: 14px; color: #10b981;"></i>
                  <span style="font-size: 0.7rem; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em;">Redemption Analytics</span>
               </div>
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Discount Power</div>
                     <div style="font-size: 1.25rem; font-weight: 950; color: #10b981; margin-top: 0.25rem;">
                        {{ editingVoucher.discountType === 'Percent' ? editingVoucher.discountValue + '%' : 'Rp ' + Number(editingVoucher.discountValue).toLocaleString('id-ID') }}
                     </div>
                  </div>
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Remaining Potency</div>
                     <div style="font-size: 1.25rem; font-weight: 950; margin-top: 0.25rem;">Rp {{ Number(editingVoucher.balance).toLocaleString('id-ID') }}</div>
                  </div>
               </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
               <button @click="modalMode = 'edit'" style="padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 14px; font-weight: 950; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="edit-3" style="width: 14px;"></i> MODIFY ASSET
               </button>
               <button @click="isModalOpen = false" style="padding: 1rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 14px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">
                  CLOSE INTELLIGENCE
               </button>
            </div>
         </div>

         <!-- MODE: EDIT -->
         <div v-else style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            <div><label class="f-label">Voucher Name</label><input type="text" v-model="formData.voucherName" class="f-input"></div>
            <div><label class="f-label">Voucher Code</label><input type="text" v-model="formData.voucherCode" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Discount Type</label><select v-model="formData.discountType" class="f-input"><option>Percent</option><option>Nominal</option></select></div>
               <div><label class="f-label">Discount Value</label><input type="number" v-model.number="formData.discountValue" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Current Balance / Max Discount</label><input type="number" v-model.number="formData.balance" class="f-input"></div>
               <div><label class="f-label">Expiry Date</label><input type="date" v-model="formData.expiryDate" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>Active</option><option>Used</option><option>Expired</option><option>Exhausted</option></select></div>
               <div style="display: flex; align-items: center; gap: 0.5rem; height: 50px;">
                  <input type="checkbox" v-model="formData.isSingleUse" id="chkSingle">
                  <label for="chkSingle" class="f-label" style="margin: 0;">Single Use Only</label>
               </div>
            </div>
            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveVou" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE ASSET
               </button>
               <button v-if="editingVoucher.voucherID" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingVoucher.voucherID" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="combine" style="width: 14px;"></i> MERGE
               </button>
               <button v-if="editingVoucher.voucherID" @click="deleteVou" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
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
const editingVoucher = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const filteredVouchers = computed(() => {
  if (!searchQuery.value) return store.vouchers
  const q = searchQuery.value.toLowerCase()
  return store.vouchers.filter(v => 
    (v.voucherName || '').toLowerCase().includes(q) ||
    (v.provider || '').toLowerCase().includes(q) ||
    (v.voucherCode || '').toLowerCase().includes(q)
  )
})

const openModal = (v) => {
  if (v) { 
    editingVoucher.value = { ...v }
    formData.value = { 
      ...v,
      balance: Number(v.balance) || 0,
      discountValue: Number(v.discountValue) || 0
    } 
    modalMode.value = 'analysis'
  }
  else { 
    editingVoucher.value = {}
    formData.value = { voucherName: '', provider: '', voucherCode: '', discountType: 'Nominal', discountValue: 0, balance: 0, expiryDate: '', status: 'Active', isSingleUse: false, notes: '' } 
    modalMode.value = 'edit'
  }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const saveVou = () => {
  if (!formData.value.voucherName) return alert('Name required')
  if (editingVou.value.voucherID) store.updateVoucher({ ...formData.value })
  else store.addVoucher({ ...formData.value })
  isModalOpen.value = false
}

const deleteVou = () => { if (confirm('Delete this voucher?')) { store.deleteVoucher(editingVou.value.voucherID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.voucherID
  editingVou.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const handleMerge = () => {
  alert('VOUCHER Merge Engine coming soon.')
}

onMounted(() => { if (window.lucide) window.lucide.createIcons() })
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
