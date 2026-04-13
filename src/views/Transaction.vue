<template>
  <div class="view-content container" style="max-width: 1400px; margin: 0 auto; padding: 1rem; overflow-y: auto; height: 100%; padding-bottom: calc(120px + env(safe-area-inset-bottom));">
    <div class="sticky-nav" style="width: 92%; margin: 0 auto; padding: calc(0.2rem + env(safe-area-inset-top)) 1rem 0.2rem 1rem; border: 1px solid var(--border); border-top: none; border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem; position: sticky; top: 0; background: rgba(15, 15, 25, 0.8); backdrop-filter: blur(20px); z-index: 100; box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
      <header style="display: flex; justify-content: space-between; align-items: center; position: relative; padding: 0.35rem 0;">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <button class="back-btn" @click="$router.push('/')" style="background:none; border:none; color:var(--text-primary); cursor:pointer;"><i data-lucide="chevron-left" style="width:20px;"></i></button>
          <h1 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin:0;">Identity</h1>
        </div>
        <div>
          <button @click="saveTransaction" style="background: var(--success, #10b981); color: white; border: none; padding: 0.4rem 1rem; border-radius: 10px; font-weight: 950; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.05em; transition: 0.3s;">
            <i data-lucide="shield-check" style="width: 14px;"></i> AUTHORIZE
          </button>
        </div>
      </header>
    </div>

    <form @submit.prevent="saveTransaction" style="display: flex; flex-direction: column; gap: 2rem; margin-top: 1.5rem;">
      
      <!-- 1. Temporal -->
      <section class="form-section">
         <div class="section-header">
            <i data-lucide="clock-4" stroke-width="1.5"></i> <span style="font-weight: 700;">1. Temporal Coordinates</span>
         </div>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="input-group">
               <label class="form-label">Mission Date</label>
               <input type="date" v-model="form.date" class="f-input-clean">
            </div>
            <div class="input-group">
               <label class="form-label">Sync Time</label>
               <input type="time" v-model="form.time" class="f-input-clean">
            </div>
         </div>
         <div style="margin-top: 1.5rem;">
            <label class="form-label">Designated Author</label>
            <select v-model="form.author" class="f-input" style="background: rgba(255,255,255,0.02);">
               <option v-for="a in store.authors" :key="a.authorID" :value="a.authorName">{{ a.authorName }}</option>
               <option value="Self">Self (Standard)</option>
            </select>
         </div>
      </section>

      <!-- 2. Identity -->
      <section class="form-section">
         <div class="section-header">
            <i data-lucide="fingerprint" stroke-width="1.5"></i> <span style="font-weight: 700;">2. Object Identity</span>
         </div>
         
         <div style="margin-bottom: 2rem;">
            <button type="button" @click="startScanner" style="width: 100%; height: 50px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.1), transparent); border: 1px dashed var(--accent); color: var(--accent); border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: 0.3s; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.05);">
               <i data-lucide="scan" style="width: 18px;"></i>
               <span style="font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem;">Initialize Scanner</span>
            </button>
         </div>

         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div style="grid-column: span 2;" class="input-group">
               <label class="form-label">Primary Designation (Item Name) *</label>
               <div style="position: relative;">
                  <input type="text" v-model="itemSearch" @focus="showItemDropdown = true" @blur="hideDropdown('item')" placeholder="Search Archives..." required class="f-input" style="font-size: 1rem; border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);">
                  <div v-if="showItemDropdown && filteredItems.length" style="position: absolute; top: 110%; left: 0; right: 0; background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 12px; z-index: 100; max-height: 250px; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                     <div v-for="i in filteredItems" :key="i.itemID" @mousedown="selectItem(i)" style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s;">
                        <div style="font-weight: 800; color: white;">{{ i.itemName }}</div>
                        <div v-if="i.notes || i.itemCategory" style="font-size: 0.7rem; opacity: 0.5; margin-top: 0.25rem;">{{ i.itemCategory }} • {{ i.notes }}</div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="input-group">
               <label class="form-label">Vendor / Merchant</label>
               <div style="position: relative;">
                  <input type="text" v-model="merchantSearch" @focus="showMerchantDropdown = true" @blur="hideDropdown('merchant')" placeholder="Search Vendors..." class="f-input" style="background: rgba(255,255,255,0.02);">
                  <div v-if="showMerchantDropdown && filteredMerchants.length" style="position: absolute; top: 110%; left: 0; right: 0; background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 12px; z-index: 100; max-height: 250px; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                     <div v-for="m in filteredMerchants" :key="m.merchantID" @mousedown="selectMerchant(m)" style="padding: 0.8rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s;">
                        <div style="font-weight: 800; color: white; font-size: 0.85rem;">{{ m.merchantName }}</div>
                        <div v-if="m.location" style="font-size: 0.65rem; opacity: 0.5; margin-top: 0.2rem;">{{ m.location }}</div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="input-group">
               <label class="form-label">Classification</label>
               <div style="position: relative;">
                  <input type="text" v-model="categorySearch" @focus="showCategoryDropdown = true" @blur="hideDropdown('category')" placeholder="General" class="f-input" style="background: rgba(255,255,255,0.02);">
                  <div v-if="showCategoryDropdown && filteredCategories.length" style="position: absolute; top: 110%; left: 0; right: 0; background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 12px; z-index: 100; max-height: 250px; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                     <div v-for="c in filteredCategories" :key="c.categoryID" @mousedown="selectCategory(c)" style="padding: 0.8rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                        <div style="font-weight: 800; color: white; font-size: 0.85rem;">{{ c.category }}</div>
                        <div v-if="c.description" style="font-size: 0.65rem; opacity: 0.5; margin-top: 0.2rem;">{{ c.description }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div style="margin-top: 1.5rem;">
            <label class="form-label">Intel / Additional Notes</label>
            <textarea v-model="form.description" placeholder="Mission briefing or item specifics..." class="f-input" style="min-height: 100px; background: rgba(255,255,255,0.01); border-style: dashed;"></textarea>
         </div>
      </section>

      <!-- 3. Essence -->
      <section class="form-section">
         <div class="section-header">
            <i data-lucide="activity" stroke-width="1.5"></i> <span style="font-weight: 700;">3. Logic & Resource Flow</span>
         </div>
         <div style="margin-bottom: 2rem;">
            <label class="form-label">Transfer Type Protocol *</label>
            <div style="display: flex; gap: 0.6rem; overflow-x: auto; padding: 0.25rem 0.25rem 0.75rem 0.25rem; scrollbar-width: none;">
               <button v-for="t in ['Income', 'Expense', 'Transfer', 'Investment', 'Savings']" :key="t" type="button" @click="form.type = t" :class="{ active: form.type === t }" class="type-btn">
                  {{ t }}
               </button>
            </div>
         </div>
         
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div v-show="form.type !== 'Income'" class="input-group">
               <label class="form-label" style="display: flex; align-items: center; gap: 0.4rem;"><i data-lucide="minus-circle" style="width: 10px; color: #f87171;"></i> Source Vault *</label>
               <select v-model="form.paymentSourceAccount" class="f-input" style="background: rgba(255,255,255,0.02);">
                  <option value="">Select Vault...</option>
                  <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
               </select>
            </div>
            <div v-show="form.type !== 'Expense'" class="input-group">
               <label class="form-label" style="display: flex; align-items: center; gap: 0.4rem;"><i data-lucide="plus-circle" style="width: 10px; color: #10b981;"></i> Target Vault *</label>
               <select v-model="form.beneficiaryAccount" class="f-input" style="background: rgba(255,255,255,0.02);">
                  <option value="">Select Vault...</option>
                  <option v-for="a in store.accounts" :key="a.accountID" :value="a.accountName">{{ a.accountName }}</option>
               </select>
            </div>
         </div>

         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
            <div style="grid-column: span 2;">
               <label class="form-label">Encrypted Receipt & Evidence</label>
               <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                  <select v-model="form.receipt" class="f-input" style="flex: 1; background: rgba(255,255,255,0.02);">
                     <option value="">No Receipt Linked</option>
                     <option v-for="r in store.receipts" :key="r.receiptID" :value="r.receiptID">{{ r.merchant }} - {{ r.date }}</option>
                  </select>
                  <button type="button" @click="$refs.txPhoto.click()" style="width: 50px; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--accent); border-radius: 12px; color: var(--accent); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;">
                     <i data-lucide="camera" style="width: 20px;"></i>
                  </button>
                  <input type="file" ref="txPhoto" @change="onTxPhotoChange" accept="image/*" capture="environment" style="display: none;">
               </div>
               <div v-if="form.localPhoto" style="margin-top: 1rem; position: relative; display: inline-block;">
                  <div style="padding: 4px; background: var(--border); border-radius: 12px;">
                     <img :src="form.localPhoto" style="max-height: 140px; border-radius: 10px; display: block;">
                  </div>
                  <button type="button" @click="form.localPhoto = ''" style="position: absolute; top: -10px; right: -10px; background: #ef4444; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);">
                     <i data-lucide="x" style="width: 14px;"></i>
                  </button>
               </div>
            </div>

            <div v-if="suggestedReceipts.length > 0" style="grid-column: span 2; background: rgba(16, 185, 129, 0.03); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 1.25rem; padding: 1.25rem;">
               <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <div style="width: 4px; height: 16px; background: #10b981; border-radius: 2px;"></div>
                  <div style="font-size: 0.7rem; font-weight: 950; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em;">Matching Receipts Detected</div>
               </div>
               <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  <div v-for="sr in suggestedReceipts" :key="sr.receiptID" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                     <div style="font-size: 0.8rem;">
                        <div style="font-weight: 800; color: white;">{{ sr.merchant }}</div>
                        <div style="opacity: 0.5; font-size: 0.65rem; margin-top: 0.2rem;">{{ sr.date }} • {{ sr.account }}</div>
                     </div>
                     <button type="button" @click="linkReceipt(sr)" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 900; font-size: 0.65rem; cursor: pointer; text-transform: uppercase;">
                        Link Source
                     </button>
                  </div>
               </div>
            </div>

            <div style="display:flex; align-items:flex-end; grid-column: span 2; margin-top: 0.5rem;">
               <button type="button" @click="form.cleared = (form.cleared === 'yes' ? 'no' : 'yes')" :style="{ background: form.cleared === 'yes' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: form.cleared === 'yes' ? '#10b981' : '#f87171', border: `1px solid ${form.cleared === 'yes' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }" style="width:100%; border-radius:12px; padding:0.875rem; font-weight:900; cursor:pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: 0.3s; letter-spacing: 0.05em;">
                  <span style="font-size: 0.75rem;">TRANSACTION CLEARANCE</span>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                     <span style="font-size: 0.75rem;">{{ form.cleared === 'yes' ? 'VERIFIED' : 'PENDING' }}</span>
                     <div :style="{ background: form.cleared === 'yes' ? '#10b981' : '#f87171' }" style="width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor;"></div>
                  </div>
               </button>
            </div>
         </div>
      </section>

      <!-- 4. Pricing -->
      <section class="form-section">
         <div class="section-header" style="margin-bottom: 1.25rem;">
            <i data-lucide="banknote" stroke-width="1.5"></i> <span style="font-weight: 700;">4. Calculation Protocols</span>
         </div>

         <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); border-radius: 1.75rem; padding: 1.75rem; display: flex; flex-direction: column; gap: 1.5rem; backdrop-filter: blur(20px);">
            <!-- Currency Block -->
            <div style="display: grid; gap: 1.25rem;" :style="{ gridTemplateColumns: form.currency.toUpperCase() === 'IDR' ? '1fr' : '1fr 1fr' }">
               <div class="input-group">
                  <label class="form-label">Active Currency</label>
                  <input type="text" v-model="form.currency" class="f-input-clean" placeholder="IDR">
               </div>
               <div v-if="form.currency.toUpperCase() !== 'IDR'" class="input-group">
                  <label class="form-label">Exchange Rate</label>
                  <input type="number" v-model.number="form.exchangeRate" step="any" class="f-input-clean" placeholder="1.0">
               </div>
            </div>

            <!-- Volume & Cost Block -->
            <div style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 1.25rem;">
               <div class="input-group">
                  <label class="form-label">Quantity & Scale</label>
                  <div style="display: flex; align-items: center; gap: 0.25rem; background: var(--bg-input); padding: 0 0.5rem; border-radius: 14px; border: 1px solid var(--border); height: 50px; box-sizing: border-box; position: relative;">
                     <input type="number" v-model.number="form.quantity" step="any" style="width: 100%; background: none; border: none; font-weight: 800; color: white; outline: none; padding: 0 0.5rem; height: 100%;">
                     
                     <!-- Searchable Unit Dropdown -->
                     <div style="position: relative; min-width: 80px;">
                        <input type="text" v-model="unitSearch" @focus="showUnitDropdown = true" @blur="hideDropdown('unit')" placeholder="UNIT" 
                          style="background: var(--accent); color: white; border: none; border-radius: 10px; font-size: 0.65rem; font-weight: 900; padding: 6px 10px; outline: none; cursor: pointer; text-transform: uppercase; width: 100%; text-align: center;">
                        <div v-if="showUnitDropdown && filteredUnits.length" style="position: absolute; bottom: 120%; right: 0; min-width: 150px; background: var(--bg-primary, #000); border: 1px solid var(--border); border-radius: 12px; z-index: 100; max-height: 200px; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                           <div v-for="u in filteredUnits" :key="u.unitScale" @mousedown="selectUnit(u)" style="padding: 0.8rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                              <div style="font-weight: 800; color: white; font-size: 0.8rem;">{{ u.unitScale }}</div>
                              <div v-if="u.description" style="font-size: 0.6rem; opacity: 0.5; margin-top: 0.2rem;">{{ u.description }}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="input-group">
                  <label class="form-label">Base Cost / Item</label>
                  <div style="position: relative; display: flex; align-items: center; height: 50px;">
                     <input type="number" v-model.number="form.amountPerUnit" step="any" class="f-input" style="font-size: 1.5rem; font-weight: 950; color: white; background: rgba(255,255,255,0.03);">
                  </div>
               </div>
            </div>

            <!-- Adjustments -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px dashed var(--border); padding-top: 1.5rem;">
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; align-items: center;">
                  <div class="input-group">
                     <label class="form-label" style="color: var(--success); display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="tag" style="width: 10px;"></i> REWARD OFFSET (-)</label>
                     <div style="position: relative;">
                        <input type="number" :value="calculatedDiscount" readonly class="f-input" style="background: rgba(16, 185, 129, 0.05); color: #10b981; font-weight: 900; border: none; letter-spacing: 0.02em;">
                        <div style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); font-size: 0.55rem; font-weight: 900; opacity: 0.6; background: rgba(16, 185, 129, 0.2); padding: 2px 6px; border-radius: 4px;">CALC</div>
                     </div>
                  </div>
                  <div class="input-group">
                     <label class="form-label">LOGISTICS FEE (+)</label>
                     <input type="number" v-model.number="form.fee" step="any" class="f-input" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); font-weight: 700;">
                  </div>
               </div>
            </div>

            <!-- Privilege Selection (Sleeker) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; padding: 0.5rem 1.25rem; background: rgba(255,255,255,0.02); border-radius: 1.25rem; border: 1px solid var(--border);">
               <div class="input-group" style="justify-content: center;">
                  <label class="form-label" style="font-size: 0.6rem; opacity: 0.6; margin-bottom: 0;">Membership Protocol</label>
                  <select v-model="form.membershipID" style="background: none; border: none; padding: 0; width: 100%; color: white; font-weight: 700; outline: none; height: 30px;">
                     <option value="">No Membership Selected</option>
                     <option v-for="m in store.members" :key="m.memberID" :value="m.memberID">{{ m.memberName }}</option>
                  </select>
               </div>
               <div class="input-group" style="border-left: 1px solid var(--border); padding-left: 1.25rem; justify-content: center;">
                  <label class="form-label" style="font-size: 0.6rem; opacity: 0.6; margin-bottom: 0;">Redeemable Voucher</label>
                  <select v-model="form.voucherID" style="background: none; border: none; padding: 0; width: 100%; color: white; font-weight: 700; outline: none; height: 30px;">
                     <option value="">No Active Voucher</option>
                     <option v-for="v in store.vouchers" :key="v.voucherID" :value="v.voucherID" :disabled="v.status === 'Used' || v.status === 'Exhausted'">
                        {{ v.voucherName }}
                     </option>
                  </select>
               </div>
            </div>

            <!-- Final Result Box (Premium) -->
            <div style="background: linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%); border-radius: 1.5rem; padding: 2rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(139, 92, 246, 0.25); border: 1px solid rgba(255,255,255,0.2);">
               <div style="position: absolute; top: -30px; right: -30px; width: 140px; height: 140px; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); border-radius: 50%;"></div>
               <div style="position: absolute; bottom: -20px; left: 10%; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%; blur: 20px;"></div>
               
               <div style="position: relative; z-index: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                     <div style="font-size: 0.8rem; font-weight: 800; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.2em;">PROTOCOL SETTLEMENT</div>
                     <i data-lucide="shield-check" style="width: 18px; opacity: 0.8;"></i>
                  </div>
                  <div style="display: flex; align-items: baseline; gap: 0.75rem;">
                     <span style="font-size: 1.25rem; font-weight: 900; opacity: 0.6;">Rp</span>
                     <span style="font-size: 3rem; font-weight: 1000; letter-spacing: -0.04em; line-height: 1;">
                        {{ calculatedTotal.toLocaleString('id-ID') }}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- 5. Metadata -->
      <section class="form-section">
         <div class="section-header">
            <i data-lucide="scan-eye" stroke-width="1.5"></i> <span style="font-weight: 700;">5. Meta Coordinates</span>
         </div>
         <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="input-group">
               <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                  Classification Tags
                  <button type="button" @click="handleQuickAdd('tag')" style="background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.6rem; font-weight: 800;">+ ADD NEW</button>
               </label>
               <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button v-for="t in store.tags" :key="t.tagID" type="button" 
                     @click="form.tags = toggleValue(form.tags, t.tagName)"
                     :style="{ background: isSelected(form.tags, t.tagName) ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: isSelected(form.tags, t.tagName) ? 'white' : 'var(--text-secondary)' }"
                     style="padding: 0.4rem 0.8rem; border-radius: 8px; border: 1px solid var(--border); font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">
                     {{ t.tagName }}
                  </button>
                  <div v-if="store.tags.length === 0" style="font-size: 0.7rem; opacity: 0.4; font-style: italic;">No tags in registry</div>
               </div>
            </div>
            
            <div class="input-group">
               <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                  Project Association
                  <button type="button" @click="handleQuickAdd('project')" style="background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.6rem; font-weight: 800;">+ ADD NEW</button>
               </label>
               <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button v-for="p in store.projects" :key="p.projectID" type="button" 
                     @click="form.projects = toggleValue(form.projects, p.projectName)"
                     :style="{ background: isSelected(form.projects, p.projectName) ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: isSelected(form.projects, p.projectName) ? 'white' : 'var(--text-secondary)' }"
                     style="padding: 0.4rem 0.8rem; border-radius: 8px; border: 1px solid var(--border); font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">
                     {{ p.projectName }}
                  </button>
                  <div v-if="store.projects.length === 0" style="font-size: 0.7rem; opacity: 0.4; font-style: italic;">No projects in registry</div>
               </div>
            </div>
         </div>
      </section>

    </form>

    <!-- Scanner Overlay -->
    <div v-if="showScanner" style="position: fixed; inset: 0; background: #000; z-index: 2000; display: flex; flex-direction: column;">
       <div style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border);">
          <span style="font-weight: 800;">Scan Product SKU</span>
          <button @click="stopScanner" style="background: none; border: none; color: white;"><i data-lucide="x"></i></button>
       </div>
       <div style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative;">
          <div id="txn-reader" style="width: 100%; max-width: 500px; border-radius: 1rem; overflow: hidden;"></div>
          <div style="position: absolute; width: 250px; height: 180px; border: 2px solid var(--accent); border-radius: 1rem; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5); pointer-events: none;">
             <div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-top: 4px solid var(--accent); border-left: 4px solid var(--accent); border-top-left-radius: 12px;"></div>
             <div style="position: absolute; top: 0; right: 0; width: 40px; height: 40px; border-top: 4px solid var(--accent); border-right: 4px solid var(--accent); border-top-right-radius: 12px;"></div>
             <div style="position: absolute; bottom: 0; left: 0; width: 40px; height: 40px; border-bottom: 4px solid var(--accent); border-left: 4px solid var(--accent); border-bottom-left-radius: 12px;"></div>
             <div style="position: absolute; bottom: 0; right: 0; width: 40px; height: 40px; border-bottom: 4px solid var(--accent); border-right: 4px solid var(--accent); border-bottom-right-radius: 12px;"></div>
             <div style="position: absolute; left: 0; top: 50%; width: 100%; height: 2px; background: rgba(139, 92, 246, 0.5); animation: scanLine 2s linear infinite;"></div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const store = useFinanceStore()
