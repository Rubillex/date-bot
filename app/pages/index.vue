<template>
  <main class="date-app">
    <div class="ambient ambient--one" />
    <div class="ambient ambient--two" />
    <div class="particles" aria-hidden="true">
      <span v-for="particle in 14" :key="particle" />
    </div>

    <section class="shell">
      <header class="topbar">
        <button
          class="icon-button"
          type="button"
          :disabled="activeStepIndex === 0"
          aria-label="Назад"
          @click="goBack"
        >
          <Icon name="lucide:chevron-left" />
        </button>
        <div class="progress">
          <span
            v-for="(step, index) in steps"
            :key="step.id"
            :class="{ active: index <= activeStepIndex }"
          />
        </div>
        <button
          class="icon-button"
          type="button"
          aria-label="К месту встречи"
          @click="goToStep('place')"
        >
          <Icon name="lucide:map-pin" />
        </button>
      </header>

      <section v-if="activeStep === 'home'" class="screen home-screen">
        <div class="hero-copy">
          <p class="eyebrow">личное приглашение</p>
          <h1>У меня есть для тебя приглашение</h1>
          <p>
            Я кое-что подготовил. Немного интриги, немного вкусного и одно
            место, которое тебе понравится.
          </p>
        </div>
        <button class="primary-button" type="button" @click="goToStep('place')">
          <span>Посмотреть детали</span>
          <Icon name="lucide:arrow-right" />
        </button>
      </section>

      <section v-else-if="activeStep === 'place'" class="screen place-screen">
        <div class="section-heading">
          <p class="eyebrow">детали вечера</p>
          <h2>Место с тихим светом и прогулкой рядом</h2>
          <p>
            Встречаемся у входа. Внутри тепло и спокойно, а после можно пройтись
            без спешки.
          </p>
        </div>

        <article class="place-card">
          <div class="place-media">
            <img :src="placePreview.src" :alt="placePreview.alt" />
            <div>
              <span>место</span>
              <strong>Тихое бистро</strong>
            </div>
          </div>
          <dl class="date-facts">
            <div>
              <dt>Дата</dt>
              <dd>Суббота</dd>
            </div>
            <div>
              <dt>Время</dt>
              <dd>19:00</dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>Центр города</dd>
            </div>
          </dl>
        </article>

        <div class="recommendation-chips" aria-label="Рекомендации">
          <span v-for="chip in recommendationChips" :key="chip">{{ chip }}</span>
        </div>

        <button class="primary-button" type="button" @click="openConfirmModal">
          <span>Посмотреть фото места</span>
          <Icon name="lucide:image" />
        </button>
      </section>

      <section
        v-else-if="activeStep === 'gallery'"
        class="screen gallery-screen"
        @touchstart.passive="onSwipeStart"
        @touchend.passive="onSwipeEnd"
      >
        <div class="gallery-bg">
          <img :src="activePhoto.src" :alt="activePhoto.alt" />
        </div>
        <div class="gallery-frame">
          <img :src="activePhoto.src" :alt="activePhoto.alt" />
          <button
            class="gallery-arrow gallery-arrow--left"
            type="button"
            aria-label="Предыдущее фото"
            @click="previousPhoto"
          >
            <Icon name="lucide:chevron-left" />
          </button>
          <button
            class="gallery-arrow gallery-arrow--right"
            type="button"
            aria-label="Следующее фото"
            @click="nextPhoto"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
        <div class="gallery-footer">
          <div>
            <p class="eyebrow">атмосфера</p>
            <h2>{{ activePhoto.title }}</h2>
          </div>
          <div class="gallery-dots" aria-label="Фото">
            <button
              v-for="(photo, index) in placePhotos"
              :key="photo.src"
              type="button"
              :class="{ active: activePhotoIndex === index }"
              :aria-label="`Показать фото ${index + 1}`"
              @click="activePhotoIndex = index"
            />
          </div>
        </div>
        <button class="primary-button" type="button" @click="goToStep('menu')">
          <span>Перейти к меню</span>
          <Icon name="lucide:utensils" />
        </button>
      </section>

      <section v-else-if="activeStep === 'menu'" class="screen menu-screen">
        <div class="section-heading">
          <p class="eyebrow">меню</p>
          <h2>Выбери, что хочется попробовать</h2>
          <p>
            Если вы оба отметите одно блюдо, оно появится как совпадение.
          </p>
        </div>

        <nav class="restaurant-chips" aria-label="Кухня">
          <button
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            type="button"
            :class="{ active: selectedRestaurantId === restaurant.id }"
            @click="selectRestaurant(restaurant.id)"
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
                @click="toggleWant(item.id)"
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

        <button class="primary-button" type="button" @click="goToStep('matches')">
          <span>Смотреть совпадения</span>
          <Icon name="lucide:sparkles" />
        </button>
      </section>

      <section v-else class="screen matches-screen">
        <div class="section-heading">
          <p class="eyebrow">совпадения</p>
          <h2>То, что хочется вам обоим</h2>
          <p>
            Здесь остаются блюда, где ваши выборы встретились.
          </p>
        </div>

        <div v-if="mutualMatches.length" class="match-list">
          <article
            v-for="item in mutualMatches"
            :key="item.id"
            class="match-card"
          >
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

        <button class="primary-button" type="button" @click="goToStep('menu')">
          <span>Вернуться в меню</span>
          <Icon name="lucide:arrow-left" />
        </button>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import DateConfirmModal from "~/components/modals/DateConfirmModal.vue";

