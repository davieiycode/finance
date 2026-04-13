<template>
  <div ref="scrollContainer" class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 0 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(100px + env(safe-area-inset-bottom)); position: relative;">
    <div class="sticky-nav" style="width: 92%; margin: 0 auto; padding: calc(0.2rem + env(safe-area-inset-top)) 1rem 0.2rem 1rem; border: 1px solid var(--border); border-top: none; border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem; position: sticky; top: 0; background: rgba(15, 15, 25, 0.8); backdrop-filter: blur(20px); z-index: 100; box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative; padding: 0.35rem 0;">
        <div style="display: flex; align-items: center; gap: 0.75rem;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:20px;"></i></button>
          <h1 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin:0; white-space: nowrap;">Item Catalog</h1>
        </div>
        
        <div style="display: flex; gap: 0.5rem; align-items: center;" :style="{ opacity: showSearch ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: showSearch ? 'none' : 'auto' }">
          <button @click="showSearch = true" style="background:none; border:none; color:var(--text-primary); cursor:pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="search" style="width: 18px;"></i>
          </button>
        </div>

        <!-- Expanding Search Bar -->
        <div :style="{ width: showSearch ? '100%' : '0px', opacity: showSearch ? 1 : 0, pointerEvents: showSearch ? 'auto' : 'none' }" style="position: absolute; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: flex-end; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
           <div style="position: relative; width: 100%; height: 36px; display: flex; align-items: center; min-width: 250px;">
              <i data-lucide="search" style="position: absolute; left: 1rem; width: 16px; color: var(--text-secondary);"></i>
              <input type="text" v-model="searchQuery" placeholder="Search archives..." style="width: 100%; height: 100%; background: var(--bg-input); border: 1px solid var(--border); border-radius: 18px; padding: 0 2.5rem 0 2.5rem; color: var(--text-primary); outline: none; font-size: 0.8125rem;">
              <button @click="showSearch = false; searchQuery = ''" style="position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 12px;">
                 <i data-lucide="x" style="width: 16px;"></i>
              </button>
           </div>
        </div>
      </header>
    </div>

    <div class="item-list" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
      <div v-for="item in filteredItems" :key="item.itemID" @click="openModal(item)" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.2s;">
        <div style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(139,92,246,0.1); color: var(--accent); font-weight: 700; flex-shrink: 0; overflow: hidden;">
           <img v-if="item.itemImage" :src="item.itemImage" style="width: 100%; height: 100%; object-fit: cover;">
           <span v-else>{{ (item.itemName || 'I')[0].toUpperCase() }}</span>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 700; color: white; display: flex; justify-content: space-between;">
             {{ item.itemName }}
             <span>{{ item.currency }} {{ (item.amountPerUnit || 0).toLocaleString('id-ID') }}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
             {{ item.itemCategory || 'General' }} • {{ item.unitScale || 'pcs' }} • {{ item.SKU || 'No SKU' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Scanner Overlay -->
    <div v-if="showScanner" style="position: fixed; inset: 0; background: #000; z-index: 2000; display: flex; flex-direction: column;">
       <div style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border);">
          <span style="font-weight: 800;">Scan SKU / Barcode</span>
          <button @click="stopScanner" style="background: none; border: none; color: white;"><i data-lucide="x"></i></button>
       </div>
       <div style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative; background: #000;">
          <div id="reader" style="width: 100%; max-width: 500px; border-radius: 1rem; overflow: hidden;"></div>
          <!-- Scanning Frame Overlay -->
          <div style="position: absolute; width: 250px; height: 180px; border: 2px solid var(--accent); border-radius: 1rem; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5); pointer-events: none;">
             <div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-top: 4px solid var(--accent); border-left: 4px solid var(--accent); border-top-left-radius: 12px;"></div>
             <div style="position: absolute; top: 0; right: 0; width: 40px; height: 40px; border-top: 4px solid var(--accent); border-right: 4px solid var(--accent); border-top-right-radius: 12px;"></div>
             <div style="position: absolute; bottom: 0; left: 0; width: 40px; height: 40px; border-bottom: 4px solid var(--accent); border-left: 4px solid var(--accent); border-bottom-left-radius: 12px;"></div>
             <div style="position: absolute; bottom: 0; right: 0; width: 40px; height: 40px; border-bottom: 4px solid var(--accent); border-right: 4px solid var(--accent); border-bottom-right-radius: 12px;"></div>
             <div style="position: absolute; left: 0; top: 50%; width: 100%; height: 2px; background: rgba(139, 92, 246, 0.5); animation: scanLine 2s linear infinite;"></div>
          </div>
       </div>
       <div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.875rem;">
          Place barcode / QR code inside the frame
       </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" :class="{ 'modal-active': isModalOpen }" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 2rem; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
         <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg-primary); z-index: 5;">
            <span style="font-weight: 800;">{{ editingItem.itemID ? (modalMode === 'analysis' ? 'Item Intelligence' : 'Modify Item' ) : 'New Item' }}</span>
            <button @click="isModalOpen = false" style="background: none; border: none; color: white; cursor: pointer;"><i data-lucide="x"></i></button>
         </div>

         <!-- MODE: ANALYSIS -->
         <div v-if="modalMode === 'analysis' && editingItem.itemID" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; gap: 1.25rem; align-items: center;">
               <div style="width: 80px; height: 80px; border-radius: 20px; background: rgba(139, 92, 246, 0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border);">
                  <img v-if="editingItem.itemImage" :src="editingItem.itemImage" style="width: 100%; height: 100%; object-fit: cover;">
                  <i v-else data-lucide="package" style="width: 32px; color: var(--accent);"></i>
               </div>
               <div>
                  <div style="font-size: 1.25rem; font-weight: 900;">{{ editingItem.itemName }}</div>
                  <div style="font-size: 0.75rem; opacity: 0.5; margin-top: 0.2rem;">{{ editingItem.itemCategory }} • {{ editingItem.SKU || 'No SKU' }}</div>
               </div>
            </div>

            <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 1.25rem; padding: 1.25rem;">
               <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <i data-lucide="line-chart" style="width: 14px; color: var(--accent);"></i>
                  <span style="font-size: 0.7rem; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Intelligence Analysis</span>
               </div>
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Current Live Price</div>
                     <div style="font-size: 1rem; font-weight: 950; color: #3b82f6; margin-top: 0.25rem;">
                       Rp {{ (itemAnalysis.lastPrice || 0).toLocaleString('id-ID') }}
                       <span style="display: block; font-size: 0.5rem; opacity: 0.5; font-weight: 400; margin-top: 2px;">LATEST LOG</span>
                     </div>
                  </div>
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Total Protocol Outflow</div>
                     <div style="font-size: 1rem; font-weight: 950; color: #ef4444; margin-top: 0.25rem;">Rp {{ (itemAnalysis.totalSpend || 0).toLocaleString('id-ID') }}</div>
                  </div>
                  
                  <div v-if="itemAnalysis.bestPrice" style="background: rgba(16, 185, 129, 0.05); padding: 1rem; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); grid-column: span 2;">
                     <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 900; text-transform: uppercase; color: #10b981;">Best Historical Value (1Y)</div>
                        <div style="font-size: 0.7rem; font-weight: 800; color: #10b981;">{{ itemAnalysis.bestMerchant }}</div>
                     </div>
                     <div style="font-size: 1.2rem; font-weight: 950; color: #10b981; margin-top: 0.25rem;">Rp {{ itemAnalysis.bestPrice.toLocaleString('id-ID') }}</div>
                     <p style="font-size: 0.65rem; opacity: 0.6; margin-top: 0.5rem; line-height: 1.4;">
                        Secured at <b>{{ itemAnalysis.bestMerchant }}</b> on {{ itemAnalysis.bestDate }}. 
                        Savings potential: {{ (((itemAnalysis.lastPrice - itemAnalysis.bestPrice) / itemAnalysis.lastPrice) * 100).toFixed(1) }}% vs current.
                     </p>
                  </div>

                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Inventory Harvested</div>
                     <div style="font-size: 1rem; font-weight: 950; color: white; margin-top: 0.25rem;">{{ itemAnalysis.totalQty }} <span style="font-size: 0.6rem; opacity: 0.4;">{{ editingItem.unitScale }}</span></div>
                  </div>
                  <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.55rem; opacity: 0.6; font-weight: 800; text-transform: uppercase;">Avg Acquisition Cost</div>
                     <div style="font-size: 1rem; font-weight: 950; color: var(--accent); margin-top: 0.25rem;">Rp {{ Math.round(itemAnalysis.avgPrice).toLocaleString('id-ID') }}</div>
                  </div>
               </div>
               
               <div v-if="itemAnalysis.insight" style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; font-size: 0.75rem; border: 1px dashed var(--border); line-height: 1.5; color: var(--text-secondary);">
                  <i data-lucide="zap" style="width: 12px; display: inline-block; margin-right: 4px; color: var(--accent);"></i>
                  {{ itemAnalysis.insight }}
               </div>
            </div>

            <div v-if="editingItem.notes" style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">
               <div style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">Inventory Notes</div>
               <div style="font-size: 0.8rem; line-height: 1.5;">{{ editingItem.notes }}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
               <button @click="modalMode = 'edit'" style="padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 14px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em;">
                  <i data-lucide="edit-3" style="width: 14px;"></i> MODIFY ITEM
               </button>
               <button @click="isModalOpen = false" style="padding: 1rem; background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 14px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">
                  CLOSE INTELLIGENCE
               </button>
            </div>
         </div>

         <!-- MODE: EDIT -->
         <div v-else style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; padding-bottom: 6rem;">
            <div><label class="f-label">Item Name</label><input type="text" v-model="formData.itemName" class="f-input"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div>
                  <label class="f-label">Category</label>
                  <select v-model="formData.itemCategory" class="f-input">
                     <option value="">Select Category...</option>
                     <option v-for="c in store.categories" :key="c.categoryID" :value="c.category">{{ c.category }}</option>
                  </select>
               </div>
               <div>
                  <label class="f-label">Unit Scale</label>
                  <select v-model="formData.unitScale" class="f-input">
                     <option value="">Select Unit...</option>
                     <option v-for="u in store.unitScales" :key="u.unitScale" :value="u.unitScale">{{ u.unitScale }}</option>
                  </select>
               </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Amount per Unit</label><input type="number" v-model.number="formData.amountPerUnit" class="f-input"></div>
               <div><label class="f-label">Currency</label><input type="text" v-model="formData.currency" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
               <div><label class="f-label">Manufacturer</label><input type="text" v-model="formData.manufacturer" class="f-input"></div>
               <div><label class="f-label">Model</label><input type="text" v-model="formData.model" class="f-input"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
               <div style="grid-column: span 2;">
                  <label class="f-label">SKU</label>
                  <div style="display: flex; gap: 0.5rem;">
                     <input type="text" v-model="formData.SKU" class="f-input" placeholder="Scan or type SKU">
                     <button @click="startScanner" style="background: rgba(139, 92, 246, 0.1); border: 1px solid var(--accent); color: var(--accent); padding: 0 1rem; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                        <i data-lucide="scan" style="width: 16px;"></i>
                        <span style="font-weight: 700; font-size: 0.75rem;">SCAN</span>
                     </button>
                  </div>
               </div>
               <div style="grid-column: span 2;"><label class="f-label">Warranty Expire</label><input type="date" v-model="formData.warrantyExpiryDate" class="f-input"></div>
            </div>
            <div><label class="f-label">Image URL</label><input type="text" v-model="formData.itemImage" class="f-input"></div>

            <div><label class="f-label">Notes</label><textarea v-model="formData.notes" class="f-input" style="min-height: 80px;"></textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
               <button @click="saveItem" style="padding: 0.8rem; background: var(--accent); color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="check-circle" style="width: 14px;"></i> SAVE ITEM
               </button>
               <button v-if="editingItem.itemID" @click="handleDuplicate" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="copy" style="width: 14px;"></i> DUPE
               </button>
               <button v-if="editingItem.itemID" @click="handleMerge" style="padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border); color: white; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <i data-lucide="combine" style="width: 14px;"></i> MERGE
               </button>
               <button v-if="editingItem.itemID" @click="deleteItem" style="padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; grid-column: span 2;">
                  <i data-lucide="trash-2" style="width: 14px;"></i> DELETE
               </button>
            </div>
         </div>
       </div>

       <!-- Merge Selection Panel -->
       <div v-if="isMergePanelOpen" style="position: absolute; inset: 0; background: var(--bg-primary, #000); z-index: 3000; border-radius: 2rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid var(--border);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
             <span style="font-weight: 800; color: var(--accent);">Target Selection</span>
             <button @click="isMergePanelOpen = false" style="background:none; border:none; color:white; cursor:pointer;"><i data-lucide="x"></i></button>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
             Select the target entity to absorb "{{ editingItem.itemName }}".
          </div>
          <input type="text" v-model="mergeTargetSearch" placeholder="Search target catalog..." class="f-input" style="background: rgba(255,255,255,0.05);">
          
          <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
             <div v-for="target in filteredMergeTargets" :key="target.itemID" @click="performMerge(target)" style="padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: 0.2s;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(139, 92, 246, 0.1); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">
                   {{ (target.itemName || 'I')[0].toUpperCase() }}
                </div>
                <div>
                   <div style="font-weight: 700; font-size: 0.875rem;">{{ target.itemName }}</div>
                   <div style="font-size: 0.65rem; color: var(--text-secondary);">{{ target.itemCategory }}</div>
                </div>
             </div>
             <div v-if="filteredMergeTargets.length === 0" style="text-align: center; padding: 2rem; opacity: 0.5; font-size: 0.75rem;">
                No compatible targets found in this sector.
             </div>
          </div>
       </div>
      </div>
    </Teleport>

    <!-- Bottom Contextual Island (Filters) -->
    <Teleport to="body">
       <div v-if="!document.body.classList.contains('modal-open')" style="position: fixed; bottom: 7.5rem; left: 50%; transform: translateX(-50%); z-index: 1500; width: auto; max-width: 90vw; background: rgba(15, 15, 25, 0.7); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.1); border-radius: 32px; padding: 0.6rem 1rem; display: flex; gap: 0.5rem; overflow-x: auto; scrollbar-width: none; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          <button @click="selectedCategory = ''" :class="{ active: selectedCategory === '' }" class="filter-pill" style="padding: 0.4rem 1.25rem; height: 32px; font-size: 0.65rem;">ALL</button>
          <button v-for="cat in uniqueCategories" :key="cat" @click="selectedCategory = cat" :class="{ active: selectedCategory === cat }" class="filter-pill" style="padding: 0.4rem 1.25rem; height: 32px; font-size: 0.65rem; white-space: nowrap;">
             {{ cat }}
          </button>
       </div>
    </Teleport>

    <!-- Add New Item FAB -->
    <Teleport to="body">
       <button @click="openModal(null)" class="fab" style="position: fixed; bottom: 6.5rem; right: 1.5rem; width: 56px; height: 56px; border-radius: 28px; background: var(--accent); color: white; border: none; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2000; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <i data-lucide="plus" style="width: 24px; height: 24px; stroke-width: 3;"></i>
       </button>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { useFinanceStore } from '../stores/finance'

