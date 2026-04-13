<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(100px + env(safe-area-inset-bottom)); position: relative;">
    <div class="sticky-nav" style="padding: calc(0.2rem + env(safe-area-inset-top)) 0 0.2rem 0; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg-primary, #000); z-index: 100;">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative;">
        <div style="display: flex; align-items: center; gap: 1rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s' }">
          <button class="back-btn" @click="$router.push('/settings')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:24px;"></i></button>
          <h1 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin:0;">Registry Vault</h1>
        </div>

        <button v-if="!showSearch" @click="showSearch = true" style="background: none; border: none; color: var(--text-primary); cursor: pointer;"><i data-lucide="search" style="width: 20px;"></i></button>

        <!-- Expanding Search Bar -->
        <div :style="{ width: showSearch ? '100%' : '0px', opacity: showSearch ? 1 : 0, pointerEvents: showSearch ? 'auto' : 'none' }" style="position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: flex-end; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
           <div style="position: relative; width: 100%; height: 40px; display: flex; align-items: center;">
              <i data-lucide="search" style="position: absolute; left: 1rem; width: 18px; color: var(--text-secondary);"></i>
              <input type="text" v-model="searchQuery" :placeholder="'Search ' + activeTab + '...'" style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 20px; padding: 0 2.5rem 0 3rem; color: var(--text-primary); outline: none; font-size: 0.875rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.75rem; background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <!-- Tab Selector -->
    <div style="margin: 1.5rem 0; display: flex; gap: 0.75rem; overflow-x: auto; padding: 0.5rem 0.25rem 1.25rem 0.25rem; scrollbar-width: none; border-bottom: 1px solid var(--border);">
       <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id" :class="{ active: activeTab === t.id }" class="tab-pill" style="padding: 0.8rem 1.5rem; font-size: 0.85rem; height: 46px;">
          <i :data-lucide="t.icon" style="width: 16px;"></i>
          {{ t.label }}
       </button>
    </div>

    <!-- Data List -->
    <div v-if="filteredList.length > 0" style="display: flex; flex-direction: column; gap: 0.75rem;">
       <div v-for="(item, i) in filteredList" :key="i" @click="openModal(item)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; animation: fadeIn 0.3s ease; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 1rem;">
             <div :style="{ background: colors[i % colors.length] + '15', color: colors[i % colors.length] }" style="width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                <i :data-lucide="item.icon || getItemIcon(item)" style="width: 20px;"></i>
             </div>
             <div>
                <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">{{ getItemName(item) }}</div>
                <div style="font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-top: 0.2rem;">
                   {{ getItemSub(item) }}
                </div>
             </div>
          </div>
          <i data-lucide="chevron-right" style="width: 16px; opacity: 0.3;"></i>
       </div>
    </div>
    <div v-else style="text-align: center; padding: 4rem 2rem; background: rgba(255,255,255,0.01); border: 1px dashed var(--border); border-radius: 1.5rem; animation: fadeIn 0.3s ease;">
       <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">No matching entries in this registry.</div>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
         <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out; padding-bottom: 5rem;">
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary);">
               <span style="font-weight: 800;">{{ editingItem ? (modalMode === 'analysis' ? 'Registry Intelligence' : 'Modify Record') : 'New Record' }}</span>
               <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
            </div>

            <!-- MODE: ANALYSIS -->
            <div v-if="modalMode === 'analysis' && editingItem" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
               <div style="display: flex; align-items: center; gap: 1.25rem;">
                  <div :style="{ background: colors[0] + '15', color: colors[0] }" style="width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center;">
                     <i :data-lucide="editingItem.icon || getItemIcon(editingItem)" style="width: 28px;"></i>
                  </div>
                  <div>
                     <div style="font-size: 1.25rem; font-weight: 950; letter-spacing: -0.02em;">{{ getItemName(editingItem) }}</div>
                     <div style="font-size: 0.75rem; opacity: 0.5; margin-top: 0.2rem;">{{ activeTab.toUpperCase() }} Registry Entry</div>
                  </div>
               </div>

               <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 1.25rem; padding: 1.25rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                     <i data-lucide="activity" style="width: 14px; color: var(--accent);"></i>
                     <span style="font-size: 0.7rem; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Metadata Analysis</span>
                  </div>
                  <div style="font-size: 0.85rem; line-height: 1.6; opacity: 0.8;">
                     {{ getItemSub(editingItem) }}
                  </div>
               </div>

               <div v-if="formData.description" style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 14px; border: 1px solid var(--border);">
                  <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">Briefing / Protocol</div>
                  <div style="font-size: 0.8rem; line-height: 1.5;">{{ formData.description }}</div>
               </div>

               <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
                  <button @click="modalMode = 'edit'" style="padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 14px; font-weight: 950; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                     <i data-lucide="edit-3" style="width: 14px;"></i> MODIFY RECORD
                  </button>
                  <button @click="isModalOpen = false" style="padding: 1rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 14px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">
                     CLOSE REGISTRY
                  </button>
               </div>
            </div>

            <!-- MODE: EDIT -->
            <div v-else style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
               <!-- Category Form -->
               <template v-if="activeTab === 'categories'">
                  <div><label class="f-label">Category Name</label><input type="text" v-model="formData.category" class="f-input"></div>
                  <div>
                     <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label class="f-label" style="margin-bottom: 0;">Icon Selection</label>
                        <div style="position: relative; width: 140px;">
                           <input type="text" v-model="iconSearch" placeholder="Search icon..." style="width: 100%; font-size: 0.65rem; padding: 4px 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 6px; color: white; outline: none;">
                        </div>
                     </div>
                     <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; background: var(--bg-input); padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border); overflow-y: auto; max-height: 200px;">
                        <button v-for="iconName in filteredIcons" :key="iconName" @click="formData.icon = iconName" :style="{ background: formData.icon === iconName ? 'var(--accent)' : 'transparent', color: formData.icon === iconName ? 'white' : 'var(--text-secondary)' }" style="border: none; padding: 0.5rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                           <i :data-lucide="iconName" style="width: 20px;"></i>
                        </button>
                     </div>
                  </div>
                  <div><label class="f-label">Category Group</label><input type="text" v-model="formData.categoryGroup" placeholder="Food, Living, etc." class="f-input"></div>
                  <div><label class="f-label">Type</label><select v-model="formData.type" class="f-input"><option>Income</option><option>Expense</option><option>Transfer</option><option>Savings</option><option>Investment</option></select></div>
                  <div><label class="f-label">Description</label><textarea v-model="formData.description" class="f-input"></textarea></div>
               </template>

               <!-- UnitScale Form -->
               <template v-if="activeTab === 'unitScales'">
                  <div><label class="f-label">Unit Code</label><input type="text" v-model="formData.unitScale" placeholder="pcs, kg, etc." class="f-input" :disabled="isEditing"></div>
                  <div><label class="f-label">Description</label><textarea v-model="formData.description" class="f-input"></textarea></div>
               </template>

               <!-- Tag Form -->
               <template v-if="activeTab === 'tags'">
                  <div><label class="f-label">Tag Name</label><input type="text" v-model="formData.tagName" class="f-input"></div>
                  <div><label class="f-label">Tag Group</label><input type="text" v-model="formData.tagGroup" class="f-input"></div>
                  <div><label class="f-label">Description</label><textarea v-model="formData.description" class="f-input"></textarea></div>
               </template>

               <!-- Project Form -->
               <template v-if="activeTab === 'projects'">
                  <div><label class="f-label">Project Name</label><input type="text" v-model="formData.projectName" class="f-input"></div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                     <div><label class="f-label">Start Date</label><input type="date" v-model="formData.startDate" class="f-input"></div>
                     <div><label class="f-label">End Date</label><input type="date" v-model="formData.endDate" class="f-input"></div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                     <div><label class="f-label">Budget Amount</label><input type="number" v-model.number="formData.budgetAmount" class="f-input"></div>
                     <div><label class="f-label">Author</label><select v-model="formData.author" class="f-input"><option v-for="a in store.authors" :key="a.authorID" :value="a.authorName">{{ a.authorName }}</option></select></div>
                  </div>
                  <div><label class="f-label">Status</label><select v-model="formData.status" class="f-input"><option>Active</option><option>Completed</option><option>Planned</option></select></div>
                  <div><label class="f-label">Description</label><textarea v-model="formData.description" class="f-input"></textarea></div>
               </template>

               <!-- Author Form -->
               <template v-if="activeTab === 'authors'">
                  <div><label class="f-label">Author Name</label><input type="text" v-model="formData.authorName" class="f-input"></div>
                  <div><label class="f-label">Role Type</label><select v-model="formData.roleType" class="f-input"><option>Admin</option><option>Explorer</option><option>Auditor</option></select></div>
               </template>

               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
                  <button @click="handleSave" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                     <i data-lucide="check-circle" style="width: 14px;"></i> SAVE RECORD
                  </button>
                  <button v-if="isEditing" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                     <i data-lucide="copy" style="width: 14px;"></i> DUPE
                  </button>
                  <button v-if="isEditing" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                     <i data-lucide="combine" style="width: 14px;"></i> MERGE
                  </button>
                  <button v-if="isEditing" @click="handleDelete" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
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
               <span style="font-weight: 800; font-size: 1rem;">Consolidation Target</span>
               <button @click="isMergePanelOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">Select the record that will absorb all transactions and metadata associated with <b>{{ getItemName(editingItem) }}</b>.</p>
            
            <div style="position: relative;">
               <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 14px; color: var(--text-secondary);"></i>
               <input type="text" v-model="mergeTargetSearch" placeholder="Search targets..." class="f-input" style="padding-left: 2.5rem; height: 44px; font-size: 0.8rem;">
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 300px; overflow-y: auto; padding-right: 0.5rem;">
               <div v-for="t in filteredMergeTargets" :key="getItemName(t)" @click="performMerge(t)" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 0.8rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: 0.2s;">
                  <div :style="{ background: colors[0] + '20', color: colors[0] }" style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                     <i :data-lucide="getItemIcon(t)" style="width: 14px;"></i>
                  </div>
                  <div style="font-weight: 700; font-size: 0.85rem;">{{ getItemName(t) }}</div>
               </div>
               <div v-if="filteredMergeTargets.length === 0" style="text-align: center; padding: 2rem; opacity: 0.4; font-size: 0.75rem;">No valid merge targets found.</div>
            </div>
            <button @click="isMergePanelOpen = false" style="width: 100%; padding: 0.8rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 12px; font-weight: 700; cursor: pointer;">Cancel Mission</button>
         </div>
      </div>
    </Teleport>

    <!-- Add New Entry FAB -->
    <Teleport to="body">
       <button @click="openModal(null)" class="fab" style="position: fixed; bottom: 6rem; right: 1.5rem; width: 60px; height: 60px; border-radius: 20px; background: var(--accent); color: white; border: none; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2000; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <i data-lucide="plus" style="width: 28px; height: 28px; stroke-width: 3;"></i>
       </button>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useFinanceStore } from '../stores/finance'

