<script setup lang="ts">
import { computed } from 'vue'
import { Check, Clock, AlertTriangle, Sparkles, Camera, Heart, Scissors, Package, PartyPopper, AlertCircle, CheckCircle2, Link2, ArrowRight, Zap } from 'lucide-vue-next'
import { useBrideStore } from '@/stores/bride'
import { useShootStore } from '@/stores/shoot'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'
import type { FittingRound, ChangeItem, ShootPlan, DeliveryImpact } from '@/types'

const brideStore = useBrideStore()
const shootStore = useShootStore()
const fittingStore = useFittingStore()
const { bride } = storeToRefs(brideStore)
const { shootPlans } = storeToRefs(shootStore)
const { fittingRounds } = storeToRefs(fittingStore)

interface RelatedChange {
  id: string
  description: string
  reason: string
  status: string
  deliveryImpact: DeliveryImpact
}

interface TimelineNode {
  id: string
  date: string
  title: string
  type: 'fitting' | 'shoot' | 'delivery' | 'wedding'
  description: string
  status: 'completed' | 'in-progress' | 'upcoming' | 'urgent'
  icon: any
  relatedChanges: RelatedChange[]
  affectedShoots?: Array<{ id: string; name: string; date: string; daysUntil: number }>
  affectsWedding?: boolean
  daysUntil: number
  isOnTrack: boolean
  note?: string
  deliveryImpact?: DeliveryImpact
  allChangesCompleted?: boolean
}