const uiStore = useUIStore()

const now = new Date()
const form = ref({
  transactionID: '',
  date: now.toISOString().split('T')[0],
  time: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'),
  category: '',
  merchant: '',
  itemName: '',
  amountPerUnit: 0,
  quantity: 1,
  unitScale: 'pcs',
  type: 'Expense',
  cleared: 'yes',
  paymentSourceAccount: '',
  beneficiaryAccount: '',
  receipt: '',
  membershipID: '',
  voucherID: '',
  localPhoto: '',
  tags: '',
  projects: '',
  author: 'Self',
  discount: 0,
  fee: 0,
  total: 0,
  description: '',
  currency: 'IDR',
  exchangeRate: 1
})

// Searchable UI Refs
const itemSearch = ref('')
const showItemDropdown = ref(false)
const categorySearch = ref('')
const showCategoryDropdown = ref(false)
const merchantSearch = ref('')
const showMerchantDropdown = ref(false)
const unitSearch = ref('')
const showUnitDropdown = ref(false)

// Sync search refs to form
watch(itemSearch, (val) => { 
  if (val !== form.value.itemName) {
    form.value.itemName = val
    onItemChange() // Trigger auto-fill when typing
  }
})
watch(categorySearch, (val) => { if (val !== form.value.category) form.value.category = val })
watch(merchantSearch, (val) => { if (val !== form.value.merchant) form.value.merchant = val })
watch(unitSearch, (val) => { if (val !== form.value.unitScale) form.value.unitScale = val })

