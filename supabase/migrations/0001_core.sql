-- جدار — المخطط الأساسي (يطبق docs/02-tech.md + docs/05-ops.md)
-- يعتمد على auth.users من Supabase Auth (تسجيل بالبريد).

create extension if not exists postgis;

-- ============ الأنواع ============
create type user_role as enum ('owner', 'provider', 'both');
create type provider_kind as enum ('company', 'resident_pro', 'guard', 'day_laborer', 'supplier');
create type provider_status as enum ('pending', 'needs_docs', 'active', 'suspended', 'rejected');
create type response_sla as enum ('hour', 'day');
create type project_type as enum ('villa', 'building', 'istiraha', 'renovation', 'finishing', 'annex', 'mosque_waqf');
create type stage_state as enum ('locked', 'active', 'done');
create type opportunity_state as enum ('open', 'closed', 'archived');
create type offer_scope as enum ('without_materials', 'with_materials', 'materials_only');
create type offer_state as enum ('submitted', 'seen', 'shortlisted', 'accepted', 'rejected', 'closed');
create type appointment_kind as enum ('site_visit', 'measurement');
create type appointment_state as enum ('proposed', 'confirmed', 'done', 'cancelled');
create type report_reason as enum ('spam', 'misleading', 'impersonation', 'off_platform_payment', 'other');

-- ============ المستخدمون ============
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role user_role not null default 'owner',
  phone text,
  city text,
  district text,
  guard_phone text,          -- رقم حارس الموقع، يُرسل داخل المحادثات بضغطة
  language text not null default 'ar' check (language in ('ar', 'ur', 'hi', 'bn')),
  created_at timestamptz not null default now()
);

-- ============ قوالب المراحل ============
create table stage_templates (
  project_type project_type not null,
  stage_no int not null,
  name text not null,
  provider_categories text[] not null default '{}',
  primary key (project_type, stage_no)
);

-- ============ المزوّدون ============
create table providers (
  id uuid primary key references profiles (id) on delete cascade,
  kind provider_kind not null,
  status provider_status not null default 'pending',
  business_name text not null,
  bio text,
  years_experience int,
  specialties text[] not null default '{}',
  tools text[] not null default '{}',
  city text not null,
  districts text[] not null default '{}',
  service_center geography (point),
  service_radius_km int not null default 15,
  sla response_sla not null default 'day',
  work_hours text,                       -- مثال: «8ص–6م»
  sca_membership text,                   -- رقم عضوية هيئة المقاولين (اختياري، يُتحقق يدويًا)
  enterprise_size text,                  -- متناهية الصغر/صغيرة/متوسطة
  cr_number text,
  iqama_number text,
  docs jsonb not null default '{}',      -- مسارات مرفقات التوثيق في التخزين
  avatar_url text,
  recommendations_count int not null default 0,
  response_avg_minutes int,
  commitment_pct int,
  created_at timestamptz not null default now()
);

-- ============ المشاريع والمراحل ============
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  title text not null default 'مشروعي',
  type project_type not null,
  city text not null,
  district text not null,
  location geography (point),
  land_area int,
  built_area int,
  floors int,
  current_stage_no int not null default 1,
  created_at timestamptz not null default now()
);

create table project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  stage_no int not null,
  name text not null,
  state stage_state not null default 'locked',
  opened_at timestamptz,
  closed_at timestamptz,
  unique (project_id, stage_no)
);

create table stage_photos (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references project_stages (id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

-- ============ الفرص والعروض ============
create table opportunities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  stage_no int not null,
  scope text not null default 'stage' check (scope in ('stage', 'structure', 'turnkey')),
  budget_min int,
  budget_max int,
  note text,
  requires_plans boolean not null default true,
  requires_code boolean not null default true,
  state opportunity_state not null default 'open',
  auto_archive_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities (id) on delete cascade,
  provider_id uuid not null references providers (id) on delete cascade,
  total int,                               -- المبلغ الإجمالي (بعد المعاينة قد يكون فارغًا مبدئيًا)
  scope offer_scope not null default 'without_materials',
  duration_days int,
  invoice_url text,                        -- فاتورة المورد (اختيارية)
  note text,
  state offer_state not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (opportunity_id, provider_id)
);

-- رصيد عروض الاهتمام الأسبوعي يُحتسب من offers خلال آخر 7 أيام (بدون جدول إضافي).

-- ============ عروض الحي (إعلان خدمة بسعر خاص) ============
create table service_offers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers (id) on delete cascade,
  specialty text not null,
  title text not null,
  description text,
  price int,
  city text not null,
  districts text[] not null default '{}',
  active boolean not null default true,
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);
-- عرض واحد نشط لكل تخصص لكل مزوّد
create unique index one_active_service_offer
  on service_offers (provider_id, specialty) where active;

