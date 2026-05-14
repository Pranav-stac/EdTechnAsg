import { CheckoutButton } from "@/components/payments/checkout-button";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function StudentWalletPage() {
  const data = await api<{ user: { walletBalance: number } }>("/api/v1/auth/me");
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
