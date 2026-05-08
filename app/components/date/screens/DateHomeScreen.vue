<template>
  <section class="screen home-screen">
    <div class="hero-copy">
      <p class="eyebrow">личное приглашение</p>
      <h1>У меня есть для тебя приглашение</h1>
      <p>
        Я кое-что подготовил. Немного интриги, красивый вечер и одно место,
        которое лучше раскрывать постепенно.
      </p>
    </div>
    <button class="primary-button" type="button" @click="emit('next')">
      <span>Посмотреть детали</span>
      <Icon name="lucide:arrow-right" />
    </button>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  next: [];
}>();
</script>
