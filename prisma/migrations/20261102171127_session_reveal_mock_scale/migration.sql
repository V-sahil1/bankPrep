-- AlterTable
ALTER TABLE "MockTest" ADD COLUMN     "scalePercent" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "SessionQuestion" ADD COLUMN     "revealed" BOOLEAN NOT NULL DEFAULT false;
