import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { DressStyle, FabricSwatch, Silhouette, FabricType, TrainLength, SleeveStyle } from "@/types";
import { mockDressStyles, mockFabricSwatches } from "@/mock";

export const useDressStore = defineStore("dress", () => {
  const dressStyles = ref<DressStyle[]>(mockDressStyles);
  const fabricSwatches = ref<FabricSwatch[]>(mockFabricSwatches);
  const selectedDressId = ref<string>("dress-001");
  const selectedSilhouette = ref<Silhouette>("A-line");
  const selectedFabric = ref<FabricType>("satin");
  const selectedTrain = ref<TrainLength>("medium");
  const hasDetachableSleeves = ref(true);
  const selectedSleeveStyle = ref<SleeveStyle>("long");

  const selectedDress = computed(() => {
    return dressStyles.value.find((d) => d.id === selectedDressId.value);
  });

  const currentFabricSwatch = computed(() => {
    return fabricSwatches.value.find((f) => f.type === selectedFabric.value);
  });

  function selectDress(id: string) {
    selectedDressId.value = id;
    const dress = dressStyles.value.find((d) => d.id === id);
    if (dress) {
      selectedSilhouette.value = dress.silhouette;
      selectedFabric.value = dress.fabric;
      selectedTrain.value = dress.trainLength;
      hasDetachableSleeves.value = dress.hasDetachableSleeves;
      if (dress.sleeveStyle) {
        selectedSleeveStyle.value = dress.sleeveStyle;
      }
    }
  }

  function setSilhouette(silhouette: Silhouette) {
    selectedSilhouette.value = silhouette;
  }

  function setFabric(fabric: FabricType) {
    selectedFabric.value = fabric;
  }

  function setTrainLength(train: TrainLength) {
    selectedTrain.value = train;
  }

  function toggleDetachableSleeves() {
    hasDetachableSleeves.value = !hasDetachableSleeves.value;
  }

  function setSleeveStyle(style: SleeveStyle) {
    selectedSleeveStyle.value = style;
  }

  return {
    dressStyles,
    fabricSwatches,
    selectedDressId,
    selectedSilhouette,
    selectedFabric,
    selectedTrain,
    hasDetachableSleeves,
    selectedSleeveStyle,
    selectedDress,
    currentFabricSwatch,
    selectDress,
    setSilhouette,
    setFabric,
    setTrainLength,
    toggleDetachableSleeves,
    setSleeveStyle,
  };
});
