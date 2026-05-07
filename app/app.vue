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
  --frog-modal-overlay-background: #291e1c;
  --frog-modal-overlay-opacity: 0.42;
  --frog-modal-animation-duration: 0.24s;
  --frog-modal-animation-timing: ease-out;
}

* {
  box-sizing: border-box;
}
</style>
