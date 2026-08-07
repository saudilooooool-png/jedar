import Link from "next/link";
import { Icon } from "@/components/Icons";
import { StageTimeline } from "@/components/StageTimeline";
import { getCurrentProject, getPrices, getServiceOffers } from "@/lib/data";

export default async function WallPage() {
  const [project, serviceOffers, prices] = await Promise.all([
    getCurrentProject(),
    getServiceOffers(),
    getPrices(),
  ]);

  if (!project) {
    return (
      <main className="screen">
        <h1 className="title">أهلًا بك في جدار</h1>
        <p className="sub">سجّل مشروعك وحدد مرحلتك — والعروض بتجيك</p>
        <Link href="/opportunity" className="btn btn-navy">
          أنشئ مشروعك
        </Link>
      </main>
    );
  }

  const typeLabel: Record<string, string> = {
    villa: "فيلا",
    building: "عمارة",
    istiraha: "استراحة",
    renovation: "ترميم",
    finishing: "تشطيب",
    annex: "ملحق",
    mosque_waqf: "مسجد / وقف",
  };
  const currentStage = project.stages.find((s) => s.no === project.currentStageNo);

  return (
    <main className="screen">
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: "var(--navy)" }}>{project.title}</div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>
          حي {project.district}، {project.city} · {typeLabel[project.type] ?? project.type}
          {project.landArea ? ` · ${project.landArea} م²` : ""}
        </div>
      </div>

      <StageTimeline stages={project.stages} currentNo={project.currentStageNo} />

      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 8 }}>
        <Link href="/browse" className="btn btn-navy">
          <Icon name="search" />
          تصفّح مقاولي {currentStage ? `«${currentStage.name}»` : "المرحلة"}
        </Link>
        <Link href="/opportunity" className="btn btn-ghost">
          <Icon name="horn" />
          اطرح فرصتك — استقبل العروض
        </Link>
      </div>

      {serviceOffers.length > 0 && (
        <>
          <div className="sechead">
            <h2>عروض هذا الأسبوع في حيّك</h2>
          </div>
          {serviceOffers.map((s) => (
            <article key={s.id} className="pcard card">
              <div className="top">
                <div className="avatar">{s.providerName.slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: "var(--navy)", fontSize: 15.5 }}>{s.title}</b>
                  <div style={{ color: "var(--muted)", fontSize: 13.5 }}>
                    {s.providerName}
                    {s.description ? ` · ${s.description}` : ""}
                    {s.price ? ` · ${s.price.toLocaleString("ar-SA")} ريال` : ""}
                  </div>
                </div>
              </div>
              <div className="badges">
                {s.verified && (
                  <span className="badge v">
                    <Icon name="check" className="i sm" /> موثّق
                  </span>
                )}
                <span className="badge">عرض واحد نشط لكل مزوّد</span>
              </div>
            </article>
          ))}
        </>
      )}

      <div className="sechead">
        <h2>أسعار المواد بالرياض</h2>
      </div>
      <div className="card" style={{ padding: 13 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
          <tbody>
            {prices.map((r) => (
              <tr key={r.material}>
                <td style={{ padding: "7px 0", borderBottom: "1px solid var(--line)" }}>
                  {r.material} ({r.unit})
                </td>
                <td
                  style={{
                    padding: "7px 0",
                    borderBottom: "1px solid var(--line)",
                    textAlign: "left",
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {r.price.toLocaleString("ar-SA")} ريال{" "}
                  <span
                    style={{
                      fontSize: 12.5,
                      color: r.changePct <= 0 ? "var(--green)" : "var(--danger)",
                    }}
                  >
                    {r.changePct <= 0 ? "▼" : "▲"} {Math.abs(r.changePct)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
