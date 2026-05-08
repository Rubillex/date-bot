<template>
  <section class="screen menu-screen">
    <div class="section-heading">
      <p class="eyebrow">меню</p>
      <h2>Выбери, что хочется попробовать</h2>
      <p>Если вы оба отметите одно блюдо, оно появится как совпадение.</p>
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
          <button
            class="want-button"
            type="button"
            :aria-pressed="wants[item.id]"
            @click="emit('toggleWant', item.id)"
          >
            <Icon :name="wants[item.id] ? 'lucide:check' : 'lucide:heart'" />
            <span>Хочу</span>
          </button>
          <div v-if="isMutualMatch(item)" class="match-label">
            <Icon name="lucide:heart" />
            <span>Вы оба хотите это</span>
          </div>
        </div>
      </article>
    </div>

    <button class="primary-button" type="button" @click="emit('matches')">
      <span>Смотреть совпадения</span>
      <Icon name="lucide:sparkles" />
    </button>
  </section>
</template>

<script setup lang="ts">
import type { MenuItem, Restaurant } from "~/data/date-invitation";

const props = defineProps<{
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant;
  selectedRestaurantId: string;
  wants: Record<string, boolean>;
}>();

const emit = defineEmits<{
  matches: [];
  selectRestaurant: [restaurantId: string];
  toggleWant: [itemId: string];
}>();

const isMutualMatch = (item: MenuItem) =>
  Boolean(props.wants[item.id] && item.partnerWants);
</script>
