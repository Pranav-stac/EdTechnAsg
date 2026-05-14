"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: Props) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [mode, setMode] = useState<"login" | "otp">("login");
  const [identifier, setIdentifier] = useState("ankit@demo.com");
  const [password, setPassword] = useState("student123");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    setTab("login");
    setMode("login");
    setMessage("");
  }, [open]);

  useEffect(() => {
    if (!resendIn) return;
    const timer = setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  if (!open) return null;

  const completeLogin = async (role: string) => {
    await refresh();
    onClose();
    router.push(role === "admin" ? "/admin" : "/student");
  };

  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await api<{ user: { role: string } }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });
      await completeLogin(data.user.role);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await api<{ devOtp?: string }>("/api/v1/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ identifier }),
      });
      setMode("otp");
      setResendIn(30);
      if (data.devOtp) setMessage(`Development OTP: ${data.devOtp}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP request failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await api<{ user: { role: string } }>("/api/v1/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ identifier, otp: otp.join("") }),
      });
      await completeLogin(data.user.role);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const onOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setOtp(pasted.split("").concat(Array(6).fill("")).slice(0, 6));
  };

  return (
    <motionAuthModalOverlay onClose={onClose}>
      <div className="grid overflow-hidden rounded-3xl bg-white shadow-panel lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[560px] bg-hero-grid p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">MANZILCHASER</p>
            <h2 className="mt-6 text-3xl font-bold leading-tight">Learn with confidence. Grow with mentors.</h2>
            <p className="mt-4 max-w-sm text-blue-100">
              Access live classes, placement support, and guided admissions from one student-first platform.
            </p>
          </div>
          <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/15">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
              alt="Student learning illustration"
              width={900}
              height={700}
              className="h-56 w-full object-cover"
            />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{mode === "otp" ? "Verify Your Number" : "Welcome back"}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {mode === "otp" ? "Enter the 6-digit code sent to your mobile." : "Login or sign up to continue learning."}
              </p>
            </div>
            <button onClick={onClose} className="rounded-xl border border-surface-line px-3 py-1 text-sm text-slate-500">
              Close
            </button>
          </div>

          {mode === "login" ? (
            <>
              <div className="mb-6 grid grid-cols-2 rounded-2xl bg-surface-muted p-1">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === "login" ? "bg-white text-brand shadow-sm" : "text-slate-600"}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === "signup" ? "bg-white text-brand shadow-sm" : "text-slate-600"}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Email or mobile
                  <input className="input mt-2" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                </label>
                <button className="btn-primary w-full" disabled={loading}>
                  {loading ? "Signing in..." : tab === "signup" ? "Create account" : "Login"}
                </button>
                <button type="button" className="btn-secondary w-full" onClick={requestOtp} disabled={loading}>
                  Login with OTP
                </button>
              </form>
            </>
          ) : (
            <OtpForm
              otp={otp}
              onOtpChange={onOtpChange}
              onOtpPaste={onOtpPaste}
              inputsRef={inputsRef}
              verifyOtp={verifyOtp}
              requestOtp={requestOtp}
              resendIn={resendIn}
              loading={loading}
              setMode={setMode}
            />
          )}

          {message ? <p className="mt-4 rounded-xl bg-brand-light px-4 py-3 text-sm text-brand-navy">{message}</p> : null}
        </div>
      </div>
    </motionAuthModalOverlay>
  );
}

function AuthModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function OtpForm({
  otp,
  onOtpChange,
  onOtpPaste,
  inputsRef,
  verifyOtp,
  requestOtp,
  resendIn,
  loading,
  setMode,
}: {
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
  onOtpPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  inputsRef: React.MutableRefObject<Array<HTMLInputElement | null>>;
  verifyOtp: () => void;
  requestOtp: () => void;
  resendIn: number;
  loading: boolean;
  setMode: (mode: "login" | "otp") => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-6 gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            className="input text-center text-lg font-semibold"
            value={digit}
            onChange={(event) => onOtpChange(index, event.target.value)}
            onPaste={onOtpPaste}
            inputMode="numeric"
            maxLength={1}
          />
        ))}
      </div>
      <button className="btn-primary w-full" onClick={verifyOtp} disabled={loading}>
        Verify OTP
      </button>
      <motionOtpFormFooter requestOtp={requestOtp} resendIn={resendIn} setMode={setMode} />
    </div>
  );
}

function OtpFormFooter({
  requestOtp,
  resendIn,
  setMode,
}: {
  requestOtp: () => void;
  resendIn: number;
  setMode: (mode: "login" | "otp") => void;
}) {
  return (
    <motionOtpFormFooterInner requestOtp={requestOtp} resendIn={resendIn} setMode={setMode} />
  );
}

function OtpFormFooterInner({
  requestOtp,
  resendIn,
  setMode,
}: {
  requestOtp: () => void;
  resendIn: number;
  setMode: (mode: "login" | "otp") => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm text-slate-600">
      <button type="button" onClick={() => setMode("login")}>
        Change number
      </button>
      <button type="button" onClick={requestOtp} disabled={resendIn > 0}>
        {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
      </button>
    </div>
  );
}

const motionAuthModalOverlay = AuthModalOverlay;
const motionOtpFormFooter = OtpFormFooter;
const motionOtpFormFooterInner = OtpFormFooterInner;
