import { retrieveLaunchParams } from "@telegram-apps/sdk";

export const useTelegramUser = () => {
  const { tgWebAppData } = retrieveLaunchParams();

  return computed(() => tgWebAppData?.user ?? null);
};
