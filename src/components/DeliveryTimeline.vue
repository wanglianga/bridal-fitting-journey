<script setup lang="ts">
import { computed } from 'vue'
import { Check, Clock, AlertTriangle, Sparkles, Camera, Heart, Scissors, Package, PartyPopper } from 'lucide-vue-next'
import { useBrideStore } from '@/stores/bride'
import { useShootStore } from '@/stores/shoot'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'
import type { FittingRound } from '@/types'

const brideStore = useBrideStore()
const shootStore = useShootStore()
const fittingStore = useFittingStore()
const { bride } = storeToRefs(brideStore)
const { shootPlans } = storeToRefs(shootStore)
const { fittingRounds } = storeToRefs(fittingStore)

interface TimelineNode {
  id: string
  date: string
  title: string
  type: 'fitting' | 'shoot' | 'delivery' | 'wedding'
  description: string
  status: 'completed' | 'in-progress' | 'upcoming' | 'urgent'
  icon: any
  relatedChanges: string[]
  affectedShoots?: string[]
  linkedRounds?: string[]
  requiredState?: string
  daysUntil: number
  isOnTrack: boolean
  note?: string
}

function shootTypeLabel(type: string) {
  if (type === 'pre-wedding') return '婚纱照'
  if (type === 'trial-makeup') return '试妆照'
  return '婚礼当天'
}

function isChangeLinkedToShoot(changeShoots: string[], shootId: string, shootName: string, type: string) {
  const label = shootTypeLabel(type)
  return changeShoots.some((item) => item === shootId || item === shootName || item === label)
}