const hideDropdown = (type) => {
  setTimeout(() => {
    if (type === 'item') showItemDropdown.value = false
    else if (type === 'category') showCategoryDropdown.value = false
    else if (type === 'merchant') showMerchantDropdown.value = false
    else if (type === 'unit') showUnitDropdown.value = false
  }, 200)
}

const filteredItems = computed(() => {
  const q = itemSearch.value.toLowerCase()
  if (!q && !showItemDropdown.value) return []
  return store.items.filter(i => 
    (i.itemName || '').toLowerCase().includes(q) || 
    (i.notes || '').toLowerCase().includes(q) ||
    (i.itemCategory || '').toLowerCase().includes(q)
  ).slice(0, 10)
})

const filteredCategories = computed(() => {
  const q = categorySearch.value.toLowerCase()
  const list = store.categories.filter(c => !form.value.type || c.type === form.value.type)
  if (!q && !showCategoryDropdown.value) return list.slice(0, 10)
  return list.filter(c => 
    (c.category || '').toLowerCase().includes(q) || 
    (c.description || '').toLowerCase().includes(q)
  ).slice(0, 10)
})

const filteredUnits = computed(() => {
  const q = unitSearch.value.toLowerCase()
  if (!q && !showUnitDropdown.value) return store.unitScales.slice(0, 10)
  return store.unitScales.filter(u => 
    (u.unitScale || '').toLowerCase().includes(q) || 
    (u.description || '').toLowerCase().includes(q)
  ).slice(0, 10)
})

