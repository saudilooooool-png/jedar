export type Stage = {
  no: number;
  name: string;
  state: "done" | "active" | "locked";
};

export type Project = {
  id: string;
  title: string;
  type: string;
  city: string;
  district: string;
  landArea: number | null;
  builtArea: number | null;
  floors: number | null;
  currentStageNo: number;
  stages: Stage[];
};

export type Provider = {
  id: string;
  businessName: string;
  kind: string;
  bio: string | null;
  specialties: string[];
  tools: string[];
  city: string;
  districts: string[];
  distanceKm: number | null;
  sla: "hour" | "day";
  workHours: string | null;
  verified: boolean;
  scaMembership: string | null;
  enterpriseSize: string | null;
  yearsExperience: number | null;
  recommendationsCount: number;
  commitmentPct: number | null;
  phone: string | null;
};

export type Offer = {
  id: string;
  providerId: string;
  providerName: string;
  recommendationsCount: number;
  total: number | null;
  scope: "without_materials" | "with_materials" | "materials_only";
  durationDays: number | null;
  invoiceUrl: string | null;
  note: string | null;
  state: string;
};

export type Opportunity = {
  id: string;
  stageNo: number;
  stageName: string;
  scope: "stage" | "structure" | "turnkey";
  budgetMin: number | null;
  budgetMax: number | null;
  note: string | null;
  state: "open" | "closed" | "archived";
  offers: Offer[];
};

export type ServiceOffer = {
  id: string;
  providerName: string;
  specialty: string;
  title: string;
  description: string | null;
  price: number | null;
  verified: boolean;
};

export type PriceRow = {
  material: string;
  unit: string;
  price: number;
  changePct: number;
};

export type ChatMessage = {
  id: string;
  mine: boolean;
  kind: "text" | "voice" | "location" | "guard_phone" | "phone";
  body: string | null;
  originalLang: string | null;
  originalBody: string | null;
  createdAt: string;
};
