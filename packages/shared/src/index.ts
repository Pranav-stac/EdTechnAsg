import { z } from "zod";

export const UserRole = z.enum(["student", "admin"]);
export type UserRole = z.infer<typeof UserRole>;

export const LeadStatus = z.enum(["new", "contacted", "qualified", "closed"]);
export type LeadStatus = z.infer<typeof LeadStatus>;

export const PaymentStatus = z.enum(["created", "paid", "failed"]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const otpRequestSchema = z.object({
  identifier: z.string().min(5),
});

export const otpVerifySchema = z.object({
  identifier: z.string().min(5),
  otp: z.string().length(6),
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(4),
});

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  courseSlug: z.string().optional(),
  source: z.enum(["enroll", "talk_to_expert", "homepage"]),
  message: z.string().optional(),
});

export const courseQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  specialization: z.string().optional(),
  feeMin: z.coerce.number().optional(),
  feeMax: z.coerce.number().optional(),
  university: z.string().optional(),
  sort: z.enum(["popular", "fee_asc", "fee_desc", "rating"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(12),
});

export const progressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean().default(true),
  watchedSeconds: z.number().optional(),
});

export const quizSubmitSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export const assignmentSubmitSchema = z.object({
  submissionNote: z.string().min(5),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10).optional().nullable(),
});

export const discussionPostSchema = z.object({
  body: z.string().min(2).max(1000),
});

export const createOrderSchema = z.object({
  courseSlug: z.string().optional(),
  amount: z.number().positive().optional(),
  purpose: z.enum(["enrollment", "wallet_topup"]).default("enrollment"),
});

export const adminLeadUpdateSchema = z.object({
  status: LeadStatus,
});

export const adminCourseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  fee: z.number().positive(),
  duration: z.string().min(2),
  mode: z.string().min(2),
  specialization: z.string().min(2),
  categorySlug: z.string(),
  universitySlug: z.string(),
  rating: z.number().min(0).max(5).default(4.5),
  isPublished: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
});

export const MEGA_MENU = {
  byGoal: ["MBA", "MCA", "B.Tech", "M.Tech", "BBA", "BCA"],
  byClass: ["Class 1-5", "Class 6-8", "Class 9-10", "Class 11-12"],
  bySkill: ["English Speaking", "Coding", "Data Science", "Digital Marketing", "Design"],
  byMode: ["Online", "Offline", "Hybrid", "Live Classes"],
};

export const NAV_LINKS = [
  "Online Degrees",
  "Offline Colleges",
  "Kids Learning",
  "Coding & IT",
  "Govt. Exams",
  "Test Series",
  "Study Abroad",
  "More",
];

export const TRUST_METRICS = [
  { label: "Trusted by 10M+ Students", value: "10M+" },
  { label: "Expert Mentors", value: "5000+" },
  { label: "Google Rating", value: "4.8/5" },
  { label: "Success Stories", value: "50K+" },
];
