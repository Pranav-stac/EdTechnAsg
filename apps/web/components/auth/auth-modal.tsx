"use client";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="card w-full max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{mode === "login" ? "Login" : "Verify Your Number"}</h2>
          <button onClick={onClose} className="text-slate-500">
            Close
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <input className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email or mobile" />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
            <button type="button" className="btn-secondary w-full" onClick={requestOtp} disabled={loading}>
              Login with OTP
            </button>
          </form>
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

        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
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
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            className="input text-center"
            value={digit}
            onChange={(event) => onOtpChange(index, event.target.value)}
            onPaste={onOtpPaste}
            inputMode="numeric"
          />
        ))}
      </div>
      <button className="btn-primary w-full" onClick={verifyOtp} disabled={loading}>
        Verify OTP
      </button>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <button type="button" onClick={() => setMode("login")}>
          Change number
        </button>
        <button type="button" onClick={requestOtp} disabled={resendIn > 0}>
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

const motionOtpForm = OtpForm;
