import {
  bindThemeParamsCssVars,
  init,
  mountThemeParamsSync,
  viewport,
} from "@telegram-apps/sdk";

export default defineNuxtPlugin(() => {
  try {
    init();

    if (mountThemeParamsSync.isAvailable()) {
      mountThemeParamsSync();
    }

    if (bindThemeParamsCssVars.isAvailable()) {
      bindThemeParamsCssVars();
    }

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
