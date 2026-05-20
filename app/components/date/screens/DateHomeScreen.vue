<template>
  <section class="screen home-screen">
    <div class="hero-copy">
      <p class="eyebrow">{{ content.eyebrow }}</p>
      <h1>{{ content.title }}</h1>
      <p>{{ content.text }}</p>
    </div>
    <button class="primary-button" type="button" @click="emit('next')">
      <span>Посмотреть детали</span>
      <Icon name="lucide:arrow-right" />
    </button>
  </section>
</template>

<script setup lang="ts">
import type { InvitationCopy } from "~/data/date-invitation";

defineProps<{
  content: InvitationCopy;
}>();

const emit = defineEmits<{
  next: [];
}>();
</script>
