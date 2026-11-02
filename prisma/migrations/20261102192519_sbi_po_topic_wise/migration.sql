-- SBI PO topic-wise preparation: exam stages, stage mappings, subtopic tiers,
-- topic notes and formulas, structured explanations and PYQ sources, per-user
-- topic/subtopic/subject progress, descriptive tasks and Phase III guides.
-- CreateEnum
CREATE TYPE "StageKind" AS ENUM ('OBJECTIVE', 'DESCRIPTIVE', 'INTERVIEW');

-- CreateEnum
CREATE TYPE "TopicKind" AS ENUM ('OBJECTIVE', 'DESCRIPTIVE');

-- CreateEnum
CREATE TYPE "TopicPriority" AS ENUM ('UNSET', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "SubtopicTier" AS ENUM ('FOUNDATION', 'ADVANCED');

-- CreateEnum
CREATE TYPE "NoteKind" AS ENUM ('INTRODUCTION', 'CONCEPT', 'SHORTCUT', 'COMMON_MISTAKE', 'SOLVED_EXAMPLE');

-- CreateEnum
CREATE TYPE "DescriptiveTaskType" AS ENUM ('EMAIL', 'SITUATION_ANALYSIS', 'REPORT', 'PRECIS', 'ESSAY', 'LETTER');

-- AlterEnum
ALTER TYPE "Difficulty" ADD VALUE 'ADVANCED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionStatus" ADD VALUE 'DRAFT';
ALTER TYPE "QuestionStatus" ADD VALUE 'ARCHIVED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SessionScope" ADD VALUE 'SUBTOPIC';
ALTER TYPE "SessionScope" ADD VALUE 'TOPIC_TEST';
ALTER TYPE "SessionScope" ADD VALUE 'SIMILAR';

-- AlterEnum
ALTER TYPE "SourceType" ADD VALUE 'PATTERN_BASED';

-- AlterTable
ALTER TABLE "AIQuestionGenerationJob" ADD COLUMN     "stageId" TEXT,
ADD COLUMN     "subtopicId" TEXT;

-- AlterTable
ALTER TABLE "Mistake" ADD COLUMN     "topicId" TEXT,
ADD COLUMN     "understoodAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PracticeSession" ADD COLUMN     "autoFinished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sourceFilter" "SourceType",
ADD COLUMN     "stageId" TEXT,
ADD COLUMN     "subtopicId" TEXT,
ADD COLUMN     "timeLimitSec" INTEGER;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "periodMonth" TEXT;

-- AlterTable
ALTER TABLE "Subtopic" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tier" "SubtopicTier" NOT NULL DEFAULT 'FOUNDATION',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- Existing rows got the default above; new rows are stamped by Prisma.
ALTER TABLE "Subtopic" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "kind" "TopicKind" NOT NULL DEFAULT 'OBJECTIVE';

-- AlterTable
ALTER TABLE "UserAnswer" ADD COLUMN     "subtopicId" TEXT;

-- CreateTable
CREATE TABLE "ExamStage" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "kind" "StageKind" NOT NULL DEFAULT 'OBJECTIVE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "totalQuestions" INTEGER,
    "totalMarks" DOUBLE PRECISION,
    "durationMinutes" INTEGER,
    "notes" TEXT,
    "includesAdvanced" BOOLEAN NOT NULL DEFAULT false,
    "preferredDifficulties" "Difficulty"[] DEFAULT ARRAY[]::"Difficulty"[],
    "taskTypes" "DescriptiveTaskType"[] DEFAULT ARRAY[]::"DescriptiveTaskType"[],
    "patternId" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageSubject" (
    "stageId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "displayName" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionCount" INTEGER,
    "marks" DOUBLE PRECISION,
    "durationMinutes" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StageSubject_pkey" PRIMARY KEY ("stageId","subjectId")
);

-- CreateTable
CREATE TABLE "StageTopic" (
    "stageId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "priority" "TopicPriority" NOT NULL DEFAULT 'UNSET',
    "priorityNote" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StageTopic_pkey" PRIMARY KEY ("stageId","topicId")
);

