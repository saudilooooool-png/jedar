import { Icon } from "@/components/Icons";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";

export default async function AccountPage() {
  let email: string | null = null;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }

  return (
    <main className="screen">
      <h1 className="title">حسابي</h1>

      <div className="card" style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 14,
            borderBottom: "1px solid var(--line)",
          }}
        >
          <Icon name="user" />
          <span style={{ flex: 1 }}>{email ?? "زائر تجريبي — مالك"}</span>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>حي النرجس، الرياض</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
          <Icon name="shield" />
          <span style={{ flex: 1 }}>رقم حارس الموقع</span>
          <span style={{ color: "var(--muted)", fontSize: 14, direction: "ltr" }}>
            0559 876 543
          </span>
        </div>
      </div>

      <div className="sechead">
        <h2>خدمات</h2>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        {[
          { icon: "star" as const, label: "خدمة الكونسيرج — منسق يشرف على بناءك" },
          { icon: "shield" as const, label: "توفير حارس للمبنى" },
          { icon: "doc" as const, label: "تمويل مشروعك (قريبًا)" },
          { icon: "horn" as const, label: "جدار أعمال — منافسات المنشآت (قريبًا)" },
        ].map((r, i, arr) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
            }}
          >
            <Icon name={r.icon} />
            <span style={{ flex: 1 }}>{r.label}</span>
            <span style={{ color: "var(--grey)" }}>‹</span>
          </div>
        ))}
      </div>

      {isSupabaseConfigured ? (
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost">
            تسجيل الخروج
          </button>
        </form>
      ) : (
        <div className="note">
          <b>وضع تجريبي:</b> اربط مشروع Supabase في ‎<code>.env.local</code> لتفعيل التسجيل
          الحقيقي بالبريد، وحفظ المشاريع والمحادثات في قاعدة البيانات.
        </div>
      )}
    </main>
  );
}
