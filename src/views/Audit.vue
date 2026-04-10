<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: 5rem;">
    <header style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--border); position: sticky; top: -1px; background: var(--bg-primary, #000); z-index: 10; padding-top: 0.5rem;">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button @click="$router.push('/')" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%;">
           <i data-lucide="chevron-left" style="width: 20px;"></i>
        </button>
        <span style="font-weight: 1000; font-size: 1.15rem; letter-spacing: -0.02em; text-transform: uppercase;">Intelligence Audit</span>
      </div>
      <div style="display: flex; gap: 0.5rem;">
         <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.7rem; font-weight: 900;">{{ totalIssues }} ANOMALIES</div>
      </div>
    </header>

    <div style="display: flex; flex-direction: column; gap: 2rem; margin-top: 1.5rem;">
      <!-- Section: Pending Clearances -->
      <section class="audit-section">
        <div class="audit-header">
           <i data-lucide="clock-alert" style="color: #f59e0b;"></i>
           <span>Pending Protocol Clearances ({{ pendingClearances.length }})</span>
        </div>
        <div v-if="pendingClearances.length === 0" class="empty-state">No pending clearances detected. System is operational.</div>
        <div v-else class="audit-list">
          <div v-for="tx in pendingClearances" :key="tx.transactionID" @click="openTx(tx)" class="audit-item">
            <div style="flex: 1;">
              <div style="font-weight: 800; color: white;">{{ tx.itemName }}</div>
              <div style="font-size: 0.7rem; opacity: 0.6; margin-top: 0.2rem;">{{ tx.merchant }} • {{ tx.date }}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 950; color: #ef4444;">Rp {{ (tx.total || 0).toLocaleString('id-ID') }}</div>
              <div style="font-size: 0.55rem; color: #f59e0b; font-weight: 900; letter-spacing: 0.1em; margin-top: 0.2rem;">UNCLEARED</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Duplicate Protocols -->
      <section class="audit-section">
        <div class="audit-header">
           <i data-lucide="layers" style="color: #6366f1;"></i>
           <span>Duplicate Entry Clusters ({{ duplicateClusters.length }})</span>
        </div>
        <div v-if="duplicateClusters.length === 0" class="empty-state">No redundant protocols found. Efficiency optimal.</div>
        <div v-else class="audit-list">
          <div v-for="(cluster, idx) in duplicateClusters" :key="idx" style="border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 1rem; overflow: hidden; background: rgba(0,0,0,0.2);">
            <div style="background: rgba(99, 102, 241, 0.1); padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
               <span style="font-size: 0.65rem; font-weight: 900; letter-spacing: 0.05em;">CLUSTER #{{ idx + 1 }} • {{ cluster.length }} COPIES</span>
               <button @click="resolveCluster(cluster)" style="background: #6366f1; border: none; color: white; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.55rem; font-weight: 900; cursor: pointer;">RESOLVE</button>
            </div>
            <div v-for="tx in cluster" :key="tx.transactionID" @click="openTx(tx)" class="audit-item" style="border: none; border-bottom: 1px solid rgba(255,255,255,0.02); border-radius: 0;">
               <div style="flex: 1;">
                  <div style="font-weight: 800; color: white;">{{ tx.itemName }}</div>
                  <div style="font-size: 0.65rem; opacity: 0.5;">{{ tx.transactionID }}</div>
               </div>
               <div style="text-align: right;">
                  <div style="font-weight: 900;">Rp {{ (tx.total || 0).toLocaleString('id-ID') }}</div>
                  <div style="font-size: 0.55rem; opacity: 0.4;">{{ tx.date }}</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Metadata Desync -->
      <section class="audit-section">
        <div class="audit-header">
           <i data-lucide="database-zap" style="color: #a855f7;"></i>
           <span>Registry Desync (Tags & Projects)</span>
        </div>
        <div v-if="desyncIssues.length === 0" class="empty-state">Registry alignment 100%. Data integrity secure.</div>
        <div v-else class="audit-list">
           <div v-for="t in desyncIssues" :key="t.tx.transactionID" @click="openTx(t.tx)" class="audit-item">
              <div style="flex: 1;">
                 <div style="font-weight: 800; color: white;">{{ t.tx.itemName }}</div>
                 <div style="font-size: 0.65rem; color: #a855f7; font-weight: 700;">MISSING IN REGISTRY: {{ t.missing.join(', ') }}</div>
              </div>
              <button @click.stop="quickFixRegistry(t)" style="background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7; color: #a855f7; padding: 0.4rem 0.75rem; border-radius: 8px; font-size: 0.6rem; font-weight: 900; cursor: pointer;">SYNC ALL</button>
           </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'

const router = useRouter()
const store = useFinanceStore()

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
       txTags.forEach(tagName => {
          if (!regTags.some(rt => rt.tagName === tagName)) missing.push(tagName)
       })
    }
    if (t.projects) {
       const txPrjs = String(t.projects).split(',').map(s => s.trim()).filter(Boolean)
       txPrjs.forEach(prjName => {
          if (!regPrjs.some(rp => rp.projectName === prjName)) missing.push(prjName)
       })
    }
    if (missing.length > 0) issues.push({ tx: t, missing })
  })
  return issues
})

const totalIssues = computed(() => {
  return (pendingClearances.value?.length || 0) + (duplicateClusters.value?.length || 0) + (desyncIssues.value?.length || 0)
})

const openTx = (tx) => {
  // Navigate to transaction edit view
  router.push({ path: '/transaction', query: { id: tx.transactionID } })
}

const resolveCluster = (cluster) => {
  if (confirm(`Remove all except the first entry in this cluster (${cluster.length - 1} detections will be purged)?`)) {
     for (let i = 1; i < cluster.length; i++) {
        store.deleteTransaction(cluster[i].transactionID)
     }
     alert('Cluster protocols purged.')
  }
}

const quickFixRegistry = (issue) => {
   issue.missing.forEach(name => {
      // Very basic check: if tag or project? Usually tags are food/groceries, projects are Vacation
      // Here we check both registries and add to the matching one or both if ambiguous
      // Since it's a "Missing in Registry" issue, we'll try to add it.
      // For simplicity, we add as a tag if it doesn't exist in tags, and project if it fits
      // Actually, let's just add it to whatever it was used for.
      if (issue.tx.tags && issue.tx.tags.includes(name)) store.addTag({ tagName: name })
      if (issue.tx.projects && issue.tx.projects.includes(name)) store.addProject({ projectName: name })
   })
   alert('Registry synchronized with missing coordinates.')
}

onMounted(() => {
  if (window.lucide) window.lucide.createIcons()
})
</script>

<style scoped>
.audit-section { display: flex; flex-direction: column; gap: 1rem; }
.audit-header { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.1em; border-left: 3px solid var(--accent); padding-left: 1rem; }
.audit-list { display: flex; flex-direction: column; gap: 0.75rem; }
.audit-item { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; }
.audit-item:hover { background: rgba(255,255,255,0.05); border-color: var(--accent); }
.empty-state { padding: 2rem; background: rgba(255,255,255,0.01); border: 1px dashed var(--border); border-radius: 1rem; text-align: center; font-size: 0.75rem; color: var(--text-secondary); opacity: 0.5; font-style: italic; }
</style>
