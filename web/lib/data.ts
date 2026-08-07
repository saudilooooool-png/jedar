import { isSupabaseConfigured } from "@/lib/config";
import {
  demoMessages,
  demoOpportunity,
  demoPrices,
  demoProject,
  demoProviders,
  demoServiceOffers,
} from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type {
  ChatMessage,
  Opportunity,
  PriceRow,
  Project,
  Provider,
  ServiceOffer,
} from "@/lib/types";

/**
 * طبقة البيانات الوحيدة للتطبيق.
 * مع Supabase مهيأ تقرأ من قاعدة البيانات الحقيقية (بحساب المستخدم وRLS)،
 * وبدونه تعيد بيانات الوضع التجريبي حتى يعمل التطبيق فورًا.
 */

export async function getCurrentProject(): Promise<Project | null> {
  if (!isSupabaseConfigured) return demoProject;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: project } = await supabase
    .from("projects")
    .select("id,title,type,city,district,land_area,built_area,floors,current_stage_no")
    .eq("owner_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!project) return null;

  const { data: stages } = await supabase
    .from("project_stages")
    .select("stage_no,name,state")
    .eq("project_id", project.id)
    .order("stage_no");

  return {
    id: project.id,
    title: project.title,
    type: project.type,
    city: project.city,
    district: project.district,
    landArea: project.land_area,
    builtArea: project.built_area,
    floors: project.floors,
    currentStageNo: project.current_stage_no,
    stages: (stages ?? []).map((s) => ({
      no: s.stage_no,
      name: s.name,
      state: s.state === "done" ? "done" : s.state === "active" ? "active" : "locked",
    })),
  };
}

export async function getProviders(specialty?: string): Promise<Provider[]> {
  if (!isSupabaseConfigured) {
    return specialty && specialty !== "الكل"
      ? demoProviders.filter((p) => p.specialties.includes(specialty))
      : demoProviders;
  }

  const supabase = await createClient();
  let query = supabase
    .from("providers")
    .select(
      "id,business_name,kind,bio,specialties,tools,city,districts,sla,work_hours,status,sca_membership,enterprise_size,years_experience,recommendations_count,commitment_pct,phone:profiles(phone)",
    )
    .eq("status", "active")
    .order("recommendations_count", { ascending: false })
    .limit(30);
  if (specialty && specialty !== "الكل") query = query.contains("specialties", [specialty]);

  const { data } = await query;
  return (data ?? []).map((p) => ({
    id: p.id,
    businessName: p.business_name,
    kind: p.kind,
    bio: p.bio,
    specialties: p.specialties ?? [],
    tools: p.tools ?? [],
    city: p.city,
    districts: p.districts ?? [],
    distanceKm: null,
    sla: p.sla,
    workHours: p.work_hours,
    verified: p.status === "active",
    scaMembership: p.sca_membership,
    enterpriseSize: p.enterprise_size,
    yearsExperience: p.years_experience,
    recommendationsCount: p.recommendations_count ?? 0,
    commitmentPct: p.commitment_pct,
    phone: Array.isArray(p.phone) ? (p.phone[0]?.phone ?? null) : null,
  }));
}

export async function getProvider(id: string): Promise<Provider | null> {
  const all = await getProviders();
  return all.find((p) => p.id === id) ?? null;
}

export async function getMyOpportunity(): Promise<Opportunity | null> {
  if (!isSupabaseConfigured) return demoOpportunity;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: opp } = await supabase
    .from("opportunities")
    .select("id,stage_no,scope,budget_min,budget_max,note,state,projects!inner(owner_id,type)")
    .eq("projects.owner_id", auth.user.id)
    .eq("state", "open")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!opp) return null;

  const { data: stage } = await supabase
    .from("stage_templates")
    .select("name")
    .eq("project_type", (opp.projects as unknown as { type: string }).type)
    .eq("stage_no", opp.stage_no)
    .maybeSingle();

  const { data: offers } = await supabase
    .from("offers")
    .select("id,provider_id,total,scope,duration_days,invoice_url,note,state,providers(business_name,recommendations_count)")
    .eq("opportunity_id", opp.id)
    .order("created_at");

  return {
    id: opp.id,
    stageNo: opp.stage_no,
    stageName: stage?.name ?? `المرحلة ${opp.stage_no}`,
    scope: opp.scope,
    budgetMin: opp.budget_min,
    budgetMax: opp.budget_max,
    note: opp.note,
    state: opp.state,
    offers: (offers ?? []).map((o) => {
      const prov = o.providers as unknown as {
        business_name: string;
        recommendations_count: number;
      } | null;
      return {
        id: o.id,
        providerId: o.provider_id,
        providerName: prov?.business_name ?? "مزوّد",
        recommendationsCount: prov?.recommendations_count ?? 0,
        total: o.total,
        scope: o.scope,
        durationDays: o.duration_days,
        invoiceUrl: o.invoice_url,
        note: o.note,
        state: o.state,
      };
    }),
  };
}

export async function getServiceOffers(): Promise<ServiceOffer[]> {
  if (!isSupabaseConfigured) return demoServiceOffers;

  const supabase = await createClient();
  const { data } = await supabase
    .from("service_offers")
    .select("id,specialty,title,description,price,providers(business_name,status)")
    .eq("active", true)
    .gt("expires_at", new Date().toISOString())
    .limit(5);
  return (data ?? []).map((s) => {
    const prov = s.providers as unknown as { business_name: string; status: string } | null;
    return {
      id: s.id,
      providerName: prov?.business_name ?? "مزوّد",
      specialty: s.specialty,
      title: s.title,
      description: s.description,
      price: s.price,
      verified: prov?.status === "active",
    };
  });
}

export async function getPrices(city = "الرياض"): Promise<PriceRow[]> {
  if (!isSupabaseConfigured) return demoPrices;

  const supabase = await createClient();
  const { data } = await supabase
    .from("price_index")
    .select("material,unit,price,change_pct")
    .eq("city", city)
    .order("week", { ascending: false })
    .limit(8);
  return (data ?? []).map((r) => ({
    material: r.material,
    unit: r.unit,
    price: Number(r.price),
    changePct: Number(r.change_pct),
  }));
}

export async function getDemoMessages(): Promise<ChatMessage[]> {
  return demoMessages;
}
