import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FittingRound, Annotation, ChangeItem } from "@/types";
import { mockFittingRounds } from "@/mock";

export const useFittingStore = defineStore("fitting", () => {
  const fittingRounds = ref<FittingRound[]>(mockFittingRounds);
  const selectedRoundId = ref<string>("fitting-002");
  const selectedPhotoId = ref<string | null>(null);
  const showAnnotations = ref(true);

  const selectedRound = computed(() => {
    return fittingRounds.value.find((r) => r.id === selectedRoundId.value);
  });

  const selectedPhoto = computed(() => {
    if (!selectedPhotoId.value || !selectedRound.value) return null;
    return selectedRound.value.photos.find((p) => p.id === selectedPhotoId.value);
  });

  const completedRounds = computed(() => {
    return fittingRounds.value.filter((r) => r.status === "completed").length;
  });

  const totalRounds = computed(() => fittingRounds.value.length);

  const allChanges = computed(() => {
    const changes: ChangeItem[] = [];
    fittingRounds.value.forEach((round) => {
      changes.push(...round.changes);
    });
    return changes;
  });

  const pendingChanges = computed(() => {
    return allChanges.value.filter((c) => c.status !== "completed");
  });

  function selectRound(id: string) {
    selectedRoundId.value = id;
    const round = fittingRounds.value.find((r) => r.id === id);
    if (round && round.photos.length > 0) {
      selectedPhotoId.value = round.photos[0].id;
    }
  }

  function selectPhoto(id: string) {
    selectedPhotoId.value = id;
  }

  function addAnnotation(annotation: Omit<Annotation, "id" | "createdAt">) {
    const round = fittingRounds.value.find((r) => r.id === selectedRoundId.value);
    if (!round) return;
    const photo = round.photos.find((p) => p.id === selectedPhotoId.value);
    if (!photo) return;
    photo.annotations.push({
      ...annotation,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  }

  function updateConsultantNotes(notes: string) {
    const round = fittingRounds.value.find((r) => r.id === selectedRoundId.value);
    if (round) {
      round.consultantNotes = notes;
    }
  }

  function updateMobilityDifficulty(level: number) {
    const round = fittingRounds.value.find((r) => r.id === selectedRoundId.value);
    if (round) {
      round.mobilityDifficulty = level;
    }
  }

  function toggleAnnotations() {
    showAnnotations.value = !showAnnotations.value;
  }

  return {
    fittingRounds,
    selectedRoundId,
    selectedPhotoId,
    showAnnotations,
    selectedRound,
    selectedPhoto,
    completedRounds,
    totalRounds,
    allChanges,
    pendingChanges,
    selectRound,
    selectPhoto,
    addAnnotation,
    updateConsultantNotes,
    updateMobilityDifficulty,
    toggleAnnotations,
  };
});
