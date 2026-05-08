<template>
  <main class="date-app">
    <div class="ambient ambient--one" />
    <div class="ambient ambient--two" />
    <div class="particles" aria-hidden="true">
      <span v-for="particle in 14" :key="particle" />
    </div>

    <section class="shell">
      <DateTopbar
        :active-step-index="activeStepIndex"
        :steps="steps"
        @back="goBack"
        @place="goToStep('place')"
      />

      <DateHomeScreen v-if="activeStep === 'home'" @next="goToStep('place')" />

      <DatePlaceScreen
        v-else-if="activeStep === 'place'"
        :place-preview="placePreview"
        :recommendation-chips="recommendationChips"
        @reveal="openConfirmModal"
      />

      <DateGalleryScreen
        v-else-if="activeStep === 'gallery'"
        :active-photo="activePhoto"
        :active-photo-index="activePhotoIndex"
        :photos="placePhotos"
        @menu="goToStep('menu')"
        @next="nextPhoto"
        @previous="previousPhoto"
        @select-photo="selectPhoto"
      />

      <DateMenuScreen
        v-else-if="activeStep === 'menu'"
        :is-sending="isSendingMenu"
        :is-sent="isMenuSent"
        :restaurants="restaurants"
        :send-error="sendMenuError"
        :selected-count="selectedMenuItems.length"
        :selected-restaurant="selectedRestaurant"
        :selected-restaurant-id="selectedRestaurantId"
        :wants="wants"
        @select-restaurant="selectRestaurant"
        @show-details="openMenuItemModal"
        @submit="sendMenuSelection"
        @toggle-want="toggleWant"
      />

      <DateMatchesScreen
        v-else
        :mutual-matches="mutualMatches"
        @menu="goToStep('menu')"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import DateTopbar from "~/components/date/DateTopbar.vue";
import DateGalleryScreen from "~/components/date/screens/DateGalleryScreen.vue";
import DateHomeScreen from "~/components/date/screens/DateHomeScreen.vue";
import DateMatchesScreen from "~/components/date/screens/DateMatchesScreen.vue";
import DateMenuScreen from "~/components/date/screens/DateMenuScreen.vue";
import DatePlaceScreen from "~/components/date/screens/DatePlaceScreen.vue";
import DateConfirmModal from "~/components/modals/DateConfirmModal.vue";
import DateMenuItemModal from "~/components/modals/DateMenuItemModal.vue";
import {
  placePhotos,
  recommendationChips,
  restaurants,
  steps,
  type MenuItem,
  type Restaurant,
  type StepId,
} from "~/data/date-invitation";

type SelectedMenuItemPayload = {
  id: string;
  name: string;
  restaurantName: string;
  description: string;
  partnerWants: boolean;
};

const activeStep = ref<StepId>("home");
const activePhotoIndex = ref(0);
const selectedRestaurantId = ref(restaurants[0]?.id ?? "");
const isSendingMenu = ref(false);
const isMenuSent = ref(false);
const sendMenuError = ref<string | null>(null);
const wants = ref<Record<string, boolean>>(
  restaurants.reduce<Record<string, boolean>>((accumulator, restaurant) => {
    restaurant.items.forEach((item) => {
      accumulator[item.id] = false;
    });

    return accumulator;
  }, {}),
);

const { setModal, clearModals } = useFrogModal();

const activeStepIndex = computed(() =>
  steps.findIndex((step) => step === activeStep.value),
);

const activePhoto = computed(() => placePhotos[activePhotoIndex.value]);
const placePreview = computed(() => placePhotos[0]);

const selectedRestaurant = computed(
  () =>
    restaurants.find(
      (restaurant) => restaurant.id === selectedRestaurantId.value,
    ) ?? restaurants[0],
);

const allMenuItems = computed(() =>
  restaurants.flatMap((restaurant) => restaurant.items),
);

const mutualMatches = computed(() =>
  allMenuItems.value.filter((item) => isMutualMatch(item)),
);

const selectedMenuItems = computed(() =>
  restaurants.flatMap((restaurant) =>
    restaurant.items
      .filter((item) => wants.value[item.id])
      .map((item) => toSelectedMenuItemPayload(item, restaurant)),
  ),
);

const mutualMatchPayload = computed(() =>
  restaurants.flatMap((restaurant) =>
    restaurant.items
      .filter((item) => isMutualMatch(item))
      .map((item) => toSelectedMenuItemPayload(item, restaurant)),
  ),
);

