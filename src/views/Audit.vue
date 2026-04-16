<template>
  <div class="view-content audit-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.back()">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <div class="header-briefing">
          <span class="briefing-prefix">AUDIT PROTOCOL</span>
          <h1 class="briefing-title">{{ totalIssues }} Anomali</h1>
          <p class="briefing-sub">Sistem mendeteksi entri yang memerlukan verifikasi manual.</p>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <div class="filter-row">
         <button v-for="t in [['all', 'Semua'], ['unverified', 'Belum'], ['duplicate', 'Duplikat'], ['desync', 'Meleset']]" :key="t[0]" @click="filterType = t[0]" :class="{ active: filterType === t[0] }" class="tab-chip">
            <span class="chip-label">{{ t[1] }}</span>
         </button>
      </div>

      <div class="audit-stack">
        <!-- Section: Pending Clearances -->
        <section class="audit-section" v-if="filterType === 'all' || filterType === 'unverified'">
           <div class="section-title">
              <span class="material-symbols-rounded warning">report</span>
              BELUM DICEK ({{ pendingClearances.length }})
           </div>
           
           <div v-if="pendingClearances.length === 0 && filterType === 'unverified'" class="audit-empty-state">
              <span class="material-symbols-rounded">check_circle</span>
              <p>Semua data sudah diverifikasi.</p>
           </div>
           
           <div v-else class="audit-list">
              <div v-for="tx in pendingClearances" :key="tx.transactionID" @click="openTx(tx)" class="audit-card card-md3">
                 <div class="card-left">
                    <span class="item-name">{{ tx.itemName }}</span>
                    <span class="item-meta">{{ tx.merchant }} • {{ tx.date }}</span>
                 </div>
                 <div class="card-right">
                    <span class="item-total">-Rp {{ (tx.total || 0).toLocaleString('id-ID') }}</span>
                    <span class="issue-tag warning">BELUM DICEK</span>
                 </div>
              </div>
           </div>
        </section>

        <!-- Section: Duplicate Protocols -->
        <section class="audit-section" v-if="filterType === 'all' || filterType === 'duplicate'">
           <div class="section-title">
              <span class="material-symbols-rounded primary">layers</span>
              DUPLIKAT ({{ duplicateClusters.length }})
           </div>

           <div v-if="duplicateClusters.length === 0 && filterType === 'duplicate'" class="audit-empty-state">
              <span class="material-symbols-rounded">verified</span>
              <p>Semua data sudah bersih dan sesuai!</p>
           </div>

           <div v-else class="audit-list">
              <div v-for="(cluster, idx) in duplicateClusters" :key="idx" class="cluster-container card-md3 outline">
                 <div class="cluster-header">
                    <span class="cluster-id">KLUSTER #{{ idx + 1 }} • {{ cluster.length }} DATA</span>
                     <button @click="resolveCluster(cluster)" class="filled-btn" style="height: 36px; font-size: 11px; padding: 0 16px;">HAPUS DUPLIKAT</button>
                 </div>
                 <div class="cluster-items">
                    <div v-for="tx in cluster" :key="tx.transactionID" @click="openTx(tx)" class="cluster-item">
                       <div class="item-main">
                          <span class="name">{{ tx.itemName }}</span>
                          <span class="id">{{ tx.transactionID }}</span>
                       </div>
                       <div class="item-side">
                          <span class="val">Rp {{ (tx.total || 0).toLocaleString('id-ID') }}</span>
                          <span class="date">{{ tx.date }}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <!-- Section: Metadata Desync -->
        <section class="audit-section" v-if="filterType === 'all' || filterType === 'desync'">
           <div class="section-title">
              <span class="material-symbols-rounded secondary">hub</span>
              TIDAK COCOK (TAG & PROYEK)
           </div>

           <div v-if="desyncIssues.length === 0 && filterType === 'desync'" class="audit-empty-state">
              <span class="material-symbols-rounded">published_with_changes</span>
              <p>Data sudah sinkron.</p>
           </div>

           <div v-else class="audit-list">
              <div v-for="t in desyncIssues" :key="t.tx.transactionID" @click="openTx(t.tx)" class="audit-card card-md3">
                 <div class="card-left">
                    <span class="item-name">{{ t.tx.itemName }}</span>
                    <span class="desync-warn">TIDAK DITEMUKAN: {{ t.missing.join(', ') }}</span>
                 </div>
                 <button @click.stop="quickFixRegistry(t)" class="tonal-btn" style="height: 36px; padding: 0 16px;">
                    <span class="material-symbols-rounded" style="font-size: 18px;">sync</span>
                    SINKRON
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const store = useFinanceStore()
const uiStore = useUIStore()
const filterType = ref('all')

const pendingClearances = computed(() => {
  const txs = store.transactions || []
  return txs.filter(t => t.cleared === 'no' || !t.cleared)
})

const duplicateClusters = computed(() => {
  const txs = store.transactions || []
  const groups = {}
  txs.forEach(t => {
    const sig = `${t.date}_${t.merchant}_${t.total}_${t.itemName}`
    if (!groups[sig]) groups[sig] = []
    groups[sig].push(t)
  })
  return Object.values(groups).filter(g => g.length > 1)
})