-- CreateTable
CREATE TABLE "TopicNote" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "kind" "NoteKind" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formula" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionExplanation" (
    "questionId" TEXT NOT NULL,
    "steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "concept" TEXT,
    "rule" TEXT,
    "shortcut" TEXT,
    "commonMistake" TEXT,
    "estimatedSeconds" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionExplanation_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "QuestionSource" (
    "questionId" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "year" INTEGER,
    "shift" TEXT,
    "paper" TEXT,
    "reference" TEXT NOT NULL,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionSource_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "UserTopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "attempted" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "incorrect" INTEGER NOT NULL DEFAULT 0,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "uniqueSolved" INTEGER NOT NULL DEFAULT 0,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "easyAttempted" INTEGER NOT NULL DEFAULT 0,
    "easyCorrect" INTEGER NOT NULL DEFAULT 0,
    "mediumAttempted" INTEGER NOT NULL DEFAULT 0,
    "mediumCorrect" INTEGER NOT NULL DEFAULT 0,
    "hardAttempted" INTEGER NOT NULL DEFAULT 0,
    "hardCorrect" INTEGER NOT NULL DEFAULT 0,
    "advancedAttempted" INTEGER NOT NULL DEFAULT 0,
    "advancedCorrect" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTopicProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubtopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subtopicId" TEXT NOT NULL,
    "attempted" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "incorrect" INTEGER NOT NULL DEFAULT 0,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "uniqueSolved" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubtopicProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubjectProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "attempted" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "incorrect" INTEGER NOT NULL DEFAULT 0,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubjectProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescriptiveTask" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "topicId" TEXT,
    "subtopicId" TEXT,
    "type" "DescriptiveTaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "sourceText" TEXT,
    "modelAnswer" TEXT NOT NULL,
    "evaluationCriteria" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wordLimit" INTEGER NOT NULL,
    "timeLimitMinutes" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "sourceType" "SourceType" NOT NULL DEFAULT 'ADMIN_AUTHORED',
    "sourceReference" TEXT,
    "status" "QuestionStatus" NOT NULL DEFAULT 'APPROVED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DescriptiveTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescriptiveAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "responseText" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "selfScores" JSONB,
    "feedback" JSONB,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DescriptiveAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrepGuide" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrepGuide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamStage_examId_order_idx" ON "ExamStage"("examId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ExamStage_examId_slug_key" ON "ExamStage"("examId", "slug");

-- CreateIndex
CREATE INDEX "StageSubject_subjectId_idx" ON "StageSubject"("subjectId");

-- CreateIndex
CREATE INDEX "StageTopic_stageId_subjectId_order_idx" ON "StageTopic"("stageId", "subjectId", "order");

-- CreateIndex
CREATE INDEX "StageTopic_topicId_idx" ON "StageTopic"("topicId");

-- CreateIndex
CREATE INDEX "TopicNote_topicId_kind_order_idx" ON "TopicNote"("topicId", "kind", "order");

-- CreateIndex
CREATE INDEX "Formula_topicId_order_idx" ON "Formula"("topicId", "order");

-- CreateIndex
CREATE INDEX "QuestionSource_examName_year_idx" ON "QuestionSource"("examName", "year");

-- CreateIndex
CREATE INDEX "UserTopicProgress_userId_lastPracticedAt_idx" ON "UserTopicProgress"("userId", "lastPracticedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserTopicProgress_userId_topicId_key" ON "UserTopicProgress"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubtopicProgress_userId_subtopicId_key" ON "UserSubtopicProgress"("userId", "subtopicId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubjectProgress_userId_subjectId_key" ON "UserSubjectProgress"("userId", "subjectId");

-- CreateIndex
CREATE INDEX "DescriptiveTask_stageId_status_order_idx" ON "DescriptiveTask"("stageId", "status", "order");

-- CreateIndex
CREATE INDEX "DescriptiveTask_topicId_idx" ON "DescriptiveTask"("topicId");

-- CreateIndex
CREATE INDEX "DescriptiveAttempt_userId_submittedAt_idx" ON "DescriptiveAttempt"("userId", "submittedAt");

-- CreateIndex
CREATE INDEX "DescriptiveAttempt_taskId_idx" ON "DescriptiveAttempt"("taskId");

-- CreateIndex
CREATE INDEX "PrepGuide_stageId_order_idx" ON "PrepGuide"("stageId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PrepGuide_stageId_slug_key" ON "PrepGuide"("stageId", "slug");

-- CreateIndex
CREATE INDEX "Mistake_userId_topicId_idx" ON "Mistake"("userId", "topicId");

-- CreateIndex
CREATE INDEX "PracticeSession_userId_topicId_status_idx" ON "PracticeSession"("userId", "topicId", "status");

-- CreateIndex
CREATE INDEX "Question_subtopicId_difficulty_status_idx" ON "Question"("subtopicId", "difficulty", "status");

-- CreateIndex
CREATE INDEX "Question_topicId_periodMonth_idx" ON "Question"("topicId", "periodMonth");

-- CreateIndex
CREATE INDEX "Subtopic_topicId_order_idx" ON "Subtopic"("topicId", "order");

-- CreateIndex
CREATE INDEX "UserAnswer_userId_subtopicId_idx" ON "UserAnswer"("userId", "subtopicId");

-- AddForeignKey
ALTER TABLE "ExamStage" ADD CONSTRAINT "ExamStage_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamStage" ADD CONSTRAINT "ExamStage_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "ExamPattern"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageSubject" ADD CONSTRAINT "StageSubject_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ExamStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageSubject" ADD CONSTRAINT "StageSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageTopic" ADD CONSTRAINT "StageTopic_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ExamStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageTopic" ADD CONSTRAINT "StageTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageTopic" ADD CONSTRAINT "StageTopic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicNote" ADD CONSTRAINT "TopicNote_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formula" ADD CONSTRAINT "Formula_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionExplanation" ADD CONSTRAINT "QuestionExplanation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSource" ADD CONSTRAINT "QuestionSource_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ExamStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubtopicProgress" ADD CONSTRAINT "UserSubtopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubtopicProgress" ADD CONSTRAINT "UserSubtopicProgress_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubjectProgress" ADD CONSTRAINT "UserSubjectProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubjectProgress" ADD CONSTRAINT "UserSubjectProgress_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveTask" ADD CONSTRAINT "DescriptiveTask_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ExamStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveTask" ADD CONSTRAINT "DescriptiveTask_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveTask" ADD CONSTRAINT "DescriptiveTask_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveAttempt" ADD CONSTRAINT "DescriptiveAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveAttempt" ADD CONSTRAINT "DescriptiveAttempt_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "DescriptiveTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrepGuide" ADD CONSTRAINT "PrepGuide_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ExamStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIQuestionGenerationJob" ADD CONSTRAINT "AIQuestionGenerationJob_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ExamStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIQuestionGenerationJob" ADD CONSTRAINT "AIQuestionGenerationJob_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Backfills: denormalised columns and progress tables from existing answers.
-- ---------------------------------------------------------------------------
UPDATE "Mistake" m SET "topicId" = q."topicId" FROM "Question" q WHERE q."id" = m."questionId" AND m."topicId" IS NULL;

UPDATE "UserAnswer" a SET "subtopicId" = q."subtopicId" FROM "Question" q WHERE q."id" = a."questionId" AND a."subtopicId" IS NULL;

INSERT INTO "UserTopicProgress" ("id", "userId", "topicId", "attempted", "correct", "incorrect", "timeSpentSec", "uniqueSolved", "sessionCount",
  "easyAttempted", "easyCorrect", "mediumAttempted", "mediumCorrect", "hardAttempted", "hardCorrect", "advancedAttempted", "advancedCorrect", "lastPracticedAt", "updatedAt")
SELECT
  md5(a."userId" || ':' || a."topicId"),
  a."userId", a."topicId",
  COUNT(*), COUNT(*) FILTER (WHERE a."isCorrect"), COUNT(*) FILTER (WHERE NOT a."isCorrect"), COALESCE(SUM(a."timeSpentSec"), 0),
  COUNT(DISTINCT a."questionId"),
  (SELECT COUNT(*) FROM "PracticeSession" s WHERE s."userId" = a."userId" AND s."topicId" = a."topicId" AND s."status" = 'COMPLETED'),
  COUNT(*) FILTER (WHERE a."difficulty"::text = 'EASY'), COUNT(*) FILTER (WHERE a."difficulty"::text = 'EASY' AND a."isCorrect"),
  COUNT(*) FILTER (WHERE a."difficulty"::text = 'MEDIUM'), COUNT(*) FILTER (WHERE a."difficulty"::text = 'MEDIUM' AND a."isCorrect"),
  COUNT(*) FILTER (WHERE a."difficulty"::text = 'HARD'), COUNT(*) FILTER (WHERE a."difficulty"::text = 'HARD' AND a."isCorrect"),
  COUNT(*) FILTER (WHERE a."difficulty"::text = 'ADVANCED'), COUNT(*) FILTER (WHERE a."difficulty"::text = 'ADVANCED' AND a."isCorrect"),
  MAX(a."finalizedAt"), CURRENT_TIMESTAMP
FROM "UserAnswer" a WHERE a."finalizedAt" IS NOT NULL
GROUP BY a."userId", a."topicId";

INSERT INTO "UserSubtopicProgress" ("id", "userId", "subtopicId", "attempted", "correct", "incorrect", "timeSpentSec", "uniqueSolved", "lastPracticedAt", "updatedAt")
SELECT md5(a."userId" || ':' || a."subtopicId"), a."userId", a."subtopicId",
  COUNT(*), COUNT(*) FILTER (WHERE a."isCorrect"), COUNT(*) FILTER (WHERE NOT a."isCorrect"), COALESCE(SUM(a."timeSpentSec"), 0),
  COUNT(DISTINCT a."questionId"), MAX(a."finalizedAt"), CURRENT_TIMESTAMP
FROM "UserAnswer" a WHERE a."finalizedAt" IS NOT NULL AND a."subtopicId" IS NOT NULL
GROUP BY a."userId", a."subtopicId";

INSERT INTO "UserSubjectProgress" ("id", "userId", "subjectId", "attempted", "correct", "incorrect", "timeSpentSec", "lastPracticedAt", "updatedAt")
SELECT md5(a."userId" || ':' || a."subjectId"), a."userId", a."subjectId",
  COUNT(*), COUNT(*) FILTER (WHERE a."isCorrect"), COUNT(*) FILTER (WHERE NOT a."isCorrect"), COALESCE(SUM(a."timeSpentSec"), 0),
  MAX(a."finalizedAt"), CURRENT_TIMESTAMP
FROM "UserAnswer" a WHERE a."finalizedAt" IS NOT NULL
GROUP BY a."userId", a."subjectId";

-- Every table stays closed to Supabase's REST API (see 20261103000000_enable_row_level_security).
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND NOT rowsecurity LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;