-- ============ المحادثات ============
create table conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects (id) on delete set null,
  owner_id uuid not null references profiles (id) on delete cascade,
  provider_id uuid not null references providers (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (owner_id, provider_id, project_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  sender_id uuid not null references profiles (id) on delete cascade,
  kind text not null default 'text' check (kind in ('text', 'voice', 'location', 'guard_phone', 'phone')),
  body text,
  original_lang text,
  original_body text,          -- النص قبل الترجمة (يُعبأ من خدمة الترجمة لاحقًا)
  attachment_url text,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  kind appointment_kind not null default 'site_visit',
  slot timestamptz not null,
  state appointment_state not null default 'proposed',
  attended boolean,
  created_at timestamptz not null default now()
);

-- ============ الثقة ============
create table recommendations (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers (id) on delete cascade,
  owner_id uuid not null references profiles (id) on delete cascade,
  project_id uuid references projects (id) on delete set null,
  stage_no int,
  comment text,
  created_at timestamptz not null default now(),
  unique (provider_id, owner_id, project_id, stage_no)
);

create table portfolio_items (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers (id) on delete cascade,
  url text not null,
  caption text,
  verified boolean not null default false,   -- true = من مشروع تم عبر المنصة
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  target_provider_id uuid references providers (id) on delete cascade,
  target_message_id uuid references messages (id) on delete set null,
  reason report_reason not null,
  note text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  target_type text not null check (target_type in ('provider', 'offer', 'opportunity', 'service_offer')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

-- ============ مؤشر الأسعار ============
create table price_index (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  material text not null,
  unit text not null,
  price numeric not null,
  change_pct numeric not null default 0,
  week date not null default date_trunc('week', now())::date,
  unique (city, material, week)
);

-- ============ عدّاد التوصيات ============
create or replace function bump_recommendations() returns trigger
language plpgsql security definer as $$
begin
  update providers set recommendations_count = recommendations_count + 1 where id = new.provider_id;
  return new;
end $$;
create trigger trg_bump_recs after insert on recommendations
for each row execute function bump_recommendations();

-- ============ إنشاء الملف تلقائيًا عند التسجيل ============
create or replace function handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end $$;
create trigger trg_new_user after insert on auth.users
for each row execute function handle_new_user();

-- ============ RLS ============
alter table profiles enable row level security;
alter table providers enable row level security;
alter table projects enable row level security;
alter table project_stages enable row level security;
alter table stage_photos enable row level security;
alter table opportunities enable row level security;
alter table offers enable row level security;
alter table service_offers enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table appointments enable row level security;
alter table recommendations enable row level security;
alter table portfolio_items enable row level security;
alter table reports enable row level security;
alter table favorites enable row level security;
alter table price_index enable row level security;
alter table stage_templates enable row level security;

-- ملفي أنا فقط قابل للتعديل؛ الاسم والمدينة قراءة عامة تكفي عبر providers
create policy "own profile read" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- المزوّدون النشطون علنيون؛ المزوّد يعدّل ملفه؛ التسجيل متاح لصاحب الحساب
create policy "active providers are public" on providers for select
  using (status = 'active' or id = auth.uid());
create policy "provider self insert" on providers for insert with check (id = auth.uid());
create policy "provider self update" on providers for update using (id = auth.uid());

-- المشروع لمالكه
create policy "own projects" on projects for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "own stages" on project_stages for all
  using (exists (select 1 from projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "own stage photos" on stage_photos for all
  using (exists (
    select 1 from project_stages s join projects p on p.id = s.project_id
    where s.id = stage_id and p.owner_id = auth.uid()
  ));

-- الفرصة: يديرها المالك، ويقرؤها كل مزوّد نشط (النطاق الجغرافي يُرشَّح في طبقة التطبيق/الاستعلام)
create policy "owner manages opportunities" on opportunities for all
  using (exists (select 1 from projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "active providers read open opportunities" on opportunities for select
  using (
    state = 'open'
    and exists (select 1 from providers v where v.id = auth.uid() and v.status = 'active')
  );

-- العرض: يكتبه مزوّد نشط، يراه صاحبه ومالك الفرصة
create policy "provider writes own offer" on offers for insert
  with check (provider_id = auth.uid()
    and exists (select 1 from providers v where v.id = auth.uid() and v.status = 'active'));
create policy "provider updates own offer" on offers for update using (provider_id = auth.uid());
create policy "offer visible to sides" on offers for select
  using (
    provider_id = auth.uid()
    or exists (
      select 1 from opportunities o join projects p on p.id = o.project_id
      where o.id = opportunity_id and p.owner_id = auth.uid()
    )
  );

-- عروض الحي: قراءة عامة للنشط، وإدارتها لصاحبها
create policy "active service offers public" on service_offers for select
  using ((active and expires_at > now()) or provider_id = auth.uid());
create policy "provider manages service offers" on service_offers for all
  using (provider_id = auth.uid()) with check (provider_id = auth.uid());

-- المحادثات لطرفيها فقط
create policy "conversation parties" on conversations for select
  using (owner_id = auth.uid() or provider_id = auth.uid());
create policy "owner starts conversation" on conversations for insert
  with check (owner_id = auth.uid());
create policy "message parties" on messages for select
  using (exists (
    select 1 from conversations c where c.id = conversation_id
    and (c.owner_id = auth.uid() or c.provider_id = auth.uid())
  ));
create policy "party sends message" on messages for insert
  with check (sender_id = auth.uid() and exists (
    select 1 from conversations c where c.id = conversation_id
    and (c.owner_id = auth.uid() or c.provider_id = auth.uid())
  ));
create policy "appointment parties" on appointments for all
  using (exists (
    select 1 from conversations c where c.id = conversation_id
    and (c.owner_id = auth.uid() or c.provider_id = auth.uid())
  ));

-- التوصيات: قراءة عامة، وكتابتها للمالك
create policy "recommendations public" on recommendations for select using (true);
create policy "owner recommends" on recommendations for insert with check (owner_id = auth.uid());

create policy "portfolio public" on portfolio_items for select using (true);
create policy "provider manages portfolio" on portfolio_items for all
  using (provider_id = auth.uid()) with check (provider_id = auth.uid());

create policy "reporter writes report" on reports for insert with check (reporter_id = auth.uid());
create policy "reporter reads own report" on reports for select using (reporter_id = auth.uid());

create policy "own favorites" on favorites for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- بيانات عامة للقراءة
create policy "price index public" on price_index for select using (true);
create policy "stage templates public" on stage_templates for select using (true);
