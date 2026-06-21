<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, ShoppingBag, Gem } from 'lucide-vue-next'
import AccessoryGallery from '@/components/AccessoryGallery.vue'
import { useBudgetStore } from '@/stores/budget'
import { storeToRefs } from 'pinia'

const budgetStore = useBudgetStore()
const { selectedAccessories, selectedAccessoriesTotal, accessories } = storeToRefs(budgetStore)

const selectedCount = computed(() => selectedAccessories.value.length)
const totalCount = computed(() => accessories.value.length)

const categoryStats = computed(() => {
  const stats: Record<string, { total: number; selected: number; label: string }> = {
    veil: { total: 0, selected: 0, label: '头纱' },
    gloves: { total: 0, selected: 0, label: '手套' },
    jewelry: { total: 0, selected: 0, label: '首饰' },
    shoes: { total: 0, selected: 0, label: '婚鞋' },
    headpiece: { total: 0, selected: 0, label: '头饰' },
  }
  accessories.value.forEach((acc) => {
    stats[acc.category].total++
    if (acc.selected) {
      stats[acc.category].selected++
    }
  })
  return stats
})
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient py-8 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 animate-fade-in-down">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-rose-gold/10 rounded-full mb-4">
          <Gem class="w-4 h-4 text-rose-gold" />
          <span class="text-sm font-medium text-rose-gold">完美搭配</span>
        </div>
        <h1 class="text-4xl font-bold heading-serif text-espresso mb-3">
          配饰搭配
        </h1>
        <p class="text-espresso/60 max-w-xl mx-auto">
          精心挑选的配饰，让您的婚纱造型更加完美。每一件都经过严格甄选，品质保证。
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-in">
        <div
          v-for="(stat, category) in categoryStats"
          :key="category"
          class="card-elegant p-4 text-center"
        >
          <p class="text-sm text-espresso/60 mb-1">{{ stat.label }}</p>
          <p class="text-xl font-semibold heading-serif text-espresso">
            {{ stat.selected }}<span class="text-sm font-normal text-espresso/40">/{{ stat.total }}</span>
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <AccessoryGallery />
        </div>

        <div class="space-y-6">
          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-elegant bg-rose-gold/10 flex items-center justify-center">
                <ShoppingBag class="w-5 h-5 text-rose-gold" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-espresso heading-serif">已选配饰</h3>
                <p class="text-sm text-espresso/50">共 {{ selectedCount }} 件</p>
              </div>
            </div>

            <div v-if="selectedAccessories.length > 0" class="space-y-3">
              <div
                v-for="acc in selectedAccessories"
                :key="acc.id"
                class="flex items-center gap-3 p-3 bg-silk/30 rounded-elegant"
              >
                <img
                  :src="acc.imageUrl"
                  :alt="acc.name"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-espresso truncate">{{ acc.name }}</p>
                  <p class="text-xs text-espresso/50">{{ categoryStats[acc.category]?.label || acc.category }}</p>
                </div>
                <p class="text-sm font-semibold text-rose-gold">
                  ¥{{ acc.price.toLocaleString() }}
                </p>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <Sparkles class="w-10 h-10 text-espresso/20 mx-auto mb-2" />
              <p class="text-sm text-espresso/40">暂无已选配饰</p>
              <p class="text-xs text-espresso/30 mt-1">点击左侧配饰进行选择</p>
            </div>

            <div class="mt-5 pt-4 border-t border-silk-dark">
              <div class="flex items-center justify-between">
                <span class="text-sm text-espresso/70">配饰总价</span>
                <span class="text-2xl font-bold heading-serif text-gradient-rose">
                  ¥{{ selectedAccessoriesTotal.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.2s">
            <h3 class="text-sm font-medium text-espresso/80 mb-3 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-champagne" />
              温馨提示
            </h3>
            <ul class="space-y-2 text-xs text-espresso/60 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                配饰可在试衣时现场试戴，效果更佳
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                建议选择2-3件重点配饰，避免过于繁杂
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                所有配饰均可单独购买，支持7天无理由退换
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
