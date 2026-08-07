import Link from "next/link";
import { getMyOpportunity } from "@/lib/data";

const SCOPE_LABEL: Record<string, string> = {
  stage: "هذه المرحلة فقط",
  structure: "عظم",
  turnkey: "تسليم مفتاح",
};
const OFFER_SCOPE_LABEL: Record<string, string> = {
  without_materials: "بدون مواد",
  with_materials: "شامل المواد",
  materials_only: "مواد فقط",
};

export default async function OpportunityPage() {
  const opp = await getMyOpportunity();

  if (!opp) {
    return (
      <main className="screen">
        <h1 className="title">فرصتي</h1>
        <p className="sub">ما عندك فرصة مطروحة حاليًا — اطرح فرصتك والعروض بتجيك</p>
        <Link href="/wall" className="btn btn-navy">
          ارجع لجداري
        </Link>
      </main>
    );
  }

  return (
    <main className="screen">
      <h1 className="title">فرصتي والعروض</h1>

      <div
        className="card"
        style={{ padding: 14, marginBottom: 14, borderInlineStart: "4px solid var(--navy)" }}
      >
        <b style={{ color: "var(--navy)" }}>
          {opp.stageName} — {SCOPE_LABEL[opp.scope]}
        </b>
        <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 3 }}>
          {opp.budgetMin && opp.budgetMax
            ? `الميزانية: ${opp.budgetMin.toLocaleString("ar-SA")} – ${opp.budgetMax.toLocaleString("ar-SA")} ريال · `
            : ""}
          وصلك <b style={{ color: "var(--accent)" }}>{opp.offers.length} عروض</b> · الطلب مفتوح
          حتى تقفله
        </div>
        {opp.note && (
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{opp.note}</div>
        )}
      </div>

      {opp.offers.map((o) => (
        <article key={o.id} className="offer card">
          <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
            <div className="avatar">{o.providerName.slice(0, 2)}</div>
            <div style={{ flex: 1 }}>
              <b style={{ color: "var(--navy)" }}>{o.providerName}</b>
              <div className="recs">
                {o.recommendationsCount} توصية
                {o.note && <span> · {o.note}</span>}
              </div>
            </div>
          </div>
          <div className="nums">
            <div>
              <b>{o.total ? o.total.toLocaleString("ar-SA") : "بعد المعاينة"}</b>
              <span>ريال — إجمالي</span>
            </div>
            <div>
              <b>{OFFER_SCOPE_LABEL[o.scope]}</b>
              <span>النطاق</span>
            </div>
            <div>
              <b>{o.durationDays ? `${o.durationDays} يوم` : "—"}</b>
              <span>المدة</span>
            </div>
          </div>
          <div className="row">
            <Link href={`/chat?provider=${o.providerId}`} className="btn btn-navy btn-sm">
              راسله
            </Link>
            {o.invoiceUrl && (
              <a href={o.invoiceUrl} className="btn btn-ghost btn-sm">
                عرض الفاتورة
              </a>
            )}
          </div>
        </article>
      ))}
    </main>
  );
}
