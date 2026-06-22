<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { MessageSquare, ThumbsUp, Wrench, Eye, EyeOff, Plus, ArrowLeftRight, Info, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { useFittingStore } from '@/stores/fitting'
import { storeToRefs } from 'pinia'
import type { AnnotationType, FittingPhoto } from '@/types'

const fittingStore = useFittingStore()
const { selectedRound, selectedPhoto, showAnnotations, fittingRounds } = storeToRefs(fittingStore)

const isAddingAnnotation = ref(false)
const newAnnotationType = ref<AnnotationType>('note')
const newAnnotationText = ref('')
const showCompareMode = ref(false)
const comparePosition = ref(50)
const isDragging = ref(false)
const expandedAnnotations = ref<Set<string>>(new Set())

const photoList = computed(() => selectedRound.value?.photos || [])

const firstRoundPhotos = computed(() => {
  const firstRound = fittingRounds.value.find((r) => r.roundNumber === 1)
  return firstRound?.photos || []
})

const comparePhoto = computed((): FittingPhoto | null => {
  if (!selectedPhoto.value) return null
  const angle = selectedPhoto.value.angle
  return firstRoundPhotos.value.find((p) => p.angle === angle) || firstRoundPhotos.value[0] || null
})

const annotationColors: Record<AnnotationType, { bg: string; text: string; label: string }> = {
  change: { bg: '#B76E79', text: '#B76E79', label: '修改' },
  note: { bg: '#B8A9C9', text: '#9B8BB0', label: '备注' },
  praise: { bg: '#D4AF37', text: '#A8892C', label: '好评' },
}

const annotationIcons: Record<AnnotationType, any> = {
  change: Wrench,
  note: MessageSquare,
  praise: ThumbsUp,
}

const annotationStats = computed(() => {
  if (!selectedPhoto.value) return { change: 0, note: 0, praise: 0, total: 0 }
  const anns = selectedPhoto.value.annotations
  return {
    change: anns.filter((a) => a.type === 'change').length,
    note: anns.filter((a) => a.type === 'note').length,
    praise: anns.filter((a) => a.type === 'praise').length,
    total: anns.length,
  }
})

watch(
  () => selectedRound.value?.id,
  () => {
    if (photoList.value.length > 0 && !selectedPhoto.value) {
      fittingStore.selectPhoto(photoList.value[0].id)
    }
    if (photoList.value.length > 0 && selectedPhoto.value && !photoList.value.find((p) => p.id === selectedPhoto.value?.id)) {
      fittingStore.selectPhoto(photoList.value[0].id)
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (photoList.value.length > 0 && !selectedPhoto.value) {
    fittingStore.selectPhoto(photoList.value[0].id)
  }
})

function selectPhoto(id: string) {
  fittingStore.selectPhoto(id)
  expandedAnnotations.value.clear()
}

function handlePhotoClick(e: MouseEvent) {
  if (!isAddingAnnotation.value) return
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
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
  newAnnotationText.value = ''
}

function cancelAddAnnotation() {
  isAddingAnnotation.value = false
  newAnnotationText.value = ''
}

function toggleCompareMode() {
  showCompareMode.value = !showCompareMode.value
  comparePosition.value = 50
}

function handleSliderMouseDown(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  e.preventDefault()
}

function handleSliderMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const container = (e.currentTarget as HTMLElement).parentElement
  if (!container) return
  const rect = container.getBoundingClientRect()
  let clientX: number
  if ('touches' in e) {
    clientX = e.touches[0].clientX
  } else {
    clientX = e.clientX
  }
  const x = ((clientX - rect.left) / rect.width) * 100
  comparePosition.value = Math.max(0, Math.min(100, x))
}

function handleSliderUp() {
  isDragging.value = false
}

function toggleAnnotationExpand(id: string) {
  if (expandedAnnotations.value.has(id)) {
    expandedAnnotations.value.delete(id)
  } else {
    expandedAnnotations.value.add(id)
  }
}

const angleLabels: Record<string, string> = {
  front: '正面',
  side: '侧面',
  back: '背面',
  detail: '细节',
}
</script>

<template>
  <div class="card-elegant p-5 md:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h3 class="text-lg font-semibold text-espresso heading-serif">试穿照片</h3>
        <p v-if="selectedPhoto" class="text-xs text-espresso/50 mt-0.5">
          {{ angleLabels[selectedPhoto.angle] || selectedPhoto.angle }}视角 ·
          共 {{ annotationStats.total }} 处批注
        </p>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          v-if="comparePhoto && selectedRound && selectedRound.roundNumber > 1"
          class="flex items-center gap-1.5 px-3 py-2 rounded-elegant text-xs font-medium transition-all"
          :class="showCompareMode ? 'bg-rose-gold text-white shadow-md' : 'bg-silk text-espresso/70 hover:bg-silk-dark'"
          @click="toggleCompareMode"
        >
          <ArrowLeftRight class="w-3.5 h-3.5" />
          {{ showCompareMode ? '关闭对比' : '对比首试' }}
        </button>
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

    <div v-if="annotationStats.total > 0" class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="type in (['change', 'note', 'praise'] as AnnotationType[])"
        :key="type"
        class="tag-pill"
        :style="{ backgroundColor: annotationColors[type].bg + '18', color: annotationColors[type].text }"
      >
        <component :is="annotationIcons[type]" class="w-3 h-3 mr-1" />
        {{ annotationColors[type].label }} {{ annotationStats[type] }}
      </span>
    </div>

    <div v-if="isAddingAnnotation" class="mb-4 p-3 bg-rose-gold/5 rounded-elegant border border-rose-gold/20">
      <p class="text-sm text-espresso/70 mb-2">点击照片添加批注点</p>
      <div class="flex flex-wrap gap-2 mb-2">
        <button
          v-for="type in (['change', 'note', 'praise'] as AnnotationType[])"
          :key="type"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          :class="newAnnotationType === type ? 'text-white' : 'bg-silk text-espresso/70'"
          :style="newAnnotationType === type ? { backgroundColor: annotationColors[type].bg } : {}"
          @click="newAnnotationType = type"
        >
          <component :is="annotationIcons[type]" class="w-3 h-3" />
          {{ annotationColors[type].label }}
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

    <div
      class="relative aspect-[4/5] bg-silk/50 rounded-elegant overflow-hidden mb-4 select-none"
      @mousemove="handleSliderMove"
      @mouseup="handleSliderUp"
      @mouseleave="handleSliderUp"
      @touchmove="handleSliderMove"
      @touchend="handleSliderUp"
    >
      <template v-if="showCompareMode && comparePhoto">
        <div class="absolute inset-0">
          <img
            :src="comparePhoto.url"
            :alt="'首试 ' + (angleLabels[comparePhoto.angle] || comparePhoto.angle)"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 left-3 px-2.5 py-1 bg-espresso/70 backdrop-blur-sm text-white text-xs rounded-full">
            首试 · {{ angleLabels[comparePhoto.angle] || comparePhoto.angle }}
          </div>
        </div>

        <div
          class="absolute inset-0 overflow-hidden"
          :style="{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }"
        >
          <img
            v-if="selectedPhoto"
            :src="selectedPhoto.url"
            alt="当前试穿"
            class="w-full h-full object-cover"
            :class="{ 'cursor-crosshair': isAddingAnnotation }"
            @click="handlePhotoClick"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-espresso/40">
            暂无照片
          </div>
          <div class="absolute top-3 right-3 px-2.5 py-1 bg-rose-gold/90 backdrop-blur-sm text-white text-xs rounded-full">
            当前 · {{ selectedRound?.title }}
          </div>
        </div>

        <div
          class="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
          :style="{ left: `${comparePosition}%`, transform: 'translateX(-50%)' }"
          @mousedown="handleSliderMouseDown"
          @touchstart="handleSliderMouseDown"
        >
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-elegant flex items-center justify-center">
            <ArrowLeftRight class="w-5 h-5 text-espresso/60" />
          </div>
        </div>
      </template>

      <template v-else>
        <img
          v-if="selectedPhoto"
          :src="selectedPhoto.url"
          alt="试穿照片"
          class="w-full h-full object-cover"
          :class="{ 'cursor-crosshair': isAddingAnnotation }"
          @click="handlePhotoClick"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-espresso/40">
          <div class="text-center">
            <Plus class="w-12 h-12 mx-auto text-espresso/20 mb-2" />
            <p class="text-sm">暂无照片</p>
          </div>
        </div>
      </template>

      <div
        v-if="showAnnotations && selectedPhoto && !showCompareMode"
        class="absolute inset-0 pointer-events-none"
      >
        <div
          v-for="annotation in selectedPhoto.annotations"
          :key="annotation.id"
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          :style="{ left: `${annotation.x}%`, top: `${annotation.y}%` }"
        >
          <button
            class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shadow-lg transition-all hover:scale-125"
            :style="{ backgroundColor: annotationColors[annotation.type].bg }"
            @click.stop="toggleAnnotationExpand(annotation.id)"
          >
            <component :is="annotationIcons[annotation.type]" class="w-3.5 h-3.5" />
          </button>

          <div
            v-if="expandedAnnotations.has(annotation.id)"
            class="absolute left-1/2 -translate-x-1/2 top-9 z-20 min-w-[200px]"
          >
            <div class="bg-white shadow-elegant-xl rounded-elegant p-3 border border-ivory-200">
              <div class="flex items-center justify-between mb-2">
                <span
                  class="tag-pill text-[10px]"
                  :style="{ backgroundColor: annotationColors[annotation.type].bg + '20', color: annotationColors[annotation.type].text }"
                >
                  <component :is="annotationIcons[annotation.type]" class="w-2.5 h-2.5 mr-1" />
                  {{ annotationColors[annotation.type].label }}
                </span>
                <span class="text-[10px] text-espresso/40">{{ annotation.author }}</span>
              </div>
              <p class="text-sm text-espresso leading-relaxed">{{ annotation.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="photoList.length > 0" class="mb-4">
      <p class="text-xs text-espresso/50 mb-2">选择照片角度</p>
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="photo in photoList"
          :key="photo.id"
          class="flex-shrink-0 relative group"
          @click="selectPhoto(photo.id)"
        >
          <div
            class="w-16 h-20 rounded-lg overflow-hidden border-2 transition-all"
            :class="selectedPhoto?.id === photo.id ? 'border-rose-gold ring-2 ring-rose-gold/20' : 'border-transparent hover:border-rose-gold/30'"
          >
            <img :src="photo.url" :alt="photo.angle" class="w-full h-full object-cover" />
          </div>
          <span class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] px-1.5 py-0.5 bg-espresso/70 text-white rounded">
            {{ angleLabels[photo.angle] || photo.angle }}
          </span>
          <span
            v-if="photo.annotations.length > 0"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-gold text-white text-[9px] flex items-center justify-center font-medium"
          >
            {{ photo.annotations.length }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="selectedPhoto && selectedPhoto.annotations.length > 0" class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-medium text-espresso/70">本张照片批注详情</p>
        <span class="text-xs text-espresso/40">点击批注点查看详情</span>
      </div>
      <div class="space-y-2 max-h-40 overflow-y-auto scrollbar-hide pr-1">
        <div
          v-for="annotation in selectedPhoto.annotations"
          :key="annotation.id"
          class="p-2.5 rounded-elegant border transition-all cursor-pointer"
          :class="expandedAnnotations.has(annotation.id) ? 'border-rose-gold/30 bg-rose-gold/5' : 'border-silk-dark bg-silk/20 hover:bg-silk/40'"
          @click="toggleAnnotationExpand(annotation.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: annotationColors[annotation.type].bg }"
              >
                <component :is="annotationIcons[annotation.type]" class="w-3 h-3 text-white" />
              </span>
              <span class="text-sm font-medium text-espresso line-clamp-1">{{ annotation.text }}</span>
            </div>
            <ChevronDown
              v-if="!expandedAnnotations.has(annotation.id)"
              class="w-4 h-4 text-espresso/40 flex-shrink-0"
            />
            <ChevronUp v-else class="w-4 h-4 text-rose-gold flex-shrink-0" />
          </div>
          <div v-if="expandedAnnotations.has(annotation.id)" class="mt-2 pt-2 border-t border-silk-dark/50">
            <div class="flex items-center justify-between text-xs">
              <span class="text-espresso/50">{{ annotation.author }}</span>
              <span
                class="tag-pill"
                :style="{ backgroundColor: annotationColors[annotation.type].bg + '18', color: annotationColors[annotation.type].text }"
              >
                {{ annotationColors[annotation.type].label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="type in (['change', 'note', 'praise'] as AnnotationType[])"
        :key="type"
        class="flex items-center gap-1.5 px-3 py-2 rounded-elegant text-xs font-medium transition-all hover:shadow-md"
        :style="{ backgroundColor: annotationColors[type].bg + '15', color: annotationColors[type].text }"
        @click="startAddAnnotation(type)"
      >
        <component :is="annotationIcons[type]" class="w-3.5 h-3.5" />
        添加{{ annotationColors[type].label }}
      </button>
    </div>

    <div v-if="showCompareMode" class="mt-4 p-3 bg-champagne/10 rounded-elegant border border-champagne/20">
      <div class="flex items-start gap-2">
        <Info class="w-4 h-4 text-champagne-dark flex-shrink-0 mt-0.5" />
        <div class="text-xs text-espresso/70 leading-relaxed">
          <p class="font-medium text-espresso mb-1">前后对比说明</p>
          <p>拖动中间滑块可对比首试（左侧）与当前试衣（右侧）的效果差异。</p>
          <p class="mt-1">可直观看到版型修改、面料升级、细节调整带来的变化。</p>
        </div>
      </div>
    </div>
  </div>
</template>
