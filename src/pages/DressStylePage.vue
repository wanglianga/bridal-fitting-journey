<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Palette, Ruler, Gem, ChevronRight, Tag } from 'lucide-vue-next'
import DressPreview from '@/components/DressPreview.vue'
import { useDressStore } from '@/stores/dress'
import { useBudgetStore } from '@/stores/budget'
import { storeToRefs } from 'pinia'
import { mockFabricSwatches, silhouetteOptions, trainOptions, sleeveOptions } from '@/mock'
import type { FabricType } from '@/types'

const dressStore = useDressStore()
const budgetStore = useBudgetStore()

const {
  selectedDress,
  selectedSilhouette,
  selectedFabric,
  selectedTrain,
  hasDetachableSleeves,
  selectedSleeveStyle,
  currentFabricSwatch,
} = storeToRefs(dressStore)

const { budget } = storeToRefs(budgetStore)

const fabricColorMap: Record<FabricType, string> = {
  satin: '#FFFEF9',
  lace: '#FEF9EF',
  tulle: '#FFFEF9',
  chiffon: '#FEF9EF',
  organza: '#FFFEF9',
}

const silhouetteLabel = computed(() => {
  const option = silhouetteOptions.find(o => o.value === selectedSilhouette.value)
  return option?.label || selectedSilhouette.value
})

const trainLabel = computed(() => {
  const option = trainOptions.find(o => o.value === selectedTrain.value)
  return option?.label || selectedTrain.value
})

const sleeveLabel = computed(() => {
  if (!hasDetachableSleeves.value) return '无'
  const option = sleeveOptions.find(o => o.value === selectedSleeveStyle.value)
  return option?.label || selectedSleeveStyle.value
})

const fabricSwatchesList = computed(() => mockFabricSwatches)

