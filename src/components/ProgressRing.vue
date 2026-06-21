<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  showLabel?: boolean
  label?: string
}>()

const size = computed(() => props.size || 120)
const strokeWidth = computed(() => props.strokeWidth || 8)
const color = computed(() => props.color || '#B76E79')
const bgColor = computed(() => props.bgColor || '#F5F0EB')

const radius = computed(() => (size.value - strokeWidth.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value - (props.progress / 100) * circumference.value)
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        :fill="'none'"
        :stroke="bgColor"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        :fill="'none'"
        :stroke="color"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        stroke-linecap="round"
        class="transition-all duration-700 ease-out"
      />
    </svg>
    <div v-if="showLabel" class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-2xl font-semibold text-espresso">{{ progress }}%</span>
      <span v-if="label" class="text-xs text-espresso/60 mt-1">{{ label }}</span>
    </div>
  </div>
</template>
