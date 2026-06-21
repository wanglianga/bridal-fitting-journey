<script setup lang="ts">
import { computed } from 'vue'
import { Ruler, Scale, TrendingDown, Baby, Footprints } from 'lucide-vue-next'
import { useBrideStore } from '@/stores/bride'
import { storeToRefs } from 'pinia'

const brideStore = useBrideStore()
const { bride, measurements, latestMeasurement } = storeToRefs(brideStore)

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
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">身形数据</h3>
      <span class="text-xs text-espresso/50">最近更新: {{ latestMeasurement?.date }}</span>
    </div>

    <div v-if="bride.isPregnant" class="mb-4 p-3 bg-mist-purple/10 rounded-elegant border border-mist-purple/20">
      <div class="flex items-center gap-2">
        <Baby class="w-4 h-4 text-mist-purple-dark" />
        <span class="text-sm font-medium text-mist-purple-dark">孕期特别关注</span>
      </div>
      <p class="text-xs text-mist-purple-dark/70 mt-1">
        预产期 {{ bride.dueDate }}，礼服预留孕期调整空间
      </p>
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

    <div class="mt-4 pt-4 border-t border-silk-dark">
      <p class="text-sm text-espresso/60 leading-relaxed">
        <span class="font-medium text-espresso">版师备注：</span>
        根据您的身形数据，建议选择A字或鱼尾版型，能很好地修饰腰线。鞋跟8cm的话，裙长需要调整约3cm。
      </p>
    </div>
  </div>
</template>