type StepId = "home" | "place" | "gallery" | "menu" | "matches";

type PlacePhoto = {
  src: string;
  alt: string;
  title: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  partnerWants: boolean;
};

type Restaurant = {
  id: string;
  name: string;
  items: MenuItem[];
};

const steps: Array<{ id: StepId; mainText: string }> = [
  { id: "home", mainText: "Посмотреть детали" },
  { id: "place", mainText: "Посмотреть фото места" },
  { id: "gallery", mainText: "Перейти к меню" },
  { id: "menu", mainText: "Смотреть совпадения" },
  { id: "matches", mainText: "Вернуться в меню" },
];

const activeStep = ref<StepId>("home");
const activePhotoIndex = ref(0);
const selectedRestaurantId = ref("italian");
const swipeStartX = ref<number | null>(null);
const wants = ref<Record<string, boolean>>({
  bruschetta: false,
  pasta: false,
  tiramisu: false,
  roll: false,
  mochi: false,
  lemonade: false,
});

const { setModal, clearModals } = useFrogModal();

const recommendationChips = [
  "одеться удобно",
  "вечерний стиль",
  "обувь без каблуков",
  "можно что-то темное",
];

const placePhotos: PlacePhoto[] = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=82",
    alt: "Уютный ресторан с теплым светом",
    title: "Теплый свет и тихие столики",
  },
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=82",
    alt: "Столики в кафе для встречи",
    title: "Место, где можно спокойно говорить",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=82",
    alt: "Вечерний зал ресторана",
    title: "Немного интриги до вечера",
  },
];

