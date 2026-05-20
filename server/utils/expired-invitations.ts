import { rm } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "./prisma";

const uploadRoot = () =>
  process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");

const monthInMilliseconds = 30 * 24 * 60 * 60 * 1000;

export const deleteExpiredInvitations = async () => {
  const cutoff = new Date(Date.now() - monthInMilliseconds);
  const expiredInvitations = await prisma.invitation.findMany({
    where: {
      lastOpenedAt: {
        lt: cutoff,
      },
    },
    select: {
      code: true,
    },
  });

  if (!expiredInvitations.length) {
    return;
  }

  await prisma.invitation.deleteMany({
    where: {
      code: {
        in: expiredInvitations.map((invitation) => invitation.code),
      },
    },
  });

  await Promise.all(
    expiredInvitations.map((invitation) =>
      rm(join(uploadRoot(), "invitations", invitation.code), {
        force: true,
        recursive: true,
      }),
    ),
  );
};
