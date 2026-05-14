import { Router } from "express";
import { adminCourseSchema, adminLeadUpdateSchema } from "@manzilchaser/shared";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/errors";
import { AuthedRequest, requireAuth, requireRole } from "../middleware/auth";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    const [leads, enrollments, revenue, activeLearners] = await Promise.all([
      prisma.lead.count(),
      prisma.enrollment.count(),
      prisma.payment.aggregate({ where: { status: "paid" }, _sum: { amount: true } }),
      prisma.user.count({ where: { role: "student" } }),
    ]);

    res.json({
      leads,
      enrollments,
      revenue: revenue._sum.amount ?? 0,
      activeLearners,
    });
  })
);

router.get(
  "/leads",
  asyncHandler(async (_req, res) => {
    const items = await prisma.lead.findMany({
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  })
);

router.patch(
  "/leads/:id",
  asyncHandler(async (req, res) => {
    const data = adminLeadUpdateSchema.parse(req.body);
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data });
    res.json({ lead });
  })
);

router.get(
  "/courses",
  asyncHandler(async (_req, res) => {
    const items = await prisma.course.findMany({
      include: { category: true, university: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  })
);

router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    const data = adminCourseSchema.parse(req.body);
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    const university = await prisma.university.findUnique({ where: { slug: data.universitySlug } });
    if (!category || !university) throw new AppError(400, "INVALID_RELATION", "Invalid category or university");

    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        fee: data.fee,
        duration: data.duration,
        mode: data.mode,
        specialization: data.specialization,
        rating: data.rating,
        isPublished: data.isPublished,
        tags: data.tags,
        categoryId: category.id,
        universityId: university.id,
      },
    });
    res.status(201).json({ course });
  })
);

router.patch(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const data = adminCourseSchema.partial().parse(req.body);
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        title: data.title,
        description: data.description,
        fee: data.fee,
        duration: data.duration,
        mode: data.mode,
        specialization: data.specialization,
        rating: data.rating,
        isPublished: data.isPublished,
        tags: data.tags,
      },
    });
    res.json({ course });
  })
);

router.get(
  "/students",
  asyncHandler(async (_req, res) => {
    const items = await prisma.user.findMany({
      where: { role: "student" },
      include: { enrollments: { include: { course: true } } },
    });
    res.json({ items });
  })
);

router.get(
  "/payments",
  asyncHandler(async (_req, res) => {
    const items = await prisma.payment.findMany({
      include: { user: true, course: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  })
);

export default router;
