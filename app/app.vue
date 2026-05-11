<template>
  <div class="app">
    <ClientOnly>
      <FrogModal />
    </ClientOnly>
    <NuxtPage />
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/index.scss" as *;

.app {
  min-height: 100dvh;
  --frog-modal-overlay-background: #0f0f14;
  --frog-modal-overlay-opacity: 0.68;
  --frog-modal-animation-duration: 0.34s;
  --frog-modal-animation-timing: cubic-bezier(0.2, 0.8, 0.2, 1);
}

* {
  box-sizing: border-box;
}
</style>
