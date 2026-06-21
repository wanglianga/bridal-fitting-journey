<script setup lang="ts">
import { computed } from 'vue'
import { Check, Plus, Sparkles } from 'lucide-vue-next'
import { useBudgetStore } from '@/stores/budget'
import { storeToRefs } from 'pinia'

const budgetStore = useBudgetStore()
const { accessories, selectedAccessoriesTotal } = storeToRefs(budgetStore)

const categoryLabels: Record<string, string> = {
  veil: '头纱',
  gloves: '手套',
  jewelry: '首饰',
  shoes: '婚鞋',
  headpiece: '头饰',
}

const categories = ['veil', 'gloves', 'jewelry', 'shoes', 'headpiece']

function toggleAccessory(id: string) {
  budgetStore.toggleAccessory(id)
}
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">配饰搭配</h3>
      <div class="text-sm">
        <span class="text-espresso/50">已选: </span>
        <span class="font-semibold text-rose-gold">¥{{ selectedAccessoriesTotal.toLocaleString() }}</span>
      </div>
    </div>

    <div class="space-y-5">
      <div v-for="category in categories" :key="category">
        <p class="text-sm font-medium text-espresso/70 mb-3 flex items-center gap-2">
          <Sparkles class="w-3.5 h-3.5 text-champagne" />
          {{ categoryLabels[category] }}
        </p>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="acc in accessories.filter((a) => a.category === category)"
            :key="acc.id"
            class="relative rounded-elegant overflow-hidden cursor-pointer transition-all group"
            :class="
              acc.selected
                ? 'ring-2 ring-rose-gold shadow-elegant-lg'
                : 'hover:shadow-elegant border border-silk-dark'
            "
            @click="toggleAccessory(acc.id)"
          >
            <div class="aspect-square bg-silk/50">
              <img :src="acc.imageUrl" :alt="acc.name" class="w-full h-full object-cover" />
            </div>
            <div class="p-2">
              <p class="text-xs font-medium text-espresso truncate">{{ acc.name }}</p>
              <p class="text-xs text-rose-gold font-medium">¥{{ acc.price.toLocaleString() }}</p>
            </div>
            
            <div
              v-if="acc.selected"
              class="absolute top-2 right-2 w-6 h-6 bg-rose-gold rounded-full flex items-center justify-center shadow-md"
            >
              <Check class="w-3.5 h-3.5 text-white" />
            </div>
            
            <div
              v-else
              class="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/5 transition-colors flex items-center justify-center"
            >
              <div class="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus class="w-4 h-4 text-rose-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-silk-dark">
      <div class="flex items-center justify-between">
        <span class="text-sm text-espresso/70">配饰总计</span>
        <span class="text-xl font-bold heading-serif text-gradient-rose">
          ¥{{ selectedAccessoriesTotal.toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>
