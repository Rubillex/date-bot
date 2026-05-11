type DateMenuPayload = {
  user: {
    username: string;
    first_name: string;
    last_name: string;
  };
};

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

  const text = ["Чат открыл пользователь:", "", body.user].join("\n");

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