const filteredMerchants = computed(() => {
  const q = merchantSearch.value.toLowerCase()
  if (!q && !showMerchantDropdown.value) return store.merchants.slice(0, 10)
  return store.merchants.filter(m => 
    (m.merchantName || '').toLowerCase().includes(q) || 
    (m.location || '').toLowerCase().includes(q)
  ).slice(0, 10)
})

const selectItem = (i) => {
  form.value.itemName = i.itemName
  itemSearch.value = i.itemName
  onItemChange()
  showItemDropdown.value = false
}

const selectCategory = (c) => {
  form.value.category = c.category
  categorySearch.value = c.category
  showCategoryDropdown.value = false
}

const selectMerchant = (m) => {
  form.value.merchant = m.merchantName
  merchantSearch.value = m.merchantName
  showMerchantDropdown.value = false
}

const selectUnit = (u) => {
  form.value.unitScale = u.unitScale
  unitSearch.value = u.unitScale
  showUnitDropdown.value = false
}

const showScanner = ref(false)
let html5QrCode = null

const categoriesByType = computed(() => {
  return store.categories.filter(c => !form.value.type || c.type === form.value.type)
})

const onItemChange = () => {
  const item = store.items.find(i => i.itemName === form.value.itemName)
  if (item) {
    if (item.amountPerUnit) form.value.amountPerUnit = Number(item.amountPerUnit)
    if (item.itemCategory) {
      form.value.category = item.itemCategory
      categorySearch.value = item.itemCategory
    }
    if (item.unitScale) {
       form.value.unitScale = item.unitScale
       unitSearch.value = item.unitScale
    }
    if (item.currency) form.value.currency = item.currency
    
    // Default quantity to 1 if it's 0
    if (!form.value.quantity) form.value.quantity = 1
  }
}

