import { Router } from "express";
import { loginSchema, otpRequestSchema, otpVerifySchema, profileUpdateSchema } from "@manzilchaser/shared";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/errors";
import { comparePassword, generateOtp, hashOtp, hashPassword } from "../lib/crypto";
import { signToken } from "../lib/jwt";
import { AuthedRequest, requireAuth } from "../middleware/auth";

const router = Router();

const authCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res: Parameters<typeof router.post>[1] extends never ? never : any, token: string) {
  res.cookie("token", token, authCookieOptions);
}

router.post(
  "/otp/request",
  asyncHandler(async (req, res) => {
    const { identifier } = otpRequestSchema.parse(req.body);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Learner",
          email: identifier.includes("@") ? identifier : null,
          phone: identifier.includes("@") ? null : identifier,
          role: "student",
        },
      });
    }

    await prisma.otpChallenge.create({
      data: {
        identifier,
        otpHash: hashOtp(otp),
        expiresAt,
        userId: user.id,
      },
    });

    const payload: Record<string, unknown> = { message: "OTP sent" };
    if (process.env.NODE_ENV !== "production") {
      payload.devOtp = otp;
      console.log(`[DEV OTP] ${identifier}: ${otp}`);
    }

    res.json(payload);
  })
);

router.post(
  "/otp/verify",
  asyncHandler(async (req, res) => {
    const { identifier, otp } = otpVerifySchema.parse(req.body);
    const challenge = await prisma.otpChallenge.findFirst({
      where: { identifier },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    if (!challenge || challenge.expiresAt < new Date()) {
      throw new AppError(400, "OTP_EXPIRED", "OTP expired or not found");
    }

    if (challenge.otpHash !== hashOtp(otp)) {
      await prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      throw new AppError(400, "OTP_INVALID", "Invalid OTP");
    }

    const user = challenge.user!;
    const token = signToken({ sub: user.id, role: user.role, name: user.name });
    setAuthCookie(res, token);
    res.json({ user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone } });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { identifier, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user?.passwordHash || !(await comparePassword(password, user.passwordHash))) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    const token = signToken({ sub: user.id, role: user.role, name: user.name });
    setAuthCookie(res, token);
    res.json({ user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone } });
  })
);

router.post("/logout", (_req, res) => {
  res.clearCookie("token", authCookieOptions);
  res.json({ message: "Logged out" });
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError(404, "NOT_FOUND", "User not found");
    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance,
      },
    });
  })
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const data = profileUpdateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: data.name,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
      },
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance,
      },
    });
  })
);

export default router;
