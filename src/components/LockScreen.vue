<template>
  <div class="lock-screen-overlay">
    <div class="lock-content">
      <div class="lock-header">
        <div class="lock-logo">
           <img src="/logo.png" alt="Jurney">
        </div>
        <h2>Selamat Datang di Jurney</h2>
        <p>{{ errorMsg || 'Masukkan PIN untuk melanjutkan' }}</p>
      </div>

      <div class="pin-display">
        <div v-for="i in 4" :key="i" class="pin-dot" :class="{ filled: pin.length >= i }"></div>
      </div>

      <div class="keypad">
        <button v-for="n in 9" :key="n" @click="addDigit(n)" class="key-btn">{{ n }}</button>
        <button @click="clear" class="key-btn action">
           <span class="material-symbols-rounded">backspace</span>
        </button>
        <button @click="addDigit(0)" class="key-btn">0</button>
        <button @click="checkPin" class="key-btn action primary">
           <span class="material-symbols-rounded">check</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['savedPin'])
const emit = defineEmits(['unlocked'])
const router = useRouter()

const pin = ref('')
const errorMsg = ref('')

const addDigit = (n) => {
  if (pin.value.length < 4) {
    pin.value += n
    errorMsg.value = ''
  }
  if (pin.value.length === 4) {
     setTimeout(checkPin, 200)
  }
}

const clear = () => {
  pin.value = pin.value.slice(0, -1)
}

const checkPin = () => {
  if (pin.value === props.savedPin) {
    emit('unlocked')
  } else {
    pin.value = ''
    errorMsg.value = 'PIN Salah! Coba lagi.'
    // Haptic feedback simulation
    if (window.navigator.vibrate) window.navigator.vibrate(200)
  }
}
</script>

<style scoped>
.lock-screen-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--bg-primary);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.lock-content {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}

.lock-header { text-align: center; margin-bottom: 48px; }
.lock-logo { width: 64px; height: 64px; background: var(--primary); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(168, 199, 250, 0.3); }
.lock-logo img { width: 40px; }
.lock-header h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; font-family: 'Outfit', sans-serif; }
.lock-header p { font-size: 14px; color: var(--on-surface-variant); }

.pin-display { display: flex; gap: 24px; margin-bottom: 64px; }
.pin-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); transition: all 0.2s; }
.pin-dot.filled { background-color: var(--primary); border-color: var(--primary); transform: scale(1.2); }

.keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; }
.key-btn { width: 72px; height: 72px; border-radius: 36px; border: none; background: var(--surface-variant); color: var(--on-surface); font-size: 24px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.key-btn:active { transform: scale(0.9); background: var(--primary-container); }
.key-btn.action { background: transparent; color: var(--on-surface-variant); }
.key-btn.primary { color: var(--primary); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
