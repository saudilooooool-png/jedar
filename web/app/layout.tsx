import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tajawal = localFont({
  src: [
    { path: "./fonts/ar400.woff2", weight: "400" },
    { path: "./fonts/la400.woff2", weight: "400" },
    { path: "./fonts/ar500.woff2", weight: "500" },
    { path: "./fonts/ar700.woff2", weight: "700" },
    { path: "./fonts/la700.woff2", weight: "700" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "جدار — عروض مقاولي حيّك، مرحلة بمرحلة",
  description:
    "منصة سعودية تجمع أصحاب العقار بالمقاولين والفنيين الموثّقين حسب مرحلة البناء — من التصميم إلى التسليم.",
};

export const viewport: Viewport = {
  themeColor: "#24344D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>{children}</body>
    </html>
  );
}
