<script setup lang="ts">
import { computed } from 'vue'
import { Heart, Scissors, Camera, Wallet, Sparkles } from 'lucide-vue-next'
import HeroSection from '@/components/HeroSection.vue'
import JourneyTimeline from '@/components/JourneyTimeline.vue'
import ShootPlan from '@/components/ShootPlan.vue'
import StatCard from '@/components/StatCard.vue'
import { useFittingStore } from '@/stores/fitting'
import { useShootStore } from '@/stores/shoot'
import { useBudgetStore } from '@/stores/budget'
import { useDressStore } from '@/stores/dress'
import { storeToRefs } from 'pinia'

const fittingStore = useFittingStore()
const shootStore = useShootStore()
const budgetStore = useBudgetStore()
const dressStore = useDressStore()

const { completedRounds, totalRounds, pendingChanges } = storeToRefs(fittingStore)
const { shootPlans } = storeToRefs(shootStore)
const { budget, paidPercentage } = storeToRefs(budgetStore)
const { selectedDress } = storeToRefs(dressStore)

const completedShoots = computed(() => {
  return shootPlans.value.filter(s => s.status === 'completed').length
})
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient pb-8">
    <div class="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div class="mb-6 md:mb-8 animate-fade-in-down">
        <h1 class="text-2xl md:text-3xl font-bold heading-serif text-espresso mb-2">
          试衣旅程
        </h1>
        <p class="text-espresso/60 text-sm md:text-base">
          记录您的专属婚纱定制之旅，每一次试衣都是向完美更近一步
        </p>
      </div>

      <div class="mb-6 md:mb-8 animate-fade-in">
        <HeroSection />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        <StatCard
          title="试衣进度"
          :value="`${completedRounds}/${totalRounds}`"
          subtitle="已完成试衣轮次"
          :icon="Heart"
          color="rose"
        />
        <StatCard
          title="待处理修改"
          :value="pendingChanges.length"
          subtitle="项修改正在进行"
          :icon="Scissors"
          color="gold"
        />
        <StatCard
          title="拍摄计划"
          :value="`${completedShoots}/${shootPlans.length}`"
          subtitle="已完成拍摄场次"
          :icon="Camera"
          color="purple"
        />
        <StatCard
          title="已付金额"
          :value="`${paidPercentage}%`"
          :subtitle="'¥' + budget.paidAmount.toLocaleString()"
          :icon="Wallet"
          color="rose"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <div class="animate-fade-in-up" style="animation-delay: 0.1s">
            <JourneyTimeline />
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="animate-fade-in-up" style="animation-delay: 0.2s">
            <ShootPlan />
          </div>

          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-espresso heading-serif">当前款式</h3>
              <Sparkles class="w-5 h-5 text-champagne" />
            </div>
            <div v-if="selectedDress" class="flex gap-4">
              <div class="w-20 h-24 rounded-elegant overflow-hidden flex-shrink-0 bg-ivory-100">
                <img
                  :src="selectedDress.imageUrl"
                  :alt="selectedDress.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-espresso truncate">{{ selectedDress.name }}</h4>
                <p class="text-sm text-espresso/60 mt-1 line-clamp-2">
                  {{ selectedDress.description }}
                </p>
                <p class="text-rose-gold font-semibold mt-2">
                  ¥{{ selectedDress.price.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
