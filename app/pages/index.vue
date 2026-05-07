<template>
  <main class="date-app">
    <section class="shell">
      <div class="topbar">
        <div>
          <p class="eyebrow">Mini app</p>
          <h1>Свидание</h1>
        </div>
        <div class="date-chip">
          <Icon name="lucide:calendar-heart" />
          <span>вечер для двоих</span>
        </div>
      </div>

      <nav class="tabs" aria-label="Разделы приложения">
        <button
          v-for="view in views"
          :key="view.id"
          class="tab-button"
          :class="{ 'tab-button--active': activeView === view.id }"
          type="button"
          @click="activeView = view.id"
        >
          <Icon :name="view.icon" />
          <span>{{ view.label }}</span>
        </button>
      </nav>

      <section v-if="activeView === 'invite'" class="screen invite-screen">
        <div class="invite-card">
          <p class="eyebrow">официальное приглашение</p>
          <h2>Пойдем на свидание?</h2>
          <p>
            Я хочу провести с тобой вечер: спокойно поговорить, выбрать что-то
            вкусное и оставить этот день в памяти как маленькое общее
            приключение.
          </p>
          <div class="invite-actions">
            <button
              class="primary-button"
              type="button"
              @click="activeView = 'place'"
            >
              <Icon name="lucide:map-pin" />
              <span>Узнать место</span>
            </button>
            <button
              class="ghost-button"
              type="button"
              @click="activeView = 'menu'"
            >
              <Icon name="lucide:utensils" />
              <span>Выбрать еду</span>
            </button>
          </div>
        </div>

        <div class="details-grid">
          <article>
            <Icon name="lucide:clock-3" />
            <span>Когда</span>
            <strong>в эту субботу, 19:00</strong>
          </article>
          <article>
            <Icon name="lucide:heart" />
            <span>Формат</span>
            <strong>ужин и прогулка</strong>
          </article>
        </div>
      </section>

      <section v-else-if="activeView === 'place'" class="screen place-screen">
        <div class="section-heading">
          <p class="eyebrow">место встречи</p>
          <h2>Кафе с тихими столиками и прогулкой рядом</h2>
          <p>
            Встречаемся у входа. Внутри тепло, не слишком шумно, а после можно
            пройтись пешком без спешки.
          </p>
        </div>

        <div class="place-panel">
          <div class="place-map">
            <Icon name="lucide:map" />
            <span>Центр города</span>
          </div>
          <ul class="recommendations">
            <li>
              <Icon name="lucide:shirt" />
              <span>Одеться удобно: лучше обувь для прогулки.</span>
            </li>
            <li>
              <Icon name="lucide:cloud-sun" />
              <span>Захватить легкий верхний слой на вечер.</span>
            </li>
            <li>
              <Icon name="lucide:message-circle-heart" />
              <span>Настроение важнее дресс-кода.</span>
            </li>
          </ul>
        </div>

        <button
          class="primary-button full-width"
          type="button"
          @click="openConfirmModal"
        >
          <Icon name="lucide:image" />
          <span>Посмотреть фото места встречи</span>
        </button>
      </section>

      <section v-else class="screen menu-screen">
        <div class="section-heading compact">
          <p class="eyebrow">меню</p>
          <h2>Выбери, что хочется попробовать</h2>
          <p>
            Отмеченные блюда сохраняются на экране. Рядом видно, что уже выбрал
            партнер.
          </p>
        </div>

        <div class="restaurant-tabs" aria-label="Рестораны">
          <button
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            type="button"
            :class="{ active: selectedRestaurantId === restaurant.id }"
            @click="selectedRestaurantId = restaurant.id"
          >
            <span>{{ restaurant.name }}</span>
            <small>{{ restaurant.cuisine }}</small>
          </button>
        </div>

        <article class="restaurant-card">
          <div class="restaurant-head">
            <div>
              <p class="eyebrow">{{ selectedRestaurant.cuisine }}</p>
              <h3>{{ selectedRestaurant.name }}</h3>
              <p>{{ selectedRestaurant.note }}</p>
            </div>
            <div class="counter">
              <strong>{{ wantedCount }}</strong>
              <span>хочу</span>
            </div>
          </div>

          <div class="menu-list">
            <div
              v-for="item in selectedRestaurant.items"
              :key="item.id"
              class="menu-item"
            >
              <div>
                <div class="item-title">
                  <h4>{{ item.name }}</h4>
                </div>
                <p>{{ item.description }}</p>
                <div v-if="item.partnerWants" class="partner-mark">
                  <Icon name="lucide:heart-handshake" />
                  <span>Партнер тоже добавил в «хочу»</span>
                </div>
              </div>
              <button
                class="want-button"
                :class="{ 'want-button--active': wants[item.id] }"
                type="button"
                @click="toggleWant(item.id)"
              >
                <Icon :name="wants[item.id] ? 'lucide:check' : 'lucide:plus'" />
                <span>{{ wants[item.id] ? "Хочу" : "Хочу" }}</span>
              </button>
            </div>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import DateConfirmModal from "~/components/modals/DateConfirmModal.vue";