const store = useFinanceStore()
const scrollContainer = ref(null)
const isModalOpen = ref(false)
const modalMode = ref('analysis')
const editingItem = ref({})
const formData = ref({})
const selectedCategory = ref('')
const showSearch = ref(false)
const searchQuery = ref('')
const showScanner = ref(false)
let html5QrCode = null

const itemAnalysis = computed(() => {
  if (!editingItem.value.itemID) return { totalSpend: 0, totalQty: 0, avgPrice: 0, lastPrice: 0, bestPrice: 0, bestMerchant: '', bestDate: '', insight: '' }
  
  const txs = store.transactions.filter(t => t.itemName === editingItem.value.itemName && t.type === 'Expense')
  if (txs.length === 0) return { totalSpend: 0, totalQty: 0, avgPrice: 0, lastPrice: 0, bestPrice: 0, bestMerchant: '', bestDate: '', insight: 'No mission data recorded for this item.' }
  
  const sortedTxs = [...txs].sort((a, b) => new Date(b.date) - new Date(a.date))
  const lastPrice = sortedTxs[0].amountPerUnit || 0
  
  const totalSpend = txs.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const totalQty = txs.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0)
  const avgPrice = totalQty > 0 ? totalSpend / totalQty : 0
  
  // Best Price (Lowest in 1 Year)
  const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const yearlyTxs = txs.filter(t => new Date(t.date) >= oneYearAgo)
  
  let bestPrice = 0, bestMerchant = '', bestDate = ''
  if (yearlyTxs.length > 0) {
    const best = yearlyTxs.reduce((min, t) => (t.amountPerUnit < min.amountPerUnit) ? t : min, yearlyTxs[0])
    bestPrice = best.amountPerUnit
    bestMerchant = best.merchant
    bestDate = best.date
  }

  // Insight
  let insight = ''
  if (lastPrice > avgPrice * 1.2) insight = 'Inflation Alert: Current price is significantly higher than historical average.'
  else if (lastPrice < bestPrice && bestPrice > 0) insight = 'Optimal Acquisition: Current price is at a historical low.'
  else insight = `Stable asset. Maintain standard procurement via ${bestMerchant || 'current vendors'}.`

  return { totalSpend, totalQty, avgPrice, lastPrice, bestPrice, bestMerchant, bestDate, insight }
})

