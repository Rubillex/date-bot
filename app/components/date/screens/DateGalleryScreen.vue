<template>
  <section
    class="screen gallery-screen"
    @touchstart.passive="onSwipeStart"
    @touchend.passive="onSwipeEnd"
  >
    <div class="gallery-bg">
      <img :src="activePhoto.src" :alt="activePhoto.alt" />
    </div>
    <div class="gallery-frame">
      <img :src="activePhoto.src" :alt="activePhoto.alt" />
      <button
        class="gallery-arrow gallery-arrow--left"
        type="button"
        aria-label="Предыдущее фото"
        @click="emit('previous')"
      >
        <Icon name="lucide:chevron-left" />
      </button>
      <button
        class="gallery-arrow gallery-arrow--right"
        type="button"
        aria-label="Следующее фото"
        @click="emit('next')"
      >
        <Icon name="lucide:chevron-right" />
      </button>
    </div>
    <div class="gallery-footer">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ activePhoto.title }}</h2>
      </div>
      <div class="gallery-dots" aria-label="Фото">
        <button
          v-for="(photo, index) in photos"
          :key="photo.src"
          type="button"
          :class="{ active: activePhotoIndex === index }"
          :aria-label="`Показать фото ${index + 1}`"
          @click="emit('selectPhoto', index)"
        />
      </div>
    </div>
    <button class="primary-button" type="button" @click="emit('menu')">
      <span>{{ buttonText }}</span>
      <Icon name="lucide:utensils" />
    </button>
  </section>
</template>

<script setup lang="ts">
import type { PlacePhoto } from "~/data/date-invitation";

defineProps<{
  activePhoto: PlacePhoto;
  activePhotoIndex: number;
  buttonText: string;
  eyebrow: string;
  photos: PlacePhoto[];
}>();

const emit = defineEmits<{
  menu: [];
  next: [];
  previous: [];
  selectPhoto: [index: number];
}>();

const swipeStartX = ref<number | null>(null);

const onSwipeStart = (event: TouchEvent) => {
  swipeStartX.value = event.changedTouches[0]?.clientX ?? null;
};

const onSwipeEnd = (event: TouchEvent) => {
  if (swipeStartX.value === null) {
    return;
  }

  const endX = event.changedTouches[0]?.clientX ?? swipeStartX.value;
  const delta = endX - swipeStartX.value;
  swipeStartX.value = null;

  if (Math.abs(delta) < 42) {
    return;
  }

  emit(delta < 0 ? "next" : "previous");
};
</script>
