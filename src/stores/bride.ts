import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Bride, BodyMeasurements, ViewMode } from "@/types";
import { mockBride, mockBodyMeasurements } from "@/mock";

export const useBrideStore = defineStore("bride", () => {
  const bride = ref<Bride>(mockBride);
  const measurements = ref<BodyMeasurements[]>(mockBodyMeasurements);
  const viewMode = ref<ViewMode>("bride");

  const daysUntilWedding = computed(() => {
    const today = new Date();
    const wedding = new Date(bride.value.weddingDate);
    const diff = wedding.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  const latestMeasurement = computed(() => {
    return measurements.value[measurements.value.length - 1];
  });

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
  }

  function addMeasurement(measurement: BodyMeasurements) {
    measurements.value.push(measurement);
  }

  function updateBride(data: Partial<Bride>) {
    bride.value = { ...bride.value, ...data };
  }

  return {
    bride,
    measurements,
    viewMode,
    daysUntilWedding,
    latestMeasurement,
    setViewMode,
    addMeasurement,
    updateBride,
  };
});
