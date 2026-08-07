import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icons";
import { getProvider } from "@/lib/data";

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProvider(id);
  if (!p) notFound();

  return (
    <main className="screen">
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>
          {p.businessName.slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 18, color: "var(--navy)" }}>{p.businessName}</b>
          <div className="recs">
            يوصي به {p.recommendationsCount} مالكًا{p.verified && <span> · موثّق</span>}
          </div>
        </div>
      </div>

      {p.bio && <p style={{ fontSize: 14.5, color: "var(--muted)" }}>{p.bio}</p>}

      <div className="nums" style={{ margin: "12px 0" }}>
        <div>
          <b>{p.yearsExperience ?? "—"}</b>
          <span>سنة خبرة</span>
        </div>
        <div>
          <b>{p.recommendationsCount}</b>
          <span>توصية</span>
        </div>
        <div>
          <b>{p.commitmentPct ? `${p.commitmentPct}%` : "—"}</b>
          <span>التزام بالمواعيد</span>
        </div>
      </div>

      <div className="badges">
        {p.scaMembership && (
          <span className="badge v">
            <Icon name="check" className="i sm" /> عضو هيئة المقاولين — {p.scaMembership}
          </span>
        )}
        {p.enterpriseSize && <span className="badge">{p.enterpriseSize}</span>}
        <span className="badge">
          نطاق العمل: {p.districts.join("، ")} — {p.city}
        </span>
        {p.workHours && <span className="badge hrs">يرد من {p.workHours}</span>}
      </div>

      {p.tools.length > 0 && (
        <>
          <div className="sechead">
            <h2>الأدوات والمعدات</h2>
          </div>
          <div className="badges">
            {p.tools.map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="warn">
        <b>تنبيه:</b> صور الأعمال يرفعها المزوّد ولا يمكن للمنصة التأكد منها — ما عدا
        الموسومة «موثّقة» فهي من مشاريع تمت عبر جدار.
      </div>

      {p.phone && (
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}
        >
          <Icon name="phone" />
          <b
            style={{
              flex: 1,
              fontSize: 18,
              color: "var(--navy)",
              direction: "ltr",
              textAlign: "end",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {p.phone}
          </b>
          <a
            href={`https://wa.me/966${p.phone.replace(/\D/g, "").replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{ background: "var(--wa)", color: "#fff" }}
          >
            واتساب
          </a>
        </div>
      )}

      <div style={{ height: 12 }} />
      <div className="row">
        <Link href={`/chat?provider=${p.id}`} className="btn btn-navy btn-sm">
          راسله
        </Link>
        <Link href={`/chat?provider=${p.id}`} className="btn btn-ghost btn-sm">
          اطلب موعدًا
        </Link>
      </div>
    </main>
  );
}