const toSelectedMenuItemPayload = (
  item: MenuItem,
  restaurant: Restaurant,
): SelectedMenuItemPayload => ({
  id: item.id,
  name: item.name,
  restaurantName: restaurant.name,
  description: item.description,
  partnerWants: item.partnerWants,
});

const hapticImpact = async () => {
  if (!import.meta.client) {
    return;
  }

  const sdk = await import("@telegram-apps/sdk");

  if (sdk.hapticFeedbackImpactOccurred.isAvailable()) {
    sdk.hapticFeedbackImpactOccurred("soft");
  }
};

const hapticSuccess = async () => {
  if (!import.meta.client) {
    return;
  }

  const sdk = await import("@telegram-apps/sdk");

  if (sdk.hapticFeedbackNotificationOccurred.isAvailable()) {
    sdk.hapticFeedbackNotificationOccurred("success");
  }
};

const goToStep = (step: StepId) => {
  activeStep.value = step;
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  hapticImpact();
};

const goBack = () => {
  let previousStep = steps[activeStepIndex.value - 1];

  if (previousStep == "gallery") {
    previousStep = steps[activeStepIndex.value - 2];
  }

  if (previousStep) {
    goToStep(previousStep);
  }
};

const openConfirmModal = () => {
  setModal(DateConfirmModal, {
    onConfirm: () => {
      clearModals();
      goToStep("gallery");
    },
    onSave: () => {
      clearModals();
      goToStep("menu");
    },
  });
};

const nextPhoto = () => {
  activePhotoIndex.value = (activePhotoIndex.value + 1) % placePhotos.length;
  hapticImpact();
};

const previousPhoto = () => {
  activePhotoIndex.value =
    (activePhotoIndex.value - 1 + placePhotos.length) % placePhotos.length;
  hapticImpact();
};

const selectPhoto = (index: number) => {
  activePhotoIndex.value = index;
  hapticImpact();
};

const selectRestaurant = (restaurantId: string) => {
  selectedRestaurantId.value = restaurantId;
  hapticImpact();
};

const openMenuItemModal = (item: MenuItem) => {
  const restaurant = restaurants.find((currentRestaurant) =>
    currentRestaurant.items.some((menuItem) => menuItem.id === item.id),
  );

  setModal(DateMenuItemModal, {
    item,
    restaurantName: restaurant?.name ?? selectedRestaurant.value.name,
  });
  hapticImpact();
};

const isMutualMatch = (item: MenuItem) =>
  Boolean(wants.value[item.id] && item.partnerWants);

const toggleWant = (itemId: string) => {
  const item = allMenuItems.value.find((menuItem) => menuItem.id === itemId);
  wants.value[itemId] = !wants.value[itemId];
  isMenuSent.value = false;
  sendMenuError.value = null;

  if (item && isMutualMatch(item)) {
    hapticSuccess();
  } else {
    hapticImpact();
  }
};

const sendMenuSelection = async () => {
  if (!selectedMenuItems.value.length || isSendingMenu.value) {
    return;
  }

  isSendingMenu.value = true;
  sendMenuError.value = null;

  try {
    await $fetch("/api/date-menu", {
      method: "POST",
      body: {
        selectedItems: selectedMenuItems.value,
        mutualMatches: mutualMatchPayload.value,
      },
    });

    isMenuSent.value = true;
    hapticSuccess();
    goToStep("matches");
  } catch (error) {
    sendMenuError.value =
      error instanceof Error ? error.message : "Telegram send failed";
    hapticImpact();
  } finally {
    isSendingMenu.value = false;
  }
};

onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  const sdk = await import("@telegram-apps/sdk");

  if (sdk.hideBackButton.isAvailable()) {
    sdk.hideBackButton();
  }

  try {
    sdk.unmountBackButton();
    sdk.unmountMainButton();
  } catch {
    // Telegram controls are optional outside the Mini App environment.
  }
});
</script>

<style lang="scss">
:root {
  --date-viewport-height: var(--tg-viewport-stable-height, 100dvh);
  --date-safe-top: max(
    18px,
    env(safe-area-inset-top),
    var(--tg-viewport-safe-area-inset-top, 0px),
    var(--tg-viewport-content-safe-area-inset-top, 0px)
  );
  --date-safe-right: max(
    16px,
    env(safe-area-inset-right),
    var(--tg-viewport-safe-area-inset-right, 0px),
    var(--tg-viewport-content-safe-area-inset-right, 0px)
  );
  --date-safe-bottom: max(
    24px,
    env(safe-area-inset-bottom),
    var(--tg-viewport-safe-area-inset-bottom, 0px),
    var(--tg-viewport-content-safe-area-inset-bottom, 0px)
  );
  --date-safe-left: max(
    16px,
    env(safe-area-inset-left),
    var(--tg-viewport-safe-area-inset-left, 0px),
    var(--tg-viewport-content-safe-area-inset-left, 0px)
  );
}

