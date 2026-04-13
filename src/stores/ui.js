import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', {
  state: () => ({
    activeModals: new Set()
  }),
  getters: {
    isModalOpen: (state) => state.activeModals.size > 0
  },
  actions: {
    registerModal(id) {
      this.activeModals.add(id)
      this.updateBodyClass()
    },
    unregisterModal(id) {
      this.activeModals.delete(id)
      this.updateBodyClass()
    },
    updateBodyClass() {
      if (typeof document !== 'undefined' && document.body) {
        if (this.isModalOpen) {
          document.body.classList.add('modal-open')
        } else {
          document.body.classList.remove('modal-open')
        }
      }
    }
  }
})
