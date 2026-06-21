<script setup lang="ts">
import { Home, Shirt, Ruler, Camera, Wallet, Palette } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/', icon: Home, label: '旅程' },
  { path: '/dress-style', icon: Shirt, label: '款式' },
  { path: '/body-data', icon: Ruler, label: '身形' },
  { path: '/fitting-records', icon: Camera, label: '试衣' },
  { path: '/accessories', icon: Palette, label: '配饰' },
  { path: '/budget', icon: Wallet, label: '预算' },
]

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden">
    <div class="glass-effect border-t border-silk-dark">
      <div class="flex items-center justify-around py-2">
        <button
          v-for="item in navItems"
          :key="item.path"
          class="flex flex-col items-center gap-1 py-1.5 px-2 transition-all"
          :class="
            route.path === item.path
              ? 'text-rose-gold'
              : 'text-espresso/50 hover:text-espresso/70'
          "
          @click="navigate(item.path)"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
