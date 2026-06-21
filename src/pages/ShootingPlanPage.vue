<script setup lang="ts">
import { computed } from 'vue'
import { Camera, Calendar, MapPin, Scissors, Clock, AlertCircle, CheckCircle, User, Layers, ArrowRight } from 'lucide-vue-next'
import { useShootStore } from '@/stores/shoot'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'

const shootStore = useShootStore()
const fittingStore = useFittingStore()

const { shootPlans, nextShoot, daysUntilNextShoot } = storeToRefs(shootStore)
const { fittingRounds, allChanges } = storeToRefs(fittingStore)

const shootTypeLabels: Record<string, { label: string; color: string; bgClass: string; textClass: string }> = {
  'pre-wedding': { label: '婚纱照', color: 'rose', bgClass: 'bg-rose-gold/20', textClass: 'text-rose-gold' },
  'trial-makeup': { label: '试妆照', color: 'purple', bgClass: 'bg-mist-purple/20', textClass: 'text-mist-purple-dark' },
  'wedding-day': { label: '婚礼当天', color: 'gold', bgClass: 'bg-champagne/20', textClass: 'text-champagne-dark' },
}

const changesByRound = computed(() => {
  const grouped: Record<number, typeof allChanges.value> = {}
  allChanges.value.forEach((change) => {
    const roundId = change.fittingRoundId
    const roundNum = parseInt(roundId.split('-')[1])
    if (!grouped[roundNum]) {
      grouped[roundNum] = []
    }
    grouped[roundNum].push(change)
  })
  return grouped
})

