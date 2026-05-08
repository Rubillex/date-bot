type SelectedMenuItem = {
  id: string;
  name: string;
  restaurantName: string;
  description: string;
  partnerWants: boolean;
};

type DateMenuPayload = {
  selectedItems: SelectedMenuItem[];
  mutualMatches: SelectedMenuItem[];
};

const isSelectedMenuItem = (value: unknown): value is SelectedMenuItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.restaurantName === "string" &&
    typeof item.description === "string" &&
    typeof item.partnerWants === "boolean"
  );
};

const formatItems = (items: SelectedMenuItem[]) =>
  items
    .map((item, index) => {
      const matchLabel = item.partnerWants ? " | совпадение" : "";

      return `${index + 1}. ${item.name} (${item.restaurantName})${matchLabel}`;
    })
    .join("\n");

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const botToken = config.telegramBotToken;
  const chatId = config.telegramRecipientChatId;

  if (!botToken || !chatId) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Telegram credentials are not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_RECIPIENT_CHAT_ID.",
    });
  }

  const body = await readBody<DateMenuPayload>(event);
  const selectedItems = Array.isArray(body?.selectedItems)
    ? body.selectedItems.filter(isSelectedMenuItem)
    : [];
  const mutualMatches = Array.isArray(body?.mutualMatches)
    ? body.mutualMatches.filter(isSelectedMenuItem)
    : [];

  if (!selectedItems.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No selected menu items provided.",
    });
  }

  const text = [
    "Выбор меню для свидания",
    "",
    "Выбрано:",
    formatItems(selectedItems),
    "",
    mutualMatches.length
      ? ["Совпадения:", formatItems(mutualMatches)].join("\n")
      : "Совпадений пока нет.",
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: "Telegram sendMessage failed.",
      data: result,
    });
  }

  return {
    ok: true,
  };
});
