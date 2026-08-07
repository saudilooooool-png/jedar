# جدار — تطبيق الويب (المنتج الفعلي)

تطبيق Next.js (App Router) + Supabase، بنفس هوية النموذج الأولي المعتمد.
بدون أي إعداد يعمل في **وضع تجريبي** ببيانات محلية؛ وبربط Supabase تتفعل الحسابات
الحقيقية وقاعدة البيانات.

## التشغيل محليًا

```bash
cd web
npm install
npm run dev     # http://localhost:3000 — وضع تجريبي مباشرة
```

## تفعيل الوضع الحقيقي (Supabase)

1. أنشئ مشروعًا مجانيًا في [supabase.com](https://supabase.com).
2. من SQL Editor نفّذ بالترتيب:
   - `../supabase/migrations/0001_core.sql`
   - `../supabase/seed.sql`
3. من Project Settings → API انسخ القيمتين إلى `web/.env.local`:

```bash
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. في Supabase → Authentication → Providers فعّل **Email** (رمز OTP يعمل افتراضيًا).
5. أعد تشغيل `npm run dev` — التسجيل بالبريد والبيانات الحقيقية شغّالة.

## النشر

الأنسب: [Vercel](https://vercel.com) — اربط المستودع، حدد مجلد `web`، وأضف متغيري
البيئة نفسيهما. (GitHub Pages يبقى لصفحة الهبوط والنموذج الأولي فقط — هذا التطبيق
يحتاج خادمًا للتسجيل.)

## البنية

```
web/
  app/
    (app)/            الشاشات الرئيسية داخل الغلاف والتبويبات
      wall/           جداري: المراحل + عروض الحي + أسعار المواد
      browse/         تصفّح المزوّدين + ملف المزوّد [id]
      opportunity/    فرصتي والعروض الواردة
      chat/           المحادثة (ترجمة تلقائية + رقم الحارس + تنبيه الأمان)
      account/        حسابي + تسجيل الخروج
    login/            دخول برمز بريد (OTP) عبر Supabase
  components/         الغلاف، الخط الزمني، بطاقة المزوّد، الأيقونات
  lib/
    data.ts           طبقة البيانات الوحيدة (Supabase أو الوضع التجريبي)
    demo-data.ts      بيانات الوضع التجريبي
    supabase/         عملاء الخادم والمتصفح (@supabase/ssr)
  middleware.ts       تحديث الجلسة + حماية الشاشات (يُعطَّل في الوضع التجريبي)

../supabase/
  migrations/0001_core.sql   المخطط الكامل + RLS (من docs/02 و05)
  seed.sql                   قوالب المراحل لكل مسار + مؤشر الأسعار
```

## ما بعد هذا الأساس (بالترتيب المقترح)

1. إنشاء المشروع من التطبيق (نوع + «وين وصلت؟») بدل الاعتماد على مشروع موجود.
2. نموذج طرح الفرصة + إشعارات المزوّدين (Web Push).
3. محادثة حقيقية على Supabase Realtime + الترجمة الآلية.
4. تسجيل المزوّدين بالمرفقات وقائمة مراجعة الأدمن.
5. تحويل التطبيق PWA كاملًا (manifest + service worker) عند النشر على نطاقه.
