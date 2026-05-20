<template>
  <main class="creator-page">
    <form class="creator" @submit.prevent="submitInvitation">
      <header class="creator__header">
        <NuxtLink to="/">Назад</NuxtLink>
        <div>
          <p class="eyebrow">создание</p>
          <h1>Своё приглашение</h1>
          <p>Заполни текст, фото и меню. После сохранения появится код.</p>
        </div>
      </header>

      <section class="creator-section">
        <h2>Первый экран</h2>
        <label>
          Надпись
          <input v-model="draft.home.eyebrow" required />
        </label>
        <label>
          Заголовок
          <input v-model="draft.home.title" required />
        </label>
        <label>
          Текст
          <textarea v-model="draft.home.text" required />
        </label>
      </section>

      <section class="creator-section">
        <h2>Место и время</h2>
        <label>
          Надпись
          <input v-model="draft.place.eyebrow" required />
        </label>
        <label>
          Заголовок
          <input v-model="draft.place.title" required />
        </label>
        <label>
          Описание
          <textarea v-model="draft.place.text" required />
        </label>
        <div class="creator-grid">
          <label>
            Название места
            <input v-model="draft.place.placeName" required />
          </label>
          <label>
            Дата
            <input v-model="draft.place.dateText" required />
          </label>
          <label>
            Время
            <input v-model="draft.place.timeText" required />
          </label>
        </div>
      </section>

      <section class="creator-section">
        <div class="creator-section__title">
          <h2>Фото</h2>
          <button type="button" @click="addPhoto">Добавить фото</button>
        </div>
        <article
          v-for="(photo, index) in draft.placePhotos"
          :key="photo.fileKey"
          class="editor-card"
        >
          <label>
            Файл
            <input
              accept="image/png,image/jpeg,image/webp,image/gif"
              required
              type="file"
              @change="setPhotoFile(index, $event)"
            />
          </label>
          <label>
            Подпись
            <input v-model="photo.title" required />
          </label>
          <label>
            Alt
            <input v-model="photo.alt" required />
          </label>
          <button
            v-if="draft.placePhotos.length > 1"
            type="button"
            @click="removePhoto(index)"
          >
            Удалить
          </button>
        </article>
      </section>

      <section class="creator-section">
        <h2>Галерея, меню и совпадения</h2>
        <div class="creator-grid">
          <label>
            Надпись галереи
            <input v-model="draft.gallery.eyebrow" required />
          </label>
          <label>
            Кнопка галереи
            <input v-model="draft.gallery.buttonText" required />
          </label>
          <label>
            Надпись меню
            <input v-model="draft.menu.eyebrow" required />
          </label>
        </div>
        <label>
          Заголовок меню
          <input v-model="draft.menu.title" required />
        </label>
        <label>
          Текст меню
          <textarea v-model="draft.menu.text" required />
        </label>
        <div class="creator-grid">
          <label>
            Надпись совпадений
            <input v-model="draft.matches.eyebrow" required />
          </label>
          <label>
            Заголовок совпадений
            <input v-model="draft.matches.title" required />
          </label>
          <label>
            Заголовок пустого состояния
            <input v-model="draft.matches.emptyTitle" required />
          </label>
        </div>
        <label>
          Текст совпадений
          <textarea v-model="draft.matches.text" required />
        </label>
        <label>
          Текст пустого состояния
          <input v-model="draft.matches.emptyText" required />
        </label>
      </section>

      <section class="creator-section">
        <div class="creator-section__title">
          <h2>Рекомендации</h2>
          <button type="button" @click="draft.recommendationChips.push('')">
            Добавить
          </button>
        </div>
        <div
          v-for="(_, index) in draft.recommendationChips"
          :key="index"
          class="inline-editor"
        >
          <input v-model="draft.recommendationChips[index]" required />
          <button
            v-if="draft.recommendationChips.length > 1"
            type="button"
            @click="draft.recommendationChips.splice(index, 1)"
          >
            Удалить
          </button>
        </div>
      </section>

      <section class="creator-section">
        <div class="creator-section__title">
          <h2>Меню</h2>
          <button type="button" @click="addRestaurant">Добавить заведение</button>
        </div>
        <article
          v-for="(restaurant, restaurantIndex) in draft.restaurants"
          :key="restaurant.id"
          class="editor-card"
        >
          <div class="creator-section__title">
            <label>
              Название
              <input v-model="restaurant.name" required />
            </label>
            <button
              v-if="draft.restaurants.length > 1"
              type="button"
              @click="removeRestaurant(restaurantIndex)"
            >
              Удалить заведение
            </button>
          </div>

          <article
            v-for="(item, itemIndex) in restaurant.items"
            :key="item.id"
            class="menu-editor"
          >
            <label>
              Блюдо
              <input v-model="item.name" required />
            </label>
            <label>
              Описание
              <textarea v-model="item.description" required />
            </label>
            <label>
              Фото блюда
              <input
                accept="image/png,image/jpeg,image/webp,image/gif"
                required
                type="file"
                @change="setMenuItemFile(restaurantIndex, itemIndex, $event)"
              />
            </label>
            <label class="checkbox-label">
              <input v-model="item.partnerWants" type="checkbox" />
              Автор тоже хочет это
            </label>
            <button
              v-if="restaurant.items.length > 1"
              type="button"
              @click="removeMenuItem(restaurantIndex, itemIndex)"
            >
              Удалить блюдо
            </button>
          </article>

          <button type="button" @click="addMenuItem(restaurantIndex)">
            Добавить блюдо
          </button>
        </article>
      </section>

      <p v-if="submitError" class="creator-status creator-status--error">
        {{ submitError }}
      </p>

      <section v-if="createdCode" class="creator-result">
        <p>Код приглашения</p>
        <strong>{{ createdCode }}</strong>
        <NuxtLink :to="createdLink">{{ createdLink }}</NuxtLink>
      </section>

      <button class="primary-button" type="submit" :disabled="isSubmitting">
        <span>{{ isSubmitting ? "Сохраняю" : "Создать приглашение" }}</span>
        <Icon :name="isSubmitting ? 'lucide:loader-circle' : 'lucide:send'" />
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import type { InvitationContent, MenuItem } from "~/data/date-invitation";