const restaurants: Restaurant[] = [
  {
    id: "italian",
    name: "Italian",
    items: [
      {
        id: "bruschetta",
        name: "Брускетта с томатами",
        description: "Хрустящий хлеб, базилик и сладкие томаты.",
        image:
          "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80",
        partnerWants: true,
      },
      {
        id: "pasta",
        name: "Паста с сырным соусом",
        description: "Нежная паста, пармезан и сливочный соус.",
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
        partnerWants: false,
      },
      {
        id: "tiramisu",
        name: "Тирамису",
        description: "Кофейный десерт, который удобно разделить на двоих.",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
        partnerWants: true,
      },
    ],
  },
  {
    id: "sushi",
    name: "Sushi",
    items: [
      {
        id: "roll",
        name: "Ролл с лососем",
        description: "Лосось, рис, сливочный сыр и огурец.",
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
        partnerWants: true,
      },
      {
        id: "mochi",
        name: "Моти с манго",
        description: "Мягкий десерт с фруктовой начинкой.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
        partnerWants: false,
      },
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    items: [
      {
        id: "lemonade",
        name: "Домашний лимонад",
        description: "Цитрус, мята и легкая кислинка.",
        image:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
        partnerWants: false,
      },
    ],
  },
];

const activeStepIndex = computed(() =>
  steps.findIndex((step) => step.id === activeStep.value),
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
  hapticImpact();
};

const goBack = () => {
  const previousStep = steps[activeStepIndex.value - 1];

  if (previousStep) {
    goToStep(previousStep.id);
  }
};

const openConfirmModal = () => {
  setModal(DateConfirmModal, {
    onConfirm: () => {
      clearModals();
      goToStep("gallery");
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

const onSwipeStart = (event: TouchEvent) => {
  swipeStartX.value = event.changedTouches[0]?.clientX ?? null;
};

const onSwipeEnd = (event: TouchEvent) => {
  if (swipeStartX.value === null) {
    return;
  }

  const endX = event.changedTouches[0]?.clientX ?? swipeStartX.value;
  const delta = endX - swipeStartX.value;
  swipeStartX.value = null;

  if (Math.abs(delta) < 42) {
    return;
  }

  if (delta < 0) {
    nextPhoto();
  } else {
    previousPhoto();
  }
};

const selectRestaurant = (restaurantId: string) => {
  selectedRestaurantId.value = restaurantId;
  hapticImpact();
};

const isMutualMatch = (item: MenuItem) =>
  Boolean(wants.value[item.id] && item.partnerWants);

const toggleWant = (itemId: string) => {
  const item = allMenuItems.value.find((menuItem) => menuItem.id === itemId);
  wants.value[itemId] = !wants.value[itemId];

  if (item && isMutualMatch(item)) {
    hapticSuccess();
  } else {
    hapticImpact();
  }
};

const handleMainButton = () => {
  const currentStep = activeStep.value;

  if (currentStep === "home") {
    goToStep("place");
  } else if (currentStep === "place") {
    openConfirmModal();
  } else if (currentStep === "gallery") {
    goToStep("menu");
  } else if (currentStep === "menu") {
    goToStep("matches");
  } else {
    goToStep("menu");
  }
};

onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  const sdk = await import("@telegram-apps/sdk");

  if (sdk.mountBackButton.isAvailable()) {
    sdk.mountBackButton();
    sdk.onBackButtonClick(goBack);
  }

  if (sdk.mountMainButton.isAvailable()) {
    sdk.mountMainButton();
    sdk.onMainButtonClick(handleMainButton);
  }
});

watch(
  activeStep,
  async () => {
    if (!import.meta.client) {
      return;
    }

    const sdk = await import("@telegram-apps/sdk");
    const currentStep = steps[activeStepIndex.value];

    if (sdk.setMainButtonParams.isAvailable() && currentStep) {
      sdk.setMainButtonParams({
        text: currentStep.mainText,
        isVisible: true,
        isEnabled: true,
        isLoaderVisible: false,
        hasShineEffect: activeStep.value === "home",
        backgroundColor: "#A78BFA",
        textColor: "#FFFFFF",
      });
    }

    if (sdk.showBackButton.isAvailable() && sdk.hideBackButton.isAvailable()) {
      if (activeStep.value === "home") {
        sdk.hideBackButton();
      } else {
        sdk.showBackButton();
      }
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
:global(html) {
  background: #0f0f14;
}

:global(body) {
  min-height: 100dvh;
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
  min-height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(circle at 22% 8%, rgba(167, 139, 250, 0.22), transparent 30%),
    radial-gradient(circle at 82% 72%, rgba(244, 114, 182, 0.16), transparent 34%),
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
  min-height: 100dvh;
  margin: 0 auto;
  padding: max(18px, env(safe-area-inset-top)) 16px
    max(24px, env(safe-area-inset-bottom));
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
  min-height: calc(100dvh - 76px);
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

  img {
    display: block;
    width: 100%;
    height: 280px;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 32%, rgba(15, 15, 20, 0.74));
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
  overflow-x: auto;
  padding-bottom: 4px;
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
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 760;
}

.gallery-screen {
  align-content: end;
  min-height: calc(100dvh - 76px);
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
  }

  button.active {
    width: 24px;
    background: #f472b6;
  }
}

.restaurant-chips button {
  min-height: 44px;
  padding: 0 18px;
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
    font-size: 14px;
    line-height: 1.45;
  }
}

.want-button {
  width: fit-content;
  min-height: 44px;
  padding-inline: 15px;
  background: rgba(36, 36, 51, 0.82);
  border-color: rgba(196, 181, 253, 0.22);
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
  .shell {
    padding-inline: 12px;
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
