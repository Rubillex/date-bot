<template>
  <section class="screen place-screen">
    <div class="section-heading">
      <p class="eyebrow">детали вечера</p>
      <h2>Место, где вечер становится чуть выше обычного</h2>
      <p>
        Я выбрал точку, где можно спокойно поговорить, вкусно поужинать и
        оставить главное в секрете до последнего момента.
      </p>
    </div>

    <article class="place-card">
      <div class="place-media">
        <img :src="placePreview.src" :alt="placePreview.alt" />
        <div>
          <span>место</span>
          <strong>Секретная точка вечера</strong>
        </div>
      </div>
      <dl class="date-facts">
        <div>
          <dt>Дата</dt>
          <dd>На выходных или на недельке</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>18:00</dd>
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
