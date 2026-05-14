import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createOrderSchema } from "@manzilchaser/shared";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/errors";
import { AuthedRequest, requireAuth } from "../middleware/auth";

const router = Router();

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

router.post(
  "/create-order",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const data = createOrderSchema.parse(req.body);
    let amount = data.amount ?? 0;
    let courseId: string | undefined;

    if (data.courseSlug) {
      const course = await prisma.course.findUnique({ where: { slug: data.courseSlug } });
      if (!course) throw new AppError(404, "NOT_FOUND", "Course not found");
      amount = course.fee;
      courseId = course.id;
    }

    if (!amount) throw new AppError(400, "INVALID_AMOUNT", "Amount is required");

    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        courseId,
        amount,
        purpose: data.purpose,
        status: "created",
      },
    });

    const razorpay = getRazorpay();
    if (!razorpay) {
      const mockOrderId = `order_mock_${payment.id}`;
      await prisma.payment.update({
        where: { id: payment.id },
        data: { razorpayOrderId: mockOrderId },
      });
      return res.json({
        paymentId: payment.id,
        orderId: mockOrderId,
        amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
        mock: true,
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: payment.id,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: order.id },
    });

    res.json({
      paymentId: payment.id,
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  })
);

router.post(
  "/verify",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.userId !== req.user!.id) {
      throw new AppError(404, "NOT_FOUND", "Payment not found");
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
      if (expected !== razorpay_signature) {
        throw new AppError(400, "INVALID_SIGNATURE", "Payment verification failed");
      }
    }

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "paid",
        razorpayOrderId: razorpay_order_id ?? payment.razorpayOrderId,
        razorpayPaymentId: razorpay_payment_id ?? `mock_pay_${payment.id}`,
        razorpaySignature: razorpay_signature ?? "mock",
      },
    });

    if (updated.purpose === "enrollment" && updated.courseId) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: updated.userId, courseId: updated.courseId } },
        update: {},
        create: { userId: updated.userId, courseId: updated.courseId },
      });
    }

    if (updated.purpose === "wallet_topup") {
      await prisma.user.update({
        where: { id: updated.userId },
        data: { walletBalance: { increment: updated.amount } },
      });
      await prisma.walletTransaction.create({
        data: {
          userId: updated.userId,
          amount: updated.amount,
          type: "credit",
          note: "Wallet top-up",
        },
      });
    }

    res.json({ payment: updated });
  })
);

router.post(
  "/webhook",
  asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (signature !== expected) {
      throw new AppError(400, "INVALID_SIGNATURE", "Webhook signature mismatch");
    }
  }

  const event = req.body?.event;
  const paymentEntity = req.body?.payload?.payment?.entity;
  if (event === "payment.captured" && paymentEntity?.order_id) {
    await prisma.payment.updateMany({
      where: { razorpayOrderId: paymentEntity.order_id },
      data: {
        status: "paid",
        razorpayPaymentId: paymentEntity.id,
      },
    });
  }

  res.json({ received: true });
  })
);

export default router;
