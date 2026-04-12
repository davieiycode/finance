<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">Budget Control</h1>
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
              <input type="text" v-model="searchQuery" placeholder="Search category or type..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="budget-list" style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem;">
      <div v-for="b in filteredBudgets" :key="b.budgetID" @click="openModal(b)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; cursor: pointer; transition: 0.2s;">
         <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div>
               <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">{{ b.period }} / {{ b.category }}</div>
               <div style="font-size: 1.125rem; font-weight: 800; margin-top: 0.2rem;">{{ b.currency }} {{ (b.amount || 0).toLocaleString('id-ID') }}</div>
            </div>
            <div style="font-size: 0.65rem; background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 2px 8px; border-radius: 10px; font-weight: 800;">{{ b.status }}</div>
         </div>
         
         <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;">
            <div :style="{ width: calculateProgress(b) + '%', background: getProgressColor(b) }" style="height: 100%; transition: 0.5s;"></div>
         </div>
         <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 700; opacity: 0.6;">
            <span>{{ calculateProgress(b) }}% Used</span>
            <span>Rp {{ getSpent(b).toLocaleString('id-ID') }} spent</span>
         </div>
      </div>
    </div>

    <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary);">
            <span style="font-weight: 800;">Budget Detail</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>
         <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div><label class="f-label">Category</label><input type="text" v-model="formData.category" list="cat-list" class="f-input"></div>
            <div><label class="f-label">Period</label><select v-model="formData.period" class="f-input"><option>Monthly</option><option>Weekly</option><option>Yearly</option><option>Custom Project</option></select></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Budget Amount</label><input type="number" v-model.number="formData.amount" class="f-input"></div>
               <div><label class="f-label">Currency</label><input type="text" v-model="formData.currency" class="f-input"></div>
            </div>
            <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>Active</option><option>Paused</option><option>Completed</option></select></div>
            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveBud" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE BUDGET
               </button>
               <button v-if="editingBud.budgetID" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingBud.budgetID" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="combine" style="width: 14px;"></i> MERGE
               </button>
               <button v-if="editingBud.budgetID" @click="deleteBud" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="trash-2" style="width: 14px;"></i> DELETE
               </button>
            </div>
         </div>
         <datalist id="cat-list">
            <option v-for="c in store.categories" :key="c.categoryID" :value="c.category" />
         </datalist>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const isModalOpen = ref(false)
const editingBud = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const filteredBudgets = computed(() => {
  if (!searchQuery.value) return store.budgets
  const q = searchQuery.value.toLowerCase()
  return store.budgets.filter(b => 
    (b.category || '').toLowerCase().includes(q) ||
    (b.period || '').toLowerCase().includes(q)
  )
})

const openModal = (b) => {
  if (b) { 
    editingBud.value = { ...b }
    formData.value = { 
      ...b,
      amount: Number(b.amount) || 0
    } 
  }
  else { editingBud.value = {}; formData.value = { category: '', period: 'Monthly', amount: 0, currency: 'IDR', status: 'Active', notes: '' } }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const saveBud = () => {
  if (!formData.value.category) return alert('Category required')
  if (editingBud.value.budgetID) store.updateBudget({ ...formData.value })
  else store.addBudget({ ...formData.value })
  isModalOpen.value = false
}

const deleteBud = () => { if (confirm('Delete this budget?')) { store.deleteBudget(editingBud.value.budgetID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.budgetID
  editingBud.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const handleMerge = () => {
  alert('BUDGET Merge Engine coming soon.')
}

const getSpent = (b) => {
  return store.transactions
    .filter(t => t.category === b.category && t.type === 'Expense')
    .reduce((acc, t) => acc + (t.total || 0), 0)
}

const calculateProgress = (b) => {
  if (!b.amount) return 0
  const spent = getSpent(b)
  return Math.min(Math.round((spent / b.amount) * 100), 100)
}

const getProgressColor = (b) => {
  const p = calculateProgress(b)
  if (p > 90) return '#ef4444'
  if (p > 70) return '#f59e0b'
  return 'var(--accent)'
}

onMounted(() => { if (window.lucide) window.lucide.createIcons() })
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
