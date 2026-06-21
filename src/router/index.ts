import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import DressStylePage from '@/pages/DressStylePage.vue'
import BodyDataPage from '@/pages/BodyDataPage.vue'
import FittingRecordsPage from '@/pages/FittingRecordsPage.vue'
import AccessoriesPage from '@/pages/AccessoriesPage.vue'
import BudgetPage from '@/pages/BudgetPage.vue'
import ShootingPlanPage from '@/pages/ShootingPlanPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/dress-style',
    name: 'dress-style',
    component: DressStylePage,
  },
  {
    path: '/body-data',
    name: 'body-data',
    component: BodyDataPage,
  },
  {
    path: '/fitting-records',
    name: 'fitting-records',
    component: FittingRecordsPage,
  },
  {
    path: '/accessories',
    name: 'accessories',
    component: AccessoriesPage,
  },
  {
    path: '/budget',
    name: 'budget',
    component: BudgetPage,
  },
  {
    path: '/shooting-plan',
    name: 'shooting-plan',
    component: ShootingPlanPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