const timelineNodes = computed<TimelineNode[]>(() => {
  const nodes: TimelineNode[] = []
  const now = new Date()

  fittingRounds.value.forEach((round: FittingRound) => {
    const roundDate = new Date(round.date)
    const changes = round.changes.map((c) => `${c.description}：${c.reason}`)
    const affectedShoots = round.changes
      .filter((c) => c.affectedShoots && c.affectedShoots.length > 0)
      .flatMap((c) => c.affectedShoots)
      .map((shootRef) => {
        const shoot = shootPlans.value.find((s) => isChangeLinkedToShoot([shootRef], s.id, s.name, s.type))
        return shoot ? shoot.name : shootRef
      })
      .filter(Boolean)
      .filter((item, index, list) => list.indexOf(item) === index)

    const daysDiff = Math.ceil((roundDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    nodes.push({
      id: `fitting-${round.id}`,
      date: round.date,
      title: `${round.title} (第${round.roundNumber}轮)`,
      type: 'fitting',
      description: round.description,
      status: round.status === 'completed' ? 'completed' : round.status === 'in-progress' ? 'in-progress' : daysDiff < 7 ? 'urgent' : 'upcoming',
      icon: Scissors,
      relatedChanges: changes,
      affectedShoots,
      daysUntil: Math.round(daysDiff),
      isOnTrack: round.status === 'completed' || affectedShoots.length === 0 || daysDiff >= 0,
      note: affectedShoots.length > 0
        ? `本轮修改会影响 ${affectedShoots.join('、')}，需在对应拍摄前确认完成`
        : undefined,
    })
  })

  shootPlans.value.forEach((shoot) => {
    const shootDate = new Date(shoot.date)
    const daysDiff = Math.ceil((shootDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const relatedRound = fittingRounds.value.find((round) => round.roundNumber === shoot.relatedFittingRound)
    const linkedChanges = fittingRounds.value
      .flatMap((round) => round.changes.map((change) => ({ round, change })))
      .filter(({ change }) => isChangeLinkedToShoot(change.affectedShoots, shoot.id, shoot.name, shoot.type))
    const linkedRounds = linkedChanges
      .map(({ round }) => `${round.title}第${round.roundNumber}轮`)
      .filter((item, index, list) => list.indexOf(item) === index)
    const hasIncompleteLinkedChange = linkedChanges.some(({ change }) => change.status !== 'completed')
    const isReadyByRound = !relatedRound || relatedRound.status === 'completed'

    nodes.push({
      id: `shoot-${shoot.id}`,
      date: shoot.date,
      title: shoot.name,
      type: 'shoot',
      description: `${shoot.location} · ${shootTypeLabel(shoot.type)}`,
      status: shoot.status === 'completed' || daysDiff < 0 ? 'completed' : hasIncompleteLinkedChange || daysDiff < 14 ? 'urgent' : 'upcoming',
      icon: Camera,
      relatedChanges: linkedChanges.map(({ change }) => `${change.description}：${change.reason}`),
      linkedRounds,
      requiredState: shoot.requiredDressState,
      daysUntil: Math.round(daysDiff),
      isOnTrack: (isReadyByRound && !hasIncompleteLinkedChange) || daysDiff < 0,
      note: hasIncompleteLinkedChange
        ? '仍有影响本次拍摄的修改未完成'
        : !isReadyByRound
          ? `需完成第${shoot.relatedFittingRound}轮试衣后进入本次拍摄`
          : daysDiff >= 0 && daysDiff < 14
            ? '距离拍摄不足2周，请确认礼服完成度'
            : '对应修改轮次已对齐',
    })
  })

  const weddingDate = new Date(bride.value.weddingDate)
  const daysToWedding = Math.ceil((weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const deliveryDate = new Date(weddingDate)
  deliveryDate.setDate(deliveryDate.getDate() - 7)
  const daysToDelivery = Math.ceil((deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const pendingRounds = fittingRounds.value.filter((r) => r.status !== 'completed').length
  const pendingChanges = fittingRounds.value.flatMap((r) => r.changes).filter((c) => c.status !== 'completed').length

  nodes.push({
    id: 'delivery-final',
    date: deliveryDate.toISOString().slice(0, 10),
    title: '最终成衣交付',
    type: 'delivery',
    description: '所有修改完成，最终成衣交付并试穿确认',
    status: daysToDelivery < 0 ? 'completed' : daysToDelivery < 14 ? 'urgent' : 'upcoming',
    icon: Package,
    relatedChanges: [],
    linkedRounds: fittingRounds.value.filter((r) => r.status !== 'completed').map((r) => `${r.title}第${r.roundNumber}轮`),
    requiredState: '最终成衣，所有修改完成',
    daysUntil: Math.round(daysToDelivery),
    isOnTrack: pendingRounds <= 1 && pendingChanges <= 1 && daysToDelivery >= 0,
    note: pendingRounds > 0 || pendingChanges > 0
      ? `还有${pendingRounds}轮试衣或${pendingChanges}项修改未完成，需在婚礼前7天交付`
      : '已满足婚礼前7天交付要求',
  })

  nodes.push({
    id: 'wedding-day',
    date: bride.value.weddingDate,
    title: '婚礼日',
    type: 'wedding',
    description: bride.value.venue || '婚礼仪式',
    status: daysToWedding < 0 ? 'completed' : daysToWedding < 30 ? 'urgent' : 'upcoming',
    icon: Heart,
    relatedChanges: [],
    linkedRounds: ['最终成衣交付'],
    requiredState: '成衣交付完成并完成最终试穿确认',
    daysUntil: Math.round(daysToWedding),
    isOnTrack: daysToWedding >= 7 || pendingRounds === 0,
    note: daysToWedding >= 7 ? '交付窗口仍可覆盖婚礼节点' : '婚礼节点临近，需立即确认最终成衣',
  })

  return nodes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const statusColors = {
  completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-600', border: 'border-emerald-500/30', line: 'bg-emerald-500/30' },
  'in-progress': { bg: 'bg-rose-gold/15', text: 'text-rose-gold', border: 'border-rose-gold/30', line: 'bg-rose-gold/40' },
  upcoming: { bg: 'bg-silk-dark', text: 'text-espresso/60', border: 'border-silk-dark', line: 'bg-silk-dark' },
  urgent: { bg: 'bg-champagne/20', text: 'text-champagne-dark', border: 'border-champagne/40', line: 'bg-champagne/50' },
}

const typeLabels = {
  fitting: { label: '试衣轮次', color: 'bg-rose-gold/10 text-rose-gold' },
  shoot: { label: '拍摄', color: 'bg-mist-purple/15 text-mist-purple-dark' },
  delivery: { label: '交付', color: 'bg-champagne/20 text-champagne-dark' },
  wedding: { label: '婚礼', color: 'bg-rose-gold/20 text-rose-gold' },
}
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-espresso heading-serif flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-rose-gold" />
          交付节点时间线
        </h3>
        <p class="text-xs text-espresso/50 mt-1">修改轮次 → 拍摄 → 最终交付 → 婚礼</p>
      </div>
      <span class="tag-pill bg-ivory-100 text-espresso/60">
        共 {{ timelineNodes.length }} 个节点
      </span>
    </div>

    <div class="relative">
      <div class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-silk-dark"></div>

      <div class="space-y-6">
        <div
          v-for="node in timelineNodes"
          :key="node.id"
          class="relative pl-12"
        >
          <div
            class="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-2 z-10"
            :class="[statusColors[node.status].bg, statusColors[node.status].border]"
          >
            <Check v-if="node.status === 'completed'" class="w-4 h-4" :class="statusColors[node.status].text" />
            <Clock v-else-if="node.status === 'in-progress'" class="w-4 h-4 animate-pulse" :class="statusColors[node.status].text" />
            <AlertTriangle v-else-if="node.status === 'urgent'" class="w-4 h-4" :class="statusColors[node.status].text" />
            <component v-else :is="node.icon" class="w-4 h-4" :class="statusColors[node.status].text" />
          </div>

          <div
            class="p-4 rounded-elegant border transition-all hover:shadow-sm"
            :class="node.status === 'in-progress' ? 'border-rose-gold/20 bg-rose-gold/5' : 'border-silk-dark bg-white'"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="tag-pill text-[10px]"
                  :class="typeLabels[node.type].color"
                >
                  {{ typeLabels[node.type].label }}
                </span>
                <h4 class="text-sm font-semibold text-espresso">{{ node.title }}</h4>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-espresso/50">{{ node.date }}</span>
                <span
                  class="text-xs font-medium px-2 py-0.5 rounded-full"
                  :class="[statusColors[node.status].bg, statusColors[node.status].text]"
                >
                  {{ node.daysUntil >= 0 ? node.daysUntil + '天后' : '已完成' }}
                </span>
              </div>
            </div>

            <p class="text-xs text-espresso/60 mb-3">{{ node.description }}</p>

            <div v-if="node.requiredState" class="mb-2 rounded-lg bg-ivory-50 px-3 py-2">
              <p class="text-[11px] font-medium text-espresso/70">节点要求</p>
              <p class="mt-0.5 text-xs leading-relaxed text-espresso/60">{{ node.requiredState }}</p>
            </div>

            <div v-if="node.relatedChanges && node.relatedChanges.length > 0" class="mb-2">
              <p class="text-[11px] text-espresso/50 mb-1">本次修改：</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(change, i) in node.relatedChanges"
                  :key="i"
                  class="text-[10px] px-2 py-0.5 bg-silk/50 text-espresso/60 rounded-full"
                >
                  {{ change }}
                </span>
              </div>
            </div>

            <div v-if="node.linkedRounds && node.linkedRounds.length > 0" class="mb-2">
              <p class="text-[11px] text-espresso/50 mb-1">关联轮次：</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="round in node.linkedRounds"
                  :key="round"
                  class="text-[10px] px-2 py-0.5 bg-rose-gold/10 text-rose-gold rounded-full"
                >
                  {{ round }}
                </span>
              </div>
            </div>

            <div v-if="node.affectedShoots && node.affectedShoots.length > 0" class="mb-2">
              <div class="flex items-center gap-1 text-[11px]">
                <Camera class="w-3 h-3 text-mist-purple-dark" />
                <span class="text-mist-purple-dark">影响拍摄：</span>
                <span class="text-espresso/60">{{ node.affectedShoots.join('、') }}</span>
              </div>
            </div>

            <div v-if="node.note" class="mt-2 flex items-start gap-1.5">
              <AlertTriangle v-if="!node.isOnTrack" class="w-3.5 h-3.5 text-champagne-dark flex-shrink-0 mt-0.5" />
              <PartyPopper v-else class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span
                class="text-xs"
                :class="node.isOnTrack ? 'text-emerald-600' : 'text-champagne-dark'"
              >
                {{ node.note }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 pt-4 border-t border-silk-dark">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span class="text-espresso/60 text-xs">已完成</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-rose-gold"></span>
          <span class="text-espresso/60 text-xs">进行中</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-champagne"></span>
          <span class="text-espresso/60 text-xs">临近/风险</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-silk-dark"></span>
          <span class="text-espresso/60 text-xs">待处理</span>
        </div>
      </div>
    </div>
  </div>
</template>
