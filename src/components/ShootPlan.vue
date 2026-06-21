<script setup lang="ts">
import { computed } from 'vue'
import { Camera, Calendar, MapPin, Scissors, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-vue-next'
import { useShootStore } from '@/stores/shoot'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'

const shootStore = useShootStore()
const fittingStore = useFittingStore()

const { shootPlans, daysUntilNextShoot, nextShoot } = storeToRefs(shootStore)
const { pendingChanges } = storeToRefs(fittingStore)

const shootTypeLabels: Record<string, { label: string; color: string }> = {
  'pre-wedding': { label: '婚纱照', color: 'rose' },
  'trial-makeup': { label: '试妆照', color: 'purple' },
  'wedding-day': { label: '婚礼当天', color: 'gold' },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const changesByRound = computed(() => {
  const grouped: Record<number, typeof pendingChanges.value> = {}
  pendingChanges.value.forEach((change) => {
    const roundId = change.fittingRoundId
    const roundNum = parseInt(roundId.split('-')[1])
    if (!grouped[roundNum]) {
      grouped[roundNum] = []
    }
    grouped[roundNum].push(change)
  })
  return grouped
})
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">拍摄计划</h3>
      <Camera class="w-5 h-5 text-rose-gold" />
    </div>

    <div v-if="nextShoot" class="bg-gradient-to-r from-rose-gold/10 to-champagne/10 rounded-elegant-lg p-4 mb-5">
      <div class="flex items-center justify-between mb-2">
        <span
          class="tag-pill"
          :class="
            shootTypeLabels[nextShoot.type].color === 'rose'
              ? 'bg-rose-gold/20 text-rose-gold'
              : shootTypeLabels[nextShoot.type].color === 'gold'
                ? 'bg-champagne/20 text-champagne-dark'
                : 'bg-mist-purple/20 text-mist-purple-dark'
          "
        >
          {{ shootTypeLabels[nextShoot.type].label }}
        </span>
        <span class="text-sm font-semibold text-rose-gold">
          {{ daysUntilNextShoot }} 天后
        </span>
      </div>
      <h4 class="text-base font-semibold text-espresso mb-1">{{ nextShoot.name }}</h4>
      <div class="flex items-center gap-4 text-xs text-espresso/60">
        <span class="flex items-center gap-1">
          <Calendar class="w-3 h-3" />
          {{ formatDate(nextShoot.date) }}
        </span>
        <span class="flex items-center gap-1">
          <MapPin class="w-3 h-3" />
          {{ nextShoot.location }}
        </span>
      </div>
      <div class="mt-3 p-2.5 bg-white/60 rounded-elegant">
        <p class="text-xs text-espresso/50 mb-1">礼服要求状态</p>
        <p class="text-sm text-espresso/80">{{ nextShoot.requiredDressState }}</p>
      </div>
    </div>

    <div class="relative">
      <div class="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-rose-gold/30 via-mist-purple/30 to-champagne/30"></div>

      <div class="space-y-4">
        <div
          v-for="(shoot, index) in shootPlans"
          :key="shoot.id"
          class="relative pl-10"
        >
          <div
            class="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md"
            :class="
              shoot.status === 'completed'
                ? 'bg-emerald-500'
                : shoot.type === 'pre-wedding'
                  ? 'bg-rose-gold'
                  : shoot.type === 'trial-makeup'
                    ? 'bg-mist-purple-dark'
                    : 'bg-champagne'
            "
          >
            <Camera class="w-4 h-4 text-white" />
          </div>

          <div
            class="p-3 rounded-elegant border transition-all"
            :class="
              shoot.status === 'completed'
                ? 'bg-emerald-50 border-emerald-100'
                : 'bg-silk/30 border-silk-dark hover:border-rose-gold/30'
            "
          >
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-sm text-espresso">{{ shoot.name }}</span>
              <span class="text-xs text-espresso/50">{{ formatShortDate(shoot.date) }}</span>
            </div>
            <p class="text-xs text-espresso/60 mb-2">{{ shoot.location }}</p>
            
            <div v-if="changesByRound[shoot.relatedFittingRound]?.length > 0" class="space-y-1">
              <p class="text-xs text-espresso/50 flex items-center gap-1">
                <Scissors class="w-3 h-3" />
                相关修改 ({{ changesByRound[shoot.relatedFittingRound].length }})
              </p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="change in changesByRound[shoot.relatedFittingRound].slice(0, 3)"
                  :key="change.id"
                  class="tag-pill text-xs"
                  :class="
                    change.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : change.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-amber-50 text-amber-600'
                  "
                >
                  {{ change.description }}
                </span>
              </div>
              
              <div class="flex items-center gap-1 text-xs mt-1">
                <AlertCircle v-if="shoot.status !== 'completed' && changesByRound[shoot.relatedFittingRound].some(c => c.deliveryImpact === 'major')" class="w-3 h-3 text-rose-gold" />
                <span
                  :class="
                    shoot.status !== 'completed' && changesByRound[shoot.relatedFittingRound].some(c => c.deliveryImpact === 'major')
                      ? 'text-rose-gold'
                      : 'text-espresso/50'
                  "
                >
                  {{
                    shoot.status !== 'completed' && changesByRound[shoot.relatedFittingRound].some(c => c.deliveryImpact === 'major')
                      ? '注意：修改可能影响拍摄'
                      : '修改进度正常'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 pt-4 border-t border-silk-dark">
      <p class="text-sm text-espresso/60 leading-relaxed">
        <span class="font-medium text-espresso">温馨提示：</span>
        建议每轮试衣后预留至少2周修改时间，以确保拍摄前礼服达到最佳状态。
      </p>
    </div>
  </div>
</template>