function selectFabric(fabricType: FabricType) {
  dressStore.setFabric(fabricType)
}
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient pb-8">
    <div class="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div class="mb-6 md:mb-8 animate-fade-in-down">
        <h1 class="text-2xl md:text-3xl font-bold heading-serif text-espresso mb-2">
          款式组合
        </h1>
        <p class="text-espresso/60 text-sm md:text-base">
          定制专属于您的完美婚纱，每一处细节都彰显独特品味
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <div class="animate-fade-in-up" style="animation-delay: 0.1s">
            <DressPreview />
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.15s">
            <div class="flex items-center gap-2 mb-5">
              <Palette class="w-5 h-5 text-rose-gold" />
              <h3 class="text-lg font-semibold text-espresso heading-serif">面料样卡</h3>
            </div>

            <div class="grid grid-cols-5 gap-3">
              <button
                v-for="swatch in fabricSwatchesList"
                :key="swatch.id"
                class="group flex flex-col items-center"
                @click="selectFabric(swatch.type)"
              >
                <div
                  class="w-12 h-12 rounded-elegant border-2 transition-all duration-300 shadow-sm flex items-center justify-center"
                  :class="[
                    selectedFabric === swatch.type
                      ? 'border-rose-gold ring-2 ring-rose-gold/20 scale-105'
                      : 'border-silk-dark hover:border-rose-gold/40 group-hover:scale-105'
                  ]"
                  :style="{ backgroundColor: fabricColorMap[swatch.type] }"
                >
                  <Sparkles v-if="swatch.type === 'satin'" class="w-5 h-5 text-champagne" />
                  <span v-else class="text-[10px] text-espresso/50 capitalize">{{ swatch.type }}</span>
                </div>
                <span class="text-xs text-espresso/70 mt-2 text-center">{{ swatch.name.slice(0, 4) }}</span>
              </button>
            </div>

            <div v-if="currentFabricSwatch" class="mt-5 p-4 bg-silk/50 rounded-elegant">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium text-espresso">{{ currentFabricSwatch.name }}</h4>
                <span class="tag-pill bg-champagne/20 text-champagne-dark text-[10px]">
                  {{ '★'.repeat(currentFabricSwatch.priceLevel) }}
                </span>
              </div>
              <p class="text-sm text-espresso/60 mb-3">{{ currentFabricSwatch.description }}</p>
              <div class="flex flex-wrap gap-3 text-xs text-espresso/50">
                <span class="flex items-center gap-1">
                  <Gem class="w-3.5 h-3.5 text-champagne" />
                  光泽: {{ currentFabricSwatch.sheen === 'matte' ? '哑光' : currentFabricSwatch.sheen === 'satin' ? '缎面' : currentFabricSwatch.sheen === 'silk' ? '丝光' : '亮面' }}
                </span>
                <span class="flex items-center gap-1">
                  <Ruler class="w-3.5 h-3.5 text-mist-purple-dark" />
                  垂感: {{ currentFabricSwatch.drape === 'stiff' ? '挺括' : currentFabricSwatch.drape === 'structured' ? '有型' : currentFabricSwatch.drape === 'flowing' ? '垂顺' : '柔软' }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.25s">
            <div class="flex items-center gap-2 mb-5">
              <Sparkles class="w-5 h-5 text-champagne" />
              <h3 class="text-lg font-semibold text-espresso heading-serif">当前组合</h3>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between py-2.5 border-b border-silk-dark/50">
                <span class="text-sm text-espresso/60">款式名称</span>
                <span class="font-medium text-espresso">{{ selectedDress?.name }}</span>
              </div>
              <div class="flex items-center justify-between py-2.5 border-b border-silk-dark/50">
                <span class="text-sm text-espresso/60">裙型</span>
                <span class="font-medium text-espresso">{{ silhouetteLabel }}</span>
              </div>
              <div class="flex items-center justify-between py-2.5 border-b border-silk-dark/50">
                <span class="text-sm text-espresso/60">面料</span>
                <span class="font-medium text-espresso">{{ currentFabricSwatch?.name }}</span>
              </div>
              <div class="flex items-center justify-between py-2.5 border-b border-silk-dark/50">
                <span class="text-sm text-espresso/60">拖尾</span>
                <span class="font-medium text-espresso">{{ trainLabel }}</span>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-sm text-espresso/60">袖型</span>
                <span class="font-medium text-espresso">
                  {{ sleeveLabel }}
                  <span v-if="hasDetachableSleeves" class="text-xs text-rose-gold ml-1">(可拆卸)</span>
                </span>
              </div>
            </div>
          </div>

          <div class="card-elegant overflow-hidden animate-fade-in-up" style="animation-delay: 0.35s">
            <div class="bg-gradient-to-r from-rose-gold/10 via-champagne/10 to-mist-purple/10 p-6">
              <div class="flex items-center gap-2 mb-4">
                <Tag class="w-5 h-5 text-rose-gold" />
                <h3 class="text-lg font-semibold text-espresso heading-serif">价格明细</h3>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-espresso/70">基础价格</span>
                  <span class="text-espresso">¥{{ budget.basePrice.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-espresso/70">面料升级</span>
                  <span class="text-espresso">¥{{ budget.fabricUpgrade.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-espresso/70">配饰费用</span>
                  <span class="text-espresso">¥{{ budget.accessoryCost.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-espresso/70">修改费用</span>
                  <span class="text-espresso">¥{{ budget.alterationCost.toLocaleString() }}</span>
                </div>
              </div>

              <div class="divider-elegant my-4"></div>

              <div class="flex items-center justify-between">
                <span class="font-medium text-espresso">总计</span>
                <span class="text-2xl font-bold text-gradient-rose heading-serif">
                  ¥{{ budget.total.toLocaleString() }}
                </span>
              </div>

              <div class="mt-4 flex items-center gap-2 text-xs text-espresso/50">
                <ChevronRight class="w-4 h-4" />
                <span>已付 ¥{{ budget.paidAmount.toLocaleString() }}，剩余 ¥{{ (budget.total - budget.paidAmount).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
