<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">Accounts</h1>
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
              <input type="text" v-model="searchQuery" placeholder="Search account name, type, or number..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="accounts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; margin-top: 1.5rem;">
      <div v-for="acc in filteredAccounts" :key="acc.accountID" @click="openModal(acc)" class="account-card-premium" :style="{ background: `linear-gradient(135deg, ${acc.cardColor || '#1e293b'}, ${adjustColor(acc.cardColor || '#1e293b', -30)})` }">
         <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div v-if="acc.accountImage" style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden; background: white; padding: 4px;">
               <img :src="acc.accountImage" style="width:100%; height:100%; object-fit: contain;">
            </div>
            <div v-else style="width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
               <i data-lucide="shield-check" style="width: 20px; color: rgba(255,255,255,0.5);"></i>
            </div>
         </div>
         
         <div style="margin-top: 1.5rem;">
            <div style="font-size: 0.65rem; font-weight: 800; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em; color: white;">{{ acc.accountName }}</div>
            <div style="font-size: 1.6rem; font-weight: 900; letter-spacing: -0.02em; color: white; margin: 0.2rem 0;">Rp {{ (acc.currentBalance || 0).toLocaleString('id-ID') }}</div>
            
            <div v-if="acc.cardNumber" style="font-family: 'Courier New', Courier, monospace; font-size: 1rem; letter-spacing: 2.5px; margin-top: 1.25rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
               {{ maskNumber(acc.cardNumber) }}
            </div>
            <div v-else-if="acc.accountNumber" style="font-family: monospace; font-size: 0.8rem; letter-spacing: 2px; margin-top: 1rem; color: white; opacity: 0.6;">
               {{ maskNumber(acc.accountNumber) }}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 1.25rem;">
               <div style="font-size: 0.6rem; color: white; opacity: 0.8; font-weight: 700;">{{ acc.accountType }}</div>
               <div v-if="acc.expiryDate" style="text-align: right; color: white;">
                  <div style="font-size: 0.45rem; opacity: 0.6; text-transform: uppercase; font-weight: 800;">Exp End</div>
                  <div style="font-size: 0.8rem; font-weight: 800; font-family: monospace;">{{ acc.expiryDate }}</div>
               </div>
            </div>
         </div>
      </div>
    </div>

    <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary); z-index: 5;">
            <span style="font-weight: 800; font-size: 1.1rem;">{{ editingAcc.accountID ? 'Update Vault' : 'New Vault' }}</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>
         <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            <div><label class="f-label">Name</label><input type="text" v-model="formData.accountName" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Type</label><select v-model="formData.accountType" class="f-input"><option>Bank</option><option>E-Wallet</option><option>Cash</option><option>Credit Card</option><option>Investment</option></select></div>
               <div><label class="f-label">Currency</label><input type="text" v-model="formData.currency" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Account Number</label><input type="text" v-model="formData.accountNumber" class="f-input"></div>
               <div><label class="f-label">Card Number</label><input type="text" v-model="formData.cardNumber" placeholder="XXXX XXXX XXXX XXXX" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Opening Balance</label><input type="number" v-model.number="formData.openingBalance" class="f-input"></div>
               <div><label class="f-label">Current Balance</label><input type="number" v-model.number="formData.currentBalance" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Card Expiry (MM/YY)</label><input type="text" v-model="formData.expiryDate" placeholder="MM/YY" class="f-input"></div>
               <div><label class="f-label">Card Color</label><input type="color" v-model="formData.cardColor" style="height: 44px; padding: 4px;" class="f-input"></div>
            </div>
            <div><label class="f-label">Logo URL</label><input type="text" v-model="formData.accountImage" placeholder="https://..." class="f-input"></div>
            <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>Active</option><option>Inactive</option></select></div>

            <!-- Intelligence Analysis -->
            <div v-if="editingAcc.accountID" style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 1.25rem; padding: 1.25rem; margin-top: 0.5rem;">
               <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <i data-lucide="line-chart" style="width: 14px; color: var(--accent);"></i>
                  <span style="font-size: 0.7rem; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Intelligence Analysis</span>
               </div>
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Total Protocol Inflow</div>
                     <div style="font-size: 1rem; font-weight: 950; color: #10b981; margin-top: 0.25rem;">Rp {{ accAnalysis.inflow.toLocaleString('id-ID') }}</div>
                  </div>
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Total Protocol Outflow</div>
                     <div style="font-size: 1rem; font-weight: 950; color: #ef4444; margin-top: 0.25rem;">Rp {{ accAnalysis.outflow.toLocaleString('id-ID') }}</div>
                  </div>
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); grid-column: span 2;">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Strategic Net Shift</div>
                     <div style="font-size: 1rem; font-weight: 950; margin-top: 0.25rem;" :style="{ color: accAnalysis.net >= 0 ? '#10b981' : '#ef4444' }">Rp {{ accAnalysis.net.toLocaleString('id-ID') }}</div>
                  </div>
               </div>
            </div>

            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveAcc" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE VAULT
               </button>
               <button v-if="editingAcc.accountID" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingAcc.accountID" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="combine" style="width: 14px;"></i> MERGE
               </button>
               <button v-if="editingAcc.accountID" @click="deleteAcc" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
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
const editingAcc = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const accAnalysis = computed(() => {
  if (!editingAcc.value.accountID) return { inflow: 0, outflow: 0, net: 0 }
  const inTx = store.transactions.filter(t => t.beneficiaryAccount === editingAcc.value.accountName)
  const outTx = store.transactions.filter(t => t.paymentSourceAccount === editingAcc.value.accountName)
  
  const inflow = inTx.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const outflow = outTx.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  return { inflow, outflow, net: inflow - outflow }
})

const filteredAccounts = computed(() => {
  if (!searchQuery.value) return store.accounts
  const q = searchQuery.value.toLowerCase()
  return store.accounts.filter(a => 
    (a.accountName || '').toLowerCase().includes(q) ||
    (a.accountType || '').toLowerCase().includes(q) ||
    (a.accountNumber || '').toLowerCase().includes(q)
  )
})

const openModal = (acc) => {
  if (acc) {
    editingAcc.value = { ...acc }
    formData.value = { 
      ...acc,
      openingBalance: Number(acc.openingBalance) || 0,
      currentBalance: Number(acc.currentBalance) || 0
    }
  } else {
    editingAcc.value = {}
    formData.value = { accountName: '', accountType: 'Bank', currency: 'IDR', openingBalance: 0, currentBalance: 0, cardColor: '#1e293b', status: 'Active', notes: '', accountNumber: '', accountImage: '', cardNumber: '', expiryDate: '' }
  }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const saveAcc = () => {
  if (!formData.value.accountName) return alert('Name required')
  if (editingAcc.value.accountID) store.updateAccount({ ...formData.value })
  else store.addAccount({ ...formData.value })
  isModalOpen.value = false
}

const deleteAcc = () => { if (confirm('Delete this account?')) { store.deleteAccount(editingAcc.value.accountID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.accountID
  editingAcc.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const handleMerge = () => {
  alert('ACCOUNT Merge Engine coming soon.')
}

const maskNumber = (n) => {
  if (!n) return ''
  const s = String(n).replace(/\s/g, '')
  if (s.length < 8) return s
  return s.substring(0, 4) + ' •••• •••• ' + s.substring(s.length - 4)
}

const adjustColor = (hex, percent) => {
  if (!hex || hex[0] !== '#') return hex
  const num = parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1)
}

onMounted(() => { if (window.lucide) window.lucide.createIcons() })
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
