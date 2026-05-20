import type { Invitation } from "../generated/prisma/client";

type JsonArray = unknown;

const asArray = <T>(value: JsonArray): T[] => (Array.isArray(value) ? value : []);

export const toInvitationContent = (invitation: Invitation) => ({
  code: invitation.code,
  home: {
    eyebrow: invitation.homeEyebrow,
    title: invitation.homeTitle,
    text: invitation.homeText,
  },
  place: {
    eyebrow: invitation.placeEyebrow,
    title: invitation.placeTitle,
    text: invitation.placeText,
    placeName: invitation.placeName,
    dateText: invitation.dateText,
    timeText: invitation.timeText,
  },
  gallery: {
    eyebrow: invitation.galleryEyebrow,
    buttonText: invitation.galleryButtonText,
  },
  menu: {
    eyebrow: invitation.menuEyebrow,
    title: invitation.menuTitle,
    text: invitation.menuText,
  },
  matches: {
    eyebrow: invitation.matchesEyebrow,
    title: invitation.matchesTitle,
    text: invitation.matchesText,
    emptyTitle: invitation.matchesEmptyTitle,
    emptyText: invitation.matchesEmptyText,
  },
  recommendationChips: asArray<string>(invitation.recommendationChips),
  placePhotos: asArray(invitation.placePhotos),
  restaurants: asArray(invitation.restaurants),
});
