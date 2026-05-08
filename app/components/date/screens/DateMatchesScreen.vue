<template>
  <section class="screen matches-screen">
    <div class="section-heading">
      <p class="eyebrow">совпадения</p>
      <h2>То, что хочется вам обоим</h2>
      <p>Здесь остаются блюда, где ваши выборы встретились.</p>
    </div>

    <div v-if="mutualMatches.length" class="match-list">
      <article v-for="item in mutualMatches" :key="item.id" class="match-card">
        <img :src="item.image" :alt="item.name" />
        <div>
          <Icon name="lucide:heart" />
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </article>
    </div>
    <article v-else class="empty-matches">
      <Icon name="lucide:heart-handshake" />
      <h3>Пока нет общих выборов</h3>
      <p>Отметь блюда в меню, чтобы увидеть совпадения.</p>
    </article>

    <button class="primary-button" type="button" @click="emit('menu')">
      <span>Вернуться в меню</span>
      <Icon name="lucide:arrow-left" />
    </button>
  </section>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/data/date-invitation";

defineProps<{
  mutualMatches: MenuItem[];
}>();

const emit = defineEmits<{
  menu: [];
}>();
</script>
