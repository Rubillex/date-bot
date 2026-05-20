CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "homeEyebrow" TEXT NOT NULL,
    "homeTitle" TEXT NOT NULL,
    "homeText" TEXT NOT NULL,
    "placeEyebrow" TEXT NOT NULL,
    "placeTitle" TEXT NOT NULL,
    "placeText" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "dateText" TEXT NOT NULL,
    "timeText" TEXT NOT NULL,
    "galleryEyebrow" TEXT NOT NULL,
    "galleryButtonText" TEXT NOT NULL,
    "menuEyebrow" TEXT NOT NULL,
    "menuTitle" TEXT NOT NULL,
    "menuText" TEXT NOT NULL,
    "matchesEyebrow" TEXT NOT NULL,
    "matchesTitle" TEXT NOT NULL,
    "matchesText" TEXT NOT NULL,
    "matchesEmptyTitle" TEXT NOT NULL,
    "matchesEmptyText" TEXT NOT NULL,
    "recommendationChips" JSONB NOT NULL,
    "placePhotos" JSONB NOT NULL,
    "restaurants" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Invitation_code_key" ON "Invitation"("code");
