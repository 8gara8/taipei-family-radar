import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { TopNav } from "@/components/layout/TopNav";
import "@/styles/globals.css";

// Latin/數字用 Inter；中文用 Noto Sans TC（CJK 字檔大，preload 關閉、不需指定 subset）。
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "600", "700"],
  preload: false,
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const SITE_NAME = "台北親子活動雷達";
const SITE_DESCRIPTION =
  "為帶 4 歲與 2 歲幼兒的台北家長，每週精選大台北的戶外表演與各國文化機構親子活動。";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "zh_TW",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1f8a70",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${inter.variable} ${notoSansTC.variable}`}
    >
      <body className="min-h-dvh">
        <TopNav />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-[var(--color-text-secondary)] sm:px-6">
          <p>
            台北親子活動雷達 · 內容每週更新 · 活動請以主辦單位公告為準。
          </p>
        </footer>
      </body>
    </html>
  );
}
