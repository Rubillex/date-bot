import { retrieveLaunchParams } from "@telegram-apps/sdk";

export const useTelegramUser = () => {
  let tgData = null;
  try {
    const { tgWebAppData } = retrieveLaunchParams();
    tgData = tgWebAppData;
  } catch (e) {}

  return computed(() => tgData?.user ?? null);
};