const route = useRoute()
const store = useFinanceStore()
const activeTab = ref(route.query.tab || 'categories')
const showSearch = ref(false)
const searchQuery = ref('')
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const formData = ref({})
const iconSearch = ref('')
const editingItem = ref(null)

const iconList = [
  'banknote', 'wallet', 'shopping-cart', 'utensils', 'coffee', 
  'toy-brick', 'rocket', 'home', 'bus', 'plane', 'piggy-bank', 'receipt', 
  'stethosope', 'dumbbell', 'graduation-cap', 'trophy', 'film', 'gamepad-2', 
  'zap', 'droplet', 'wifi', 'smartphone', 'wrench', 'hammer',
  'shopping-bag', 'fuel', 'pill', 'hospital', 'store', 'pizza',
  'cake', 'ice-cream', 'beer', 'wine', 'smoking', 'cigarette',
  'car', 'bike', 'bus-front', 'train-front', 'ship', 'truck',
  'package', 'archive', 'box', 'layers', 'tag', 'ticket',
  'file-text', 'file-spreadsheet', 'book', 'pen-tool', 'brush', 'pencil',
  'monitor', 'laptop', 'keyboard', 'headphones', 'camera', 'video',
  'palette', 'layout', 'flask-conical', 'microscope', 'brain', 'cpu',
  'heart', 'star', 'gem', 'gift', 'tag', 'party-popper',
  'tent', 'building', 'landmark', 'map', 'compass', 'mountain',
  'baby', 'dog', 'users', 'user', 'user-plus', 'headset',
  'lock', 'shield-check', 'verified', 'key', 'key-round', 'fingerprint',
  'cloud', 'database', 'network', 'router', 'code-2', 'terminal',
  'briefcase', 'building-2', 'trending-up', 'pie-chart', 'undo-2', 'arrow-left-right'
]

