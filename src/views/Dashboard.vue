<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1.5rem; overflow-y: auto; height: 100%; padding-bottom: 5rem;">
    <div class="sticky-nav">
      <header class="header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0;">Jurney</h1>
          <p id="welcome-msg" style="font-size: 0.8125rem; color: var(--text-secondary); margin: 0;">Safe travels, Explorer</p>
          <div id="dash-sync-info" style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; color: var(--text-secondary); opacity: 0.8;">
            <i data-lucide="cloud-check" style="width: 12px; color: #10b981;"></i>
            <span id="dash-last-sync">Cloud: Migrating to Vue</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <div @click="toggleSearch" class="profile-icon" style="width: 40px; height: 40px; border-radius: 20px; background: var(--border); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i data-lucide="search" style="width: 20px;"></i>
          </div>
          <div class="user-meta" style="display: flex; align-items: center; gap: 0.75rem;">
            <div @click="$router.push('/settings')" class="profile-icon" style="width: 40px; height: 40px; border-radius: 20px; background: var(--border); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <i data-lucide="user" style="width: 20px;"></i>
            </div>
          </div>
        </div>
      </header>

      <div v-show="showSearch" style="position: relative; margin-bottom: 1rem; transform-origin: top; animation: slideDown 0.3s ease-out;">
        <i data-lucide="search" style="position: absolute; left: 1rem; top: 0.75rem; width: 16px; color: var(--text-secondary);"></i>
        <input type="text" v-model="searchQuery" placeholder="Scan expeditions..." style="width: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 1rem; padding: 0.75rem 1rem 0.75rem 2.5rem; color: var(--text-primary); outline: none; font-size: 0.875rem;">
      </div>
    </div>

    <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div class="stat-card" @click="$router.push('/accounts')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer;">
        <i data-lucide="wallet" style="width: 14px; color: var(--accent); margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase;">Treasure Vault</span>
        <span style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">Rp 0</span>
      </div>
      <div class="stat-card" @click="$router.push('/analysis')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer;">
        <i data-lucide="line-chart" style="width: 14px; color: #ef4444; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase;">Supplies Used</span>
        <span style="font-size: 1.25rem; font-weight: 700; color: #ef4444;">Rp 0</span>
      </div>
      <div class="stat-card" @click="$router.push('/budget')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer;">
        <i data-lucide="pie-chart" style="width: 14px; color: #22c55e; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase;">Ration Limit</span>
        <span style="font-size: 1.25rem; font-weight: 700; color: #22c55e;">Rp 0</span>
      </div>
      <div class="stat-card" @click="$router.push('/goals')" style="background: var(--glass); border: 1px solid var(--border); border-radius: var(--card-radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer;">
        <i data-lucide="target" style="width: 14px; color: #0ea5e9; margin-bottom: 0.2rem;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; text-transform: uppercase;">Destinations</span>
        <span style="font-size: 1.25rem; font-weight: 700; color: #0ea5e9;">0% Done</span>
      </div>
    </div>

    <section>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-size: 1rem; font-weight: 700;">Recent Expeditions</h3>
        <a @click.prevent="$router.push('/history')" style="font-size: 0.75rem; color: var(--accent); font-weight: 600; cursor: pointer;">See All</a>
      </div>
      
      <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 2rem; background: rgba(255,255,255,0.02); border-radius: 1rem;">
        No recent transactions yet in Vue environment.
      </div>
    </section>

    <!-- FAB -->
    <button @click="$router.push('/transaction')" class="fab" style="position: fixed; bottom: 5rem; right: 2rem; width: 56px; height: 56px; border-radius: 28px; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; border: none; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4); cursor: pointer; z-index: 100;">
      <i data-lucide="plus"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showSearch = ref(false)
const searchQuery = ref('')

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}

onMounted(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
})
</script>
