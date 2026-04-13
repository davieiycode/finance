<template>
  <div ref="scrollContainer" class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 0 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(100px + env(safe-area-inset-bottom)); position: relative;">
    <div class="sticky-nav" style="padding: 1.5rem 0 1rem 0; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg-primary, #000); z-index: 100;">
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

    <div class="accounts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
      <div v-for="acc in filteredAccounts" :key="acc.accountID" @click="openModal(acc)" class="account-card-premium card-hover" :style="{ background: `linear-gradient(135deg, ${acc.cardColor || '#1e293b'}, ${adjustColor(acc.cardColor || '#1e293b', -30)})` }">
         <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div v-if="acc.accountImage" style="width: 44px; height: 44px; border-radius: 10px; overflow: hidden; background: white; padding: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
               <img :src="acc.accountImage" style="width:100%; height:100%; object-fit: contain;">
            </div>
            <div v-else style="width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
               <i data-lucide="shield-check" style="width: 22px; color: white;"></i>
            </div>
            <div v-if="acc.accountType === 'Credit Card'" style="font-size: 0.5rem; background: rgba(255,255,255,0.1); padding: 0.25rem 0.5rem; border-radius: 4px; color: white; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">PREMIUM</div>
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

    <Teleport to="body">
      <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out; padding-bottom: 5rem;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary); z-index: 5;">
            <span style="font-weight: 800; font-size: 1.1rem;">{{ editingAcc.accountID ? (accountMode === 'analysis' ? 'Vault Intelligence' : 'Modify Vault') : 'New Vault' }}</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>

         <!-- MODE: ANALYSIS -->
         <div v-if="accountMode === 'analysis' && editingAcc.accountID" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Premium Card Preview -->
            <div class="account-card-premium" :style="{ background: `linear-gradient(135deg, ${editingAcc.cardColor || '#1e293b'}, ${adjustColor(editingAcc.cardColor || '#1e293b', -30)})`, margin: '0 auto', width: '100%', transform: 'scale(0.95)' }">
               <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div v-if="editingAcc.accountImage" style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden; background: white; padding: 2px;">
                     <img :src="editingAcc.accountImage" style="width:100%; height:100%; object-fit: contain;">
                  </div>
                  <i v-else data-lucide="shield-check" style="width: 20px; color: rgba(255,255,255,0.5);"></i>
               </div>
               <div style="margin-top: 1rem;">
                  <div style="font-size: 0.5rem; font-weight: 800; opacity: 0.6; text-transform: uppercase;">{{ editingAcc.accountName }}</div>
                  <div style="font-size: 1.4rem; font-weight: 950;">Rp {{ (editingAcc.currentBalance || 0).toLocaleString('id-ID') }}</div>
                  <div style="font-family: monospace; font-size: 0.7rem; margin-top: 1rem; opacity: 0.5;">{{ maskNumber(editingAcc.accountNumber || editingAcc.cardNumber) }}</div>
               </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">
                  <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase;">Protocol Inflow</div>
                  <div style="font-size: 1rem; font-weight: 900; color: #10b981; margin-top: 0.2rem;">Rp {{ (accAnalysis.inflow || 0).toLocaleString('id-ID') }}</div>
               </div>
               <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">
                  <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase;">Protocol Outflow</div>
                  <div style="font-size: 1rem; font-weight: 900; color: #ef4444; margin-top: 0.2rem;">Rp {{ (accAnalysis.outflow || 0).toLocaleString('id-ID') }}</div>
               </div>
            </div>

            <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid var(--accent); border-radius: 1.25rem; padding: 1.25rem;">
               <div style="font-size: 0.6rem; color: var(--accent); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Strategic Summary</div>
               <div style="font-size: 1.1rem; font-weight: 900;">Rp {{ (accAnalysis.net || 0).toLocaleString('id-ID') }} <span style="font-size: 0.6rem; opacity: 0.5; font-weight: 400;">Net Drift</span></div>
               <div v-if="accAnalysis.insight" style="font-size: 0.75rem; margin-top: 0.75rem; line-height: 1.5; color: var(--text-secondary); border-top: 1px solid rgba(139, 92, 246, 0.2); padding-top: 0.75rem;">
                  <i data-lucide="zap" style="width: 12px; display: inline-block; margin-right: 4px; color: var(--accent);"></i>
                  {{ accAnalysis.insight }}
               </div>
            </div>

            <!-- Flow Visualizer Chart -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem;">
                <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase; margin-bottom: 1rem;">Vault Inflow/Outflow Correlation</div>
                <div id="acc-flow-chart" style="width: 100%; height: 200px;"></div>
            </div>

            <!-- Related Logbook Entries -->
            <div style="margin-top: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase;">Recent Protocol Entries</div>
                    <div style="font-size: 0.5rem; opacity: 0.4;">Showing last 5 items</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div v-for="t in accAnalysis.recentTransactions" :key="t.transactionID" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 0.75rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; items-center; gap: 0.75rem;">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
                                <i :data-lucide="t.type === 'Income' ? 'trending-up' : 'trending-down'" :style="{ color: t.type === 'Income' ? '#10b981' : '#ef4444' }" style="width: 14px;"></i>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; font-weight: 700;">{{ t.merchant || t.itemName }}</div>
                                <div style="font-size: 0.55rem; opacity: 0.4;">{{ t.date }} • {{ t.category }}</div>
                            </div>
                        </div>
                        <div :style="{ color: t.type === 'Income' ? '#10b981' : '#ef4444' }" style="font-weight: 800; font-size: 0.8rem;">
                            {{ t.type === 'Income' ? '+' : '-' }} {{ (t.total || 0).toLocaleString('id-ID') }}
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
               <button @click="accountMode = 'edit'" style="padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 14px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em;">
                  <i data-lucide="edit-3" style="width: 14px;"></i> MODIFY PROTOCOL
               </button>
               <button @click="isModalOpen = false" style="padding: 1rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 14px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">
                  RETURN TO LIST
               </button>
            </div>
         </div>

         <!-- MODE: EDIT -->
         <div v-else style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            <div><label class="f-label">Name</label><input type="text" v-model="formData.accountName" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Type</label><select v-model="formData.accountType" class="f-input"><option>Bank</option><option>E-Wallet</option><option>Cash</option><option>Credit Card</option><option>Investment</option></select></div>
               <div><label class="f-label">Currency</label><input type="text" v-model="formData.currency" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Account Number</label><input type="text" v-model="formData.accountNumber" placeholder="Bank account" class="f-input"></div>
               <div><label class="f-label">Card Number</label><input type="text" v-model="formData.cardNumber" placeholder="xxxx xxxx xxxx" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Opening Balance</label><input type="number" v-model.number="formData.openingBalance" class="f-input"></div>
               <div><label class="f-label">Expiry Date (MM/YY)</label><input type="text" v-model="formData.expiryDate" placeholder="12/29" class="f-input"></div>
            </div>
            <div><label class="f-label">Current Balance (Live State)</label><input type="number" v-model.number="formData.currentBalance" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Card Color</label><input type="color" v-model="formData.cardColor" style="height: 44px; padding: 4px;" class="f-input"></div>
               <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>Active</option><option>Inactive</option></select></div>
            </div>
            <div><label class="f-label">Logo URL</label><input type="text" v-model="formData.accountImage" placeholder="https://..." class="f-input"></div>
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
    </Teleport>

    <!-- Merge Selection Panel -->
    <Teleport to="body">
       <div v-if="isMergePanelOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(20px);">
       <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 440px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; animation: slideUp 0.3s ease-out;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
             <span style="font-weight: 800; font-size: 1rem;">Vault Consolidation</span>
             <button @click="isMergePanelOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">Select the vault that will absorb all logs and historical data from <b>{{ editingAcc.accountName }}</b>.</p>
          
          <div style="position: relative;">
             <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 14px; color: var(--text-secondary);"></i>
             <input type="text" v-model="mergeTargetSearch" placeholder="Search vaults..." class="f-input" style="padding-left: 2.5rem; height: 44px; font-size: 0.8rem;">
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 300px; overflow-y: auto; padding-right: 0.5rem;">
             <div v-for="t in filteredMergeTargets" :key="t.accountID" @click="performMerge(t)" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 0.8rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: 0.2s;">
                <div :style="{ background: t.cardColor || '#8b5cf6', color: 'white' }" style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900;">
                   {{ t.accountName.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                   <div style="font-weight: 700; font-size: 0.85rem;">{{ t.accountName }}</div>
                   <div style="font-size: 0.6rem; opacity: 0.5;">{{ t.accountType }} • {{ t.currency }}</div>
                </div>
             </div>
             <div v-if="filteredMergeTargets.length === 0" style="text-align: center; padding: 2rem; opacity: 0.4; font-size: 0.75rem;">No valid vaults found.</div>
          </div>
          <button @click="isMergePanelOpen = false" style="width: 100%; padding: 0.8rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 12px; font-weight: 700; cursor: pointer;">Cancel Mission</button>
       </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const scrollContainer = ref(null)
const isModalOpen = ref(false)
const accountMode = ref('analysis') // 'analysis' or 'edit'
const editingAcc = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const accAnalysis = computed(() => {
  if (!editingAcc.value.accountID) return { inflow: 0, outflow: 0, net: 0, recentTransactions: [], insight: '' }
  const name = editingAcc.value.accountName
  const inTx = store.transactions.filter(t => t.beneficiaryAccount === name)
  const outTx = store.transactions.filter(t => t.paymentSourceAccount === name)
  
  const inflow = inTx.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const outflow = outTx.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  
  // Recent transactions (last 5)
  const allRelated = [...inTx, ...outTx].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  // Insight Logic
  let insight = ''
  if (outflow > inflow * 2 && inflow > 0) insight = 'Critical alert: Outflow exceeds inflow by 100%. Protocol recalibration recommended.'
  else if (inflow > outflow && outflow > 0) insight = 'Optimal resonance: Inflow is outpacing consumption. Core strength increasing.'
  else if (allRelated.length > 3) {
      const topCat = allRelated.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc }, {})
      const favorite = Object.keys(topCat).reduce((a, b) => topCat[a] > topCat[b] ? a : b)
      insight = `Frequent mission vector identified: "${favorite}". Monitor consumption patterns.`
  } else {
      insight = 'Insufficient mission local logs to generate predictive intelligence.'
  }

  return { inflow, outflow, net: inflow - outflow, recentTransactions: allRelated, insight }
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
      currentBalance: Number(acc.currentBalance) || 0,
      cardNumber: acc.cardNumber || '',
      expiryDate: acc.expiryDate || ''
    }
    accountMode.value = 'analysis'
  } else {
    editingAcc.value = {}
    formData.value = { accountName: '', accountType: 'Bank', currency: 'IDR', openingBalance: 0, currentBalance: 0, cardColor: '#1e293b', status: 'Active', notes: '', accountNumber: '', cardNumber: '', expiryDate: '', accountImage: '' }
    accountMode.value = 'edit'
  }
  isModalOpen.value = true
  nextTick(() => { 
    if (window.lucide) window.lucide.createIcons()
    if (accountMode.value === 'analysis') initAnalysisChart()
  })
}

