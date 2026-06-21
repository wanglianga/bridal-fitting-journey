<script setup lang="ts">
import { computed } from 'vue'
import { Scissors, Clock, AlertTriangle, CheckCircle, DollarSign, Camera } from 'lucide-vue-next'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'

const fittingStore = useFittingStore()
const { selectedRound, allChanges, pendingChanges } = storeToRefs(fittingStore)

const statusConfig = {
  pending: { label: '待确认', color: 'amber', icon: Clock },
  approved: { label: '已确认', color: 'blue', icon: CheckCircle },
  'in-progress': { label: '修改中', color: 'purple', icon: Scissors },
  completed: { label: '已完成', color: 'emerald', icon: CheckCircle },
}

const impactConfig = {
  none: { label: '不影响', color: 'emerald' },
  minor: { label: '轻微影响', color: 'amber' },
  major: { label: '较大影响', color: 'rose' },
}

const currentRoundChanges = computed(() => {
  return selectedRound.value?.changes || []
})
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">修改记录</h3>
      <span class="text-sm text-espresso/50">
        待修改 {{ pendingChanges.length }} 项
      </span>
    </div>

    <div v-if="currentRoundChanges.length === 0" class="text-center py-8">
      <Scissors class="w-12 h-12 mx-auto text-espresso/20 mb-3" />
      <p class="text-sm text-espresso/50">本次试衣暂无修改项</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="change in currentRoundChanges"
        :key="change.id"
        class="p-4 rounded-elegant border transition-all hover:shadow-elegant"
        :class="[
          change.status === 'completed'
            ? 'bg-emerald-50/50 border-emerald-100'
            : change.status === 'in-progress'
              ? 'bg-mist-purple/5 border-mist-purple/20'
              : 'bg-white border-silk-dark',
        ]"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center"
              :class="[
                statusConfig[change.status].color === 'emerald'
                  ? 'bg-emerald-100'
                  : statusConfig[change.status].color === 'purple'
                    ? 'bg-mist-purple/20'
                    : statusConfig[change.status].color === 'blue'
                      ? 'bg-blue-100'
                      : 'bg-amber-100',
              ]"
            >
              <component
                :is="statusConfig[change.status].icon"
                class="w-3.5 h-3.5"
                :class="[
                  statusConfig[change.status].color === 'emerald'
                    ? 'text-emerald-600'
                    : statusConfig[change.status].color === 'purple'
                      ? 'text-mist-purple-dark'
                      : statusConfig[change.status].color === 'blue'
                        ? 'text-blue-600'
                        : 'text-amber-600',
                ]"
              />
            </div>
            <span class="font-medium text-sm text-espresso">{{ change.description }}</span>
          </div>
          <span
            class="tag-pill text-xs"
            :class="[
              statusConfig[change.status].color === 'emerald'
                ? 'bg-emerald-100 text-emerald-700'
                : statusConfig[change.status].color === 'purple'
                  ? 'bg-mist-purple/20 text-mist-purple-dark'
                  : statusConfig[change.status].color === 'blue'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700',
            ]"
          >
            {{ statusConfig[change.status].label }}
          </span>
        </div>

        <p class="text-sm text-espresso/70 ml-9 mb-3">{{ change.reason }}</p>

        <div class="flex items-center gap-4 ml-9 text-xs">
          <div class="flex items-center gap-1.5 text-espresso/60">
            <DollarSign class="w-3.5 h-3.5" />
            <span>¥{{ change.cost.toLocaleString() }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-espresso/60">
            <Clock class="w-3.5 h-3.5" />
            <span>{{ change.estimatedDays }} 天</span>
          </div>
          <div
            class="flex items-center gap-1"
            :class="[
              impactConfig[change.deliveryImpact].color === 'emerald'
                ? 'text-emerald-600'
                : impactConfig[change.deliveryImpact].color === 'amber'
                  ? 'text-amber-600'
                  : 'text-rose-gold',
            ]"
          >
            <AlertTriangle v-if="change.deliveryImpact !== 'none'" class="w-3.5 h-3.5" />
            <span>{{ impactConfig[change.deliveryImpact].label }}</span>
          </div>
        </div>

        <div v-if="change.affectedShoots.length > 0" class="mt-3 ml-9">
          <div class="flex items-center gap-1.5 text-xs text-espresso/50 mb-1">
            <Camera class="w-3 h-3" />
            <span>影响拍摄</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="shoot in change.affectedShoots"
              :key="shoot"
              class="tag-pill bg-silk text-espresso/70 text-xs"
            >
              {{ shoot }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="pendingChanges.length > 0" class="mt-5 pt-4 border-t border-silk-dark">
      <div class="flex items-center justify-between">
        <span class="text-sm text-espresso/70">待确认修改费用</span>
        <span class="font-semibold text-rose-gold">
          ¥{{ pendingChanges.reduce((sum, c) => sum + c.cost, 0).toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>
