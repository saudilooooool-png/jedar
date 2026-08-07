"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BrickLogo } from "@/components/Icons";
import {
  requestCode,
  verifyCode,
  type RequestState,
  type VerifyState,
} from "./actions";

const requestInitial: RequestState = { sentTo: null, error: null };
const verifyInitial: VerifyState = { error: null };

export default function LoginPage() {
  const [reqState, reqAction, reqPending] = useActionState(requestCode, requestInitial);
  const [verState, verAction, verPending] = useActionState(verifyCode, verifyInitial);

  return (
    <div className="app-shell">
      <main className="screen" style={{ paddingTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <BrickLogo size={34} />
          <b style={{ fontSize: 26, color: "var(--navy)" }}>جدار</b>
        </div>

        <h1 className="title">سجّل دخولك</h1>
        <p className="sub">بالبريد الإلكتروني — نرسل لك رمز تحقق، بدون كلمات مرور</p>

        {reqState.sentTo === null ? (
          <form action={reqAction}>
            <div className="field">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                dir="ltr"
                placeholder="you@example.com"
                required
              />
            </div>
            {reqState.error && (
              <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 10 }}>
                {reqState.error}
              </p>
            )}
            <button type="submit" className="btn btn-navy" disabled={reqPending}>
              {reqPending ? "جارٍ الإرسال…" : "أرسل رمز التحقق"}
            </button>
          </form>
        ) : (
          <form action={verAction}>
            <p className="note">
              أرسلنا رمزًا إلى <b dir="ltr">{reqState.sentTo}</b>
            </p>
            <input type="hidden" name="email" value={reqState.sentTo} />
            <div className="field">
              <label htmlFor="code">رمز التحقق</label>
              <input
                id="code"
                name="code"
                inputMode="numeric"
                dir="ltr"
                placeholder="123456"
                required
              />
            </div>
            {verState.error && (
              <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 10 }}>
                {verState.error}
              </p>
            )}
            <button type="submit" className="btn btn-navy" disabled={verPending}>
              {verPending ? "جارٍ التحقق…" : "تأكيد الدخول"}
            </button>
          </form>
        )}

        <div style={{ height: 14 }} />
        <Link href="/wall" className="btn btn-ghost">
          أتصفح بس — بدون تسجيل
        </Link>
      </main>
    </div>
  );
}
