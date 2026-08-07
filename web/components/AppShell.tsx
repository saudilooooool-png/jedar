"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrickLogo, Icon, type IconName } from "@/components/Icons";

const TABS: { href: string; icon: IconName; label: string }[] = [
  { href: "/wall", icon: "home", label: "جداري" },
  { href: "/browse", icon: "search", label: "تصفّح" },
  { href: "/opportunity", icon: "horn", label: "فرصتي" },
  { href: "/chat", icon: "chat", label: "محادثات" },
  { href: "/account", icon: "user", label: "حسابي" },
];

export function AppShell({
  children,
  demo,
}: {
  children: React.ReactNode;
  demo: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      {demo && (
        <div className="demo-banner">
          وضع تجريبي — اربط Supabase في ‎.env.local لتفعيل الحسابات والبيانات الحقيقية
        </div>
      )}
      <header className="bar">
        <Link href="/wall" className="logo">
          <BrickLogo />
          <span>جدار</span>
        </Link>
        <div className="spacer" />
      </header>
      {children}
      <nav className="tabs" aria-label="التنقل الرئيسي">
        {TABS.map((t) => {
          const selected = pathname.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={`tab${selected ? " sel" : ""}`}>
              <Icon name={t.icon} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
