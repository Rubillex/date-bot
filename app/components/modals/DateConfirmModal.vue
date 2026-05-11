<template>
  <FrogModalWrapper
    :desktop-position="FrogModalWrapperPosition.CENTER"
    :mobile-position="FrogModalWrapperPosition.BOTTOM"
    class="date-confirm-modal"
  >
    <button
      class="icon-close"
      type="button"
      aria-label="Закрыть"
      @click="closeModal"
    >
      <Icon name="lucide:x" />
    </button>
    <div class="modal-mark">
      <Icon name="lucide:sparkles" />
    </div>
    <h2>Точно хочешь увидеть?</h2>
    <p>Я старался сохранить интригу.</p>
    <div class="modal-actions">
      <button class="ghost-button" type="button" @click="openOrClose(false)">
        Сохранить сюрприз
      </button>
      <button class="primary-button" type="button" @click="openOrClose(true)">
        Показать
      </button>
    </div>
  </FrogModalWrapper>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  confirm: [];
  save: [];
}>();

const { closeModal } = useFrogModal();

const user = useTelegramUser();

const openOrClose = async (isOpened: boolean) => {
  try {
    await $fetch("/api/show-place", {
      method: "POST",
      body: {
        user: user.value,
        isOpened: isOpened,
      },
    });
  } catch (error) {
  } finally {
    if (isOpened) {
      emit("confirm");
    } else {
      emit("save");
    }
  }
};
</script>

<style scoped lang="scss">
.date-confirm-modal {
  width: min(calc(100vw - 24px), 520px);
  padding: 28px 22px 22px;
  border: 1px solid rgba(196, 181, 253, 0.18);
  border-radius: 30px 30px 24px 24px;
  background:
    radial-gradient(
      circle at 24% 0%,
      rgba(167, 139, 250, 0.24),
      transparent 40%
    ),
    #1b1b24;
  color: #ffffff;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(22px);

  h2 {
    margin: 16px 0 0;
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: 36px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }

  p {
    margin: 10px 0 0;
    color: #b8b8c7;
    line-height: 1.5;
  }
}

.modal-mark {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 999px;
  background: rgba(167, 139, 250, 0.16);
  color: #f5d0fe;
  box-shadow: 0 0 28px rgba(167, 139, 250, 0.2);
}

.icon-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(196, 181, 253, 0.14);
  border-radius: 999px;
  background: rgba(36, 36, 51, 0.78);
  color: #ffffff;
  cursor: pointer;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 24px;
}

.primary-button,
.ghost-button {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0 16px;
  color: #ffffff;
  font: inherit;
  font-weight: 850;
  cursor: pointer;
  transition: transform 160ms ease;

  &:active {
    transform: scale(0.98);
  }
}

.primary-button {
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  box-shadow: 0 16px 34px rgba(167, 139, 250, 0.22);
}

.ghost-button {
  border-color: rgba(196, 181, 253, 0.18);
  background: rgba(36, 36, 51, 0.72);
  color: #f5d0fe;
}

@media (max-width: 430px) {
  .modal-actions {
    grid-template-columns: 1fr;
  }
}
</style>
