<template>
  <section class="screen menu-screen">
    <div class="section-heading">
      <p class="eyebrow">меню</p>
      <h2>Выбери, что хочется попробовать</h2>
      <p>Если мы оба отметим одно блюдо, оно появится как совпадение.</p>
    </div>

    <nav class="restaurant-chips" aria-label="Кухня">
      <button
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        type="button"
        :class="{ active: selectedRestaurantId === restaurant.id }"
        @click="emit('selectRestaurant', restaurant.id)"
      >
        {{ restaurant.name }}
      </button>
    </nav>

    <div class="food-list">
      <article
        v-for="item in selectedRestaurant.items"
        :key="item.id"
        class="food-card"
        :class="{
          'food-card--selected': wants[item.id],
          'food-card--match': isMutualMatch(item),
        }"
      >
        <img :src="item.image" :alt="item.name" />
        <div class="food-card__body">
          <div>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <div class="food-card__actions">
            <button
              class="details-button"
              type="button"
              @click="emit('showDetails', item)"
            >
              <Icon name="lucide:list" />
              <span>Подробнее</span>
            </button>
            <button
              class="want-button"
              type="button"
              :aria-pressed="wants[item.id]"
              @click="emit('toggleWant', item.id)"
            >
              <Icon :name="wants[item.id] ? 'lucide:check' : 'lucide:heart'" />
              <span>Хочу</span>
            </button>
          </div>
          <div v-if="isMutualMatch(item)" class="match-label">
            <Icon name="lucide:heart" />
            <span>Вы оба хотите это</span>
          </div>
        </div>
      </article>
    </div>

    <p v-if="sendError" class="menu-status menu-status--error">
      Не получилось отправить выбор. Попробуй ещё раз.
    </p>
    <p v-else-if="isSent" class="menu-status menu-status--success">
      Выбор отправлен.
    </p>

    <button
      class="primary-button floating-button"
      type="button"
      :disabled="isSending || !selectedCount"
      @click="emit('submit')"
    >
      <span>{{ buttonText }}</span>
      <Icon :name="isSending ? 'lucide:loader-circle' : 'lucide:send'" />
    </button>
  </section>
</template>

<script setup lang="ts">
import type { MenuItem, Restaurant } from "~/data/date-invitation";

const props = defineProps<{
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant;
  selectedRestaurantId: string;
  selectedCount: number;
  isSending: boolean;
  isSent: boolean;
  sendError: string | null;
  wants: Record<string, boolean>;
}>();

const emit = defineEmits<{
  selectRestaurant: [restaurantId: string];
  showDetails: [item: MenuItem];
  submit: [];
  toggleWant: [itemId: string];
}>();

const isMutualMatch = (item: MenuItem) =>
  Boolean(props.wants[item.id] && item.partnerWants);

const buttonText = computed(() => {
  if (props.isSending) {
    return "Отправляю выбор";
  }

  if (!props.selectedCount) {
    return "Выбери хотя бы один пункт";
  }

  return "Соханить смотреть совпадения";
});
</script>

<style lang="scss">
.floating-button {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  margin-inline: 16px;
  width: calc(100vw - 32px);
}

.menu-screen {
  position: relative;
  padding-bottom: 80px;
}
</style>
