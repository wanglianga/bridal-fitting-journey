<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, MapPin, Clock, Heart, Sparkles, Camera } from 'lucide-vue-next'
import { useBrideStore } from '@/stores/bride'
import { useFittingStore } from '@/stores/fitting'
import { useShootStore } from '@/stores/shoot'
import { storeToRefs } from 'pinia'
import ProgressRing from '@/components/ProgressRing.vue'

const brideStore = useBrideStore()
const fittingStore = useFittingStore()
const shootStore = useShootStore()

const { bride, daysUntilWedding } = storeToRefs(brideStore)
const { completedRounds, totalRounds } = storeToRefs(fittingStore)
const { daysUntilNextShoot, nextShoot } = storeToRefs(shootStore)

const overallProgress = computed(() => {
  return Math.round((completedRounds.value / totalRounds.value) * 100)
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const venueTypeLabels: Record<string, string> = {
  church: '教堂婚礼',
  outdoor: '户外婚礼',
  hotel: '酒店婚礼',
  garden: '花园婚礼',
}
</script>

<template>
  <div class="relative overflow-hidden rounded-elegant-lg">
    <div class="absolute inset-0 bg-gradient-to-br from-rose-gold/20 via-champagne/15 to-mist-purple/20"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
    
    <div class="relative p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-gold to-champagne p-0.5 shadow-elegant-lg">
              <img
                v-if="bride.avatar"
                :src="bride.avatar"
                :alt="bride.name"
                class="w-full h-full rounded-full object-cover"
              />
              <div v-else class="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Sparkles class="w-8 h-8 text-rose-gold" />
              </div>
            </div>
            <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-champagne rounded-full flex items-center justify-center shadow-md">
              <Heart class="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold heading-serif text-espresso mb-1">
              {{ bride.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-3 text-sm text-espresso/70">
              <span class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4 text-rose-gold" />
                {{ formatDate(bride.weddingDate) }}
              </span>
              <span class="flex items-center gap-1.5">
                <MapPin class="w-4 h-4 text-mist-purple-dark" />
                {{ venueTypeLabels[bride.venueType] || '' }}
              </span>
            </div>
            <p class="text-sm text-espresso/50 mt-1">{{ bride.venue }}</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-center">
            <ProgressRing
              :progress="overallProgress"
              :size="80"
              :stroke-width="6"
              color="#B76E79"
              show-label
              label="试衣进度"
            />
          </div>
          
          <div class="flex flex-col gap-3">
            <div class="bg-white/70 backdrop-blur-sm rounded-elegant px-4 py-2.5 shadow-sm">
              <div class="flex items-center gap-2">
                <Clock class="w-4 h-4 text-rose-gold" />
                <span class="text-xs text-espresso/60">距离婚礼</span>
              </div>
              <p class="text-xl font-bold heading-serif text-gradient-rose">
                {{ daysUntilWedding }} 天
              </p>
            </div>
            
            <div v-if="nextShoot" class="bg-white/70 backdrop-blur-sm rounded-elegant px-4 py-2.5 shadow-sm">
              <div class="flex items-center gap-2">
                <Camera class="w-4 h-4 text-champagne" />
                <span class="text-xs text-espresso/60">下次拍摄</span>
              </div>
              <p class="text-lg font-semibold text-espresso">
                {{ daysUntilNextShoot }} 天后
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