const linkReceipt = (r) => {
  form.value.receipt = r.receiptID
  if (r.date) form.value.date = r.date
  if (r.time) {
     const t = String(r.time)
     form.value.time = t.includes(':') ? t.split(':').slice(0, 2).join(':') : t
  }
  if (r.merchant) form.value.merchant = r.merchant
  if (r.account) form.value.paymentSourceAccount = r.account
  store.notify('Expedition Artifact Linked', 'info')
}

const suggestedReceipts = computed(() => {
  if (!form.value.merchant && !form.value.date) return []
  return store.receipts.filter(r => {
    if (form.value.receipt === r.receiptID) return false
    const sameMch = r.merchant === form.value.merchant
    const sameDate = r.date === form.value.date
    return sameMch || (sameMch && sameDate)
  }).slice(0, 3)
})

const onTxPhotoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (f) => { form.value.localPhoto = f.target.result }
  reader.readAsDataURL(file)
}

const calculatedDiscount = computed(() => {
  let disc = 0
  const sub = (Number(form.value.quantity) * Number(form.value.amountPerUnit)) || 0
  
  // 1. Voucher Discount
  if (form.value.voucherID) {
     const v = store.vouchers.find(v => v.voucherID === form.value.voucherID)
     if (v) {
        if (v.discountType === 'Percent') disc += (sub * (Number(v.discountValue) / 100))
        else disc += Number(v.discountValue || 0)
        
        // Cap discount by balance if applicable
        if (!v.isSingleUse && v.balance > 0 && disc > v.balance) disc = v.balance
     }
  }

  // 2. Membership Discount (Percentage based)
  if (form.value.membershipID) {
     const m = store.members.find(m => m.memberID === form.value.membershipID)
     if (m && m.membershipDiscount) {
        disc += (sub * (Number(m.membershipDiscount) / 100))
     }
  }
  return disc
})