const filteredIcons = computed(() => {
  const q = iconSearch.value.toLowerCase()
  if (!q) return iconList
  return iconList.filter(i => i.toLowerCase().includes(q))
})

const tabs = [
  { id: 'categories', label: 'Categories', icon: 'tag' },
  { id: 'unitScales', label: 'Units', icon: 'scale' },
  { id: 'tags', label: 'Labels', icon: 'hash' },
  { id: 'projects', label: 'Missions', icon: 'layers' },
  { id: 'authors', label: 'Authors', icon: 'users' }
]

const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9']
const isEditing = computed(() => !!editingItem.value)

const getItemIcon = (item) => {
  if (activeTab.value === 'categories' && item.icon) return item.icon
  return tabs.find(t => t.id === activeTab.value).icon
}

const getItemName = (item) => {
  if (activeTab.value === 'categories') return item.category || 'Untitled'
  if (activeTab.value === 'unitScales') return item.unitScale || 'pcs'
  if (activeTab.value === 'tags') return item.tagName || 'label'
  if (activeTab.value === 'projects') return item.projectName || 'Mission'
  if (activeTab.value === 'authors') return item.authorName || 'Explorer'
  return 'Unknown'
}

const getItemSub = (item) => {
  if (activeTab.value === 'categories') return `${item.categoryGroup || 'Gen'} • ${item.type}`
  if (activeTab.value === 'projects') return `${item.status} • Rp ${ (item.budgetAmount || 0).toLocaleString('id-ID') }`
  if (activeTab.value === 'tags') return item.tagGroup || 'Global'
  if (activeTab.value === 'authors') return item.roleType || 'Member'
  return 'Registry Entry'
}

