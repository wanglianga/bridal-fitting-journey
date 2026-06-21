<script setup lang="ts">
import { Calendar, MapPin, CheckCircle, Clock, Circle } from 'lucide-vue-next'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'

const fittingStore = useFittingStore()
const { fittingRounds, selectedRoundId } = storeToRefs(fittingStore)

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
  },
  'in-progress': {
    icon: Clock,
    color: 'text-rose-gold',
    bgColor: 'bg-rose-gold/10',
    borderColor: 'border-rose-gold/30',
  },
  upcoming: {
    icon: Circle,
    color: 'text-espresso/30',
    bgColor: 'bg-silk',
    borderColor: 'border-silk-dark',
  },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function selectRound(id: string) {
  fittingStore.selectRound(id)
}
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-espresso heading-serif">试衣旅程</h3>
      <span class="text-sm text-espresso/50">
        {{ fittingRounds.filter((r) => r.status === 'completed').length }}/{{ fittingRounds.length }} 轮
      </span>
    </div>

    <div class="relative">
      <div class="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-rose-gold/30 via-rose-gold/20 to-silk-dark"></div>

      <div class="space-y-4">
        <div
          v-for="(round, index) in fittingRounds"
          :key="round.id"
          class="relative pl-12 cursor-pointer group"
          :class="{
            'opacity-60': round.status === 'upcoming' && selectedRoundId !== round.id,
          }"
          @click="selectRound(round.id)"
        >
          <div
            class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            :class="[
              statusConfig[round.status].bgColor,
              statusConfig[round.status].borderColor,
              'border-2',
              selectedRoundId === round.id ? 'scale-110 ring-4 ring-rose-gold/20' : '',
              'group-hover:scale-105',
            ]"
          >
            <component
              :is="statusConfig[round.status].icon"
              class="w-5 h-5"
              :class="statusConfig[round.status].color"
            />
          </div>

          <div
            class="p-4 rounded-elegant transition-all duration-300"
            :class="[
              selectedRoundId === round.id
                ? 'bg-rose-gold/5 border border-rose-gold/20'
                : 'bg-silk/30 border border-transparent group-hover:bg-silk/50',
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-espresso">{{ round.title }}</span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="[
                  round.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : round.status === 'in-progress'
                      ? 'bg-rose-gold/10 text-rose-gold'
                      : 'bg-silk-dark text-espresso/50',
                ]"
              >
                {{ round.status === 'completed' ? '已完成' : round.status === 'in-progress' ? '进行中' : '待开始' }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-xs text-espresso/60">
              <span class="flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                {{ formatDate(round.date) }}
              </span>
            </div>
            <p v-if="round.description" class="text-sm text-espresso/70 mt-2">{{ round.description }}</p>

            <div v-if="round.status === 'in-progress' || round.status === 'completed'" class="mt-3">
              <div class="flex items-center gap-2">
                <span v-for="change in round.changes.slice(0, 3)" :key="change.id" class="tag-pill"
                  :class="[
                    change.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    change.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                    change.status === 'approved' ? 'bg-amber-50 text-amber-600' :
                    'bg-silk text-espresso/50'
                  ]">
                  {{ change.description }}
                </span>
                <span v-if="round.changes.length > 3" class="text-xs text-espresso/40">
                  +{{ round.changes.length - 3 }} 项
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
