<script setup lang="ts">
import { useBrideStore } from '@/stores/bride'
import { storeToRefs } from 'pinia'
import { Smartphone, Tablet, Monitor } from 'lucide-vue-next'
import type { ViewMode } from '@/types'

const brideStore = useBrideStore()
const { viewMode } = storeToRefs(brideStore)

const modes: { value: ViewMode; label: string; icon: any; desc: string }[] = [
  { value: 'bride', label: '新娘端', icon: Smartphone, desc: '手机查看' },
  { value: 'consultant', label: '顾问端', icon: Tablet, desc: '平板记录' },
  { value: 'patternmaker', label: '版师端', icon: Monitor, desc: '大屏查看' },
]

function setMode(mode: ViewMode) {
  brideStore.setViewMode(mode)
}
</script>

<template>
  <div class="card-elegant p-2 inline-flex gap-1">
    <button
      v-for="mode in modes"
      :key="mode.value"
      class="flex items-center gap-2 px-4 py-2 rounded-elegant transition-all"
      :class="
        viewMode === mode.value
          ? 'bg-rose-gold text-white shadow-md'
          : 'text-espresso/60 hover:bg-silk hover:text-espresso'
      "
      @click="setMode(mode.value)"
    >
      <component :is="mode.icon" class="w-4 h-4" />
      <span class="text-sm font-medium hidden sm:inline">{{ mode.label }}</span>
    </button>
  </div>
</template>
