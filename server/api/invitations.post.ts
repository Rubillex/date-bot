import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { prisma } from "../utils/prisma";
import { deleteExpiredInvitations } from "../utils/expired-invitations";
import { toInvitationContent } from "../utils/invitation-content";

type PhotoPayload = {
  fileKey?: string;
  src?: string;
  alt: string;
  title: string;
};

type InvitationPayload = {
  home: {
    eyebrow: string;
    title: string;
    text: string;
  };
  place: {
    eyebrow: string;
    title: string;
    text: string;
    placeName: string;
    dateText: string;
    timeText: string;
  };
  gallery: {
    eyebrow: string;
    buttonText: string;
  };
  menu: {
    eyebrow: string;
    title: string;
    text: string;
  };
  matches: {
    eyebrow: string;
    title: string;
    text: string;
    emptyTitle: string;
    emptyText: string;
  };
  recommendationChips: string[];
  placePhotos: PhotoPayload[];
  restaurants: RestaurantPayload[];
};

type MenuItemPayload = {
  id: string;
  name: string;
  description: string;
  fileKey?: string;
  image?: string;
  partnerWants: boolean;
};

type RestaurantPayload = {
  id: string;
  name: string;
  items: MenuItemPayload[];
};

const uploadRoot = () =>
  process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");

const createCode = () =>
  randomBytes(4).toString("base64url").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6)
    .toUpperCase();

const requiredString = (value: unknown, field: string) => {
  if (typeof value !== "string" || !value.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: `Field ${field} is required.`,
    });
  }

  return value.trim();
};

const parsePayload = (value: string): InvitationPayload => {
  const payload = JSON.parse(value) as InvitationPayload;

  return {
    home: {
      eyebrow: requiredString(payload.home?.eyebrow, "home.eyebrow"),
      title: requiredString(payload.home?.title, "home.title"),
      text: requiredString(payload.home?.text, "home.text"),
    },
    place: {
      eyebrow: requiredString(payload.place?.eyebrow, "place.eyebrow"),
      title: requiredString(payload.place?.title, "place.title"),
      text: requiredString(payload.place?.text, "place.text"),
      placeName: requiredString(payload.place?.placeName, "place.placeName"),
      dateText: requiredString(payload.place?.dateText, "place.dateText"),
      timeText: requiredString(payload.place?.timeText, "place.timeText"),
    },
    gallery: {
      eyebrow: requiredString(payload.gallery?.eyebrow, "gallery.eyebrow"),
      buttonText: requiredString(
        payload.gallery?.buttonText,
        "gallery.buttonText",
      ),
    },
    menu: {
      eyebrow: requiredString(payload.menu?.eyebrow, "menu.eyebrow"),
      title: requiredString(payload.menu?.title, "menu.title"),
      text: requiredString(payload.menu?.text, "menu.text"),
    },
    matches: {
      eyebrow: requiredString(payload.matches?.eyebrow, "matches.eyebrow"),
      title: requiredString(payload.matches?.title, "matches.title"),
      text: requiredString(payload.matches?.text, "matches.text"),
      emptyTitle: requiredString(
        payload.matches?.emptyTitle,
        "matches.emptyTitle",
      ),
      emptyText: requiredString(payload.matches?.emptyText, "matches.emptyText"),
    },
    recommendationChips: Array.isArray(payload.recommendationChips)
      ? payload.recommendationChips.filter(
          (chip): chip is string => typeof chip === "string" && Boolean(chip),
        )
      : [],
    placePhotos: Array.isArray(payload.placePhotos)
      ? payload.placePhotos.map((photo, index) => ({
          fileKey:
            typeof photo.fileKey === "string" ? photo.fileKey : undefined,
          src: typeof photo.src === "string" ? photo.src : undefined,
          alt: requiredString(photo.alt, `placePhotos.${index}.alt`),
          title: requiredString(photo.title, `placePhotos.${index}.title`),
        }))
      : [],
    restaurants: Array.isArray(payload.restaurants)
      ? payload.restaurants.map((restaurant, restaurantIndex) => ({
          id: requiredString(restaurant.id, `restaurants.${restaurantIndex}.id`),
          name: requiredString(
            restaurant.name,
            `restaurants.${restaurantIndex}.name`,
          ),
          items: Array.isArray(restaurant.items)
            ? restaurant.items.map((item, itemIndex) => ({
                id: requiredString(
                  item.id,
                  `restaurants.${restaurantIndex}.items.${itemIndex}.id`,
                ),
                name: requiredString(
                  item.name,
                  `restaurants.${restaurantIndex}.items.${itemIndex}.name`,
                ),
                description: requiredString(
                  item.description,
                  `restaurants.${restaurantIndex}.items.${itemIndex}.description`,
                ),
                fileKey:
                  typeof item.fileKey === "string" ? item.fileKey : undefined,
                image: typeof item.image === "string" ? item.image : undefined,
                partnerWants: Boolean(item.partnerWants),
              }))
            : [],
        }))
      : [],
  };
};

