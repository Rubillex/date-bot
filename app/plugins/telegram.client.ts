import { init, viewport } from "@telegram-apps/sdk";

export default defineNuxtPlugin(() => {
  try {
    init();

    // Раскрыть приложение на весь экран
    if (viewport.mount.isAvailable()) {
      viewport.mount();
    }

    if (viewport.expand.isAvailable()) {
      viewport.expand();
    }

    // iOS fullscreen
    if (viewport.requestFullscreen?.isAvailable?.()) {
      viewport.requestFullscreen();
    }
  } catch (e) {
    console.error(e);
  }
});