import DatePlacePhotosModal from "~/components/modals/DatePlacePhotosModal.vue";

type ViewName = "invite" | "place" | "menu";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  partnerWants: boolean;
};

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  note: string;
  items: MenuItem[];
};

const activeView = ref<ViewName>("invite");
const selectedRestaurantId = ref("bistro");
const wants = ref<Record<string, boolean>>({
  bruschetta: false,
  pasta: false,
  tiramisu: false,
  ramen: false,
  mochi: false,
  lemonade: false,
});
const { setModal, clearModals } = useFrogModal();

const views: Array<{ id: ViewName; label: string; icon: string }> = [
  { id: "invite", label: "Приглашение", icon: "lucide:sparkles" },
  { id: "place", label: "Место", icon: "lucide:map-pin" },
  { id: "menu", label: "Меню", icon: "lucide:utensils" },
];

const placePhotos = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    alt: "Уютный ресторан с теплым светом",
  },
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    alt: "Столики в кафе для встречи",
  },
];

const restaurants: Restaurant[] = [
  {
    id: "bistro",
    name: "Тихое бистро",
    cuisine: "Итальянская кухня",
    note: "Спокойное место для первого ужина без лишнего шума.",
    items: [
      {
        id: "bruschetta",
        name: "Брускетта с томатами",
        description: "Хрустящий хлеб, базилик, сладкие томаты.",
        price: "390 ₽",
        partnerWants: true,
      },
      {
        id: "pasta",
        name: "Паста с сырным соусом",
        description: "Нежная паста, пармезан, сливочный соус.",
        price: "720 ₽",
        partnerWants: false,
      },
      {
        id: "tiramisu",
        name: "Тирамису",
        description: "Кофейный десерт, который удобно разделить на двоих.",
        price: "430 ₽",
        partnerWants: true,
      },
    ],
  },
  {
    id: "noodle",
    name: "Лапшичная у окна",
    cuisine: "Азиатская кухня",
    note: "Вариант, если захочется теплого, простого и сытного.",
    items: [
      {
        id: "ramen",
        name: "Рамен с курицей",
        description: "Бульон, лапша, яйцо и зеленый лук.",
        price: "650 ₽",
        partnerWants: false,
      },
      {
        id: "mochi",
        name: "Моти с манго",
        description: "Мягкий десерт с фруктовой начинкой.",
        price: "310 ₽",
        partnerWants: true,
      },
      {
        id: "lemonade",
        name: "Домашний лимонад",
        description: "Цитрус, мята, легкая кислинка.",
        price: "260 ₽",
        partnerWants: false,
      },
    ],
  },
];

