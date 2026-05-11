import {
  bindMiniAppCssVars,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  init,
  isTMA,
  miniAppReady,
  mountMiniAppSync,
  mountThemeParamsSync,
  setMiniAppBackgroundColor,
  setMiniAppBottomBarColor,
  setMiniAppHeaderColor,
  viewport,
} from "@telegram-apps/sdk";

export default defineNuxtPlugin(async () => {
  try {
    init();

    if (isTMA()) {
      document.documentElement.classList.add("telegram-mini-app");
    }

    if (mountMiniAppSync.isAvailable()) {
      mountMiniAppSync();
    }

    if (mountThemeParamsSync.isAvailable()) {
      mountThemeParamsSync();
    }

    if (bindThemeParamsCssVars.isAvailable()) {
      bindThemeParamsCssVars();
    }

    if (bindMiniAppCssVars.isAvailable()) {
      bindMiniAppCssVars();
    }

    if (viewport.mount.isAvailable()) {
      await viewport.mount();
    }

    if (bindViewportCssVars.isAvailable()) {
      bindViewportCssVars();
    }

    // Максимально раскрыть Mini App при открытии из чата.
    if (viewport.expand.isAvailable()) {
      viewport.expand();
    }

    if (viewport.requestFullscreen?.isAvailable?.()) {
      try {
        await viewport.requestFullscreen();
      } catch (error) {
        console.warn(error);
      }

      viewport.expand.ifAvailable();
    }

    if (
      setMiniAppHeaderColor.isAvailable() &&
      setMiniAppHeaderColor.supports.rgb()
    ) {
      setMiniAppHeaderColor("#0F0F14");
    }

    if (setMiniAppBackgroundColor.isAvailable()) {
      setMiniAppBackgroundColor("#0F0F14");
    }

    if (setMiniAppBottomBarColor.isAvailable()) {
      setMiniAppBottomBarColor("#0F0F14");
    }

    if (miniAppReady.isAvailable()) {
      miniAppReady();
    }
  } catch (e) {
    console.error(e);
  }
  try {
    const user = useTelegramUser();

    await $fetch("/api/init", {
      method: "POST",
      body: {
        user: user.value,
      },
    });
  } catch (error) {}
});
