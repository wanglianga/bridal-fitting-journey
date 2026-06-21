import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Budget, Accessory } from "@/types";
import { mockBudget, mockAccessories } from "@/mock";

export const useBudgetStore = defineStore("budget", () => {
  const budget = ref<Budget>(mockBudget);
  const accessories = ref<Accessory[]>(mockAccessories);

  const paidPercentage = computed(() => {
    return Math.round((budget.value.paidAmount / budget.value.total) * 100);
  });

  const remainingAmount = computed(() => {
    return budget.value.total - budget.value.paidAmount;
  });

  const selectedAccessories = computed(() => {
    return accessories.value.filter((a) => a.selected);
  });

  const selectedAccessoriesTotal = computed(() => {
    return selectedAccessories.value.reduce((sum, a) => sum + a.price, 0);
  });

  function toggleAccessory(id: string) {
    const accessory = accessories.value.find((a) => a.id === id);
    if (accessory) {
      accessory.selected = !accessory.selected;
      budget.value.accessoryCost = selectedAccessoriesTotal.value;
      budget.value.total =
        budget.value.basePrice +
        budget.value.fabricUpgrade +
        budget.value.accessoryCost +
        budget.value.alterationCost;
    }
  }

  return {
    budget,
    accessories,
    paidPercentage,
    remainingAmount,
    selectedAccessories,
    selectedAccessoriesTotal,
    toggleAccessory,
  };
});