type DraftPhoto = InvitationContent["placePhotos"][number] & {
  fileKey: string;
};

type DraftMenuItem = MenuItem & {
  fileKey: string;
};

type DraftRestaurant = Omit<InvitationContent["restaurants"][number], "items"> & {
  items: DraftMenuItem[];
};

type DraftInvitation = Omit<
  InvitationContent,
  "placePhotos" | "restaurants"
> & {
  placePhotos: DraftPhoto[];
  restaurants: DraftRestaurant[];
};

const nextId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyMenuItem = () => ({
  id: nextId("item"),
  fileKey: nextId("menu-photo"),
  name: "",
  description: "",
  image: "",
  partnerWants: false,
});

const createEmptyRestaurant = () => ({
  id: nextId("restaurant"),
  name: "",
  items: [createEmptyMenuItem()],
});

const createEmptyPhoto = (): DraftPhoto => ({
  fileKey: nextId("photo"),
  src: "",
  alt: "",
  title: "",
});

const createEmptyDraft = (): DraftInvitation => ({
  home: {
    eyebrow: "",
    title: "",
    text: "",
  },
  place: {
    eyebrow: "",
    title: "",
    text: "",
    placeName: "",
    dateText: "",
    timeText: "",
  },
  gallery: {
    eyebrow: "",
    buttonText: "",
  },
  menu: {
    eyebrow: "",
    title: "",
    text: "",
  },
  matches: {
    eyebrow: "",
    title: "",
    text: "",
    emptyTitle: "",
    emptyText: "",
  },
  recommendationChips: [""],
  placePhotos: [createEmptyPhoto()],
  restaurants: [createEmptyRestaurant()],
});

const draft = reactive<DraftInvitation>(createEmptyDraft());
const photoFiles = ref<Record<string, File>>({});
const menuItemFiles = ref<Record<string, File>>({});
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const createdCode = ref("");

const createdLink = computed(() => `/?code=${createdCode.value}`);

const addPhoto = () => {
  draft.placePhotos.push(createEmptyPhoto());
};

const removePhoto = (index: number) => {
  const [photo] = draft.placePhotos.splice(index, 1);
  if (photo) {
    delete photoFiles.value[photo.fileKey];
  }
};

const setPhotoFile = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const photo = draft.placePhotos[index];

  if (file && photo) {
    photoFiles.value[photo.fileKey] = file;
  }
};

