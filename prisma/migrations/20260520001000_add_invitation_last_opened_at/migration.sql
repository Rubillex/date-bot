ALTER TABLE "Invitation"
ADD COLUMN "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "Invitation_lastOpenedAt_idx" ON "Invitation"("lastOpenedAt");
