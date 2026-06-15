import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { TimeCoinsProvider } from "@/hooks/use-time-coins";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Coins 时间金币",
  description: "用 34 枚半小时金币，看见每天的时间流向。",
  applicationName: "Time Coins",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "时间金币",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF7F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <TimeCoinsProvider>{children}</TimeCoinsProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
