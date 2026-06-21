<script setup lang="ts">
import { computed } from 'vue'
import { useBrideStore } from '@/stores/bride'
import { storeToRefs } from 'pinia'
import MobileNav from '@/components/MobileNav.vue'
import ViewModeSwitcher from '@/components/ViewModeSwitcher.vue'
import { Sparkles } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const brideStore = useBrideStore()
const { viewMode, bride } = storeToRefs(brideStore)
const router = useRouter()
const route = useRoute()

const containerClass = computed(() => {
  if (viewMode.value === 'bride') {
    return 'max-w-md mx-auto'
  } else if (viewMode.value === 'consultant') {
    return 'max-w-4xl mx-auto'
  } else {
    return 'max-w-7xl mx-auto'
  }
})

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen pb-20 md:pb-0">
    <header class="sticky top-0 z-40 glass-effect border-b border-silk-dark">
      <div :class="['px-4 py-3 md:py-4', containerClass]">
        <div class="flex items-center justify-between">
          <button class="flex items-center gap-2" @click="goHome">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-rose-gold to-champagne flex items-center justify-center shadow-md">
              <Sparkles class="w-5 h-5 text-white" />
            </div>
            <div class="hidden sm:block">
              <h1 class="text-lg font-bold heading-serif text-espresso">婚纱定制</h1>
              <p class="text-xs text-espresso/50">{{ bride.name }}的试衣旅程</p>
            </div>
          </button>
          
          <ViewModeSwitcher />
        </div>
      </div>
    </header>

    <main :class="['px-4 py-6', containerClass]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <MobileNav />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
