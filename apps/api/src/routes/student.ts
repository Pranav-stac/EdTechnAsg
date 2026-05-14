import { Router } from "express";
import { assignmentSubmitSchema, discussionPostSchema, progressSchema, quizSubmitSchema } from "@manzilchaser/shared";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/errors";
import { AuthedRequest, requireAuth, requireRole } from "../middleware/auth";

const router = Router();
router.use(requireAuth, requireRole("student"));

router.get(
  "/dashboard",
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.id;
    const [enrollments, liveClasses, assignments, announcements, quizAttempts] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: { include: { university: true } } },
      }),
      prisma.liveClass.findMany({
        where: { course: { enrollments: { some: { userId } } } },
        include: { course: true },
        orderBy: { startsAt: "asc" },
        take: 5,
      }),
      prisma.assignment.findMany({ where: { userId }, include: { course: true }, take: 5 }),
      prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 1 }),
    ]);

    const avgScore = quizAttempts[0]
      ? Math.round((quizAttempts[0].score / quizAttempts[0].total) * 100)
      : 0;

    res.json({
      stats: {
        coursesEnrolled: enrollments.length,
        liveClasses: liveClasses.length,
        assignments: assignments.length,
        testScore: avgScore,
      },
      enrollments,
      liveClasses,
      assignments,
      announcements,
    });
  })
);

router.get(
  "/courses",
  asyncHandler(async (req: AuthedRequest, res) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      include: { course: { include: { university: true, modules: { include: { lessons: true } } } } },
    });
    res.json({ items: enrollments });
  })
);

router.get(
  "/courses/:courseId/content",
  asyncHandler(async (req: AuthedRequest, res) => {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: req.user!.id, courseId: req.params.courseId },
    });
    if (!enrollment) throw new AppError(403, "FORBIDDEN", "Not enrolled in this course");

    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
            quizzes: { include: { questions: { orderBy: { order: "asc" } } } },
          },
        },
      },
    });

    const progress = await prisma.lessonProgress.findMany({
      where: { userId: req.user!.id, lesson: { module: { courseId: req.params.courseId } } },
    });

    res.json({ course, progress, enrollment });
  })
);

router.post(
  "/progress",
  asyncHandler(async (req: AuthedRequest, res) => {
    const data = progressSchema.parse(req.body);
    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: req.user!.id, lessonId: data.lessonId } },
      update: {
        completed: data.completed,
        watchedSeconds: data.watchedSeconds ?? 0,
      },
      create: {
        userId: req.user!.id,
        lessonId: data.lessonId,
        completed: data.completed,
        watchedSeconds: data.watchedSeconds ?? 0,
      },
    });

    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
      include: { module: { include: { course: { include: { modules: { include: { lessons: true } } } } } } },
    });

    if (lesson) {
      const course = lesson.module.course;
      const totalLessons = course.modules.flatMap((module) => module.lessons).length;
      const completed = await prisma.lessonProgress.count({
        where: { userId: req.user!.id, completed: true, lesson: { module: { courseId: course.id } } },
      });
      const percent = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
      await prisma.enrollment.updateMany({
        where: { userId: req.user!.id, courseId: course.id },
        data: { progress: percent },
      });
    }

    res.json({ progress });
  })
);

router.get(
  "/attendance",
  asyncHandler(async (req: AuthedRequest, res) => {
    const items = await prisma.attendanceRecord.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: "desc" },
    });
    res.json({ items });
  })
);

router.get(
  "/assignments",
  asyncHandler(async (req: AuthedRequest, res) => {
    const items = await prisma.assignment.findMany({
      where: { userId: req.user!.id },
      include: { course: true },
      orderBy: { dueDate: "asc" },
    });
    res.json({ items });
  })
);

router.post(
  "/assignments/:id/submit",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { submissionNote } = assignmentSubmitSchema.parse(req.body);
    const assignment = await prisma.assignment.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!assignment) throw new AppError(404, "NOT_FOUND", "Assignment not found");

    const updated = await prisma.assignment.update({
      where: { id: assignment.id },
      data: {
        submissionNote,
        submittedAt: new Date(),
        status: "submitted",
      },
      include: { course: true },
    });

    res.json({ assignment: updated });
  })
);

router.get(
  "/certificates",
  asyncHandler(async (req: AuthedRequest, res) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id, progress: { gte: 100 } },
      include: { course: { include: { university: true } } },
      orderBy: { enrolledAt: "desc" },
    });

    const items = enrollments.map((enrollment) => ({
      id: enrollment.id,
      courseTitle: enrollment.course.title,
      university: enrollment.course.university.name,
      issuedAt: enrollment.enrolledAt,
      certificateCode: `MC-${enrollment.id.slice(0, 8).toUpperCase()}`,
    }));

    res.json({ items });
  })
);

router.get(
  "/lessons/:lessonId/discussion",
  asyncHandler(async (req: AuthedRequest, res) => {
    const items = await prisma.lessonDiscussion.findMany({
      where: { lessonId: req.params.lessonId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json({ items });
  })
);

router.post(
  "/lessons/:lessonId/discussion",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { body } = discussionPostSchema.parse(req.body);
    const item = await prisma.lessonDiscussion.create({
      data: {
        lessonId: req.params.lessonId,
        userId: req.user!.id,
        body,
      },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json({ item });
  })
);

router.post(
  "/quizzes/:quizId/submit",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { answers } = quizSubmitSchema.parse(req.body);
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.quizId },
      include: { questions: true },
    });
    if (!quiz) throw new AppError(404, "NOT_FOUND", "Quiz not found");

    let score = 0;
    for (const question of quiz.questions) {
      if (answers[question.id] === question.answerKey) score += 1;
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user!.id,
        quizId: quiz.id,
        score,
        total: quiz.questions.length,
        answers,
      },
    });

    res.json({ attempt, percent: Math.round((score / quiz.questions.length) * 100) });
  })
);

export default router;
