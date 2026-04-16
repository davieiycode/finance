<template>
  <div class="view-content memberships-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar" :class="{ 'has-search': showSearch }">
      <div class="app-bar-content">
        <template v-if="!showSearch">
          <button class="icon-btn" @click="$router.push('/')">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <h1>Privileges</h1>
          <button class="icon-btn" @click="showSearch = true">
            <span class="material-symbols-rounded">search</span>
          </button>
        </template>
        <template v-else>
          <button class="icon-btn" @click="showSearch = false; searchQuery = ''">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <input type="text" v-model="searchQuery" placeholder="Search archive..." autofocus class="search-input-field">
          <button v-if="searchQuery" class="icon-btn" @click="searchQuery = ''">
            <span class="material-symbols-rounded">close</span>
          </button>
        </template>
      </div>
    </div>

    <div class="content-scroll">
      <div class="members-grid">
        <div v-for="m in filteredMembers" :key="m.memberID" @click="openModal(m)" class="membership-card" :style="{ backgroundColor: m.color || 'var(--bg-secondary)' }">
           <div class="card-glass-overlay"></div>
           <div class="card-header">
              <div class="card-logo-box">
                 <img v-if="m.memberImage" :src="m.memberImage" class="card-logo">
                 <span v-else class="material-symbols-rounded">badge</span>
              </div>
              <span class="tier-badge">{{ m.type }}</span>
           </div>
           
           <div class="card-body">
              <h2 class="card-holder">{{ m.memberName }}</h2>
              <span class="card-id">{{ m.code || '•••• •••• ••••' }}</span>
           </div>
           
           <div class="card-footer">
              <div class="valid-thru">
                 <span class="footer-label">VALID THRU</span>
                 <span class="footer-value">{{ m.expiryDate || 'PERPETUAL' }}</span>
              </div>
              <span v-if="isExpired(m.expiryDate)" class="expired-tag">EXPIRED</span>
           </div>
        </div>
      </div>

      <div v-if="filteredMembers.length === 0" class="empty-state">
        <span class="material-symbols-rounded">id_card</span>
        <p>No active privilege identifiers detected.</p>
      </div>
    </div>

    <!-- FAB -->
    <button @click="openModal(null)" class="fab">
      <span class="material-symbols-rounded">add</span>
    </button>

    <!-- Bottom Sheet Modal -->
    <Teleport to="body">
       <div v-if="isModalOpen" class="modal-backdrop-full" @click.self="isModalOpen = false">
          <div class="bottom-sheet">
             <div class="sheet-drag-handle"></div>
             <div class="sheet-header">
                <h3 class="sheet-title">{{ editingMember.memberID ? (modalMode === 'analysis' ? 'Membership Intel' : 'Modify Privilege') : 'New Privilege' }}</h3>
                <button @click="isModalOpen = false" class="icon-btn">
                  <span class="material-symbols-rounded">close</span>
                </button>
             </div>
             
             <div class="sheet-content">
                <!-- MODE: ANALYSIS -->
                <div v-if="modalMode === 'analysis' && editingMember.memberID" class="analysis-view">
                   <div class="membership-hero-card" :style="{ backgroundColor: editingMember.color || 'var(--primary)' }">
                      <div class="hero-header">
                         <span class="hero-protocol">MEMBER PROTOCOL</span>
                         <span class="material-symbols-rounded">verified</span>
                      </div>
                      <h2 class="hero-name">{{ editingMember.memberName }}</h2>
                      <span class="hero-tier">{{ editingMember.type }} CLASS</span>
                   </div>

                   <div class="analytics-grid">
                      <div class="stat-card card-md3 tonal">
                         <span class="stat-label">BENEFIT RATIO</span>
                         <span class="stat-value success">{{ editingMember.membershipDiscount }}% Off</span>
                      </div>
                      <div class="stat-card card-md3">
                         <span class="stat-label">PROTOCOL COST</span>
                         <span class="stat-value">Rp {{ (editingMember.membershipCost || 0).toLocaleString('id-ID') }}</span>
                      </div>
                   </div>

                   <div class="action-grid">
                      <button @click="modalMode = 'edit'" class="tonal-btn-lg">
                         <span class="material-symbols-rounded">edit</span>
                         MODIFY
                      </button>
                      <button @click="isModalOpen = false" class="outline-btn-lg">CLOSE</button>
                   </div>
                </div>

                <!-- MODE: EDIT -->
                <div v-else class="edit-view">
                   <div class="form-grid">
                      <div class="form-group full"><label>Member Name</label><input type="text" v-model="formData.memberName" class="md-input"></div>
                      <div class="form-group"><label>Code / PID</label><input type="text" v-model="formData.code" class="md-input"></div>
                      <div class="form-group"><label>Discount (%)</label><input type="number" v-model.number="formData.membershipDiscount" class="md-input"></div>
                      <div class="form-group"><label>Expiry Date</label><input type="date" v-model="formData.expiryDate" class="md-input"></div>
                      <div class="form-group"><label>Card Color</label><input type="color" v-model="formData.color" class="md-input color-picker"></div>
                      <div class="form-group"><label>Protocol Cost</label><input type="number" v-model.number="formData.membershipCost" class="md-input"></div>
                      <div class="form-group">
                         <label>Class Status</label>
                         <button type="button" @click="formData.isPaid = !formData.isPaid" class="toggle-btn" :class="{ active: formData.isPaid }">
                            {{ formData.isPaid ? 'PAID' : 'FREE' }}
                         </button>
                      </div>
                      <div class="form-group full"><label>Image URL (Logo/Card)</label><input type="text" v-model="formData.memberImage" class="md-input"></div>
                      <div class="form-group full"><label>Notes</label><textarea v-model="formData.notes" class="md-textarea"></textarea></div>
                   </div>

                   <div class="modal-actions">
                      <button @click="saveMem" class="filled-btn-lg">
                         <span class="material-symbols-rounded">save</span>
                         SAVE MEMBER
                      </button>
                      <div v-if="editingMember.memberID" class="secondary-actions">
                         <button @click="handleDuplicate" class="tonal-btn">Duplicate</button>
                         <button @click="deleteMem" class="error-btn">Purge</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const store = useFinanceStore()