const currentList = computed(() => store[activeTab.value] || [])
const filteredList = computed(() => {
  if (!searchQuery.value) return currentList.value
  const q = searchQuery.value.toLowerCase()
  return currentList.value.filter(item => getItemName(item).toLowerCase().includes(q))
})

const openModal = (item) => {
  editingItem.value = item ? { ...item } : null
  if (item) {
     formData.value = { icon: 'tag', ...item }
     iconSearch.value = ''
     modalMode.value = 'analysis'
  } else {
     // Default values for new entry
     modalMode.value = 'edit'
     if (activeTab.value === 'categories') formData.value = { category: '', categoryGroup: '', type: 'Expense', description: '', icon: 'tag' }
     else if (activeTab.value === 'unitScales') formData.value = { unitScale: '', description: '' }
     else if (activeTab.value === 'tags') formData.value = { tagName: '', tagGroup: '', description: '' }
     else if (activeTab.value === 'projects') formData.value = { projectName: '', startDate: '', endDate: '', budgetAmount: 0, status: 'Active', author: 'Self', description: '' }
     else if (activeTab.value === 'authors') formData.value = { authorName: '', roleType: 'Explorer' }
  }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const handleSave = () => {
   const data = { ...formData.value }
   
   if (activeTab.value === 'categories') {
      if (isEditing.value) store.updateCategory(data)
      else store.addCategory(data)
   } else if (activeTab.value === 'unitScales') {
      if (isEditing.value) {
         const idx = store.unitScales.findIndex(u => u.unitScale === editingItem.value.unitScale)
         if (idx !== -1) store.unitScales[idx] = data
      } else {
         store.addUnitScale(data)
      }
   } else if (activeTab.value === 'tags') {
      if (isEditing.value) store.updateTag(data)
      else store.addTag(data)
   } else if (activeTab.value === 'projects') {
      if (isEditing.value) store.updateProject(data)
      else store.addProject(data)
   } else if (activeTab.value === 'authors') {
      if (isEditing.value) store.updateAuthor(data)
      else store.addAuthor(data)
   }
   
   store.saveAll()
   isModalOpen.value = false
}

const handleDuplicate = () => {
   const data = { ...formData.value }
   // Remove IDs to make it a new entry
   delete data.categoryID
   delete data.tagID
   delete data.projectID
   delete data.authorID
   if (activeTab.value === 'unitScales') data.unitScale = data.unitScale + '_copy'

   editingItem.value = null
   formData.value = data
   nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return currentList.value.filter(item => 
    getItemName(item) !== getItemName(editingItem.value) &&
    getItemName(item).toLowerCase().includes(q)
  )
})

