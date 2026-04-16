<template>
  <div class="view-content audit-container">
    <!-- MD3 Top App Bar -->
    <div class="top-app-bar">
      <div class="app-bar-content">
        <button class="icon-btn" @click="$router.push('/')">
          <span class="material-symbols-rounded">arrow_back</span>
        </button>
        <div class="wealth-card">
          <span class="wealth-label">PERLU DICEK</span>
          <h2 class="wealth-amount">{{ totalIssues }} Catatan</h2>
          <span class="wealth-sub">Menunggu verifikasi Anda</span>
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <div class="filter-switcher">
         <button v-for="t in [['all', 'Semua'], ['unverified', 'Belum Dicek'], ['duplicate', 'Duplikat'], ['desync', 'Tidak Cocok']]" :key="t[0]" @click="filterType = t[0]" :class="{ active: filterType === t[0] }" class="filter-chip">
            {{ t[1] }}
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
                    <button @click="resolveCluster(cluster)" class="resolve-btn">HAPUS DUPLIKAT</button>
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
                 <button @click.stop="quickFixRegistry(t)" class="sync-action-btn">
                    <span class="material-symbols-rounded">sync</span>
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
.top-app-bar { padding: env(safe-area-inset-top) 16px 8px 16px; background-color: var(--bg-primary); border-bottom: 1px solid var(--border); z-index: 100; }
.app-bar-content { height: 64px; display: flex; align-items: center; gap: 12px; }
.app-bar-content h1 { flex: 1; font-size: 22px; font-weight: 400; margin: 0; }

.anomaly-counter { display: flex; flex-direction: column; align-items: center; background: var(--error-container); color: var(--on-error-container); padding: 4px 12px; border-radius: 8px; min-width: 60px; }
.anomaly-counter .count { font-size: 16px; font-weight: 800; }
.anomaly-counter .label { font-size: 8px; font-weight: 900; opacity: 0.8; }

.icon-btn { width: 40px; height: 40px; border-radius: 20px; border: none; background: transparent; color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }

.content-scroll { flex: 1; overflow-y: auto; padding: 16px; }
.audit-stack { display: flex; flex-direction: column; gap: 32px; }

.audit-section { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 11px; font-weight: 700; color: var(--primary); letter-spacing: 1px; display: flex; align-items: center; gap: 10px; border-left: 4px solid var(--primary); padding-left: 12px; }
.section-title .material-symbols-rounded { font-size: 18px; }
.section-title .material-symbols-rounded.warning { color: var(--error); }
.section-title .material-symbols-rounded.primary { color: var(--primary); }
.section-title .material-symbols-rounded.secondary { color: var(--secondary); }

.audit-list { display: flex; flex-direction: column; gap: 12px; }
.audit-card { display: flex; align-items: center; justify-content: space-between; padding: 16px; cursor: pointer; }
.card-left { display: flex; flex-direction: column; gap: 2px; }
.item-name { font-size: 15px; font-weight: 600; }
.item-meta { font-size: 11px; color: var(--on-surface-variant); }
.desync-warn { font-size: 11px; color: var(--secondary); font-weight: 700; }

.card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.item-total { font-size: 14px; font-weight: 700; color: var(--error); }
.issue-tag { font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; }
.issue-tag.warning { background: var(--error-container); color: var(--on-error-container); }

.audit-empty-state { padding: 40px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.3; }
.audit-empty-state .material-symbols-rounded { font-size: 48px; }

.cluster-container { padding: 0; overflow: hidden; border: 1px solid var(--outline-variant); }
.cluster-header { background: rgba(0,0,0,0.2); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
.cluster-id { font-size: 10px; font-weight: 800; letter-spacing: 0.5px; opacity: 0.7; }
.resolve-btn { background: var(--primary); color: var(--on-primary); border: none; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; cursor: pointer; }

.cluster-items { display: flex; flex-direction: column; }
.cluster-item { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border); }
.cluster-item:last-child { border-bottom: none; }
.item-main { display: flex; flex-direction: column; }
.item-main .name { font-size: 14px; font-weight: 600; }
.item-main .id { font-size: 10px; opacity: 0.4; }
.item-side { display: flex; flex-direction: column; align-items: flex-end; }
.item-side .val { font-size: 13px; font-weight: 700; }
.item-side .date { font-size: 10px; opacity: 0.5; }

.sync-action-btn { background: var(--secondary-container); color: var(--on-secondary-container); border: none; height: 36px; padding: 0 16px; border-radius: 18px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; cursor: pointer; }
.sync-action-btn .material-symbols-rounded { font-size: 18px; }
</style>