const uiStore = useUIStore()
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const editingMember = ref({})
const formData = ref({})
const showSearch = ref(false)
const searchQuery = ref('')

const filteredMembers = computed(() => {
  if (!searchQuery.value) return store.members
  const q = searchQuery.value.toLowerCase()
  return store.members.filter(m => 
    (m.memberName || '').toLowerCase().includes(q) ||
    (m.code || '').toLowerCase().includes(q) ||
    (m.type || '').toLowerCase().includes(q)
  )
})

const openModal = (m) => {
  if (m) { 
    editingMember.value = { ...m }
    formData.value = { ...m, membershipDiscount: Number(m.membershipDiscount) || 0, membershipCost: Number(m.membershipCost) || 0 } 
    modalMode.value = 'analysis'
  } else { 
    editingMember.value = {}
    formData.value = { memberName: '', code: '', expiryDate: '', type: 'Basic', color: '#004494', notes: '', memberImage: '', membershipDiscount: 0, membershipCost: 0, isPaid: false } 
    modalMode.value = 'edit'
  }
  isModalOpen.value = true
}

const saveMem = () => {
  if (!formData.value.memberName) return alert('Name required')
  if (editingMember.value.memberID) store.updateMember({ ...formData.value })
  else store.addMember({ ...formData.value })
  isModalOpen.value = false
}

const deleteMem = () => { if (confirm('Purge this identifier?')) { store.deleteMember(editingMember.value.memberID); isModalOpen.value = false } }
const handleDuplicate = () => { const data = { ...formData.value }; delete data.memberID; editingMember.value = {}; formData.value = data }
const isExpired = (date) => date && new Date(date) < new Date()

watch(isModalOpen, (val) => {
  if (val) uiStore.registerModal('memberships')
  else uiStore.unregisterModal('memberships')
})

onBeforeUnmount(() => { uiStore.unregisterModal('memberships') })
</script>