const saveUpload = async (
  file: NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>[number],
  directory: string,
  code: string,
) => {
  const extension = extname(file.filename ?? "") || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  await writeFile(join(directory, filename), file.data);

  return `/api/uploads/invitations/${code}/${filename}`;
};

const createUniqueCode = async () => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = createCode();
    const existing = await prisma.invitation.findUnique({ where: { code } });

    if (!existing) {
      return code;
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: "Unable to create unique invitation code.",
  });
};

export default defineEventHandler(async (event) => {
  await deleteExpiredInvitations();

  const form = await readMultipartFormData(event);
  const payloadPart = form?.find((part) => part.name === "payload");

  if (!payloadPart) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payload is required.",
    });
  }

  const payload = parsePayload(payloadPart.data.toString("utf8"));
  const code = await createUniqueCode();
  const files = new Map(
    form
      ?.filter((part) => part.name && part.filename)
      .map((part) => [part.name, part]) ?? [],
  );
  const directory = join(uploadRoot(), "invitations", code);
  await mkdir(directory, { recursive: true });

  const placePhotos = await Promise.all(
    payload.placePhotos.map(async (photo, index) => {
      const file = photo.fileKey ? files.get(photo.fileKey) : undefined;

      if (!file) {
        if (photo.src) {
          return {
            src: photo.src,
            alt: photo.alt,
            title: photo.title,
          };
        }

        throw createError({
          statusCode: 400,
          statusMessage: `Photo file ${index + 1} is required.`,
        });
      }

      return {
        src: await saveUpload(file, directory, code),
        alt: photo.alt,
        title: photo.title,
      };
    }),
  );

  const restaurants = await Promise.all(
    payload.restaurants.map(async (restaurant, restaurantIndex) => ({
      ...restaurant,
      items: await Promise.all(
        restaurant.items.map(async (item, itemIndex) => {
          const file = item.fileKey ? files.get(item.fileKey) : undefined;

          if (!file) {
            if (item.image) {
              return {
                ...item,
                image: item.image,
              };
            }

            throw createError({
              statusCode: 400,
              statusMessage: `Menu item photo ${restaurantIndex + 1}.${itemIndex + 1} is required.`,
            });
          }

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            image: await saveUpload(file, directory, code),
            partnerWants: item.partnerWants,
          };
        }),
      ),
    })),
  );

  if (
    !placePhotos.length ||
    !restaurants.length ||
    restaurants.some((restaurant) => !restaurant.items.length)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "At least one photo, one restaurant and one menu item are required.",
    });
  }

  const invitation = await prisma.invitation.create({
    data: {
      code,
      homeEyebrow: payload.home.eyebrow,
      homeTitle: payload.home.title,
      homeText: payload.home.text,
      placeEyebrow: payload.place.eyebrow,
      placeTitle: payload.place.title,
      placeText: payload.place.text,
      placeName: payload.place.placeName,
      dateText: payload.place.dateText,
      timeText: payload.place.timeText,
      galleryEyebrow: payload.gallery.eyebrow,
      galleryButtonText: payload.gallery.buttonText,
      menuEyebrow: payload.menu.eyebrow,
      menuTitle: payload.menu.title,
      menuText: payload.menu.text,
      matchesEyebrow: payload.matches.eyebrow,
      matchesTitle: payload.matches.title,
      matchesText: payload.matches.text,
      matchesEmptyTitle: payload.matches.emptyTitle,
      matchesEmptyText: payload.matches.emptyText,
      recommendationChips: payload.recommendationChips,
      placePhotos,
      restaurants,
    },
  });

  return toInvitationContent(invitation);
});
