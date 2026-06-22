<script setup lang="ts">
import { computed } from 'vue'
import { Ruler, Scale, TrendingDown, Baby, Footprints, AlertCircle, Shield, Calendar, Sparkles } from 'lucide-vue-next'
import { useBrideStore } from '@/stores/bride'
import { useShootStore } from '@/stores/shoot'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'

const brideStore = useBrideStore()
const shootStore = useShootStore()
const fittingStore = useFittingStore()
const { bride, measurements, latestMeasurement, viewMode } = storeToRefs(brideStore)
const { nextShoot, daysUntilNextShoot } = storeToRefs(shootStore)
const { fittingRounds } = storeToRefs(fittingStore)

const isPatternView = computed(() => viewMode.value === 'patternmaker')

const measurementItems = computed(() => {
  if (!latestMeasurement.value) return []
  return [
    { label: '肩宽', value: latestMeasurement.value.shoulderWidth, unit: 'cm', icon: Ruler, color: 'rose' },
    { label: '胸围', value: latestMeasurement.value.bust, unit: 'cm', icon: Ruler, color: 'purple' },
    { label: '腰围', value: latestMeasurement.value.waist, unit: 'cm', icon: Ruler, color: 'gold' },
    { label: '臀围', value: latestMeasurement.value.hips, unit: 'cm', icon: Ruler, color: 'rose' },
    { label: '体重', value: latestMeasurement.value.weight, unit: 'kg', icon: Scale, color: 'purple' },
    { label: '鞋跟', value: bride.value.shoeHeelHeight, unit: 'cm', icon: Footprints, color: 'gold' },
  ]
})

const weightChange = computed(() => {
  if (measurements.value.length < 2) return null
  const first = measurements.value[0].weight
  const last = measurements.value[measurements.value.length - 1].weight
  const diff = (last - first).toFixed(1)
  return {
    value: diff,
    isDown: last < first,
  }
})

