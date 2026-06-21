<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Ruler, Scale, Activity, ChevronRight, Baby, Footprints, Info, Shield, AlertCircle } from 'lucide-vue-next'
import BodyDataPanel from '@/components/BodyDataPanel.vue'
import ViewModeSwitcher from '@/components/ViewModeSwitcher.vue'
import DeliveryTimeline from '@/components/DeliveryTimeline.vue'
import { useBrideStore } from '@/stores/bride'
import { storeToRefs } from 'pinia'

const brideStore = useBrideStore()
const { bride, measurements, viewMode, latestMeasurement } = storeToRefs(brideStore)

const isPatternmaker = computed(() => viewMode.value === 'patternmaker')

const measurementTrends = computed(() => {
  if (measurements.value.length < 2) return []
  
  const keys = ['shoulderWidth', 'bust', 'waist', 'hips', 'weight'] as const
  const labels: Record<string, string> = {
    shoulderWidth: '肩宽',
    bust: '胸围',
    waist: '腰围',
    hips: '臀围',
    weight: '体重',
  }
  const units: Record<string, string> = {
    shoulderWidth: 'cm',
    bust: 'cm',
    waist: 'cm',
    hips: 'cm',
    weight: 'kg',
  }
  
  return keys.map((key) => {
    const first = measurements.value[0][key] as number
    const last = measurements.value[measurements.value.length - 1][key] as number
    const diff = last - first
    const isUp = diff > 0
    const isStable = diff === 0
    
    return {
      key,
      label: labels[key],
      unit: units[key],
      first,
      last,
      diff: diff.toFixed(1),
      isUp,
      isStable,
    }
  })
})

const patternmakerMeasurements = computed(() => {
  if (!latestMeasurement.value) return []
  return [
    { label: '臂长', value: latestMeasurement.value.armLength || '--', unit: 'cm', icon: Ruler },
    { label: '背长', value: latestMeasurement.value.backLength || '--', unit: 'cm', icon: Ruler },
    { label: '身高', value: bride.value.height, unit: 'cm', icon: Ruler },
    { label: '鞋跟高度', value: bride.value.shoeHeelHeight, unit: 'cm', icon: Footprints },
  ]
})

const weightChartData = computed(() => {
  return measurements.value.map((m) => ({
    date: m.date.slice(5),
    weight: m.weight,
  }))
})

const maxWeight = computed(() => {
  return Math.max(...weightChartData.value.map((d) => d.weight)) + 2
})

const minWeight = computed(() => {
  return Math.min(...weightChartData.value.map((d) => d.weight)) - 2
})

