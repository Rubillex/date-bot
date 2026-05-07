// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "rubillex_frog-modal"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/styles/collection/functions.scss" as *;
                                 @use "~/assets/styles/collection/mixins.scss" as *;
                                 @use "~/assets/styles/collection/colors.scss" as *;
                                 @use "~/assets/styles/collection/medias.scss" as *;
                                 @use "~/assets/styles/collection/fonts.scss" as *;
                                 @use "~/assets/styles/collection/vars.scss" as *;
                                 @use "~/assets/styles/collection/animations.scss" as *;`,
        },
      },
    },
  },

  imports: {
    dirs: ["./common/types/index.ts"],
  },
});