const setMenuItemFile = (
  restaurantIndex: number,
  itemIndex: number,
  event: Event,
) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const item = draft.restaurants[restaurantIndex]?.items[itemIndex];

  if (file && item) {
    menuItemFiles.value[item.fileKey] = file;
  }
};

const addRestaurant = () => {
  draft.restaurants.push(createEmptyRestaurant());
};

const removeRestaurant = (restaurantIndex: number) => {
  const [restaurant] = draft.restaurants.splice(restaurantIndex, 1);

  restaurant?.items.forEach((item) => {
    delete menuItemFiles.value[item.fileKey];
  });
};

const addMenuItem = (restaurantIndex: number) => {
  draft.restaurants[restaurantIndex]?.items.push(createEmptyMenuItem());
};

const removeMenuItem = (restaurantIndex: number, itemIndex: number) => {
  const [item] = draft.restaurants[restaurantIndex]?.items.splice(
    itemIndex,
    1,
  ) ?? [null];

  if (item) {
    delete menuItemFiles.value[item.fileKey];
  }
};

const normalizeRestaurants = (restaurants: DraftRestaurant[]) =>
  restaurants.map((restaurant) => ({
    ...restaurant,
    id: restaurant.id || nextId("restaurant"),
    items: restaurant.items.map(({ fileKey, image, ...item }) => ({
      ...item,
      fileKey,
      id: item.id || nextId("item"),
    })),
  }));

const submitInvitation = async () => {
  isSubmitting.value = true;
  submitError.value = null;
  createdCode.value = "";

  try {
    const formData = new FormData();
    const payload = {
      ...draft,
      recommendationChips: draft.recommendationChips.filter(Boolean),
      placePhotos: draft.placePhotos.map(({ fileKey, alt, title }) => ({
        fileKey,
        alt,
        title,
      })),
      restaurants: normalizeRestaurants(draft.restaurants),
    };

    formData.append("payload", JSON.stringify(payload));
    draft.placePhotos.forEach((photo) => {
      const file = photoFiles.value[photo.fileKey];
      if (file) {
        formData.append(photo.fileKey, file);
      }
    });
    draft.restaurants.forEach((restaurant) => {
      restaurant.items.forEach((item) => {
        const file = menuItemFiles.value[item.fileKey];
        if (file) {
          formData.append(item.fileKey, file);
        }
      });
    });

    const response = await $fetch<InvitationContent>("/api/invitations", {
      method: "POST",
      body: formData,
    });

    createdCode.value = response.code ?? "";
  } catch (error) {
    submitError.value =
      error instanceof Error ? error.message : "Не получилось создать.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.creator-page {
  min-height: var(--date-viewport-height, 100dvh);
  padding: 24px 16px 48px;
  background: #0f0f14;
  color: #ffffff;
}

.creator {
  display: grid;
  gap: 18px;
  width: min(100%, 860px);
  margin: 0 auto;
}

.creator__header,
.creator-section,
.creator-result {
  display: grid;
  gap: 14px;
  border: 1px solid rgba(196, 181, 253, 0.16);
  border-radius: 8px;
  background: rgba(24, 24, 34, 0.88);
  padding: 18px;
}

.creator__header a,
.creator-result a {
  color: #fbcfe8;
  text-decoration: none;
}

.creator__header h1,
.creator-section h2 {
  margin: 0;
}

.creator__header p,
.creator-section p,
.creator-result p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
}

.creator-section__title {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.creator-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

label {
  display: grid;
  gap: 7px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 13px;
  font-weight: 700;
}

input,
textarea,
button {
  border: 1px solid rgba(196, 181, 253, 0.18);
  border-radius: 8px;
  font: inherit;
}

input,
textarea {
  width: 100%;
  min-width: 0;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding: 11px 12px;
}

textarea {
  min-height: 96px;
  resize: vertical;
}

button {
  min-height: 40px;
  padding: 0 13px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
}

.editor-card,
.menu-editor {
  display: grid;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px;
}

.inline-editor {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.checkbox-label input {
  width: auto;
}

.creator-status--error {
  color: #fecaca;
}

.creator-result strong {
  font-size: 34px;
  letter-spacing: 0;
}

.primary-button {
  justify-self: stretch;
}

@media (max-width: 720px) {
  .creator-grid {
    grid-template-columns: 1fr;
  }

  .creator-section__title,
  .inline-editor {
    align-items: stretch;
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
