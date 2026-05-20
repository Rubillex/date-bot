<template>
  <section class="screen place-screen">
    <div class="section-heading">
      <p class="eyebrow">{{ content.eyebrow }}</p>
      <h2>{{ content.title }}</h2>
      <p>{{ content.text }}</p>
    </div>

    <article class="place-card">
      <div class="place-media">
        <img :src="placePreview.src" :alt="placePreview.alt" />
        <div>
          <span>место</span>
          <strong>{{ content.placeName }}</strong>
        </div>
      </div>
      <dl class="date-facts">
        <div>
          <dt>Дата</dt>
          <dd>{{ content.dateText }}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{{ content.timeText }}</dd>
        </div>
      </dl>
    </article>

    <div class="recommendation-chips" aria-label="Рекомендации">
      <span v-for="chip in recommendationChips" :key="chip">{{ chip }}</span>
    </div>

    <button class="primary-button" type="button" @click="emit('reveal')">
      <span>Посмотреть фото места</span>
      <Icon name="lucide:image" />
    </button>
  </section>
</template>

<script setup lang="ts">
import type { PlaceDetails, PlacePhoto } from "~/data/date-invitation";

defineProps<{
  content: PlaceDetails;
  placePreview: PlacePhoto;
  recommendationChips: string[];
}>();

const emit = defineEmits<{
  reveal: [];
}>();
</script>
