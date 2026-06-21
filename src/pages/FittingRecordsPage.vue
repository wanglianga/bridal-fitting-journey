<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, User, CheckCircle, Circle, ArrowRight, Camera, Scissors, MessageSquare } from 'lucide-vue-next'
import PhotoAnnotation from '@/components/PhotoAnnotation.vue'
import ConsultantNotes from '@/components/ConsultantNotes.vue'
import ChangesList from '@/components/ChangesList.vue'
import ViewModeSwitcher from '@/components/ViewModeSwitcher.vue'
import { useFittingStore } from '@/stores/fitting'
import { useBrideStore } from '@/stores/bride'
import { storeToRefs } from 'pinia'
import type { FittingStatus } from '@/types'

const fittingStore = useFittingStore()
const brideStore = useBrideStore()
const { fittingRounds, selectedRound, selectedRoundId } = storeToRefs(fittingStore)
const { viewMode } = storeToRefs(brideStore)

const isConsultant = computed(() => viewMode.value === 'consultant')

const statusConfig: Record<FittingStatus, { label: string; color: string; bgColor: string }> = {
  upcoming: { label: '待进行', color: 'text-espresso/50', bgColor: 'bg-silk' },
  'in-progress': { label: '进行中', color: 'text-champagne', bgColor: 'bg-champagne/10' },
  completed: { label: '已完成', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
}

function selectRound(id: string) {
  fittingStore.selectRound(id)
}

const completedCount = computed(() => {
  return fittingRounds.value.filter((r) => r.status === 'completed').length
})

const selectedPhotoAngles = computed(() => {
  if (!selectedRound.value || selectedRound.value.photos.length === 0) return '待上传'
  const angleLabels: Record<string, string> = {
    front: '正面',
    side: '侧面',
    back: '背面',
    detail: '细节',
  }
  return selectedRound.value.photos.map((photo) => angleLabels[photo.angle] || photo.angle).join('、')
})

const selectedAnnotationCount = computed(() => {
  return selectedRound.value?.photos.reduce((total, photo) => total + photo.annotations.length, 0) || 0
})
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold text-espresso heading-serif">试穿记录</h1>
          <p class="text-sm text-espresso/60 mt-1">记录每一次试穿，见证完美嫁衣的诞生</p>
        </div>
        <ViewModeSwitcher />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1">
          <div class="card-elegant p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-espresso heading-serif">试衣轮次</h3>
              <span class="text-xs text-espresso/50">
                {{ completedCount }} / {{ fittingRounds.length }}
              </span>
            </div>

            <div class="space-y-2">
              <div
                v-for="round in fittingRounds"
                :key="round.id"
                class="p-3 rounded-elegant cursor-pointer transition-all"
                :class="
                  selectedRoundId === round.id
                    ? 'bg-rose-gold/10 border border-rose-gold/30'
                    : 'hover:bg-silk/50 border border-transparent'
                "
                @click="selectRound(round.id)"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 mt-0.5">
                    <CheckCircle
                      v-if="round.status === 'completed'"
                      class="w-5 h-5 text-emerald-500"
                    />
                    <Circle
                      v-else-if="round.status === 'upcoming'"
                      class="w-5 h-5 text-espresso/30"
                    />
                    <div
                      v-else
                      class="w-5 h-5 rounded-full border-2 border-champagne flex items-center justify-center"
                    >
                      <div class="w-2 h-2 rounded-full bg-champagne animate-pulse-soft"></div>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p
                        class="text-sm font-medium truncate"
                        :class="selectedRoundId === round.id ? 'text-rose-gold' : 'text-espresso'"
                      >
                        {{ round.title }}
                      </p>
                    </div>
                    <p class="text-xs text-espresso/50 mt-0.5">{{ round.description }}</p>
                    <div class="flex items-center gap-3 mt-2">
                      <div class="flex items-center gap-1 text-xs text-espresso/40">
                        <Calendar class="w-3 h-3" />
                        <span>{{ round.date }}</span>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full"
                        :class="[statusConfig[round.status].color, statusConfig[round.status].bgColor]"
                      >
                        {{ statusConfig[round.status].label }}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    v-if="selectedRoundId === round.id"
                    class="w-4 h-4 text-rose-gold flex-shrink-0 mt-1"
                  />
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-silk-dark">
              <div class="flex items-center gap-2 text-sm">
                <User class="w-4 h-4 text-mist-purple-dark" />
                <span class="text-espresso/70">专属顾问：</span>
                <span class="font-medium text-espresso">{{ selectedRound?.consultantName }}</span>
              </div>
            </div>
          </div>

          <div class="card-elegant p-4 mt-4">
            <div class="flex items-center gap-2 mb-3">
              <Clock class="w-4 h-4 text-champagne" />
              <h4 class="text-sm font-medium text-espresso">本次试衣概览</h4>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div class="text-center p-2 rounded-lg bg-silk/30">
                <Camera class="w-4 h-4 mx-auto text-rose-gold mb-1" />
                <p class="text-sm font-semibold text-espresso">{{ selectedRound?.photos.length || 0 }}</p>
                <p class="text-[10px] text-espresso/50">照片</p>
              </div>
              <div class="text-center p-2 rounded-lg bg-silk/30">
                <Scissors class="w-4 h-4 mx-auto text-mist-purple-dark mb-1" />
                <p class="text-sm font-semibold text-espresso">{{ selectedRound?.changes.length || 0 }}</p>
                <p class="text-[10px] text-espresso/50">修改项</p>
              </div>
              <div class="text-center p-2 rounded-lg bg-silk/30">
                <MessageSquare class="w-4 h-4 mx-auto text-champagne mb-1" />
                <p class="text-sm font-semibold text-espresso">
                  {{ selectedRound?.consultantNotes ? '有' : '无' }}
                </p>
                <p class="text-[10px] text-espresso/50">笔记</p>
              </div>
            </div>
            <div class="mt-3 rounded-lg bg-ivory-50 px-3 py-2 text-xs leading-relaxed text-espresso/60">
              <p>照片角度：{{ selectedPhotoAngles }}</p>
              <p>批注总数：{{ selectedAnnotationCount }} 处，照片区会同步显示局部批注点与修改说明。</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-6">
          <div v-if="isConsultant" class="card-elegant p-4 bg-gradient-to-r from-rose-gold/5 to-champagne/5 border-rose-gold/20">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-rose-gold/10 flex items-center justify-center">
                <User class="w-5 h-5 text-rose-gold" />
              </div>
              <div>
                <p class="text-sm font-medium text-espresso">顾问模式</p>
                <p class="text-xs text-espresso/60">您可以编辑笔记、添加批注和管理修改记录</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <PhotoAnnotation />
            </div>
            <div class="space-y-6">
              <ConsultantNotes />
            </div>
          </div>

          <div>
            <ChangesList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
