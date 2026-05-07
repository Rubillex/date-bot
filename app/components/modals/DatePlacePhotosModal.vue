<template>
  <FrogModalWrapper
    :desktop-position="FrogModalWrapperPosition.CENTER"
    :mobile-position="FrogModalWrapperPosition.BOTTOM"
    class="date-modal photo-modal"
  >
    <button
      class="icon-close"
      type="button"
      aria-label="Закрыть"
      @click="closeModal"
    >
      <Icon name="lucide:x" />
    </button>
    <h2>Место встречи</h2>
    <div class="photo-grid">
      <img
        v-for="photo in photos"
        :key="photo.src"
        :src="photo.src"
        :alt="photo.alt"
      />
    </div>
  </FrogModalWrapper>
</template>

<script setup lang="ts">
type PlacePhoto = {
  src: string;
  alt: string;
};

defineProps<{
  photos: PlacePhoto[];
}>();

const { closeModal } = useFrogModal();
</script>

<style scoped lang="scss">
.date-modal {
  width: min(calc(100vw - 32px), 520px);
  padding: 22px;
  border: 1px solid rgba(91, 59, 52, 0.14);
  border-radius: 8px;
  background: #fffaf4;
  box-shadow: 0 18px 46px rgba(91, 59, 52, 0.1);

  h2 {
    margin: 0;
    color: #3a2422;
    font-size: 24px;
    line-height: 1.15;
    letter-spacing: 0;
  }
}

.icon-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: #f8efe6;
  color: #553b36;
}

.photo-modal {
  max-height: 86dvh;
  overflow-y: auto;
}

.photo-grid {
  display: grid;
  gap: 10px;
  margin-top: 14px;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border-radius: 8px;
  }
}
</style>