const uniqueCategories = computed(() => {
  const cats = store.items.map(i => i.itemCategory).filter(Boolean)
  return [...new Set(cats)].sort()
})

const filteredItems = computed(() => {
  let list = store.items
  if (selectedCategory.value) {
    list = list.filter(i => i.itemCategory === selectedCategory.value)
  }
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(i => 
    (i.itemName || '').toLowerCase().includes(q) ||
    (i.itemCategory || '').toLowerCase().includes(q) ||
    (i.SKU || '').toLowerCase().includes(q) ||
    (i.manufacturer || '').toLowerCase().includes(q)
  )
})

const openModal = (item) => {
  if (item) { 
    editingItem.value = { ...item }
    formData.value = { 
      ...item,
      amountPerUnit: Number(item.amountPerUnit) || 0
    } 
    modalMode.value = 'analysis'
  }
  else { 
    editingItem.value = {}
    formData.value = { itemName: '', itemCategory: 'Food & Groceries', unitScale: 'pcs', amountPerUnit: 0, currency: 'IDR', manufacturer: '', model: '', SKU: '', warrantyExpiryDate: '', notes: '', itemImage: '' } 
    modalMode.value = 'edit'
  }
  isModalOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const saveItem = () => {
  if (!formData.value.itemName) return alert('Name required')
  if (editingItem.value.itemID) store.updateItem({ ...formData.value })
  else store.addItem({ ...formData.value })
  isModalOpen.value = false
}

const deleteItem = () => { if (confirm('Delete this item?')) { store.deleteItem(editingItem.value.itemID); isModalOpen.value = false } }

const handleDuplicate = () => {
  const data = { ...formData.value }
  delete data.itemID
  editingItem.value = {}
  formData.value = data
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const isMergePanelOpen = ref(false)
const mergeTargetSearch = ref('')
const filteredMergeTargets = computed(() => {
  const q = mergeTargetSearch.value.toLowerCase()
  return store.items
    .filter(i => i.itemID !== editingItem.value.itemID)
    .filter(i => (i.itemName || '').toLowerCase().includes(q))
    .slice(0, 10)
})

const handleMerge = () => {
  isMergePanelOpen.value = true
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
}

const performMerge = (target) => {
  if (confirm(`Relocate financial payload from "${editingItem.value.itemName}" to "${target.itemName}"? This will update all transaction logs and delete the source item.`)) {
    store.mergeEntities('items', editingItem.value.itemName, target.itemName)
    isMergePanelOpen.value = false
    isModalOpen.value = false
  }
}

const startScanner = async () => {
  showScanner.value = true
  nextTick(async () => {
    if (window.lucide) window.lucide.createIcons()
    try {
      html5QrCode = new window.Html5Qrcode("reader")
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 180 } },
        (decodedText) => {
          formData.value.SKU = decodedText
          stopScanner()
        },
        () => {} // silent error for frame mismatch
      )
    } catch (err) {
      console.error("Scanner error:", err)
      alert("Search camera access failed.")
      showScanner.value = false
    }
  })
}

const stopScanner = async () => {
  if (html5QrCode) {
    try {
      await html5QrCode.stop()
      await html5QrCode.clear()
    } catch (err) { console.warn(err) }
    html5QrCode = null
  }
  showScanner.value = false
}

onBeforeUnmount(() => { 
  stopScanner()
  document.body.classList.remove('modal-open')
})

// Re-render icons when mode changes (Pulse Fix)
watch([modalMode, isMergePanelOpen], () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})

watch(isModalOpen, (val) => {
  if (val) document.body.classList.add('modal-open')
  else document.body.classList.remove('modal-open')
})

onMounted(() => { 
  if (scrollContainer.value) scrollContainer.value.scrollTo(0, 0)
  if (window.lucide) window.lucide.createIcons() 
})
</script>

<style scoped>
.f-label { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.4rem; }
.f-input { width: 100%; padding: 0.8rem 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; }
.filter-pill { padding: 0.5rem 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 20px; color: var(--text-secondary); font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: 0.3s; white-space: nowrap; }
.filter-pill.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }

@keyframes scanLine { 0% { top: 0; } 100% { top: 100%; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