const selectedRestaurant = computed(
  () =>
    restaurants.find(
      (restaurant) => restaurant.id === selectedRestaurantId.value,
    ) ?? restaurants[0],
);

const wantedCount = computed(
  () => Object.values(wants.value).filter(Boolean).length,
);

const openConfirmModal = () => {
  setModal(DateConfirmModal, {
    onConfirm: openPhotosModal,
  });
};

const openPhotosModal = () => {
  clearModals();
  setModal(DatePlacePhotosModal, {
    photos: placePhotos,
  });
};

const toggleWant = (itemId: string) => {
  wants.value[itemId] = !wants.value[itemId];
};
</script>

<style scoped lang="scss">
:global(body) {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  color: #2f2524;
}

button {
  font: inherit;
}

.date-app {
  min-height: 100dvh;
  overflow-y: auto;
  background:
    linear-gradient(
      180deg,
      rgba(254, 247, 239, 0.98),
      rgba(247, 238, 228, 0.96)
    ),
    #f7eee4;
}

.shell {
  width: min(100%, 720px);
  min-height: 100dvh;
  margin: 0 auto;
  padding: 20px 16px 28px;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h1 {
    margin: 0;
    color: #3a2422;
    font-size: 30px;
    line-height: 1;
    letter-spacing: 0;
  }
}

.eyebrow {
  margin: 0 0 6px;
  color: #9a5f4f;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(116, 77, 65, 0.18);
  border-radius: 999px;
  background: #fffaf4;
  color: #6b4741;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.tabs {
  position: sticky;
  top: 0;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0 -4px 16px;
  padding: 6px 4px;
  background: rgba(247, 238, 228, 0.92);
  backdrop-filter: blur(16px);
}

.tab-button {
  display: flex;
  min-width: 0;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid rgba(116, 77, 65, 0.14);
  border-radius: 8px;
  background: rgba(255, 250, 244, 0.76);
  color: #73514b;
  font-size: 13px;
  font-weight: 800;

  svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.tab-button--active {
  border-color: #9c4f43;
  background: #9c4f43;
  color: #fffaf4;
}

.screen {
  display: grid;
  gap: 16px;
  animation: rise 180ms ease-out;
}

.invite-card,
.place-panel,
.restaurant-card {
  border: 1px solid rgba(91, 59, 52, 0.14);
  border-radius: 8px;
  background: #fffaf4;
  box-shadow: 0 18px 46px rgba(91, 59, 52, 0.1);
}

.invite-card {
  min-height: 420px;
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background:
    linear-gradient(180deg, rgba(58, 36, 34, 0.08), rgba(58, 36, 34, 0.64)),
    url("https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1200&q=80")
      center/cover;
  color: #fffaf4;

  .eyebrow {
    color: #ffd8b7;
  }

  h2 {
    max-width: 500px;
    margin: 0;
    font-size: 42px;
    line-height: 0.98;
    letter-spacing: 0;
  }

  p:not(.eyebrow) {
    max-width: 520px;
    margin: 14px 0 0;
    color: rgba(255, 250, 244, 0.9);
    font-size: 17px;
    line-height: 1.55;
  }
}

.invite-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.primary-button,
.ghost-button,
.want-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0 16px;
  font-weight: 900;
  cursor: pointer;
}

.primary-button {
  background: #2f6f64;
  color: #fff;
}

.ghost-button {
  border-color: rgba(255, 250, 244, 0.42);
  background: rgba(255, 250, 244, 0.14);
  color: inherit;
}

.section-heading {
  h2 {
    margin: 0;
    color: #3a2422;
    font-size: 30px;
    line-height: 1.1;
    letter-spacing: 0;
  }

  p:not(.eyebrow) {
    margin: 10px 0 0;
    color: #73514b;
    font-size: 16px;
    line-height: 1.55;
  }
}

