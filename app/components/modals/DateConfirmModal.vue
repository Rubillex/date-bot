<template>
  <FrogModalWrapper
    :desktop-position="FrogModalWrapperPosition.CENTER"
    :mobile-position="FrogModalWrapperPosition.BOTTOM"
    class="date-modal"
  >
    <button
      class="icon-close"
      type="button"
      aria-label="Закрыть"
      @click="closeModal"
    >
      <Icon name="lucide:x" />
    </button>
    <Icon class="modal-icon" name="lucide:eye" />
    <h2>Вы действительно хотите увидеть?</h2>
    <p>Фото немного раскроют атмосферу места встречи.</p>
    <div class="modal-actions">
      <button class="ghost-button" type="button" @click="closeModal">
        Нет
      </button>
      <button class="primary-button" type="button" @click="emit('confirm')">
        Да, показать
      </button>
    </div>
  </FrogModalWrapper>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  confirm: [];
}>();

const { closeModal } = useFrogModal();
</script>

<style scoped lang="scss">
.date-modal {
  width: min(calc(100vw - 32px), 520px);
  padding: 22px;
  border: 1px solid rgba(91, 59, 52, 0.14);
  border-radius: 8px;
  background: #fffaf4;
  box-shadow: 0 18px 46px rgba(91, 59, 52, 0.1);

  h2 {
    margin: 10px 0 0;
    color: #3a2422;
    font-size: 24px;
    line-height: 1.15;
    letter-spacing: 0;
  }

  p {
    margin: 10px 0 0;
    color: #73514b;
    line-height: 1.45;
  }
}

.modal-icon {
  width: 34px;
  height: 34px;
  color: #9c4f43;
}

.icon-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: #f8efe6;
  color: #553b36;
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.primary-button,
.ghost-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0 16px;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}

.primary-button {
  background: #2f6f64;
  color: #fff;
}

.ghost-button {
  border-color: rgba(91, 59, 52, 0.18);
  background: #f8efe6;
  color: #553b36;
}
</style>
