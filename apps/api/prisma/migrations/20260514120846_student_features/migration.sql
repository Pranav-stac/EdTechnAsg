-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "submissionNote" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "LessonDiscussion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonDiscussion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonDiscussion_lessonId_idx" ON "LessonDiscussion"("lessonId");

-- AddForeignKey
ALTER TABLE "LessonDiscussion" ADD CONSTRAINT "LessonDiscussion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonDiscussion" ADD CONSTRAINT "LessonDiscussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