const calculatedTotal = computed(() => {
  const sub = (Number(form.value.quantity) * Number(form.value.amountPerUnit)) || 0
  const final = (sub - calculatedDiscount.value + Number(form.value.fee || 0)) * Number(form.value.exchangeRate || 1)
  return final
})

const saveTransaction = () => {
  if (!form.value.itemName) return alert("Item Name required.")
  
  form.value.discount = calculatedDiscount.value
  form.value.total = calculatedTotal.value
  
  form.value.updateTime = new Date().toISOString()
  const isEditing = !!route.query.id
  
  if (isEditing) {
    store.updateTransaction({ ...form.value })
    store.notify('Expedition Log Updated', 'success')
  } else {
    // For duplicates, we want a fresh ID
    const payload = { ...form.value }
    if (route.query.duplicate) {
      delete payload.transactionID
      payload.transactionID = 'TX-' + Date.now()
    }
    store.addTransaction(payload)
  }
  
  router.push('/')
}

const toggleValue = (current, value) => {
  const arr = current ? String(current).split(',').map(s => s.trim()).filter(Boolean) : []
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
  return arr.join(', ')
}

const isSelected = (current, value) => {
  const arr = current ? String(current).split(',').map(s => s.trim()).filter(Boolean) : []
  return arr.includes(value)
}

