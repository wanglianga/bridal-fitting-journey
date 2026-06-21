import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ShootPlan } from "@/types";
import { mockShootPlans } from "@/mock";

export const useShootStore = defineStore("shoot", () => {
  const shootPlans = ref<ShootPlan[]>(mockShootPlans);

  const upcomingShoots = computed(() => {
    return shootPlans.value
      .filter((s) => s.status === "upcoming")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  const nextShoot = computed(() => {
    return upcomingShoots.value[0];
  });

  const daysUntilNextShoot = computed(() => {
    if (!nextShoot.value) return null;
    const today = new Date();
    const shootDate = new Date(nextShoot.value.date);
    const diff = shootDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  function getShootsByRound(roundNumber: number) {
    return shootPlans.value.filter((s) => s.relatedFittingRound === roundNumber);
  }

  return {
    shootPlans,
    upcomingShoots,
    nextShoot,
    daysUntilNextShoot,
    getShootsByRound,
  };
});
