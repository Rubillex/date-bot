import { prisma } from "../../utils/prisma";
import { deleteExpiredInvitations } from "../../utils/expired-invitations";
import { toInvitationContent } from "../../utils/invitation-content";

export default defineEventHandler(async (event) => {
  await deleteExpiredInvitations();

  const code = getRouterParam(event, "code")?.toUpperCase();

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invitation code is required.",
    });
  }

  const invitation = await prisma.invitation
    .update({
      where: {
        code,
      },
      data: {
        lastOpenedAt: new Date(),
      },
    })
    .catch(() => null);

  if (!invitation) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invitation not found.",
    });
  }

  return toInvitationContent(invitation);
});
