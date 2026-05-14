"use client";

import { useState } from "react";
import { api } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function CheckoutButton({
  courseSlug,
  amount,
  purpose = "enrollment",
}: {
  courseSlug?: string;
  amount: number;
  purpose?: "enrollment" | "wallet_topup";
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const checkout = async () => {
    setLoading(true);
    setMessage("");
    try {
      const order = await api<{
        paymentId: string;
        orderId: string;
        amount: number;
        keyId: string;
        mock?: boolean;
      }>("/api/v1/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ courseSlug, amount, purpose }),
      });

      if (order.mock) {
        await api("/api/v1/payments/verify", {
          method: "POST",
          body: JSON.stringify({
            paymentId: order.paymentId,
            razorpay_order_id: order.orderId,
            razorpay_payment_id: `mock_${order.paymentId}`,
            razorpay_signature: "mock",
          }),
        });
        setMessage("Mock payment successful. Enrollment updated.");
        return;
      }

      const loaded = await loadScript();
      if (!loaded || !window.Razorpay) throw new Error("Unable to load Razorpay");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount * 100,
        currency: "INR",
        name: "MANZILCHASER",
        description: purpose === "wallet_topup" ? "Wallet top-up" : "Course enrollment",
        order_id: order.orderId,
        handler: async (response: Record<string, string>) => {
          await api("/api/v1/payments/verify", {
            method: "POST",
            body: JSON.stringify({
              paymentId: order.paymentId,
              ...response,
            }),
          });
          setMessage("Payment successful.");
        },
      });
      rzp.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn-primary w-full" onClick={checkout} disabled={loading}>
        {loading ? "Processing..." : purpose === "wallet_topup" ? "Top Up Wallet" : "Enroll Now"}
      </button>
      {message ? <p className="mt-2 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
