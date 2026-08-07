"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export type RequestState = { sentTo: string | null; error: string | null };
export type VerifyState = { error: string | null };

export async function requestCode(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) {
    return { sentTo: null, error: "اكتب بريدًا إلكترونيًا صحيحًا" };
  }
  if (!isSupabaseConfigured) redirect("/wall");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) return { sentTo: null, error: "تعذر إرسال الرمز — حاول بعد قليل" };
  return { sentTo: email, error: null };
}

export async function verifyCode(
  _prev: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) return { error: "الرمز غير صحيح أو انتهت صلاحيته" };
  redirect("/wall");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