const deliveryImpactLabels: Record<DeliveryImpact, { label: string; color: string; bg: string }> = {
  none: { label: '无影响', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  minor: { label: '轻微影响', color: 'text-champagne-dark', bg: 'bg-champagne/15' },
  major: { label: '严重影响', color: 'text-rose-gold', bg: 'bg-rose-gold/15' },
}

const timelineNodes = computed<TimelineNode[]>(() => {
  const nodes: TimelineNode[] = []
  const now = new Date()

  const shootById = (id: string): ShootPlan | undefined => {
    return shootPlans.value.find((s) => s.id === id)
  }

  fittingRounds.value.forEach((round: FittingRound) => {
    const roundDate = new Date(round.date)
    const daysDiff = Math.ceil((roundDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const relatedChanges: RelatedChange[] = round.changes.map((c) => ({
      id: c.id,
      description: c.description,
      reason: c.reason,
      status: c.status,
      deliveryImpact: c.deliveryImpact,
    }))

    const affectedShootIds = new Set<string>()
    round.changes.forEach((c) => c.affectedShoots.forEach((id) => affectedShootIds.add(id)))

    const affectedShoots = Array.from(affectedShootIds)
      .map((id) => {
        const shoot = shootById(id)
        if (!shoot) return null
        const shootDate = new Date(shoot.date)
        return {
          id: shoot.id,
          name: shoot.name,
          date: shoot.date,
          daysUntil: Math.ceil((shootDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        }
      })
      .filter(Boolean) as Array<{ id: string; name: string; date: string; daysUntil: number }>

    const affectsWedding = round.changes.some((c) => c.affectedShoots.includes('shoot-003'))

    const maxImpact = round.changes.reduce<DeliveryImpact>((max, c) => {
      const order: DeliveryImpact[] = ['none', 'minor', 'major']
      return order.indexOf(c.deliveryImpact) > order.indexOf(max) ? c.deliveryImpact : max
    }, 'none')

    const allChangesCompleted = round.changes.length > 0 && round.changes.every((c) => c.status === 'completed')

    nodes.push({
      id: `fitting-${round.id}`,
      date: round.date,
      title: `${round.title} (第${round.roundNumber}轮)`,
      type: 'fitting',
      description: round.description,
      status: round.status === 'completed' ? 'completed' : round.status === 'in-progress' ? 'in-progress' : daysDiff < 7 ? 'urgent' : 'upcoming',
      icon: Scissors,
      relatedChanges,
      affectedShoots,
      affectsWedding,
      daysUntil: Math.round(daysDiff),
      isOnTrack: round.status === 'completed' || (maxImpact !== 'major'),
      deliveryImpact: maxImpact,
      allChangesCompleted,
    })
  })

  shootPlans.value.forEach((shoot) => {
    const shootDate = new Date(shoot.date)
    const daysDiff = Math.ceil((shootDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const relatedChanges: RelatedChange[] = []
    fittingRounds.value.forEach((round) => {
      round.changes.forEach((c: ChangeItem) => {
        if (c.affectedShoots.includes(shoot.id)) {
          relatedChanges.push({
            id: c.id,
            description: c.description,
            reason: c.reason,
            status: c.status,
            deliveryImpact: c.deliveryImpact,
          })
        }
      })
    })

    const allChangesCompleted = relatedChanges.length > 0 && relatedChanges.every((c) => c.status === 'completed')
    const maxImpact = relatedChanges.reduce<DeliveryImpact>((max, c) => {
      const order: DeliveryImpact[] = ['none', 'minor', 'major']
      return order.indexOf(c.deliveryImpact) > order.indexOf(max) ? c.deliveryImpact : max
    }, 'none')

    nodes.push({
      id: `shoot-${shoot.id}`,
      date: shoot.date,
      title: shoot.name,
      type: 'shoot',
      description: `${shoot.location} · ${shoot.type === 'pre-wedding' ? '婚纱照' : shoot.type === 'trial-makeup' ? '试妆照' : '婚礼当天'}`,
      status: daysDiff < 0 ? 'completed' : daysDiff < 14 ? 'urgent' : 'upcoming',
      icon: Camera,
      relatedChanges,
      daysUntil: Math.round(daysDiff),
      isOnTrack: relatedChanges.length === 0 || allChangesCompleted,
      note: relatedChanges.length > 0 && !allChangesCompleted
        ? `还有${relatedChanges.filter((c) => c.status !== 'completed').length}项关联修改未完成`
        : relatedChanges.length > 0 && allChangesCompleted
          ? '所有关联修改已完成'
          : undefined,
      deliveryImpact: maxImpact,
      allChangesCompleted,
    })
  })

  const weddingDate = new Date(bride.value.weddingDate)
  const daysToWedding = Math.ceil((weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const deliveryDate = new Date(weddingDate)
  deliveryDate.setDate(deliveryDate.getDate() - 7)
  const daysToDelivery = Math.ceil((deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const weddingRelatedChanges: RelatedChange[] = []
  fittingRounds.value.forEach((round) => {
    round.changes.forEach((c: ChangeItem) => {
      if (c.affectedShoots.includes('shoot-003')) {
        weddingRelatedChanges.push({
          id: c.id,
          description: c.description,
          reason: c.reason,
          status: c.status,
          deliveryImpact: c.deliveryImpact,
        })
      }
    })
  })

  const pendingRounds = fittingRounds.value.filter((r) => r.status !== 'completed').length
  const pendingWeddingChanges = weddingRelatedChanges.filter((c) => c.status !== 'completed').length

  nodes.push({
    id: 'delivery-final',
    date: deliveryDate.toISOString().slice(0, 10),
    title: '最终成衣交付',
    type: 'delivery',
    description: '所有修改完成，最终成衣交付并试穿确认',
    status: daysToDelivery < 0 ? 'completed' : daysToDelivery < 14 ? 'urgent' : 'upcoming',
    icon: Package,
    relatedChanges: [],
    daysUntil: Math.round(daysToDelivery),
    isOnTrack: pendingRounds <= 1,
    note: pendingRounds > 0 ? `还有${pendingRounds}轮修改未完成` : undefined,
  })

  nodes.push({
    id: 'wedding-day',
    date: bride.value.weddingDate,
    title: '婚礼日',
    type: 'wedding',
    description: bride.value.venue || '婚礼仪式',
    status: daysToWedding < 0 ? 'completed' : daysToWedding < 30 ? 'urgent' : 'upcoming',
    icon: Heart,
    relatedChanges: weddingRelatedChanges,
    affectsWedding: true,
    daysUntil: Math.round(daysToWedding),
    isOnTrack: pendingWeddingChanges === 0,
    note: pendingWeddingChanges > 0 ? `${pendingWeddingChanges}项关联修改未完成，需尽快处理` : undefined,
  })

  return nodes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const statusColors = {
  completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-600', border: 'border-emerald-500/30', line: 'bg-emerald-500/30' },
  'in-progress': { bg: 'bg-rose-gold/15', text: 'text-rose-gold', border: 'border-rose-gold/30', line: 'bg-rose-gold/40' },
  upcoming: { bg: 'bg-silk-dark', text: 'text-espresso/60', border: 'border-silk-dark', line: 'bg-silk-dark' },
  urgent: { bg: 'bg-champagne/20', text: 'text-champagne-dark', border: 'border-champagne/40', line: 'bg-champagne/50' },
}

const statusLabels: Record<string, string> = {
  completed: '已完成',
  'in-progress': '进行中',
  upcoming: '待处理',
  urgent: '临近',
}

const typeLabels = {
  fitting: { label: '试衣轮次', color: 'bg-rose-gold/10 text-rose-gold' },
  shoot: { label: '拍摄', color: 'bg-mist-purple/15 text-mist-purple-dark' },
  delivery: { label: '交付', color: 'bg-champagne/20 text-champagne-dark' },
  wedding: { label: '婚礼', color: 'bg-rose-gold/20 text-rose-gold' },
}

const changeStatusLabels: Record<string, string> = {
  pending: '待审批',
  approved: '已批准',
  'in-progress': '进行中',
  completed: '已完成',
}

const changeStatusColors: Record<string, string> = {
  pending: 'bg-espresso/10 text-espresso/60',
  approved: 'bg-mist-purple/15 text-mist-purple-dark',
  'in-progress': 'bg-champagne/20 text-champagne-dark',
  completed: 'bg-emerald-500/15 text-emerald-600',
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
        <p class="text-xs text-espresso/50 mt-1">修改 → 拍摄 → 交付 → 婚礼 · 清晰查看每处修改的影响范围</p>
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
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="tag-pill text-[10px]"
                  :class="typeLabels[node.type].color"
                >
                  {{ typeLabels[node.type].label }}
                </span>
                <h4 class="text-sm font-semibold text-espresso">{{ node.title }}</h4>
                <span
                  v-if="node.deliveryImpact && node.deliveryImpact !== 'none' && node.type === 'fitting'"
                  class="tag-pill text-[10px] flex items-center gap-0.5"
                  :class="deliveryImpactLabels[node.deliveryImpact].bg + ' ' + deliveryImpactLabels[node.deliveryImpact].color"
                >
                  <Zap class="w-2.5 h-2.5" />
                  {{ deliveryImpactLabels[node.deliveryImpact].label }}
                </span>
                <span
                  v-if="node.affectsWedding && node.type === 'fitting'"
                  class="tag-pill text-[10px] bg-rose-gold/15 text-rose-gold flex items-center gap-0.5"
                >
                  <Heart class="w-2.5 h-2.5" />
                  影响婚礼
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-espresso/50">{{ node.date }}</span>
                <span
                  class="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                  :class="[statusColors[node.status].bg, statusColors[node.status].text]"
                >
                  <Clock v-if="node.status === 'in-progress'" class="w-3 h-3" />
                  <CheckCircle2 v-else-if="node.status === 'completed'" class="w-3 h-3" />
                  <AlertTriangle v-else-if="node.status === 'urgent'" class="w-3 h-3" />
                  {{ node.daysUntil >= 0 ? node.daysUntil + '天后' : '已完成' }}
                </span>
              </div>
            </div>

            <p class="text-xs text-espresso/60 mb-3">{{ node.description }}</p>

            <div v-if="node.relatedChanges && node.relatedChanges.length > 0" class="mb-3">
              <p class="text-[11px] text-espresso/50 mb-2 flex items-center gap-1">
                <Link2 class="w-3 h-3" />
                关联修改 ({{ node.relatedChanges.length }})
              </p>
              <div class="space-y-1.5">
                <div
                  v-for="change in node.relatedChanges"
                  :key="change.id"
                  class="p-2.5 rounded-lg bg-silk/20 border border-silk-dark/50"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5 mb-0.5">
                        <span
                          class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          :class="changeStatusColors[change.status]"
                        >
                          {{ changeStatusLabels[change.status] }}
                        </span>
                        <span
                          v-if="change.deliveryImpact !== 'none'"
                          class="text-[10px] px-1.5 py-0.5 rounded-full"
                          :class="deliveryImpactLabels[change.deliveryImpact].bg + ' ' + deliveryImpactLabels[change.deliveryImpact].color"
                        >
                          {{ deliveryImpactLabels[change.deliveryImpact].label }}
                        </span>
                      </div>
                      <p class="text-xs font-medium text-espresso">{{ change.description }}</p>
                      <p class="text-[11px] text-espresso/50 mt-0.5">{{ change.reason }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="node.affectedShoots && node.affectedShoots.length > 0 && node.type === 'fitting'" class="mb-3">
              <p class="text-[11px] text-espresso/50 mb-1.5 flex items-center gap-1">
                <ArrowRight class="w-3 h-3" />
                影响以下节点
              </p>
              <div class="flex flex-wrap gap-1.5">
                <div
                  v-for="shoot in node.affectedShoots"
                  :key="shoot.id"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
                  :class="shoot.daysUntil < 14 ? 'bg-champagne/10 border-champagne/30' : 'bg-mist-purple/8 border-mist-purple/20'"
                >
                  <Camera
                    class="w-3 h-3 flex-shrink-0"
                    :class="shoot.daysUntil < 14 ? 'text-champagne-dark' : 'text-mist-purple-dark'"
                  />
                  <div>
                    <span
                      class="text-[11px] font-medium"
                      :class="shoot.daysUntil < 14 ? 'text-champagne-dark' : 'text-mist-purple-dark'"
                    >
                      {{ shoot.name }}
                    </span>
                    <span
                      v-if="shoot.daysUntil >= 0"
                      class="text-[10px] ml-1.5"
                      :class="shoot.daysUntil < 14 ? 'text-champagne-dark/80' : 'text-espresso/40'"
                    >
                      · {{ shoot.daysUntil }}天后
                    </span>
                  </div>
                  <AlertTriangle v-if="shoot.daysUntil >= 0 && shoot.daysUntil < 14" class="w-3 h-3 text-champagne-dark flex-shrink-0" />
                </div>
              </div>
            </div>

            <div v-if="node.note" class="flex items-start gap-1.5 p-2.5 rounded-lg" :class="node.isOnTrack ? 'bg-emerald-500/5' : 'bg-champagne/10'">
              <AlertCircle v-if="!node.isOnTrack" class="w-3.5 h-3.5 text-champagne-dark flex-shrink-0 mt-0.5" />
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
      <p class="text-xs text-espresso/50 mb-2">图例说明</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
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
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-silk-dark/50">
        <div class="flex items-center gap-1.5">
          <span class="tag-pill text-[10px] bg-emerald-500/10 text-emerald-600">无影响</span>
          <span class="text-espresso/50 text-xs">修改不影响拍摄和婚礼</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="tag-pill text-[10px] bg-champagne/15 text-champagne-dark">轻微影响</span>
          <span class="text-espresso/50 text-xs">需预留少量修改时间</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="tag-pill text-[10px] bg-rose-gold/15 text-rose-gold">严重影响</span>
          <span class="text-espresso/50 text-xs">需优先处理，否则可能延期</span>
        </div>
      </div>
    </div>
  </div>
</template>