let flowChart = null
const initAnalysisChart = () => {
    const chartDom = document.getElementById('acc-flow-chart')
    if (!chartDom) return
    if (flowChart) flowChart.dispose()
    flowChart = window.echarts.init(chartDom)
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#fff' } },
        grid: { top: '10%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['Inflow', 'Outflow'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { show: false } },
        series: [
            {
                data: [
                    { value: accAnalysis.value.inflow, itemStyle: { color: '#10b981', borderRadius: [8, 8, 0, 0] } },
                    { value: accAnalysis.value.outflow, itemStyle: { color: '#ef4444', borderRadius: [8, 8, 0, 0] } }
                ],
                type: 'bar',
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params) => 'Rp ' + (params.value / 1000).toFixed(0) + 'k',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 10,
                    fontWeight: 'bold'
                }
            }
        ]
    }
    flowChart.setOption(option)
}

watch(accountMode, (newVal) => {
    if (newVal === 'analysis') {
        nextTick(() => initAnalysisChart())
    }
})

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

const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.accounts.filter(a => 
    a.accountID !== editingAcc.value.accountID &&
    (a.accountName || '').toLowerCase().includes(q)
  )
})

const handleMerge = () => {
  isMergePanelOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const performMerge = (target) => {
  const sourceName = editingAcc.value.accountName
  const targetName = target.accountName
  
  if (!confirm(`Relocate ALL logs from vault "${sourceName}" to "${targetName}"? This protocol will decommission the "${sourceName}" vault.`)) return
  
  store.mergeEntities('accounts', sourceName, targetName)
  store.deleteAccount(editingAcc.value.accountID)
  
  isMergePanelOpen.value = false
  isModalOpen.value = false
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

onMounted(() => { 
  if (scrollContainer.value) scrollContainer.value.scrollTo(0, 0)
  if (window.lucide) window.lucide.createIcons() 
})
</script>

<style scoped>
.account-card-premium {
   padding: 1.5rem;
   border-radius: 1.5rem;
   border: 1px solid rgba(255,255,255,0.1);
   cursor: pointer;
   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   position: relative;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   min-height: 180px;
}
.account-card-premium:hover {
   transform: translateY(-5px);
   box-shadow: 0 20px 40px rgba(0,0,0,0.4);
   border-color: rgba(255,255,255,0.2);
}
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
