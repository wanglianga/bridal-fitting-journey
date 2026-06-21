<script setup lang="ts">
import { computed } from 'vue'
import { Wallet, CreditCard, TrendingUp, PieChart, Receipt, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-vue-next'
import BudgetPanel from '@/components/BudgetPanel.vue'
import { useBudgetStore } from '@/stores/budget'
import { storeToRefs } from 'pinia'

const budgetStore = useBudgetStore()
const { budget, paidPercentage, remainingAmount } = storeToRefs(budgetStore)

const expenseItems = computed(() => [
  { name: '基础款', amount: budget.value.basePrice, icon: '👗', color: 'rose', percentage: Math.round((budget.value.basePrice / budget.value.total) * 100) },
  { name: '面料升级', amount: budget.value.fabricUpgrade, icon: '🧵', color: 'gold', percentage: Math.round((budget.value.fabricUpgrade / budget.value.total) * 100) },
  { name: '配饰费用', amount: budget.value.accessoryCost, icon: '💎', color: 'purple', percentage: Math.round((budget.value.accessoryCost / budget.value.total) * 100) },
  { name: '修改费用', amount: budget.value.alterationCost, icon: '✂️', color: 'blue', percentage: Math.round((budget.value.alterationCost / budget.value.total) * 100) },
])

const paidPayments = computed(() => budget.value.paymentSchedule.filter((p) => p.status === 'paid'))
const pendingPayments = computed(() => budget.value.paymentSchedule.filter((p) => p.status === 'pending'))
const overduePayments = computed(() => budget.value.paymentSchedule.filter((p) => p.status === 'overdue'))

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function getDaysUntil(dateStr: string) {
  const today = new Date()
  const targetDate = new Date(dateStr)
  const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}
</script>

<template>
  <div class="min-h-screen bg-ivory-gradient py-8 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 animate-fade-in-down">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-champagne/10 rounded-full mb-4">
          <Wallet class="w-4 h-4 text-champagne-dark" />
          <span class="text-sm font-medium text-champagne-dark">透明消费</span>
        </div>
        <h1 class="text-4xl font-bold heading-serif text-espresso mb-3">
          预算管理
        </h1>
        <p class="text-espresso/60 max-w-xl mx-auto">
          清晰的费用明细和付款计划，让您的婚纱预算一目了然，无忧消费。
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in">
        <div class="card-elegant p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-elegant bg-rose-gold/10 flex items-center justify-center">
              <CreditCard class="w-5 h-5 text-rose-gold" />
            </div>
            <p class="text-sm text-espresso/60">总预算</p>
          </div>
          <p class="text-3xl font-bold heading-serif text-gradient-rose">
            ¥{{ budget.total.toLocaleString() }}
          </p>
        </div>

        <div class="card-elegant p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-elegant bg-emerald-100 flex items-center justify-center">
              <CheckCircle class="w-5 h-5 text-emerald-600" />
            </div>
            <p class="text-sm text-espresso/60">已支付</p>
          </div>
          <p class="text-3xl font-bold heading-serif text-emerald-600">
            ¥{{ budget.paidAmount.toLocaleString() }}
          </p>
          <p class="text-xs text-espresso/40 mt-1">{{ paidPercentage }}% 已完成</p>
        </div>

        <div class="card-elegant p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-elegant bg-champagne/10 flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-champagne-dark" />
            </div>
            <p class="text-sm text-espresso/60">待支付</p>
          </div>
          <p class="text-3xl font-bold heading-serif text-espresso">
            ¥{{ remainingAmount.toLocaleString() }}
          </p>
          <p class="text-xs text-espresso/40 mt-1">{{ pendingPayments.length + overduePayments.length }} 笔待付</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-elegant bg-rose-gold/10 flex items-center justify-center">
                  <Receipt class="w-5 h-5 text-rose-gold" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-espresso heading-serif">详细费用明细</h3>
                  <p class="text-sm text-espresso/50">各项费用占比分析</p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="item in expenseItems"
                :key="item.name"
                class="group"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="text-xl">{{ item.icon }}</span>
                    <span class="text-sm font-medium text-espresso">{{ item.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-semibold text-espresso">¥{{ item.amount.toLocaleString() }}</span>
                    <span class="text-xs text-espresso/40 ml-2">{{ item.percentage }}%</span>
                  </div>
                </div>
                <div class="h-2 rounded-full bg-silk-dark overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :class="{
                      'bg-gradient-to-r from-rose-gold to-rose-gold-light': item.color === 'rose',
                      'bg-gradient-to-r from-champagne to-champagne-light': item.color === 'gold',
                      'bg-gradient-to-r from-mist-purple-dark to-mist-purple': item.color === 'purple',
                      'bg-gradient-to-r from-blue-400 to-blue-300': item.color === 'blue',
                    }"
                    :style="{ width: `${item.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-silk-dark">
              <div class="flex items-center justify-between">
                <span class="text-base font-medium text-espresso/80">总计</span>
                <span class="text-2xl font-bold heading-serif text-gradient-rose">
                  ¥{{ budget.total.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-elegant bg-champagne/10 flex items-center justify-center">
                  <Calendar class="w-5 h-5 text-champagne-dark" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-espresso heading-serif">付款计划</h3>
                  <p class="text-sm text-espresso/50">按时支付，享受无忧服务</p>
                </div>
              </div>
            </div>

            <div class="relative">
              <div class="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-rose-gold/30 via-champagne/30 to-mist-purple/30"></div>

              <div class="space-y-4">
                <div
                  v-for="(payment, index) in budget.paymentSchedule"
                  :key="payment.id"
                  class="relative pl-12"
                >
                  <div
                    class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                    :class="{
                      'bg-emerald-500': payment.status === 'paid',
                      'bg-rose-gold': payment.status === 'overdue',
                      'bg-silk-dark': payment.status === 'pending',
                    }"
                  >
                    <CheckCircle v-if="payment.status === 'paid'" class="w-5 h-5 text-white" />
                    <AlertTriangle v-else-if="payment.status === 'overdue'" class="w-5 h-5 text-white" />
                    <Clock v-else class="w-5 h-5 text-espresso/50" />
                  </div>

                  <div
                    class="p-4 rounded-elegant border transition-all"
                    :class="{
                      'bg-emerald-50 border-emerald-100': payment.status === 'paid',
                      'bg-rose-gold/5 border-rose-gold/20': payment.status === 'overdue',
                      'bg-silk/30 border-silk-dark': payment.status === 'pending',
                    }"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-espresso">{{ payment.name }}</span>
                        <span
                          class="text-xs px-2 py-0.5 rounded-full"
                          :class="{
                            'bg-emerald-100 text-emerald-700': payment.status === 'paid',
                            'bg-rose-gold/10 text-rose-gold': payment.status === 'overdue',
                            'bg-silk-dark text-espresso/60': payment.status === 'pending',
                          }"
                        >
                          {{ payment.status === 'paid' ? '已支付' : payment.status === 'overdue' ? '已逾期' : '待支付' }}
                        </span>
                      </div>
                      <span class="text-lg font-bold text-espresso">
                        ¥{{ payment.amount.toLocaleString() }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-xs text-espresso/50">
                      <span class="flex items-center gap-1">
                        <Calendar class="w-3 h-3" />
                        到期日：{{ formatDate(payment.dueDate) }}
                      </span>
                      <span v-if="payment.status !== 'paid'" class="flex items-center gap-1">
                        <Clock class="w-3 h-3" />
                        {{ getDaysUntil(payment.dueDate) > 0 ? `还有 ${getDaysUntil(payment.dueDate)} 天` : '已到期' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <BudgetPanel />

          <div class="card-elegant p-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <h3 class="text-sm font-medium text-espresso/80 mb-3 flex items-center gap-2">
              <PieChart class="w-4 h-4 text-mist-purple-dark" />
              预算说明
            </h3>
            <ul class="space-y-2 text-xs text-espresso/60 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                基础款包含婚纱主体制作费用
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                面料升级可选择更高档面料
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                配饰可根据需求自由搭配
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-gold mt-0.5">·</span>
                修改费用包含首轮免费修改
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