function getWeightHeight(weight: number) {
  const range = maxWeight.value - minWeight.value
  if (range === 0) return 50
  return ((weight - minWeight.value) / range) * 100
}
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold text-espresso heading-serif">身形数据</h1>
          <p class="text-sm text-espresso/60 mt-1">记录您的身形变化，见证最美的自己</p>
        </div>
        <ViewModeSwitcher />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <BodyDataPanel />
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="card-elegant p-6">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <Activity class="w-5 h-5 text-rose-gold" />
                <h3 class="text-lg font-semibold text-espresso heading-serif">数据变化趋势</h3>
              </div>
              <span class="text-xs text-espresso/50">
                共 {{ measurements.length }} 次记录
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div
                v-for="item in measurementTrends"
                :key="item.key"
                class="p-3 rounded-elegant bg-silk/30 text-center"
              >
                <p class="text-xs text-espresso/50 mb-1">{{ item.label }}</p>
                <p class="text-lg font-semibold text-espresso heading-serif">
                  {{ item.last }}
                </p>
                <div
                  class="flex items-center justify-center gap-1 mt-1 text-xs font-medium"
                  :class="item.isStable ? 'text-espresso/40' : item.isUp ? 'text-rose-gold' : 'text-emerald-600'"
                >
                  <TrendingUp v-if="item.isUp" class="w-3 h-3" />
                  <TrendingDown v-else-if="!item.isStable" class="w-3 h-3" />
                  <span v-if="!item.isStable">{{ item.isUp ? '+' : '' }}{{ item.diff }}</span>
                  <span v-else>持平</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-elegant p-6">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <Scale class="w-5 h-5 text-champagne" />
                <h3 class="text-lg font-semibold text-espresso heading-serif">体重变化曲线</h3>
              </div>
            </div>

            <div class="relative h-48 sm:h-56">
              <div class="absolute inset-x-0 top-0 bottom-6 flex items-end justify-between gap-2 px-2">
                <div
                  v-for="(point, index) in weightChartData"
                  :key="index"
                  class="flex-1 flex flex-col items-center"
                >
                  <div
                    class="w-full max-w-[40px] bg-gradient-to-t from-rose-gold/40 to-champagne/30 rounded-t-lg transition-all duration-500"
                    :style="{ height: `${getWeightHeight(point.weight)}%` }"
                  ></div>
                </div>
              </div>
              <div class="absolute bottom-0 inset-x-0 flex justify-between px-2">
                <div
                  v-for="(point, index) in weightChartData"
                  :key="index"
                  class="flex-1 flex flex-col items-center"
                >
                  <span class="text-xs text-espresso/40">{{ point.weight }}kg</span>
                  <span class="text-[10px] text-espresso/30 mt-1">{{ point.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isPatternmaker" class="card-elegant p-6">
            <div class="flex items-center gap-2 mb-5">
              <Info class="w-5 h-5 text-mist-purple-dark" />
              <h3 class="text-lg font-semibold text-espresso heading-serif">版师专业数据</h3>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div
                v-for="item in patternmakerMeasurements"
                :key="item.label"
                class="p-4 rounded-elegant bg-mist-purple/10 text-center"
              >
                <div class="w-8 h-8 mx-auto mb-2 rounded-lg bg-mist-purple/20 flex items-center justify-center">
                  <component :is="item.icon" class="w-4 h-4 text-mist-purple-dark" />
                </div>
                <p class="text-xl font-semibold text-espresso heading-serif">{{ item.value }}</p>
                <p class="text-xs text-espresso/50">{{ item.label }} ({{ item.unit }})</p>
              </div>
            </div>

            <div v-if="!bride.isPregnant" class="p-4 bg-emerald-500/5 rounded-elegant border border-emerald-500/15 mb-5">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-emerald-700">未怀孕 - 版型状态正常</p>
                  <p class="text-xs text-emerald-600/70 mt-0.5">
                    当前无孕期身形变化风险，礼服版型可按常规标准制作
                  </p>
                </div>
                <span class="ml-auto px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-medium flex items-center gap-1">
                  <Shield class="w-3 h-3" />
                  低风险
                </span>
              </div>
              <div class="mt-3 pt-3 border-t border-emerald-500/10">
                <p class="text-xs font-medium text-emerald-700 mb-1.5">版型制作建议：</p>
                <ul class="space-y-1">
                  <li class="text-xs text-emerald-600/75 flex items-start gap-1.5">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0"></span>
                    建议维持当前体重波动不超过±2kg
                  </li>
                  <li class="text-xs text-emerald-600/75 flex items-start gap-1.5">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0"></span>
                    婚礼前2周确认最终鞋跟高度
                  </li>
                  <li class="text-xs text-emerald-600/75 flex items-start gap-1.5">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0"></span>
                    如有身形变化请提前2周预约复尺
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="bride.isPregnant" class="p-4 bg-rose-gold/5 rounded-elegant border border-rose-gold/20 mb-5">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-lg bg-mist-purple/15 flex items-center justify-center flex-shrink-0">
                  <Baby class="w-4 h-4 text-mist-purple-dark" />
                </div>
                <div>
                  <p class="text-sm font-medium text-mist-purple-dark">孕期特别调整说明</p>
                  <p class="text-xs text-mist-purple-dark/70 mt-0.5">
                    预产期 {{ bride.dueDate }}，需预留孕期调整空间
                  </p>
                </div>
                <span class="ml-auto px-2 py-1 rounded-full bg-rose-gold/15 text-rose-gold text-xs font-medium flex items-center gap-1">
                  <AlertCircle class="w-3 h-3" />
                  需关注
                </span>
              </div>
              <div class="mt-3 pt-3 border-t border-mist-purple/15">
                <p class="text-xs font-medium text-mist-purple-dark mb-1.5">孕期制作注意事项：</p>
                <ul class="space-y-1">
                  <li class="text-xs text-mist-purple-dark/75 flex items-start gap-1.5">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-mist-purple/50 flex-shrink-0"></span>
                    礼服腰部预留5-8cm弹性调整空间
                  </li>
                  <li class="text-xs text-mist-purple-dark/75 flex items-start gap-1.5">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-mist-purple/50 flex-shrink-0"></span>
                    建议婚礼前1个月完成最终试衣
                  </li>
                  <li class="text-xs text-mist-purple-dark/75 flex items-start gap-1.5">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-mist-purple/50 flex-shrink-0"></span>
                    准备可调节腰带和胸垫备选方案
                  </li>
                </ul>
              </div>
            </div>

            <div class="divider-elegant mb-4"></div>

            <div class="space-y-3">
              <div class="flex items-start justify-between">
                <span class="text-sm text-espresso/60">建议版型</span>
                <span class="text-sm font-medium text-espresso">A字 / 鱼尾</span>
              </div>
              <div class="flex items-start justify-between">
                <span class="text-sm text-espresso/60">裙长调整</span>
                <span class="text-sm font-medium text-espresso">+3cm (8cm鞋跟)</span>
              </div>
              <div class="flex items-start justify-between">
                <span class="text-sm text-espresso/60">收腰建议</span>
                <span class="text-sm font-medium text-espresso">适度收腰，保留舒适度</span>
              </div>
              <div class="flex items-start justify-between">
                <span class="text-sm text-espresso/60">肩线处理</span>
                <span class="text-sm font-medium text-espresso">标准肩线，自然贴合</span>
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-silk-dark">
              <p class="text-sm font-medium text-espresso mb-2">版师备注</p>
              <p class="text-sm text-espresso/70 leading-relaxed">
                根据客户身形数据，建议选择A字或鱼尾版型，能很好地修饰腰线。
                面料建议选择有垂坠感的缎面或蕾丝，可增加优雅气质。
                鞋跟8cm的话，裙长需要调整约3cm，建议试穿时确认最终裙长。
              </p>
            </div>
          </div>

          <div class="card-elegant p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-espresso heading-serif">量体记录</h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="(m, index) in measurements"
                :key="m.id"
                class="flex items-center justify-between p-3 rounded-elegant bg-silk/30 hover:bg-silk/50 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="index === measurements.length - 1 ? 'bg-rose-gold/10' : 'bg-silk'"
                  >
                    <span
                      class="text-sm font-semibold"
                      :class="index === measurements.length - 1 ? 'text-rose-gold' : 'text-espresso/50'"
                    >
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-espresso">第{{ index + 1 }}次量体</p>
                    <p class="text-xs text-espresso/50">{{ m.date }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs text-espresso/60">
                  <span>体重 {{ m.weight }}kg</span>
                  <span>腰围 {{ m.waist }}cm</span>
                  <ChevronRight class="w-4 h-4 text-espresso/30" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="isPatternmaker">
            <DeliveryTimeline />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
