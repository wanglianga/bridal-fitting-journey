<script setup lang="ts">
import { computed } from 'vue'
import { Wallet, CreditCard, Clock, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import { useBudgetStore } from '@/stores/budget'
import { storeToRefs } from 'pinia'

const budgetStore = useBudgetStore()
const { budget, paidPercentage, remainingAmount } = storeToRefs(budgetStore)

const paymentItems = computed(() => [
  { name: '基础款', amount: budget.value.basePrice, icon: '👗', color: 'rose' },
  { name: '面料升级', amount: budget.value.fabricUpgrade, icon: '🧵', color: 'gold' },
  { name: '配饰费用', amount: budget.value.accessoryCost, icon: '💎', color: 'purple' },
  { name: '修改费用', amount: budget.value.alterationCost, icon: '✂️', color: 'rose' },
])

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<template>
  <div class="card-elegant p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-espresso heading-serif">预算概览</h3>
      <Wallet class="w-5 h-5 text-rose-gold" />
    </div>

    <div class="bg-gradient-to-br from-rose-gold/10 via-champagne/10 to-mist-purple/20 rounded-elegant-lg p-5 mb-5">
      <div class="flex items-end justify-between mb-3">
        <div>
          <p class="text-sm text-espresso/60 mb-1">总预算</p>
          <p class="text-3xl font-bold heading-serif text-gradient-rose">
            ¥{{ budget.total.toLocaleString() }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-espresso/60 mb-1">已支付</p>
          <p class="text-xl font-semibold text-emerald-600">
            ¥{{ budget.paidAmount.toLocaleString() }}
          </p>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: `${paidPercentage}%` }"></div>
      </div>
      <div class="flex justify-between mt-2 text-xs text-espresso/50">
        <span>已付 {{ paidPercentage }}%</span>
        <span>剩余 ¥{{ remainingAmount.toLocaleString() }}</span>
      </div>
    </div>

    <div class="space-y-3 mb-5">
      <p class="text-sm font-medium text-espresso/80">费用明细</p>
      <div
        v-for="item in paymentItems"
        :key="item.name"
        class="flex items-center justify-between p-3 bg-silk/30 rounded-elegant"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-sm text-espresso">{{ item.name }}</span>
        </div>
        <span class="font-medium text-espresso">¥{{ item.amount.toLocaleString() }}</span>
      </div>
    </div>

    <div>
      <p class="text-sm font-medium text-espresso/80 mb-3">付款计划</p>
      <div class="space-y-2">
        <div
          v-for="payment in budget.paymentSchedule"
          :key="payment.id"
          class="flex items-center justify-between p-3 rounded-elegant border"
          :class="
            payment.status === 'paid'
              ? 'bg-emerald-50 border-emerald-100'
              : payment.status === 'pending'
                ? 'bg-silk/30 border-silk-dark'
                : 'bg-rose-gold/5 border-rose-gold/20'
          "
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="
                payment.status === 'paid'
                  ? 'bg-emerald-100'
                  : payment.status === 'pending'
                    ? 'bg-silk-dark'
                    : 'bg-rose-gold/10'
              "
            >
              <CheckCircle v-if="payment.status === 'paid'" class="w-4 h-4 text-emerald-600" />
              <Clock v-else-if="payment.status === 'pending'" class="w-4 h-4 text-espresso/50" />
              <AlertTriangle v-else class="w-4 h-4 text-rose-gold" />
            </div>
            <div>
              <p class="text-sm font-medium text-espresso">{{ payment.name }}</p>
              <p class="text-xs text-espresso/50">{{ formatDate(payment.dueDate) }} 到期</p>
            </div>
          </div>
          <span
            class="font-medium"
            :class="
              payment.status === 'paid'
                ? 'text-emerald-600'
                : payment.status === 'pending'
                  ? 'text-espresso'
                  : 'text-rose-gold'
            "
          >
            ¥{{ payment.amount.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
