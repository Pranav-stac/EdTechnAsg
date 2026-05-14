import { Router } from "express";
import { courseQuerySchema, leadSchema } from "@manzilchaser/shared";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/errors";

const router = Router();

router.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json({ items: categories });
  })
);

router.get(
  "/universities",
  asyncHandler(async (_req, res) => {
    const universities = await prisma.university.findMany({ orderBy: { name: "asc" } });
    res.json({ items: universities });
  })
);

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const query = courseQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { isPublished: true };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { specialization: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.category) where.category = { slug: query.category };
    if (query.specialization) where.specialization = { contains: query.specialization, mode: "insensitive" };
    if (query.university) where.university = { slug: query.university };
    if (query.feeMin || query.feeMax) {
      where.fee = {
        ...(query.feeMin ? { gte: query.feeMin } : {}),
        ...(query.feeMax ? { lte: query.feeMax } : {}),
      };
    }

    const orderBy =
      query.sort === "fee_asc"
        ? { fee: "asc" as const }
        : query.sort === "fee_desc"
          ? { fee: "desc" as const }
          : query.sort === "rating"
            ? { rating: "desc" as const }
            : { createdAt: "desc" as const };

    const [total, items] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        include: { category: true, university: true },
        orderBy,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    res.json({ items, page: query.page, pageSize: query.pageSize, total });
  })
);

router.get(
  "/courses/:slug",
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        university: true,
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
            quizzes: { include: { questions: { orderBy: { order: "asc" } } } },
          },
        },
      },
    });
    res.json({ course });
  })
);

router.post(
  "/leads",
  asyncHandler(async (req, res) => {
    const data = leadSchema.parse(req.body);
    let courseId: string | undefined;
    if (data.courseSlug) {
      const course = await prisma.course.findUnique({ where: { slug: data.courseSlug } });
      courseId = course?.id;
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: data.source,
        courseId,
      },
    });

    res.status(201).json({ lead });
  })
);

router.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const items = await prisma.testimonial.findMany({ take: 6 });
    res.json({ items });
  })
);

router.get(
  "/partners",
  asyncHandler(async (_req, res) => {
    const items = await prisma.partner.findMany();
    res.json({ items });
  })
);

export default router;
