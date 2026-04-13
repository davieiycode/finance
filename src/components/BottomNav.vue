<template>
  <nav class="nav-island" :class="{ 'nav-hidden': isHidden }">
    <router-link to="/" class="nav-item" active-class="active">
      <div class="icon-box">
        <i data-lucide="layout-dashboard"></i>
      </div>
      <span>Dash</span>
    </router-link>
    <router-link to="/transaction" class="nav-item action-item" active-class="active">
      <div class="plus-hex">
        <i data-lucide="plus"></i>
      </div>
      <span style="color: var(--accent);">Entry</span>
    </router-link>
    <router-link to="/history" class="nav-item" active-class="active">
      <div class="icon-box">
        <i data-lucide="scroll"></i>
      </div>
      <span>Log</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHidden = ref(false)
let lastScrollY = 0

const handleScroll = (e) => {
  if (document.body.classList.contains('modal-open')) {
    isHidden.value = true
    return
  }
  const scrollY = e.target.scrollTop
  if (scrollY > lastScrollY && scrollY > 50) {
    isHidden.value = true
  } else {
    isHidden.value = false
  }
  lastScrollY = scrollY
}

const initIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

const observer = ref(null)

onMounted(() => {
  initIcons()
  document.addEventListener('scroll', handleScroll, true)
  
  observer.value = new MutationObserver(() => {
    if (document.body.classList.contains('modal-open')) isHidden.value = true
    else isHidden.value = false
  })
  observer.value.observe(document.body, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll, true)
  if (observer.value) observer.value.disconnect()
})

watch(() => route.path, () => {
  setTimeout(initIcons, 50)
  isHidden.value = false // Show nav on route change
})
</script>

<style scoped>
.nav-island {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 240px;
  max-width: 85vw;
  height: 52px;
  background: rgba(15, 15, 25, 0.7);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 2000;
  padding: 0 1.25rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: env(safe-area-inset-bottom);
}

.nav-hidden {
  bottom: -100px;
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.95);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  flex: 1;
  padding: 0 0.5rem;
}

.icon-box {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.nav-item i {
  width: 18px;
  height: 18px;
  stroke-width: 2px;
}

.nav-item.active {
  color: white;
}

.nav-item.active .icon-box i {
  color: var(--accent, #8b5cf6);
  fill: rgba(139, 92, 246, 0.3); /* Subtle fill to make it 'solid' */
  filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.8));
  stroke-width: 2.5px;
  transform: scale(1.1);
}

.nav-item.active span {
  color: white;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.plus-hex {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent) 0%, #6d28d9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 4px;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.action-item:active .plus-hex {
  transform: scale(0.85) rotate(-15deg);
}

.nav-item.active .plus-hex {
  transform: translateY(-8px) scale(1.1);
  box-shadow: 0 12px 25px rgba(139, 92, 246, 0.5);
}

.action-item i {
  color: white;
  width: 18px;
  height: 18px;
  stroke-width: 3px;
}
</style>
