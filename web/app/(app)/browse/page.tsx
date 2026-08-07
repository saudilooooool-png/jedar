import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { getProviders } from "@/lib/data";

const SPECIALTIES = ["الكل", "سباكة", "كهرباء", "تكييف", "توريد مواد"];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const specialty = s && SPECIALTIES.includes(s) ? s : "الكل";
  const providers = await getProviders(specialty);

  return (
    <main className="screen">
      <h1 className="title">مقاولو مرحلتك: التمديدات</h1>
      <p className="sub">الأقرب لك في حي النرجس — {providers.length} مزوّد</p>

      <div className="filters">
        {SPECIALTIES.map((f) => (
          <Link
            key={f}
            href={f === "الكل" ? "/browse" : `/browse?s=${encodeURIComponent(f)}`}
            className={`fchip${f === specialty ? " sel" : ""}`}
          >
            {f}
          </Link>
        ))}
      </div>

      {providers.map((p) => (
        <ProviderCard key={p.id} provider={p} />
      ))}
      {providers.length === 0 && (
        <div className="note">لا يوجد مزوّدون في هذا التخصص بعد — جرّب تخصصًا آخر.</div>
      )}
    </main>
  );
}