html.telegram-mini-app {
  --date-safe-top: max(
    116px,
    env(safe-area-inset-top),
    var(--tg-viewport-safe-area-inset-top, 0px),
    var(--tg-viewport-content-safe-area-inset-top, 0px)
  );
  --date-safe-bottom: max(
    34px,
    env(safe-area-inset-bottom),
    var(--tg-viewport-safe-area-inset-bottom, 0px),
    var(--tg-viewport-content-safe-area-inset-bottom, 0px)
  );
}

html {
  background: #0f0f14;
}

body {
  min-height: var(--date-viewport-height);
  color: #ffffff;
  background: #0f0f14;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button {
  font: inherit;
}

.date-app {
  position: relative;
  min-height: var(--date-viewport-height);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: none;
  background:
    radial-gradient(
      circle at 22% 8%,
      rgba(167, 139, 250, 0.22),
      transparent 30%
    ),
    radial-gradient(
      circle at 82% 72%,
      rgba(244, 114, 182, 0.16),
      transparent 34%
    ),
    #0f0f14;
}

.ambient,
.particles {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.ambient::before,
.ambient::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.4;
}

.ambient--one::before {
  top: 8%;
  left: -120px;
  background: #a78bfa;
}

.ambient--two::after {
  right: -130px;
  bottom: 8%;
  background: #f472b6;
}

.particles span {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: rgba(251, 207, 232, 0.72);
  animation: float 7s ease-in-out infinite;
}

.particles span:nth-child(odd) {
  background: rgba(196, 181, 253, 0.72);
}

@for $i from 1 through 14 {
  .particles span:nth-child(#{$i}) {
    top: #{8 + $i * 6%};
    left: #{($i * 17) % 92%};
    animation-delay: #{-$i * 0.42s};
  }
}

.shell {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(100%, 760px);
  min-height: var(--date-viewport-height);
  margin: 0 auto;
  padding: var(--date-safe-top) var(--date-safe-right) var(--date-safe-bottom)
    var(--date-safe-left);
}

.topbar {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  gap: 12px;
  align-items: center;
  height: 52px;
}

