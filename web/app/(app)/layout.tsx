import { AppShell } from "@/components/AppShell";
import { isSupabaseConfigured } from "@/lib/config";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell demo={!isSupabaseConfigured}>{children}</AppShell>;
}