const handleMerge = () => {
   isMergePanelOpen.value = true
   nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const performMerge = (target) => {
   const sourceName = getItemName(editingItem.value)
   const targetName = getItemName(target)
   
   if (!confirm(`Merge ALL records from "${sourceName}" into "${targetName}"? This will delete "${sourceName}".`)) return
   
   store.mergeEntities(activeTab.value, sourceName, targetName)
   
   // Delete source from registry
   if (activeTab.value === 'categories') store.deleteCategory(editingItem.value.categoryID)
   else if (activeTab.value === 'unitScales') store.deleteUnitScale(editingItem.value.unitScale)
   else if (activeTab.value === 'tags') store.deleteTag(editingItem.value.tagID)
   else if (activeTab.value === 'projects') store.deleteProject(editingItem.value.projectID)
   else if (activeTab.value === 'authors') store.deleteAuthor(editingItem.value.authorID)

   isMergePanelOpen.value = false
   isModalOpen.value = false
}

const handleDelete = () => {
   if (!confirm('Permanently decommission this registry record?')) return
   if (activeTab.value === 'categories') store.deleteCategory(editingItem.value.categoryID)
   else if (activeTab.value === 'unitScales') store.deleteUnitScale(editingItem.value.unitScale)
   else if (activeTab.value === 'tags') store.deleteTag(editingItem.value.tagID)
   else if (activeTab.value === 'projects') store.deleteProject(editingItem.value.projectID)
   else if (activeTab.value === 'authors') store.deleteAuthor(editingItem.value.authorID)
   isModalOpen.value = false
}

watch(isModalOpen, (val) => {
  if (val) document.body.classList.add('modal-open')
  else document.body.classList.remove('modal-open')
})

watch([activeTab, showSearch, iconSearch, modalMode, isMergePanelOpen, isModalOpen], () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})

onMounted(() => { if (window.lucide) window.lucide.createIcons() })
onBeforeUnmount(() => { document.body.classList.remove('modal-open') })
</script>

<style scoped>
.tab-pill { flex-shrink: 0; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 0.6rem 1.25rem; color: var(--text-secondary); font-size: 0.75rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s; border-radius: 12px; }
.tab-pill.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; box-sizing: border-box; font-family: inherit; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