.icon-button,
.gallery-arrow {
  display: inline-grid;
  place-items: center;
  border: 1px solid rgba(196, 181, 253, 0.18);
  border-radius: 999px;
  background: rgba(36, 36, 51, 0.72);
  color: #ffffff;
  cursor: pointer;
  backdrop-filter: blur(18px);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.icon-button {
  width: 44px;
  height: 44px;
}

.icon-button:disabled {
  cursor: default;
  opacity: 0.34;
}

.icon-button:not(:disabled):active,
.gallery-arrow:active,
.primary-button:active,
.want-button:active,
.restaurant-chips button:active {
  transform: scale(0.98);
}

.progress {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 7px;
}

.progress span {
  height: 3px;
  border-radius: 999px;
  background: rgba(184, 184, 199, 0.22);
}

.progress span.active {
  background: linear-gradient(90deg, #a78bfa, #f472b6);
  box-shadow: 0 0 18px rgba(167, 139, 250, 0.42);
}

.screen {
  display: grid;
  align-content: center;
  gap: 22px;
  min-height: calc(
    var(--date-viewport-height) - var(--date-safe-top) - var(
        --date-safe-bottom
      ) -
      76px
  );
  animation: screenIn 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.eyebrow {
  margin: 0 0 8px;
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-copy {
  max-width: 620px;
  text-align: center;
  justify-self: center;

  h1 {
    margin: 0;
    color: #ffffff;
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(48px, 11vw, 82px);
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: 0;
  }

  p:not(.eyebrow) {
    max-width: 480px;
    margin: 18px auto 0;
    color: #d7d3e3;
    font-size: 17px;
    line-height: 1.65;
  }
}

.primary-button,
.want-button {
  display: inline-flex;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0 20px;
  color: #ffffff;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}

.primary-button {
  width: min(100%, 420px);
  justify-self: center;
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  box-shadow: 0 18px 42px rgba(167, 139, 250, 0.24);
}

.primary-button:disabled {
  cursor: default;
  opacity: 0.58;
  box-shadow: none;
}

.section-heading {
  h2 {
    margin: 0;
    color: #ffffff;
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(38px, 8vw, 58px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }

  p:not(.eyebrow) {
    margin: 12px 0 0;
    color: #b8b8c7;
    font-size: 16px;
    line-height: 1.6;
  }
}

.place-card {
  overflow: hidden;
  border: 1px solid rgba(196, 181, 253, 0.14);
  border-radius: 28px;
  background: rgba(27, 27, 36, 0.84);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.place-media {
  position: relative;
  min-height: 280px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 280px;
    object-fit: cover;
    filter: blur(10px);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 32%,
      rgba(15, 15, 20, 0.74)
    );
  }

  div {
    position: absolute;
    right: 20px;
    bottom: 18px;
    left: 20px;
    z-index: 1;
  }

  span,
  strong {
    display: block;
  }

  span {
    color: #f5d0fe;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
  }

  strong {
    margin-top: 4px;
    color: #ffffff;
    font-size: 25px;
  }
}

.date-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  background: rgba(196, 181, 253, 0.1);

  div {
    padding: 16px;
    background: rgba(27, 27, 36, 0.94);
  }

  dt,
  dd {
    margin: 0;
  }

  dt {
    color: #b8b8c7;
    font-size: 12px;
  }

  dd {
    margin-top: 6px;
    color: #ffffff;
    font-weight: 800;
  }
}

.recommendation-chips,
.restaurant-chips {
  display: flex;
  gap: 10px;
  margin-right: calc(var(--date-safe-right) * -1);
  margin-left: calc(var(--date-safe-left) * -1);
  overflow-x: auto;
  padding: 3px var(--date-safe-right) 8px var(--date-safe-left);
  scroll-padding-right: var(--date-safe-right);
  scroll-padding-left: var(--date-safe-left);
  scrollbar-width: none;
}

.recommendation-chips::-webkit-scrollbar,
.restaurant-chips::-webkit-scrollbar {
  display: none;
}

.recommendation-chips span,
.restaurant-chips button {
  flex: 0 0 auto;
  border: 1px solid rgba(196, 181, 253, 0.16);
  border-radius: 999px;
  background: rgba(36, 36, 51, 0.72);
  color: #f5d0fe;
  backdrop-filter: blur(16px);
}

.recommendation-chips span {
  min-height: 48px;
  padding: 13px 18px;
  font-size: 15px;
  font-weight: 760;
}

.gallery-screen {
  align-content: end;
  min-height: calc(
    var(--date-viewport-height) - var(--date-safe-top) - var(
        --date-safe-bottom
      ) -
      76px
  );
}

.gallery-bg {
  position: absolute;
  inset: 0;
  z-index: -1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(32px) saturate(1.2);
    opacity: 0.34;
    transform: scale(1.12);
  }
}

.gallery-frame {
  position: relative;
  overflow: hidden;
  height: min(62dvh, 620px);
  border-radius: 34px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.42);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: photoIn 420ms ease;
  }
}

.gallery-arrow {
  position: absolute;
  top: 50%;
  width: 42px;
  height: 42px;
  transform: translateY(-50%);
}

.gallery-arrow--left {
  left: 14px;
}

.gallery-arrow--right {
  right: 14px;
}

.gallery-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;

  h2 {
    margin: 0;
    color: #ffffff;
    font-size: 24px;
    line-height: 1.15;
    min-height: 2lh;
  }
}

.gallery-dots {
  display: flex;
  gap: 8px;

  button {
    width: 8px;
    height: 8px;
    border: 0;
    border-radius: 999px;
    background: rgba(184, 184, 199, 0.4);
    cursor: pointer;

    transition: all 0.5s ease-in-out;
  }

  button.active {
    width: 24px;
    background: #f472b6;
  }
}

.restaurant-chips button {
  min-height: 50px;
  padding: 0 22px;
  cursor: pointer;
}

.restaurant-chips button.active {
  border-color: rgba(167, 139, 250, 0.72);
  background: rgba(167, 139, 250, 0.24);
  color: #ffffff;
  box-shadow: 0 0 24px rgba(167, 139, 250, 0.18);
}

.food-list,
.match-list {
  display: grid;
  gap: 14px;
}

.food-card,
.match-card,
.empty-matches {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(196, 181, 253, 0.12);
  border-radius: 28px;
  background: rgba(27, 27, 36, 0.88);
  box-shadow: 0 24px 58px rgba(0, 0, 0, 0.24);
}

