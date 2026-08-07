import Link from "next/link";
import { Icon } from "@/components/Icons";
import type { Provider } from "@/lib/types";

export function ProviderCard({ provider }: { provider: Provider }) {
  const initials = provider.businessName.slice(0, 2);
  return (
    <article className="pcard card">
      <div className="top">
        <div className="avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b style={{ fontSize: "16.5px", display: "block", color: "var(--navy)" }}>
            {provider.businessName}
          </b>
          <div className="recs">
            يوصي به {provider.recommendationsCount} {provider.recommendationsCount === 1 ? "مالك" : "مالكًا"}
            {provider.verified && <span> · موثّق</span>}
          </div>
        </div>
      </div>
      <div className="badges">
        {provider.verified && (
          <span className="badge v">
            <Icon name="check" className="i sm" /> موثّق
          </span>
        )}
        {provider.scaMembership && (
          <span className="badge v">عضو هيئة المقاولين</span>
        )}
        {provider.workHours && <span className="badge hrs">يرد من {provider.workHours}</span>}
        {provider.distanceKm !== null && <span className="badge">{provider.distanceKm} كم</span>}
        {provider.yearsExperience !== null && (
          <span className="badge">خبرة {provider.yearsExperience} سنة</span>
        )}
      </div>
      <div className="acts">
        <Link href={`/browse/${provider.id}`} className="btn btn-navy btn-sm">
          عرض الملف
        </Link>
        <Link href={`/chat?provider=${provider.id}`} className="btn btn-ghost btn-sm">
          راسله
        </Link>
      </div>
    </article>
  );
}
