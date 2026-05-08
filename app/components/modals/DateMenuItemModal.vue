<template>
  <FrogModalWrapper
    :desktop-position="FrogModalWrapperPosition.CENTER"
    :mobile-position="FrogModalWrapperPosition.BOTTOM"
    class="menu-item-modal"
  >
    <button
      class="icon-close"
      type="button"
      aria-label="Закрыть"
      @click="closeModal"
    >
      <Icon name="lucide:x" />
    </button>

    <img class="menu-item-modal__image" :src="item.image" :alt="item.name" />

    <div class="menu-item-modal__body">
      <p class="eyebrow">{{ restaurantName }}</p>
      <h2>{{ item.name }}</h2>

      <section class="composition">
        <h3>Состав</h3>
        <p>{{ item.description }}</p>
      </section>
    </div>
  </FrogModalWrapper>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/data/date-invitation";

defineProps<{
  item: MenuItem;
  restaurantName: string;
}>();

const { closeModal } = useFrogModal();
</script>

<style scoped lang="scss">
.menu-item-modal {
  width: min(calc(100vw - 24px), 560px);
  max-height: min(86dvh, 760px);
  overflow: hidden auto;
  border: 1px solid rgba(196, 181, 253, 0.18);
  border-radius: 30px 30px 24px 24px;
  background: #1b1b24;
  color: #ffffff;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(22px);
}

.icon-close {
  position: absolute;
  z-index: 2;
  top: 14px;
  right: 14px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(196, 181, 253, 0.14);
  border-radius: 999px;
  background: rgba(36, 36, 51, 0.78);
  color: #ffffff;
  cursor: pointer;
}

.menu-item-modal__image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: rgba(36, 36, 51, 0.82);
}

.menu-item-modal__body {
  padding: 22px;

  h2 {
    margin: 0;
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: 36px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }
}

.eyebrow {
  margin: 0 0 8px;
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.composition {
  margin-top: 22px;

  h3 {
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    line-height: 1.25;
  }

  p {
    margin: 10px 0 0;
    color: #d7d3e3;
    font-size: 15px;
    line-height: 1.58;
  }
}
</style>
