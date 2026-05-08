<template>
  <header class="topbar">
    <button
      class="icon-button"
      type="button"
      :disabled="activeStepIndex === 0"
      aria-label="Назад"
      @click="emit('back')"
    >
      <Icon name="lucide:chevron-left" />
    </button>
    <div class="progress">
      <span
        v-for="(step, index) in steps"
        :key="step"
        :class="{ active: index <= activeStepIndex }"
      />
    </div>
    <button
      class="icon-button"
      type="button"
      aria-label="К месту встречи"
      @click="emit('place')"
    >
      <Icon name="lucide:map-pin" />
    </button>
  </header>
</template>

<script setup lang="ts">
import type { StepId } from "~/data/date-invitation";

defineProps<{
  activeStepIndex: number;
  steps: StepId[];
}>();

const emit = defineEmits<{
  back: [];
  place: [];
}>();
</script>
