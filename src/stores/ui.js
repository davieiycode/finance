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
    haptic(type = 'light') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        if (type === 'light') navigator.vibrate(10)
        else if (type === 'medium') navigator.vibrate(20)
        else if (type === 'heavy') navigator.vibrate(50)
        else if (type === 'success') navigator.vibrate([10, 30, 10])
        else if (type === 'error') navigator.vibrate([50, 50, 50])
      }
    },
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