.compact h2 {
  font-size: 25px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  article {
    min-height: 112px;
    padding: 16px;
    border: 1px solid rgba(91, 59, 52, 0.14);
    border-radius: 8px;
    background: #fffaf4;
  }

  svg {
    color: #2f6f64;
  }

  span,
  strong {
    display: block;
  }

  span {
    margin-top: 10px;
    color: #8b6a63;
    font-size: 13px;
  }

  strong {
    margin-top: 4px;
    color: #3a2422;
    font-size: 16px;
  }
}

.place-panel {
  padding: 14px;
}

.place-map {
  display: grid;
  min-height: 180px;
  place-items: center;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(47, 111, 100, 0.88), rgba(156, 79, 67, 0.78)),
    #2f6f64;
  color: #fff;

  svg {
    width: 44px;
    height: 44px;
  }

  span {
    margin-top: -42px;
    font-size: 18px;
    font-weight: 900;
  }
}

.recommendations {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #553b36;
    line-height: 1.45;
  }

  svg {
    margin-top: 2px;
    color: #9c4f43;
    flex: 0 0 auto;
  }
}

.full-width {
  width: 100%;
}

.restaurant-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  button {
    min-width: 0;
    min-height: 68px;
    padding: 10px 12px;
    border: 1px solid rgba(91, 59, 52, 0.14);
    border-radius: 8px;
    background: #fffaf4;
    color: #3a2422;
    text-align: left;
  }

  button.active {
    border-color: #2f6f64;
    background: #e7f0eb;
  }

  span,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    font-weight: 900;
  }

  small {
    margin-top: 3px;
    color: #73514b;
    font-size: 12px;
  }
}

.restaurant-card {
  padding: 16px;
}

.restaurant-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(91, 59, 52, 0.12);

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: #3a2422;
    font-size: 23px;
    letter-spacing: 0;
  }

  p:not(.eyebrow) {
    margin-top: 6px;
    color: #73514b;
    line-height: 1.45;
  }
}

.counter {
  min-width: 64px;
  height: 64px;
  border-radius: 8px;
  background: #3a2422;
  color: #fffaf4;
  display: grid;
  place-items: center;
  align-content: center;

  strong,
  span {
    line-height: 1;
  }

  strong {
    font-size: 22px;
  }

  span {
    margin-top: 4px;
    font-size: 11px;
    font-weight: 800;
  }
}

.menu-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.menu-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f8efe6;

  p {
    margin: 6px 0 0;
    color: #73514b;
    font-size: 14px;
    line-height: 1.4;
  }
}

.item-title {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  h4 {
    margin: 0;
    color: #3a2422;
    font-size: 16px;
    line-height: 1.25;
    letter-spacing: 0;
  }

  span {
    color: #2f6f64;
    font-weight: 900;
    white-space: nowrap;
  }
}

.partner-mark {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  color: #9c4f43;
  font-size: 12px;
  font-weight: 800;
}

.want-button {
  min-width: 92px;
  background: #fffaf4;
  color: #2f6f64;
  border-color: rgba(47, 111, 100, 0.22);
}

.want-button--active {
  background: #2f6f64;
  color: #fff;
}

@keyframes rise {
  from {
    transform: translateY(6px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .shell {
    padding-inline: 12px;
  }

  .topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .date-chip {
    width: fit-content;
  }

  .tab-button {
    flex-direction: column;
    gap: 3px;
    min-height: 58px;
    font-size: 11px;
  }

  .invite-card {
    min-height: 390px;
    padding: 22px 18px;

    h2 {
      font-size: 36px;
    }
  }

  .details-grid,
  .restaurant-tabs {
    grid-template-columns: 1fr;
  }

  .restaurant-head,
  .menu-item {
    grid-template-columns: 1fr;
  }

  .restaurant-head {
    display: grid;
  }

  .counter {
    width: 100%;
    min-width: 0;
    height: 52px;
    grid-auto-flow: column;
    justify-content: center;
    gap: 6px;
  }

  .want-button {
    width: 100%;
  }
}
</style>
