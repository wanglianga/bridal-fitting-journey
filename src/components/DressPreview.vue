<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-vue-next'
import { useDressStore } from '@/stores/dress'
import { storeToRefs } from 'pinia'
import { silhouetteOptions, trainOptions, sleeveOptions } from '@/mock'

const dressStore = useDressStore()
const {
  dressStyles,
  selectedDressId,
  selectedSilhouette,
  selectedFabric,
  selectedTrain,
  hasDetachableSleeves,
  selectedSleeveStyle,
  currentFabricSwatch,
} = storeToRefs(dressStore)

const activeTab = ref<'silhouette' | 'fabric' | 'train' | 'sleeves'>('silhouette')

const currentIndex = computed(() => {
  return dressStyles.value.findIndex((d) => d.id === selectedDressId.value)
})

function prevDress() {
  const newIndex = (currentIndex.value - 1 + dressStyles.value.length) % dressStyles.value.length
  dressStore.selectDress(dressStyles.value[newIndex].id)
}

function nextDress() {
  const newIndex = (currentIndex.value + 1) % dressStyles.value.length
  dressStore.selectDress(dressStyles.value[newIndex].id)
}

const fabricColors: Record<string, string> = {
  satin: '#FFFEF9',
  lace: '#FEF9EF',
  tulle: '#FFFEF9',
  chiffon: '#FEF9EF',
  organza: '#FFFEF9',
}
</script>

<template>
  <div class="card-elegant overflow-hidden">
    <div class="relative aspect-[3/4] bg-gradient-to-b from-ivory-50 to-ivory-100 overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <img
          :src="dressStyles[currentIndex]?.imageUrl"
          :alt="dressStyles[currentIndex]?.name"
          class="w-full h-full object-cover transition-all duration-700"
          :style="{
            filter: selectedFabric === 'lace' ? 'contrast(1.05)' : 'none',
          }"
        />
      </div>

      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/60 via-espresso/20 to-transparent p-6">
        <h3 class="text-white text-xl font-semibold heading-serif mb-1">
          {{ dressStyles[currentIndex]?.name }}
        </h3>
        <p class="text-white/80 text-sm">{{ dressStyles[currentIndex]?.description }}</p>
      </div>

      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-espresso/70 hover:bg-white hover:text-espresso transition-all"
        @click="prevDress"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-espresso/70 hover:bg-white hover:text-espresso transition-all"
        @click="nextDress"
      >
        <ChevronRight class="w-5 h-5" />
      </button>

      <div class="absolute top-4 right-4 flex gap-2">
        <span class="tag-pill bg-white/90 backdrop-blur-sm text-rose-gold">
          ¥{{ dressStyles[currentIndex]?.price.toLocaleString() }}
        </span>
      </div>
    </div>

    <div class="p-5">
      <div class="flex gap-1 mb-4 border-b border-silk-dark">
        <button
          v-for="tab in [
            { key: 'silhouette', label: '裙型' },
            { key: 'fabric', label: '面料' },
            { key: 'train', label: '拖尾' },
            { key: 'sleeves', label: '袖型' },
          ]"
          :key="tab.key"
          class="flex-1 py-2.5 text-sm font-medium transition-all relative"
          :class="activeTab === tab.key ? 'text-rose-gold' : 'text-espresso/50 hover:text-espresso/70'"
          @click="activeTab = tab.key as any"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-rose-gold rounded-full"
          ></span>
        </button>
      </div>

      <div v-if="activeTab === 'silhouette'" class="grid grid-cols-2 gap-2">
        <button
          v-for="option in silhouetteOptions"
          :key="option.value"
          class="p-3 rounded-elegant border-2 transition-all text-left"
          :class="
            selectedSilhouette === option.value
              ? 'border-rose-gold bg-rose-gold/5'
              : 'border-silk-dark hover:border-rose-gold/30'
          "
          @click="dressStore.setSilhouette(option.value as any)"
        >
          <p class="font-medium text-sm text-espresso">{{ option.label }}</p>
          <p class="text-xs text-espresso/50 mt-0.5">{{ option.description }}</p>
        </button>
      </div>

      <div v-if="activeTab === 'fabric'" class="space-y-3">
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="fabric in ['satin', 'lace', 'tulle', 'chiffon', 'organza']"
            :key="fabric"
            class="flex-shrink-0 w-16 h-16 rounded-elegant border-2 transition-all flex items-center justify-center"
            :class="
              selectedFabric === fabric
                ? 'border-rose-gold ring-2 ring-rose-gold/20'
                : 'border-silk-dark hover:border-rose-gold/30'
            "
            :style="{ backgroundColor: fabricColors[fabric] }"
            @click="dressStore.setFabric(fabric as any)"
          >
            <Sparkles v-if="fabric === 'satin'" class="w-5 h-5 text-champagne" />
            <span v-else class="text-xs text-espresso/50 capitalize">{{ fabric }}</span>
          </button>
        </div>
        <div v-if="currentFabricSwatch" class="p-3 bg-silk/50 rounded-elegant">
          <p class="font-medium text-sm text-espresso">{{ currentFabricSwatch.name }}</p>
          <p class="text-xs text-espresso/60 mt-1">{{ currentFabricSwatch.description }}</p>
          <div class="flex items-center gap-3 mt-2 text-xs text-espresso/50">
            <span>光泽: {{ currentFabricSwatch.sheen === 'matte' ? '哑光' : currentFabricSwatch.sheen === 'satin' ? '缎面' : currentFabricSwatch.sheen === 'silk' ? '丝光' : '亮面' }}</span>
            <span>垂感: {{ currentFabricSwatch.drape === 'stiff' ? '挺括' : currentFabricSwatch.drape === 'structured' ? '有型' : currentFabricSwatch.drape === 'flowing' ? '垂顺' : '柔软' }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'train'" class="space-y-2">
        <button
          v-for="option in trainOptions"
          :key="option.value"
          class="w-full p-3 rounded-elegant border-2 transition-all text-left flex items-center justify-between"
          :class="
            selectedTrain === option.value
              ? 'border-rose-gold bg-rose-gold/5'
              : 'border-silk-dark hover:border-rose-gold/30'
          "
          @click="dressStore.setTrainLength(option.value as any)"
        >
          <span class="font-medium text-sm text-espresso">{{ option.label }}</span>
          <span class="text-xs text-espresso/50">{{ option.description }}</span>
        </button>
      </div>

      <div v-if="activeTab === 'sleeves'" class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-silk/50 rounded-elegant">
          <div>
            <p class="font-medium text-sm text-espresso">可拆卸袖</p>
            <p class="text-xs text-espresso/50">一裙两穿，仪式和敬酒都合适</p>
          </div>
          <button
            class="relative w-12 h-6 rounded-full transition-all"
            :class="hasDetachableSleeves ? 'bg-rose-gold' : 'bg-silk-dark'"
            @click="dressStore.toggleDetachableSleeves()"
          >
            <span
              class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              :class="hasDetachableSleeves ? 'left-6' : 'left-0.5'"
            ></span>
          </button>
        </div>

        <div v-if="hasDetachableSleeves" class="grid grid-cols-3 gap-2">
          <button
            v-for="option in sleeveOptions"
            :key="option.value"
            class="p-2.5 rounded-elegant border-2 transition-all text-center"
            :class="
              selectedSleeveStyle === option.value
                ? 'border-rose-gold bg-rose-gold/5'
                : 'border-silk-dark hover:border-rose-gold/30'
            "
            @click="dressStore.setSleeveStyle(option.value as any)"
          >
            <span class="text-xs font-medium text-espresso">{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
