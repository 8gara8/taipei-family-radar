import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import "@/styles/globals.css";

// Latin/數字用 Inter；中文用 Noto Sans TC（CJK 字檔大，preload 關閉、不需指定 subset）。
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "600", "700", "800", "900"],
  preload: false,
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const SITE_NAME = "台北親子活動雷達";
const SITE_DESCRIPTION =
  "台北・新北・基隆的免費親子活動：戶外表演、各國文化節慶、街舞賽事、音樂會、市集";

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
  viewportFit: "cover",
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
        {/* 行動優先的 App 外殼：置中的手機寬欄，桌機以左右細線界定。 */}
        <div className="relative mx-auto flex min-h-dvh max-w-[480px] flex-col bg-[var(--color-bg)] sm:border-x sm:border-[var(--color-border)]">
          <AppHeader />
          <main className="pb-nav flex-1">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