const handleQuickAdd = (type) => {
  const name = prompt(`Enter new ${type} name:`)
  if (!name) return
  if (type === 'tag') store.addTag({ tagName: name })
  else store.addProject({ projectName: name })
}

const startScanner = async () => {
  showScanner.value = true
  nextTick(async () => {
    if (window.lucide) window.lucide.createIcons()
    try {
      html5QrCode = new window.Html5Qrcode("txn-reader")
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 180 } },
        (decodedText) => {
          // Look up item by SKU
          const item = store.items.find(i => i.SKU === decodedText)
          if (item) {
            form.value.itemName = item.itemName
            itemSearch.value = item.itemName
            onItemChange() // Trigger auto-fill for price/category
            alert(`Detected: ${item.itemName}`)
          } else {
            alert(`SKU Not Found: ${decodedText}`)
          }
          stopScanner()
        },
        () => {}
      )
    } catch (err) {
      console.error(err)
      alert("Scanner failure.")
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

onBeforeUnmount(() => { stopScanner() })

const initForm = () => {
  const txID = route.query.id || route.query.duplicate
  
  if (txID) {
    // Force string comparison for robustness
    const tx = store.transactions.find(t => String(t.transactionID) === String(txID))
    if (tx) {
      // Ensure time is in HH:mm format for input type="time"
      let formattedTime = tx.time || ''
      if (formattedTime.includes(':')) {
        if (formattedTime.includes('1899-12-30')) {
          const parts = formattedTime.split('T')
          if (parts[1]) formattedTime = parts[1].substring(0, 5)
        } else {
          formattedTime = formattedTime.split(':').slice(0, 2).join(':')
        }
      }

      // Sanitize Date (Ensure YYYY-MM-DD for input type="date")
      let formattedDate = tx.date || ''
      if (formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0]
      }

      form.value = { 
        ...tx,
        date: formattedDate,
        time: formattedTime,
        amountPerUnit: Number(tx.amountPerUnit) || 0,
        quantity: Number(tx.quantity) || 1, 
        total: Number(tx.total) || (Number(tx.amountPerUnit) * Number(tx.quantity)) || 0,
        discount: Number(tx.discount) || 0,
        fee: Number(tx.fee) || 0,
        exchangeRate: Number(tx.exchangeRate) || 1
      }
      form.value.total = Number(form.value.total) // Double check
      
      itemSearch.value = form.value.itemName || ''
      categorySearch.value = form.value.category || ''
      merchantSearch.value = form.value.merchant || ''
      unitSearch.value = form.value.unitScale || ''
      return
    }
  }

  // Reset to defaults if no ID or no matching transaction found
  form.value = {
    transactionID: '',
    date: now.toISOString().split('T')[0],
    time: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'),
    category: '',
    merchant: '',
    itemName: '',
    amountPerUnit: 0,
    quantity: 1,
    unitScale: 'pcs',
    type: 'Expense',
    cleared: 'yes',
    paymentSourceAccount: '',
    beneficiaryAccount: '',
    receipt: '',
    membershipID: '',
    voucherID: '',
    localPhoto: '',
    tags: '',
    projects: '',
    author: 'Self',
    discount: 0,
    fee: 0,
    total: 0,
    description: '',
    currency: 'IDR',
    exchangeRate: 1
  }
  itemSearch.value = ''
  categorySearch.value = ''
  merchantSearch.value = ''
  unitSearch.value = ''
}