.food-card {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  min-height: 188px;
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease,
    transform 220ms ease;

  > img {
    width: 100%;
    height: 100%;
    min-height: 188px;
    object-fit: cover;
  }
}

.food-card--selected {
  border-color: rgba(167, 139, 250, 0.78);
  box-shadow:
    0 0 0 1px rgba(167, 139, 250, 0.18),
    0 22px 58px rgba(167, 139, 250, 0.16);
}

.food-card--match {
  border-color: rgba(244, 114, 182, 0.82);
  box-shadow:
    0 0 0 1px rgba(244, 114, 182, 0.22),
    0 0 36px rgba(244, 114, 182, 0.18);
  animation: glowPulse 1.8s ease-in-out infinite;
}

.food-card--match::after {
  content: "";
  position: absolute;
  top: 18px;
  right: 18px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f472b6;
  box-shadow:
    18px 12px 0 rgba(244, 114, 182, 0.7),
    -12px 18px 0 rgba(251, 207, 232, 0.74);
  animation: heartBurst 1.2s ease both;
}

.food-card__body {
  display: grid;
  align-content: space-between;
  gap: 16px;
  padding: 16px;

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: #ffffff;
    font-size: 18px;
    line-height: 1.25;
  }

  p {
    margin-top: 7px;
    color: #b8b8c7;
    display: -webkit-box;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }
}

.food-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.details-button,
.want-button {
  width: fit-content;
  min-height: 44px;
  padding-inline: 15px;
  background: rgba(36, 36, 51, 0.82);
  border-color: rgba(196, 181, 253, 0.22);
}

.details-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid rgba(196, 181, 253, 0.18);
  color: #f5d0fe;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 220ms ease,
    background 220ms ease;

  &:active {
    transform: scale(0.98);
  }
}

.details-button:focus-visible {
  outline: 2px solid rgba(244, 114, 182, 0.72);
  outline-offset: 3px;
}

.food-card--selected .want-button {
  background: rgba(167, 139, 250, 0.24);
  border-color: rgba(167, 139, 250, 0.72);
}

.match-label {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 7px;
  color: #fbcfe8;
  font-size: 13px;
  font-weight: 850;
}

.menu-status {
  width: min(100%, 420px);
  justify-self: center;
  margin: 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
}

.menu-status--error {
  color: #fbcfe8;
}

.menu-status--success {
  color: #c4b5fd;
}

.match-card {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);

  img {
    width: 100%;
    height: 100%;
    min-height: 142px;
    object-fit: cover;
  }

  div {
    padding: 18px;
  }

  svg {
    color: #f472b6;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    margin-top: 8px;
    color: #ffffff;
    font-size: 20px;
  }

  p {
    margin-top: 7px;
    color: #b8b8c7;
    line-height: 1.45;
  }
}

.empty-matches {
  display: grid;
  justify-items: center;
  padding: 36px 20px;
  text-align: center;

  svg {
    width: 38px;
    height: 38px;
    color: #f472b6;
  }

  h3 {
    margin: 14px 0 0;
    color: #ffffff;
    font-size: 21px;
  }

  p {
    margin: 8px 0 0;
    color: #b8b8c7;
    line-height: 1.45;
  }
}

@keyframes screenIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes photoIn {
  from {
    opacity: 0.82;
    transform: scale(1.02);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(12px, -22px, 0);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.01);
  }
}

@keyframes heartBurst {
  from {
    opacity: 0;
    transform: scale(0.4);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 560px) {
  :root {
    --date-safe-right: max(
      12px,
      env(safe-area-inset-right),
      var(--tg-viewport-safe-area-inset-right, 0px),
      var(--tg-viewport-content-safe-area-inset-right, 0px)
    );
    --date-safe-left: max(
      12px,
      env(safe-area-inset-left),
      var(--tg-viewport-safe-area-inset-left, 0px),
      var(--tg-viewport-content-safe-area-inset-left, 0px)
    );
  }

  .shell {
    padding-right: var(--date-safe-right);
    padding-left: var(--date-safe-left);
  }

  .screen {
    gap: 18px;
  }

  .date-facts,
  .food-card,
  .match-card {
    grid-template-columns: 1fr;
  }

  .date-facts {
    gap: 1px;
  }

  .food-card > img,
  .match-card img {
    height: 190px;
    min-height: 0;
  }

  .gallery-frame {
    height: 56dvh;
    border-radius: 28px;
  }

  .gallery-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