const shootsByRound = computed(() => {
  const grouped: Record<number, typeof shootPlans.value> = {}
  shootPlans.value.forEach((shoot) => {
    const round = shoot.relatedFittingRound
    if (!grouped[round]) {
      grouped[round] = []
    }
    grouped[round].push(shoot)
  })
  return grouped
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function getDaysUntil(dateStr: string) {
  const today = new Date()
  const targetDate = new Date(dateStr)
  const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    completed: '已完成',
    'in-progress': '进行中',
    pending: '待处理',
    approved: '已确认',
    upcoming: '即将到来',
  }
  return map[status] || status
}

function getImpactText(impact: string) {
  const map: Record<string, string> = {
    none: '无影响',
    minor: '轻微影响',
    major: '重大影响',
  }
  return map[impact] || impact
}

const sortedShootPlans = computed(() => {
  return [...shootPlans.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const completedShoots = computed(() => shootPlans.value.filter((s) => s.status === 'completed').length)
const totalShoots = computed(() => shootPlans.value.length)
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient py-8 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 animate-fade-in-down">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-mist-purple/20 rounded-full mb-4">
          <Camera class="w-4 h-4 text-mist-purple-dark" />
          <span class="text-sm font-medium text-mist-purple-dark">精心规划</span>
        </div>
        <h1 class="text-4xl font-bold heading-serif text-espresso mb-3">
          拍摄计划
        </h1>
        <p class="text-espresso/60 max-w-xl mx-auto">
          清晰的拍摄时间线，实时追踪修改进度，确保每一次拍摄都完美呈现。
        </p>
      </div>

      <div class="grid md:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <div class="card-elegant p-5">
          <p class="text-sm text-espresso/60 mb-1">拍摄总数</p>
          <p class="text-3xl font-bold heading-serif text-espresso">{{ totalShoots }}</p>
        </div>
        <div class="card-elegant p-5">
          <p class="text-sm text-espresso/60 mb-1">已完成</p>
          <p class="text-3xl font-bold heading-serif text-emerald-600">{{ completedShoots }}</p>
        </div>
        <div class="card-elegant p-5">
          <p class="text-sm text-espresso/60 mb-1">待拍摄</p>
          <p class="text-3xl font-bold heading-serif text-rose-gold">{{ totalShoots - completedShoots }}</p>
        </div>
        <div class="card-elegant p-5">
          <p class="text-sm text-espresso/60 mb-1">下次拍摄</p>
          <p class="text-3xl font-bold heading-serif text-gradient-rose">
            {{ daysUntilNextShoot !== null ? `${daysUntilNextShoot}天` : '-' }}
          </p>
        </div>
      </div>

      <div v-if="nextShoot" class="card-elegant p-6 mb-8 animate-fade-in-up">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-elegant-lg bg-gradient-to-br from-rose-gold to-champagne flex items-center justify-center">
              <Camera class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-espresso/50 mb-0.5">即将到来</p>
              <h3 class="text-xl font-semibold heading-serif text-espresso">{{ nextShoot.name }}</h3>
            </div>
          </div>
          <div class="text-right">
            <span
              class="tag-pill mb-1"
              :class="[
                shootTypeLabels[nextShoot.type].bgClass,
                shootTypeLabels[nextShoot.type].textClass,
              ]"
            >
              {{ shootTypeLabels[nextShoot.type].label }}
            </span>
            <p class="text-2xl font-bold heading-serif text-gradient-rose">
              {{ daysUntilNextShoot }} 天后
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="flex items-center gap-3 p-3 bg-silk/30 rounded-elegant">
            <Calendar class="w-5 h-5 text-rose-gold" />
            <div>
              <p class="text-xs text-espresso/50">日期</p>
              <p class="text-sm font-medium text-espresso">{{ formatDate(nextShoot.date) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-silk/30 rounded-elegant">
            <MapPin class="w-5 h-5 text-rose-gold" />
            <div>
              <p class="text-xs text-espresso/50">地点</p>
              <p class="text-sm font-medium text-espresso">{{ nextShoot.location }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-silk/30 rounded-elegant">
            <User class="w-5 h-5 text-rose-gold" />
            <div>
              <p class="text-xs text-espresso/50">摄影师</p>
              <p class="text-sm font-medium text-espresso">{{ nextShoot.photographer || '待定' }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 p-4 bg-gradient-to-r from-rose-gold/5 to-champagne/5 rounded-elegant border border-rose-gold/10">
          <p class="text-sm font-medium text-espresso/80 mb-1">礼服要求状态</p>
          <p class="text-base text-espresso">{{ nextShoot.requiredDressState }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-elegant bg-rose-gold/10 flex items-center justify-center">
                  <Layers class="w-5 h-5 text-rose-gold" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-espresso heading-serif">拍摄时间线</h3>
                  <p class="text-sm text-espresso/50">所有拍摄计划一览</p>
                </div>
              </div>
            </div>

            <div class="relative">
              <div class="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-rose-gold/30 via-mist-purple/30 to-champagne/30"></div>

              <div class="space-y-6">
                <div
                  v-for="(shoot, index) in sortedShootPlans"
                  :key="shoot.id"
                  class="relative pl-12"
                >
                  <div
                    class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10"
                    :class="{
                      'bg-emerald-500': shoot.status === 'completed',
                      'bg-rose-gold': shoot.type === 'pre-wedding' && shoot.status !== 'completed',
                      'bg-mist-purple-dark': shoot.type === 'trial-makeup' && shoot.status !== 'completed',
                      'bg-champagne': shoot.type === 'wedding-day' && shoot.status !== 'completed',
                    }"
                  >
                    <Camera class="w-5 h-5 text-white" />
                  </div>

                  <div
                    class="p-5 rounded-elegant-lg border transition-all"
                    :class="{
                      'bg-emerald-50 border-emerald-100': shoot.status === 'completed',
                      'bg-white border-silk-dark hover:border-rose-gold/30': shoot.status !== 'completed',
                    }"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="text-base font-semibold text-espresso">{{ shoot.name }}</h4>
                          <span
                            class="tag-pill text-xs"
                            :class="[
                              shootTypeLabels[shoot.type].bgClass,
                              shootTypeLabels[shoot.type].textClass,
                            ]"
                          >
                            {{ shootTypeLabels[shoot.type].label }}
                          </span>
                        </div>
                        <div class="flex items-center gap-4 text-sm text-espresso/50">
                          <span class="flex items-center gap-1">
                            <Calendar class="w-3.5 h-3.5" />
                            {{ formatShortDate(shoot.date) }}
                          </span>
                          <span class="flex items-center gap-1">
                            <MapPin class="w-3.5 h-3.5" />
                            {{ shoot.location }}
                          </span>
                        </div>
                      </div>
                      <span
                        v-if="shoot.status === 'completed'"
                        class="tag-pill bg-emerald-100 text-emerald-700"
                      >
                        <CheckCircle class="w-3 h-3 mr-1" />
                        已完成
                      </span>
                      <span
                        v-else
                        class="tag-pill bg-rose-gold/10 text-rose-gold"
                      >
                        <Clock class="w-3 h-3 mr-1" />
                        {{ getDaysUntil(shoot.date) }} 天后
                      </span>
                    </div>

                    <div class="p-3 bg-silk/30 rounded-elegant mb-4">
                      <p class="text-xs text-espresso/50 mb-1">礼服要求状态</p>
                      <p class="text-sm text-espresso/80">{{ shoot.requiredDressState }}</p>
                    </div>

                    <div v-if="changesByRound[shoot.relatedFittingRound]?.length > 0">
                      <div class="flex items-center gap-2 mb-2">
                        <Scissors class="w-4 h-4 text-rose-gold" />
                        <span class="text-sm font-medium text-espresso/80">
                          关联修改（第{{ shoot.relatedFittingRound }}轮试衣）
                        </span>
                        <span class="text-xs text-espresso/40">
                          {{ changesByRound[shoot.relatedFittingRound].length }} 项
                        </span>
                      </div>

                      <div class="space-y-2">
                        <div
                          v-for="change in changesByRound[shoot.relatedFittingRound]"
                          :key="change.id"
                          class="flex items-center justify-between p-2.5 bg-white/50 rounded-elegant"
                        >
                          <div class="flex items-center gap-2">
                            <span
                              class="tag-pill text-xs"
                              :class="{
                                'bg-emerald-100 text-emerald-700': change.status === 'completed',
                                'bg-blue-50 text-blue-600': change.status === 'in-progress',
                                'bg-amber-50 text-amber-600': change.status === 'approved',
                                'bg-silk text-espresso/50': change.status === 'pending',
                              }"
                            >
                              {{ getStatusText(change.status) }}
                            </span>
                            <span class="text-sm text-espresso">{{ change.description }}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <AlertCircle
                              v-if="change.deliveryImpact === 'major'"
                              class="w-3.5 h-3.5 text-rose-gold"
                            />
                            <span
                              class="text-xs"
                              :class="{
                                'text-emerald-600': change.deliveryImpact === 'none',
                                'text-amber-600': change.deliveryImpact === 'minor',
                                'text-rose-gold': change.deliveryImpact === 'major',
                              }"
                            >
                              {{ getImpactText(change.deliveryImpact) }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="shoot.status !== 'completed' && changesByRound[shoot.relatedFittingRound].some(c => c.deliveryImpact === 'major')"
                        class="mt-3 p-3 bg-rose-gold/5 border border-rose-gold/20 rounded-elegant flex items-start gap-2"
                      >
                        <AlertCircle class="w-4 h-4 text-rose-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <p class="text-sm font-medium text-rose-gold">注意：修改可能影响拍摄</p>
                          <p class="text-xs text-rose-gold/70 mt-0.5">
                            建议及时跟进修改进度，必要时调整拍摄计划。
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-3 text-sm text-espresso/40">
                      暂无关联修改
                    </div>
                  </div>

                  <div v-if="index < sortedShootPlans.length - 1" class="flex justify-center py-3">
                    <ArrowRight class="w-4 h-4 text-espresso/20 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-elegant bg-mist-purple/20 flex items-center justify-center">
                <Scissors class="w-5 h-5 text-mist-purple-dark" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-espresso heading-serif">修改进度</h3>
                <p class="text-sm text-espresso/50">按试衣轮次分组</p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="round in fittingRounds"
                :key="round.id"
                class="p-3 bg-silk/30 rounded-elegant"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-espresso">
                    第{{ round.roundNumber }}轮 - {{ round.title }}
                  </span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-emerald-100 text-emerald-700': round.status === 'completed',
                      'bg-rose-gold/10 text-rose-gold': round.status === 'in-progress',
                      'bg-silk-dark text-espresso/50': round.status === 'upcoming',
                    }"
                  >
                    {{ getStatusText(round.status) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-espresso/50">
                  <span>{{ round.changes.length }} 项修改</span>
                  <span>·</span>
                  <span>
                    {{ round.changes.filter(c => c.status === 'completed').length }} 项已完成
                  </span>
                </div>

                <div v-if="shootsByRound[round.roundNumber]?.length > 0" class="mt-2 pt-2 border-t border-silk-dark">
                  <p class="text-xs text-espresso/40 mb-1">影响拍摄：</p>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="shoot in shootsByRound[round.roundNumber]"
                      :key="shoot.id"
                      class="text-xs px-2 py-0.5 bg-white/70 rounded text-espresso/60"
                    >
                      {{ shoot.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <h3 class="text-sm font-medium text-espresso/80 mb-3 flex items-center gap-2">
              <Clock class="w-4 h-4 text-champagne-dark" />
              温馨提示
            </h3>
            <ul class="space-y-2 text-xs text-espresso/60 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                建议每轮试衣后预留至少2周修改时间
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                拍摄前一周确认礼服最终状态
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                重要修改请提前与顾问沟通确认
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                如遇修改延期，及时调整拍摄计划
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
