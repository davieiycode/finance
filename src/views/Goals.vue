<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 2rem; position: relative;">
    <div class="sticky-nav" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin:0;">Goals</h1>
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
              <input type="text" v-model="searchQuery" placeholder="Search goal name or status..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="goals-list" style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem;">
      <div v-for="g in filteredGoals" :key="g.goalID" @click="openModal(g)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; cursor: pointer; transition: 0.3s;">
         <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div>
               <div style="font-size: 1.125rem; font-weight: 800;">{{ g.goalName }}</div>
               <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">Deadline: {{ g.deadline || 'Someday' }}</div>
            </div>
            <div style="text-align: right;">
               <div style="font-size: 0.6rem; font-weight: 800; color: var(--accent); text-transform: uppercase;">{{ g.status }}</div>
               <div style="font-weight: 800; font-size: 0.9rem; margin-top: 0.2rem;">Rp {{ (g.targetAmount || 0).toLocaleString('id-ID') }}</div>
            </div>
         </div>
         
         <div style="margin: 1.5rem 0 1rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.6rem;">
               <div style="font-size: 1.5rem; font-weight: 900; color: white;">{{ calculateProgress(g) }}%</div>
               <div style="font-size: 0.8rem; font-weight: 700; opacity: 0.8;">Rp {{ (g.currentAmount || 0).toLocaleString('id-ID') }} saved</div>
            </div>
            <div style="height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; border: 1px solid var(--border);">
               <div :style="{ width: calculateProgress(g) + '%' }" style="height: 100%; background: var(--accent); position: relative; transition: 1s cubic-bezier(0.23, 1, 0.32, 1);">
                  <div style="position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: sweep 2s infinite;"></div>
               </div>
            </div>
         </div>
         <div v-if="g.deadline" style="font-size: 0.65rem; color: var(--text-secondary); font-weight: 700; opacity: 0.5; text-align: center;">{{ calculateDaysLeft(g.deadline) }} days remaining</div>
      </div>
    </div>

    <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary);">
            <span style="font-weight: 800;">Goal Detail</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>
         <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div><label class="f-label">Goal Name</label><input type="text" v-model="formData.goalName" class="f-input"></div>
            <div><label class="f-label">Category</label><input type="text" v-model="formData.category" list="cat-list" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Target Amount</label><input type="number" v-model.number="formData.targetAmount" class="f-input"></div>
               <div><label class="f-label">Current Amount</label><input type="number" v-model.number="formData.currentAmount" class="f-input"></div>
            </div>
            <div><label class="f-label">Deadline</label><input type="date" v-model="formData.deadline" class="f-input"></div>
            <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>In Progress</option><option>Paused</option><option>Completed</option><option>Abandoned</option></select></div>
            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>
            <datalist id="cat-list">
               <option v-for="c in store.categories" :key="c.categoryID" :value="c.category" />
            </datalist>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveGoal" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE GOAL
               </button>
               <button v-if="editingGoal.goalID" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingGoal.goalID" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="combine" style="width: 14px;"></i> MERGE
               </button>
               <button v-if="editingGoal.goalID" @click="deleteGoal" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
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
const editingGoal = ref({})
const formData = ref({})

const showSearch = ref(false)
const searchQuery = ref('')

const filteredGoals = computed(() => {
  if (!searchQuery.value) return store.goals
  const q = searchQuery.value.toLowerCase()
  return store.goals.filter(g => 
    (g.goalName || '').toLowerCase().includes(q) ||
    (g.status || '').toLowerCase().includes(q)
  )
})

const openModal = (g) => {
  if (g) { 
    editingGoal.value = { ...g }
    formData.value = { 
      ...g,
      targetAmount: Number(g.targetAmount) || 0,
      currentAmount: Number(g.currentAmount) || 0
    } 
  }
  else { editingGoal.value = {}; formData.value = { goalName: '', targetAmount: 0, currentAmount: 0, deadline: '', status: 'In Progress' } }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const saveGoal = () => {
  if (!formData.value.goalName) return alert('Name required')
  if (editingGoal.value.goalID) store.updateGoal({ ...formData.value })
  else store.addGoal({ ...formData.value })
  isModalOpen.value = false
}

const deleteGoal = () => { if (confirm('Delete this goal?')) { store.deleteGoal(editingGoal.value.goalID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.goalID
  editingGoal.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const handleMerge = () => {
  alert('GOAL Merge Engine coming soon.')
}

const calculateProgress = (g) => {
  if (!g.targetAmount) return 0
  return Math.min(Math.round(((g.currentAmount || 0) / g.targetAmount) * 100), 100)
}

const calculateDaysLeft = (deadline) => {
  if (!deadline) return 0
  const diff = new Date(deadline) - new Date()
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
}

onMounted(() => { if (window.lucide) window.lucide.createIcons() })
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
@keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
