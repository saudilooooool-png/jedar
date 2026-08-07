-- جدار — بيانات التأسيس: قوالب المراحل ومؤشر الأسعار
-- تُنفَّذ بعد 0001_core.sql

-- مسار الفيلا/العمارة/الاستراحة (10 مراحل)
insert into stage_templates (project_type, stage_no, name, provider_categories) values
  ('villa', 1,  'التصميم والتراخيص',      '{"مكتب هندسي","مساح","رخص"}'),
  ('villa', 2,  'الحفر والتسوير',          '{"حفر","معدات","نقل ردم","تسوير"}'),
  ('villa', 3,  'القواعد والميدات',        '{"أساسات","نجارة","حدادة","عزل أساسات"}'),
  ('villa', 4,  'الهيكل والعظم',           '{"عظم","مضخة خرسانة"}'),
  ('villa', 5,  'المباني واللياسة',        '{"بناء","لياسة"}'),
  ('villa', 6,  'التمديدات',               '{"سباكة","كهرباء","تكييف","شبكات"}'),
  ('villa', 7,  'العزل',                   '{"عزل مائي","عزل حراري","لياسة داخلية"}'),
  ('villa', 8,  'التشطيبات',               '{"بلاط","دهان","جبس","ديكور","ألمنيوم","أبواب"}'),
  ('villa', 9,  'التركيبات النهائية',      '{"مطابخ","أدوات صحية","إنارة","مصاعد","كاميرات"}'),
  ('villa', 10, 'الأعمال الخارجية',        '{"إنترلوك","تنسيق حدائق","بوابات","نظافة"}');

insert into stage_templates (project_type, stage_no, name, provider_categories)
select 'building'::project_type, stage_no, name, provider_categories from stage_templates where project_type = 'villa';
insert into stage_templates (project_type, stage_no, name, provider_categories)
select 'istiraha'::project_type, stage_no, name, provider_categories from stage_templates where project_type = 'villa';
insert into stage_templates (project_type, stage_no, name, provider_categories)
select 'mosque_waqf'::project_type, stage_no, name, provider_categories from stage_templates where project_type = 'villa';

-- الترميم (6 مراحل)
insert into stage_templates (project_type, stage_no, name, provider_categories) values
  ('renovation', 1, 'المعاينة والتقييم',   '{"مكتب هندسي","مقاول ترميم"}'),
  ('renovation', 2, 'الهدم والإزالة',      '{"هدم","نقل مخلفات"}'),
  ('renovation', 3, 'المعالجة الإنشائية',  '{"ترميم إنشائي","عزل"}'),
  ('renovation', 4, 'التمديدات',           '{"سباكة","كهرباء","تكييف"}'),
  ('renovation', 5, 'التشطيب',             '{"بلاط","دهان","جبس"}'),
  ('renovation', 6, 'التسليم',             '{"نظافة"}');

-- التشطيب فقط (4 مراحل)
insert into stage_templates (project_type, stage_no, name, provider_categories) values
  ('finishing', 1, 'المعاينة والتصميم',    '{"مصمم داخلي","مكتب هندسي"}'),
  ('finishing', 2, 'التمديدات',            '{"سباكة","كهرباء","تكييف"}'),
  ('finishing', 3, 'التشطيب',              '{"بلاط","دهان","جبس","ديكور"}'),
  ('finishing', 4, 'التركيبات',            '{"مطابخ","أدوات صحية","إنارة"}');

-- الملحق/التوسعة (5 مراحل)
insert into stage_templates (project_type, stage_no, name, provider_categories) values
  ('annex', 1, 'التصميم والترخيص',  '{"مكتب هندسي","رخص"}'),
  ('annex', 2, 'العظم',             '{"عظم","بناء"}'),
  ('annex', 3, 'التمديدات',         '{"سباكة","كهرباء","تكييف"}'),
  ('annex', 4, 'التشطيب',           '{"بلاط","دهان","جبس"}'),
  ('annex', 5, 'التسليم',           '{"نظافة"}');

-- مؤشر أسعار الأسبوع الحالي — الرياض (قيم تأسيسية، تُحدَّث أسبوعيًا من لوحة التحكم)
insert into price_index (city, material, unit, price, change_pct) values
  ('الرياض', 'حديد',            'طن',      2340, -1.2),
  ('الرياض', 'خرسانة جاهزة',    'م³',      245,   0.8),
  ('الرياض', 'بلك أسود 20',     'حبة',     4.1,   0.0),
  ('الرياض', 'أسمنت',           'كيس',     14.5, -0.5),
  ('الرياض', 'مواسير PPR',      'حبة 4م',  27,   -2.1),
  ('الرياض', 'كيبل 4مم',        'لفة',     410,   1.5);
