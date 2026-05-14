"use client";

import { CheckoutButton } from "@/components/payments/checkout-button";
import { useAsyncApi } from "@/lib/use-async-api";
import { formatCurrency } from "@/lib/utils";

export default function StudentWalletPage() {
  const { data, loading, error } = useAsyncApi<{ user: { walletBalance: number } }>("/api/v1/auth/me");

  if (loading) return <p className="text-sm text-slate-600">Loading wallet...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load wallet."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">My Wallet</h1>
      <p className="mt-4 text-3xl font-bold text-brand">{formatCurrency(data.user.walletBalance || 0)}</p>
      <div className="mt-6 max-w-sm">
        <CheckoutButton amount={1000} purpose="wallet_topup" />
      </div>
    </div>
  );
}
