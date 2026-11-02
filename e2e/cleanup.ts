import { PrismaClient } from "@prisma/client";
import { env } from "./helpers";

/** Removes only what these tests create, so a failed run can't affect later ones. */
export default async function cleanup() {
  const prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: "@test.local", startsWith: "e2e-" } } });
  await prisma.topic.deleteMany({ where: { name: { startsWith: "Zeta" }, questions: { none: {} } } });
  await prisma.question.deleteMany({ where: { questionText: { startsWith: "E2E " } } });
  await prisma.examPattern.updateMany({
    where: { exam: { slug: "sbi-clerk" }, verifiedAt: { not: null } },
    data: { verifiedAt: null },
  });
  await prisma.$disconnect();
}
