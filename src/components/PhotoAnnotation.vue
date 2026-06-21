<script setup lang="ts">
import { ref, computed } from 'vue'
import { MessageSquare, ThumbsUp, Wrench, Eye, EyeOff, Plus } from 'lucide-vue-next'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'
import type { AnnotationType } from '@/types'

const fittingStore = useFittingStore()
const { selectedRound, selectedPhoto, showAnnotations } = storeToRefs(fittingStore)

const isAddingAnnotation = ref(false)
const newAnnotationType = ref<AnnotationType>('note')
const newAnnotationText = ref('')

const photoList = computed(() => selectedRound.value?.photos || [])

const annotationColors: Record<AnnotationType, string> = {
  change: '#B76E79',
  note: '#B8A9C9',
  praise: '#D4AF37',
}

const annotationIcons: Record<AnnotationType, any> = {
  change: Wrench,
  note: MessageSquare,
  praise: ThumbsUp,
}

function selectPhoto(id: string) {
  fittingStore.selectPhoto(id)
}

function handlePhotoClick(e: MouseEvent) {
  if (!isAddingAnnotation.value) return
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  
  if (newAnnotationText.value.trim()) {
    fittingStore.addAnnotation({
      x,
      y,
      text: newAnnotationText.value,
      type: newAnnotationType.value,
      author: '顾问',
    })
    newAnnotationText.value = ''
    isAddingAnnotation.value = false
  }
}

function startAddAnnotation(type: AnnotationType) {
  isAddingAnnotation.value = true
  newAnnotationType.value = type
}

function cancelAddAnnotation() {
  isAddingAnnotation.value = false
  newAnnotationText.value = ''
}
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-espresso heading-serif">试穿照片</h3>
      <div class="flex items-center gap-2">
        <button
          class="p-2 rounded-lg hover:bg-silk transition-colors"
          :class="showAnnotations ? 'text-rose-gold bg-rose-gold/10' : 'text-espresso/50'"
          @click="fittingStore.toggleAnnotations()"
          :title="showAnnotations ? '隐藏批注' : '显示批注'"
        >
          <Eye v-if="showAnnotations" class="w-4 h-4" />
          <EyeOff v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-if="isAddingAnnotation" class="mb-4 p-3 bg-rose-gold/5 rounded-elegant border border-rose-gold/20">
      <p class="text-sm text-espresso/70 mb-2">点击照片添加批注点</p>
      <div class="flex gap-2 mb-2">
        <button
          v-for="type in (['change', 'note', 'praise'] as AnnotationType[])"
          :key="type"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          :class="newAnnotationType === type ? 'bg-rose-gold text-white' : 'bg-silk text-espresso/70'"
          @click="newAnnotationType = type"
        >
          <component :is="annotationIcons[type]" class="w-3 h-3" />
          {{ type === 'change' ? '修改' : type === 'note' ? '备注' : '好评' }}
        </button>
      </div>
      <input
        v-model="newAnnotationText"
        type="text"
        placeholder="输入批注内容..."
        class="input-elegant text-sm"
      />
      <div class="flex justify-end gap-2 mt-2">
        <button class="btn-ghost text-sm py-1.5 px-4" @click="cancelAddAnnotation">取消</button>
        <button class="btn-primary text-sm py-1.5 px-4">确认</button>
      </div>
    </div>

    <div class="relative aspect-[4/5] bg-silk/50 rounded-elegant overflow-hidden mb-4">
      <img
        v-if="selectedPhoto"
        :src="selectedPhoto.url"
        alt="试穿照片"
        class="w-full h-full object-cover"
        :class="{ 'cursor-crosshair': isAddingAnnotation }"
        @click="handlePhotoClick"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-espresso/40">
        暂无照片
      </div>

      <div
        v-if="showAnnotations && selectedPhoto"
        class="absolute inset-0 pointer-events-none"
      >
        <div
          v-for="annotation in selectedPhoto.annotations"
          :key="annotation.id"
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
          :style="{ left: `${annotation.x}%`, top: `${annotation.y}%` }"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-lg animate-pulse-soft"
            :style="{ backgroundColor: annotationColors[annotation.type] }"
          >
            <component :is="annotationIcons[annotation.type]" class="w-3 h-3" />
          </div>
          <div class="absolute left-1/2 -translate-x-1/2 top-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div class="bg-white shadow-elegant-lg rounded-elegant p-3 min-w-[160px]">
              <p class="text-xs text-espresso/50 mb-1">{{ annotation.author }}</p>
              <p class="text-sm text-espresso">{{ annotation.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="photo in photoList"
        :key="photo.id"
        class="flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all"
        :class="selectedPhoto?.id === photo.id ? 'border-rose-gold ring-2 ring-rose-gold/20' : 'border-transparent hover:border-rose-gold/30'"
        @click="selectPhoto(photo.id)"
      >
        <img :src="photo.url" :alt="photo.angle" class="w-full h-full object-cover" />
      </button>
      <button
        class="flex-shrink-0 w-16 h-20 rounded-lg border-2 border-dashed border-silk-dark flex items-center justify-center text-espresso/40 hover:border-rose-gold/30 hover:text-rose-gold transition-all"
        @click="startAddAnnotation('note')"
      >
        <Plus class="w-5 h-5" />
      </button>
    </div>

    <div class="flex gap-2 mt-3">
      <button
        v-for="type in (['change', 'note', 'praise'] as AnnotationType[])"
        :key="type"
        class="flex items-center gap-1.5 px-3 py-2 rounded-elegant text-xs font-medium transition-all hover:shadow-md"
        :style="{ backgroundColor: annotationColors[type] + '15', color: annotationColors[type] }"
        @click="startAddAnnotation(type)"
      >
        <component :is="annotationIcons[type]" class="w-3.5 h-3.5" />
        {{ type === 'change' ? '添加修改' : type === 'note' ? '添加备注' : '添加好评' }}
      </button>
    </div>
  </div>
</template>
