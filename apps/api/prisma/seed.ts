import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/crypto";

const prisma = new PrismaClient();

const categories = [
  { name: "Online Degrees", slug: "online-degrees", icon: "graduation-cap", accent: "bg-blue-100 text-blue-700" },
  { name: "Coding & IT", slug: "coding-it", icon: "code", accent: "bg-purple-100 text-purple-700" },
  { name: "Kids Learning", slug: "kids-learning", icon: "sparkles", accent: "bg-orange-100 text-orange-700" },
  { name: "Govt. Exams", slug: "govt-exams", icon: "landmark", accent: "bg-green-100 text-green-700" },
  { name: "Study Abroad", slug: "study-abroad", icon: "globe", accent: "bg-cyan-100 text-cyan-700" },
  { name: "Test Series", slug: "test-series", icon: "clipboard-check", accent: "bg-rose-100 text-rose-700" },
];

const universities = [
  { name: "Amity University", slug: "amity-university" },
  { name: "Manipal University", slug: "manipal-university" },
  { name: "LPU", slug: "lpu" },
  { name: "IGNOU", slug: "ignou" },
  { name: "NMIMS", slug: "nmims" },
];

const specializations = ["Finance", "Marketing", "HR", "Operations", "Business Analytics", "IT Management"];

async function main() {
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.course.deleteMany();
  await prisma.university.deleteMany();
  await prisma.category.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }
  for (const university of universities) {
    await prisma.university.create({ data: university });
  }

  const categoryRows = await prisma.category.findMany();
  const universityRows = await prisma.university.findMany();

  const courses = [];
  for (let i = 1; i <= 120; i++) {
    const category = categoryRows[i % categoryRows.length];
    const university = universityRows[i % universityRows.length];
    const specialization = specializations[i % specializations.length];
    const slug = `online-mba-${university.slug}-${i}`;
    courses.push(
      await prisma.course.create({
        data: {
          title: `Online MBA - ${university.name} (${specialization})`,
          slug,
          description:
            "Industry-aligned online MBA with live classes, placement support, EMI options, and mentor guidance.",
          fee: 120000 + (i % 8) * 15000,
          duration: "2 Years",
          mode: i % 2 === 0 ? "Online" : "Hybrid",
          specialization,
          rating: 4.2 + (i % 8) * 0.1,
          tags: ["Live Classes", "Placement Support", "EMI Available"],
          categoryId: category.id,
          universityId: university.id,
        },
      })
    );
  }

  const featured = courses[0];
  const module = await prisma.courseModule.create({
    data: { title: "Python Foundations", order: 1, courseId: featured.id },
  });

  const lessons = await Promise.all(
    ["Intro to Python", "Variables & Data Types", "Control Flow", "Functions"].map((title, index) =>
      prisma.lesson.create({
        data: {
          title,
          order: index + 1,
          videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          durationSec: 600,
          notes: `${title} lecture notes and practice examples.`,
          resourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          moduleId: module.id,
        },
      })
    )
  );

  const quiz = await prisma.quiz.create({
    data: { title: "Python Basics - Quiz", moduleId: module.id },
  });

  const questions = [
    {
      prompt: "Which keyword defines a function in Python?",
      options: ["func", "def", "function", "lambda only"],
      answerKey: "def",
    },
    {
      prompt: "What is the output type of print(type([]))?",
      options: ["list", "<class 'list'>", "array", "tuple"],
      answerKey: "<class 'list'>",
    },
    {
      prompt: "Which symbol is used for comments?",
      options: ["//", "#", "--", "/* */"],
      answerKey: "#",
    },
    {
      prompt: "What does len('Manzil') return?",
      options: ["5", "6", "7", "8"],
      answerKey: "6",
    },
  ];

  for (const [index, question] of questions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        prompt: question.prompt,
        options: question.options,
        answerKey: question.answerKey,
        order: index + 1,
        quizId: quiz.id,
      },
    });
  }

  const studentPassword = await hashPassword("student123");
  const adminPassword = await hashPassword("admin123");

  const student = await prisma.user.create({
    data: {
      name: "Ankit Sharma",
      email: "ankit@demo.com",
      phone: "9876543210",
      passwordHash: studentPassword,
      role: "student",
      walletBalance: 2500,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@demo.com",
      phone: "9999999999",
      passwordHash: adminPassword,
      role: "admin",
    },
  });

  await prisma.enrollment.create({
    data: { userId: student.id, courseId: featured.id, progress: 35 },
  });

  await prisma.lessonProgress.create({
    data: { userId: student.id, lessonId: lessons[0].id, completed: true, watchedSeconds: 540 },
  });

  await prisma.liveClass.create({
    data: {
      title: "Python Doubt Clearing Session",
      startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      courseId: featured.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: "Variables Practice Set",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "pending",
      userId: student.id,
      courseId: featured.id,
    },
  });

  for (let i = 0; i < 5; i++) {
    await prisma.attendanceRecord.create({
      data: {
        userId: student.id,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        status: i === 2 ? "absent" : "present",
        courseId: featured.id,
      },
    });
  }

  await prisma.announcement.createMany({
    data: [
      { title: "New live class schedule published", body: "Check your dashboard for updated timings." },
      { title: "Assignment deadline reminder", body: "Submit pending assignments before Friday." },
    ],
  });

  await prisma.partner.createMany({
    data: [
      { name: "Amity" },
      { name: "Manipal" },
      { name: "LPU" },
      { name: "IGNOU" },
      { name: "NMIMS" },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Riya Patel",
        role: "MBA Graduate",
        quote: "MANZILCHASER helped me compare universities and enroll with confidence.",
      },
      {
        name: "Karan Mehta",
        role: "Software Engineer",
        quote: "The learning dashboard and mentor support made upskilling practical.",
      },
    ],
  });

  await prisma.lead.create({
    data: {
      name: "Sample Lead",
      email: "lead@demo.com",
      phone: "9000000001",
      source: "homepage",
      status: "new",
    },
  });

  console.log("Seed complete");
  console.log("Student: ankit@demo.com / student123 / 9876543210");
  console.log("Admin: admin@demo.com / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
