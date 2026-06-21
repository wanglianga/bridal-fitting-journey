<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon?: Component
  trend?: string
  trendUp?: boolean
  color?: 'rose' | 'gold' | 'purple' | 'default'
}>()
</script>

<template>
  <div class="card-elegant p-5 animate-fade-in-up">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-espresso/60 mb-1">{{ title }}</p>
        <p class="text-2xl font-semibold text-espresso heading-serif">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-espresso/50 mt-1">{{ subtitle }}</p>
      </div>
      <div
        v-if="icon"
        :class="[
          'w-10 h-10 rounded-elegant flex items-center justify-center',
          color === 'rose' ? 'bg-rose-gold/10 text-rose-gold' : '',
          color === 'gold' ? 'bg-champagne/10 text-champagne' : '',
          color === 'purple' ? 'bg-mist-purple/20 text-mist-purple-dark' : '',
          color === 'default' || !color ? 'bg-silk text-espresso/70' : '',
        ]"
      >
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>
    <div v-if="trend" class="mt-3 flex items-center text-xs">
      <span
        :class="[
          trendUp ? 'text-emerald-600' : 'text-rose-gold',
        ]"
      >
        {{ trendUp ? '↑' : '↓' }} {{ trend }}
      </span>
      <span class="text-espresso/40 ml-2">较上次</span>
    </div>
  </div>
</template>
