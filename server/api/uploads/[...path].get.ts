import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, normalize } from "node:path";

const uploadRoot = () =>
  process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");

const contentTypeByExtension: Record<string, string> = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");

  if (!path) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found.",
    });
  }

  const safePath = normalize(path).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(uploadRoot(), safePath);
  const fileStat = await stat(filePath).catch(() => null);

  if (!fileStat?.isFile()) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found.",
    });
  }

  const extension = safePath.split(".").pop()?.toLowerCase() ?? "";
  setHeader(
    event,
    "Content-Type",
    contentTypeByExtension[extension] ?? "application/octet-stream",
  );

  return sendStream(event, createReadStream(filePath));
});