const desyncIssues = computed(() => {
  const issues = []
  const txs = store.transactions || []
  const regTags = store.tags || []
  const regPrjs = store.projects || []
  
  txs.forEach(t => {
    const missing = []
    if (t.tags) {
       const txTags = String(t.tags).split(',').map(s => s.trim()).filter(Boolean)
       txTags.forEach(tagName => { if (!regTags.some(rt => rt.tagName === tagName)) missing.push(tagName) })
    }
    if (t.projects) {
       const txPrjs = String(t.projects).split(',').map(s => s.trim()).filter(Boolean)
       txPrjs.forEach(prjName => { if (!regPrjs.some(rp => rp.projectName === prjName)) missing.push(prjName) })
    }
    if (missing.length > 0) issues.push({ tx: t, missing })
  })
  return issues
})

const totalIssues = computed(() => (pendingClearances.value?.length || 0) + (duplicateClusters.value?.length || 0) + (desyncIssues.value?.length || 0))

const openTx = (tx) => router.push({ path: '/transaction', query: { id: tx.transactionID } })

const resolveCluster = (cluster) => {
  if (confirm(`Remove all except the primary entry in this cluster (${cluster.length - 1} detections)?`)) {
     for (let i = 1; i < cluster.length; i++) store.deleteTransaction(cluster[i].transactionID)
     store.notify('Redundancy Resolved', 'success')
  }
}

const quickFixRegistry = (issue) => {
   issue.missing.forEach(name => {
      if (issue.tx.tags && issue.tx.tags.includes(name)) store.addTag({ tagName: name })
      if (issue.tx.projects && issue.tx.projects.includes(name)) store.addProject({ projectName: name })
   })
   store.notify('Registry Aligned', 'success')
}

onBeforeUnmount(() => { uiStore.unregisterModal('audit') })
</script>

<style scoped>
.audit-container { height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary); }

.top-app-bar {
  padding-top: max(env(safe-area-inset-top), 16px);
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 24px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.header-briefing { display: flex; flex-direction: column; gap: 4px; padding-left: 4px; }
.briefing-prefix { font-size: 10px; font-weight: 800; color: var(--primary); letter-spacing: 2px; }
.briefing-title { font-size: 28px; font-weight: 600; margin: 0; color: var(--on-surface); }
.briefing-sub { font-size: 11px; color: var(--on-surface-variant); margin: 0; opacity: 0.7; }

.app-bar-content { display: flex; align-items: flex-start; gap: 16px; min-height: 100px; padding-top: 8px; }

/* Global icon-btn used */

.content-scroll { flex: 1; overflow-y: auto; padding: 24px 16px 120px 16px; }

.filter-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 24px; scrollbar-width: none; }
.filter-row::-webkit-scrollbar { display: none; }

.tab-chip {
  height: 36px; padding: 0 16px; border-radius: 18px; border: 1px solid var(--border);
  background: transparent; color: var(--on-surface-variant); font-size: 13px; font-weight: 500;
  display: flex; align-items: center; white-space: nowrap; cursor: pointer; transition: all 0.2s;
}
.tab-chip.active { background-color: var(--primary-container); color: var(--on-primary-container); border-color: var(--primary-container); }

.audit-stack { display: flex; flex-direction: column; gap: 40px; }

.audit-section { display: flex; flex-direction: column; gap: 20px; }
.section-title { 
  font-size: 11px; font-weight: 800; color: var(--primary); letter-spacing: 1.5px; 
  display: flex; align-items: center; gap: 12px; margin-left: 4px;
}
.section-title::after { content: ""; flex: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); }

.audit-list { display: flex; flex-direction: column; gap: 12px; }
.audit-card { 
  display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; 
  cursor: pointer; background-color: var(--bg-secondary); border-radius: 20px; border: 1px solid var(--border);
}

.card-left { display: flex; flex-direction: column; gap: 4px; }
.item-name { font-size: 16px; font-weight: 600; color: var(--on-surface); }
.item-meta { font-size: 12px; color: var(--on-surface-variant); }
.desync-warn { font-size: 11px; color: var(--error); font-weight: 700; background: rgba(242, 184, 181, 0.1); padding: 4px 10px; border-radius: 8px; margin-top: 4px; border: 1px solid rgba(242, 184, 181, 0.2); }

.card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.item-total { font-size: 15px; font-weight: 700; color: var(--error); }
.issue-tag { font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
.issue-tag.warning { background: var(--error-container); color: var(--on-error-container); }

.audit-empty-state { padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; opacity: 0.3; }
.audit-empty-state .material-symbols-rounded { font-size: 56px; }

.cluster-container { padding: 0; overflow: hidden; border-radius: 24px; background-color: var(--bg-secondary); border: 1px solid var(--border); }
.cluster-header { 
  background: rgba(168, 199, 250, 0.05); padding: 16px 20px; display: flex; 
  justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); 
}
.cluster-id { font-size: 11px; font-weight: 800; color: var(--primary); letter-spacing: 1px; }
/* Global MD3 Buttons are used */

.cluster-items { display: flex; flex-direction: column; }
.cluster-item { 
  display: flex; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); 
  transition: background-color 0.2s; cursor: pointer;
}
.cluster-item:hover { background-color: rgba(255,255,255,0.02); }
.cluster-item:last-child { border-bottom: none; }
.item-main { display: flex; flex-direction: column; gap: 2px; }
.item-main .name { font-size: 15px; font-weight: 600; }
.item-main .id { font-size: 10px; font-family: monospace; opacity: 0.4; }
.item-side { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.item-side .val { font-size: 14px; font-weight: 700; color: var(--on-surface); }
.item-side .date { font-size: 11px; color: var(--on-surface-variant); }

/* sync-action-btn replaced by global tonal-btn */
</style>