const pregnancyStatus = computed(() => {
  if (bride.value.isPregnant) {
    const weddingDate = new Date(bride.value.weddingDate)
    const dueDate = new Date(bride.value.dueDate as string)
    const diffMonths = Math.round((dueDate.getTime() - weddingDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return {
      isPregnant: true,
      status: '孕期中',
      statusColor: 'bg-mist-purple/15 text-mist-purple-dark border-mist-purple/25',
      icon: Baby,
      iconBg: 'bg-mist-purple/15 text-mist-purple-dark',
      description: `预产期 ${bride.value.dueDate}，距离婚礼约 ${diffMonths > 0 ? diffMonths + '个月前' : Math.abs(diffMonths) + '个月后'}`,
      risk: diffMonths >= -2 && diffMonths <= 3 ? '高' : diffMonths >= -4 && diffMonths <= 5 ? '中' : '低',
      riskColor: diffMonths >= -2 && diffMonths <= 3 ? 'bg-rose-gold/15 text-rose-gold' : diffMonths >= -4 && diffMonths <= 5 ? 'bg-champagne/20 text-champagne-dark' : 'bg-emerald-500/15 text-emerald-600',
      tips: [
        '礼服腰部预留5-8cm弹性调整空间',
        '建议婚礼前1个月完成最终试衣',
        '准备可调节腰带和胸垫备选方案',
      ],
    }
  }
  return {
    isPregnant: false,
    status: '未怀孕',
    statusColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    icon: Shield,
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    description: '当前无孕期身形变化风险，礼服版型可按常规标准制作',
    risk: '低',
    riskColor: 'bg-emerald-500/15 text-emerald-600',
    tips: [
      '建议维持当前体重波动不超过±2kg',
      '婚礼前2周确认最终鞋跟高度',
      '如有身形变化请提前2周预约复尺',
    ],
  }
})

const upcomingMilestones = computed(() => {
  const milestones: Array<{ label: string; date: string; daysLeft: number; type: string }> = []
  if (nextShoot.value) {
    milestones.push({
      label: nextShoot.value.name,
      date: nextShoot.value.date,
      daysLeft: daysUntilNextShoot.value ?? 0,
      type: 'shoot',
    })
  }
  milestones.push({
    label: '婚礼日期',
    date: bride.value.weddingDate,
    daysLeft: brideStore.daysUntilWedding,
    type: 'wedding',
  })
  return milestones
})

</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">身形数据</h3>
      <span class="text-xs text-espresso/50">最近更新: {{ latestMeasurement?.date }}</span>
    </div>

    <div
      class="mb-4 p-4 rounded-elegant border"
      :class="pregnancyStatus.statusColor"
    >
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="pregnancyStatus.iconBg"
          >
            <component :is="pregnancyStatus.icon" class="w-4 h-4" />
          </div>
          <div>
            <p class="text-sm font-semibold">{{ pregnancyStatus.status }}</p>
            <p class="text-xs opacity-75">{{ pregnancyStatus.description }}</p>
          </div>
        </div>
        <div
          v-if="isPatternView"
          class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          :class="pregnancyStatus.riskColor"
        >
          <AlertCircle v-if="pregnancyStatus.risk !== '低'" class="w-3 h-3" />
          <Shield v-else class="w-3 h-3" />
          {{ pregnancyStatus.risk }}风险
        </div>
      </div>

      <div v-if="isPatternView" class="mt-3 pt-3 border-t border-current/10">
        <p class="text-xs font-medium mb-2 opacity-80">
          <span v-if="pregnancyStatus.isPregnant">孕期制作注意事项：</span>
          <span v-else>版型制作建议：</span>
        </p>
        <ul class="space-y-1">
          <li v-for="(tip, i) in pregnancyStatus.tips" :key="i" class="text-xs opacity-75 flex items-start gap-1.5">
            <span class="mt-0.5 w-1 h-1 rounded-full bg-current opacity-50 flex-shrink-0"></span>
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="item in measurementItems"
        :key="item.label"
        class="p-3 rounded-elegant bg-silk/30 text-center"
      >
        <div
          class="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
          :class="[
            item.color === 'rose' ? 'bg-rose-gold/10 text-rose-gold' :
            item.color === 'gold' ? 'bg-champagne/10 text-champagne' :
            'bg-mist-purple/20 text-mist-purple-dark'
          ]"
        >
          <component :is="item.icon" class="w-4 h-4" />
        </div>
        <p class="text-xl font-semibold text-espresso heading-serif">{{ item.value }}</p>
        <p class="text-xs text-espresso/50">{{ item.label }} ({{ item.unit }})</p>
      </div>
    </div>

    <div v-if="weightChange" class="mt-4 p-3 bg-ivory-50 rounded-elegant">
      <div class="flex items-center justify-between">
        <span class="text-sm text-espresso/70">体重变化</span>
        <span
          class="flex items-center gap-1 text-sm font-medium"
          :class="weightChange.isDown ? 'text-emerald-600' : 'text-rose-gold'"
        >
          <TrendingDown v-if="weightChange.isDown" class="w-4 h-4" />
          {{ weightChange.isDown ? '-' : '+' }}{{ Math.abs(parseFloat(weightChange.value)) }} kg
        </span>
      </div>
      <div class="mt-2 flex items-end gap-1 h-12">
        <div
          v-for="(m, i) in measurements"
          :key="m.id"
          class="flex-1 bg-gradient-to-t from-rose-gold/30 to-rose-gold/10 rounded-t transition-all"
          :style="{ height: `${(m.weight / 65) * 100}%` }"
          :title="`${m.date}: ${m.weight}kg`"
        ></div>
      </div>
      <div class="flex justify-between mt-1 text-xs text-espresso/40">
        <span>{{ measurements[0]?.date.slice(5) }}</span>
        <span>{{ measurements[measurements.length - 1]?.date.slice(5) }}</span>
      </div>
    </div>

    <div v-if="isPatternView && upcomingMilestones.length > 0" class="mt-4 p-3 bg-champagne/10 rounded-elegant border border-champagne/20">
      <div class="flex items-center gap-2 mb-2">
        <Calendar class="w-4 h-4 text-champagne-dark" />
        <span class="text-sm font-medium text-champagne-dark">关键时间节点</span>
      </div>
      <div class="space-y-2">
        <div
          v-for="m in upcomingMilestones"
          :key="m.label"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <Sparkles v-if="m.type === 'wedding'" class="w-3.5 h-3.5 text-rose-gold" />
            <Calendar v-else class="w-3.5 h-3.5 text-champagne-dark" />
            <span class="text-xs text-espresso/70">{{ m.label }}</span>
          </div>
          <span
            class="text-xs font-medium"
            :class="m.daysLeft <= 30 ? 'text-rose-gold' : m.daysLeft <= 60 ? 'text-champagne-dark' : 'text-espresso/60'"
          >
            {{ m.date }} · {{ m.daysLeft > 0 ? m.daysLeft + '天后' : '已到' }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-silk-dark">
      <p class="text-sm text-espresso/60 leading-relaxed">
        <span class="font-medium text-espresso">版师备注：</span>
        根据您的身形数据，建议选择A字或鱼尾版型，能很好地修饰腰线。鞋跟8cm的话，裙长需要调整约3cm。
      </p>
    </div>
  </div>
</template>