watch(() => route.query, () => {
  initForm()
}, { deep: true })

onMounted(() => {
  initForm()
  uiStore.registerModal('transaction-form') // Hide global bottom nav for focused entry
  if (window.lucide) window.lucide.createIcons()
})

onBeforeUnmount(() => {
  stopScanner()
  uiStore.unregisterModal('transaction-form')
})

// Re-render icons on focus/actions
watch([showItemDropdown, showCategoryDropdown, showMerchantDropdown, showUnitDropdown, scanning], () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons() })
})
</script>

<style scoped>
.form-section { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
.section-header { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: var(--accent); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
.form-label { font-size: 0.65rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem; }
.f-input { width: 100%; height: 50px; padding: 0 1rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 12px; color: white; outline: none; transition: 0.2s; font-weight: 600; font-family: inherit; box-sizing: border-box; }
.f-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15); background: rgba(255,255,255,0.05); }
.f-input-clean { width: 100%; height: 50px; padding: 0; background: transparent; border: none; border-bottom: 1px solid var(--border); color: white; outline: none; transition: 0.2s; font-weight: 700; font-size: 1rem; box-sizing: border-box; }
.f-input-clean:focus { border-color: var(--accent); }

textarea.f-input { height: auto; padding: 1rem; }

.type-btn { height: 44px; padding: 0 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; color: var(--text-secondary); font-weight: 800; font-size: 0.75rem; cursor: pointer; transition: 0.3s; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center; }
.type-btn.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); transform: translateY(-1px); }

.input-group { display: flex; flex-direction: column; }

@keyframes scanLine { from { top: 0; } to { top: 100%; } }
#txn-reader { border: none !important; }
#txn-reader video { border-radius: 1rem; }
</style>
