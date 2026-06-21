<script setup lang="ts">
import { computed, ref } from 'vue'
import { Heart, Footprints, Users, Edit3, Star } from 'lucide-vue-next'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'

const fittingStore = useFittingStore()
const { selectedRound } = storeToRefs(fittingStore)

const isEditing = ref(false)
const editNotes = ref('')

const difficultyLevels = [
  { value: 1, label: '轻松自如', desc: '行动完全不受限' },
  { value: 2, label: '轻微束缚', desc: '正常行走没问题' },
  { value: 3, label: '中等约束', desc: '上下楼需注意' },
  { value: 4, label: '较紧', desc: '小步慢走' },
  { value: 5, label: '很紧', desc: '需要协助' },
]

const currentDifficulty = computed(() => {
  return difficultyLevels.find((d) => d.value === selectedRound.value?.mobilityDifficulty)
})

function startEdit() {
  editNotes.value = selectedRound.value?.consultantNotes || ''
  isEditing.value = true
}

function saveNotes() {
  fittingStore.updateConsultantNotes(editNotes.value)
  isEditing.value = false
}

function setDifficulty(level: number) {
  fittingStore.updateMobilityDifficulty(level)
}
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">顾问记录</h3>
      <button
        v-if="!isEditing"
        class="text-sm text-rose-gold hover:text-rose-gold-dark flex items-center gap-1"
        @click="startEdit"
      >
        <Edit3 class="w-3.5 h-3.5" />
        编辑
      </button>
    </div>

    <div class="space-y-5">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Heart class="w-4 h-4 text-rose-gold" />
          <span class="text-sm font-medium text-espresso">试穿感受</span>
        </div>
        <div v-if="isEditing">
          <textarea
            v-model="editNotes"
            class="input-elegant min-h-[100px] resize-none text-sm"
            placeholder="记录试穿感受..."
          ></textarea>
          <div class="flex justify-end gap-2 mt-2">
            <button class="btn-ghost text-sm py-1.5 px-4" @click="isEditing = false">取消</button>
            <button class="btn-primary text-sm py-1.5 px-4" @click="saveNotes">保存</button>
          </div>
        </div>
        <p v-else class="text-sm text-espresso/70 leading-relaxed">
          {{ selectedRound?.consultantNotes || '暂无记录' }}
        </p>
      </div>

      <div class="divider-elegant"></div>

      <div>
        <div class="flex items-center gap-2 mb-3">
          <Footprints class="w-4 h-4 text-champagne" />
          <span class="text-sm font-medium text-espresso">行动难度</span>
        </div>
        <div class="flex gap-2">
          <button
            v-for="level in difficultyLevels"
            :key="level.value"
            class="flex-1 py-3 px-2 rounded-elegant border-2 transition-all text-center"
            :class="
              selectedRound?.mobilityDifficulty === level.value
                ? 'border-rose-gold bg-rose-gold/5'
                : 'border-silk-dark hover:border-rose-gold/30'
            "
            @click="setDifficulty(level.value)"
          >
            <div class="flex justify-center gap-0.5 mb-1">
              <Star
                v-for="i in level.value"
                :key="i"
                class="w-3 h-3"
                :class="selectedRound?.mobilityDifficulty >= level.value ? 'text-rose-gold fill-rose-gold' : 'text-silk-dark'"
              />
            </div>
            <p class="text-xs font-medium text-espresso">{{ level.label }}</p>
          </button>
        </div>
        <p v-if="currentDifficulty" class="text-xs text-espresso/50 mt-2 text-center">
          {{ currentDifficulty.desc }}
        </p>
      </div>

      <div class="divider-elegant"></div>

      <div>
        <div class="flex items-center gap-2 mb-2">
          <Footprints class="w-4 h-4 text-mist-purple-dark" />
          <span class="text-sm font-medium text-espresso">仪式动线</span>
        </div>
        <p class="text-sm text-espresso/70 leading-relaxed">
          {{ selectedRound?.ceremonyMovement || '暂无记录' }}
        </p>
      </div>

      <div class="divider-elegant"></div>

      <div>
        <div class="flex items-center gap-2 mb-2">
          <Users class="w-4 h-4 text-emerald-600" />
          <span class="text-sm font-medium text-espresso">家人意见</span>
        </div>
        <p class="text-sm text-espresso/70 leading-relaxed">
          {{ selectedRound?.familyOpinions || '暂无记录' }}
        </p>
      </div>
    </div>
  </div>
</template>