<style scoped>
.memberships-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }
.top-app-bar { padding: env(safe-area-inset-top) 16px 8px 16px; background-color: var(--bg-primary); border-bottom: 1px solid var(--border); z-index: 100; }
.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 22px; font-weight: 400; margin: 0; }
.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.search-input-field { flex: 1; background: transparent; border: none; color: var(--on-surface); font-size: 16px; outline: none; }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px; }

.members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

.membership-card {
  height: 180px; border-radius: 24px; padding: 24px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;
  transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.membership-card:active { transform: scale(0.98); }
.card-glass-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%); pointer-events: none; }

.card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.card-logo-box { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; }
.card-logo { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
.tier-badge { font-size: 10px; font-weight: 700; color: white; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }

.card-body { display: flex; flex-direction: column; gap: 4px; }
.card-holder { font-size: 20px; font-weight: 600; color: white; margin: 0; }
.card-id { font-family: monospace; font-size: 15px; color: rgba(255,255,255,0.8); letter-spacing: 2px; }

.card-footer { display: flex; justify-content: space-between; align-items: center; }
.valid-thru { display: flex; flex-direction: column; }
.footer-label { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.5); }
.footer-value { font-size: 12px; font-weight: 500; color: white; }
.expired-tag { font-size: 10px; font-weight: 800; color: #ff5252; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; }

.fab { position: fixed; bottom: 32px; right: 32px; width: 56px; height: 56px; border-radius: 16px; background-color: var(--primary); color: var(--on-primary); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 1000; cursor: pointer; }

.modal-backdrop-full { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 4000; display: flex; align-items: flex-end; }
.bottom-sheet { width: 100%; background-color: var(--bg-primary); border-radius: 28px 28px 0 0; padding: 8px 16px 32px 16px; max-height: 90vh; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.sheet-drag-handle { width: 32px; height: 4px; background-color: var(--outline); border-radius: 2px; margin: 0 auto 16px auto; opacity: 0.4; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.sheet-title { font-size: 20px; font-weight: 400; margin: 0; }
.sheet-content { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 24px; }

.membership-hero-card { padding: 24px; border-radius: 24px; color: white; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.hero-header { display: flex; justify-content: space-between; align-items: center; }
.hero-protocol { font-size: 10px; font-weight: 700; letter-spacing: 2px; }
.hero-name { font-size: 28px; font-weight: 600; margin: 0; }
.hero-tier { font-size: 12px; font-weight: 700; opacity: 0.8; }

.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-card { padding: 16px; display: flex; flex-direction: column; gap: 4px; }
.stat-card.tonal { background-color: var(--primary-container); color: var(--on-primary-container); border: none; }
.stat-label { font-size: 10px; font-weight: 700; opacity: 0.6; }
.stat-value { font-size: 18px; font-weight: 700; }
.stat-value.success { color: var(--green); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: span 2; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--primary); margin-left: 4px; }
.md-input { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; height: 48px; padding: 0 12px; color: var(--on-surface); font-size: 14px; outline: none; }
.md-textarea { background-color: var(--surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 12px; color: var(--on-surface); font-size: 14px; outline: none; min-height: 80px; resize: vertical; }

.toggle-btn { height: 48px; border-radius: 12px; border: 1px solid var(--outline); background: transparent; color: var(--on-surface); font-weight: 700; cursor: pointer; }
.toggle-btn.active { background-color: var(--primary); color: var(--on-primary); border-color: var(--primary); }

.modal-actions { display: flex; flex-direction: column; gap: 16px; }
.secondary-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.filled-btn-lg { background-color: var(--primary); color: var(--on-primary); border: none; border-radius: 20px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; cursor: pointer; }
.tonal-btn-lg { background-color: var(--primary-container); color: var(--on-primary-container); border: none; border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; }
.outline-btn-lg { background-color: transparent; border: 1px solid var(--outline); color: var(--on-surface); border-radius: 20px; height: 56px; font-weight: 600; cursor: pointer; }
.tonal-btn { background-color: var(--secondary-container); color: var(--on-secondary-container); border: none; border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }
.error-btn { background-color: rgba(242, 184, 181, 0.1); color: var(--error); border: 1px solid var(--error); border-radius: 12px; height: 48px; font-weight: 600; cursor: pointer; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
</style>
