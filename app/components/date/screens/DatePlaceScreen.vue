<template>
  <section class="screen place-screen">
    <div class="section-heading">
      <p class="eyebrow">детали вечера</p>
      <h2>Место с тихим светом и прогулкой рядом</h2>
      <p>
        Встречаемся у входа. Внутри тепло и спокойно, а после можно пройтись без
        спешки.
      </p>
    </div>

    <article class="place-card">
      <div class="place-media">
        <img :src="placePreview.src" :alt="placePreview.alt" />
        <div>
          <span>место</span>
          <strong>Тихое бистро</strong>
        </div>
      </div>
      <dl class="date-facts">
        <div>
          <dt>Дата</dt>
          <dd>Суббота</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>19:00</dd>
        </div>
        <div>
          <dt>Адрес</dt>
          <dd>Центр города</dd>
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
import type { PlacePhoto } from "~/data/date-invitation";

defineProps<{
  placePreview: PlacePhoto;
  recommendationChips: string[];
}>();

const emit = defineEmits<{
  reveal: [];
}>();
</script>
