"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!API_URL) {
      setError("ไม่พบ API URL configuration");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          inviteCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141416] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-red-500">
            PORTFOLIO ADMIN
          </p>

          <h1 className="text-3xl font-bold">Create Account</h1>

          <p className="mt-2 text-sm text-gray-400">สมัครบัญชีผู้ดูแลระบบ</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              minLength={12}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 12 characters"
              className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Admin Invite Code
            </label>
            <input
              type="password"
              required
              maxLength={256}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter your secret invite code"
              className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-700 py-3 font-semibold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-red-500 hover:text-red-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
