import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/shared/auth-provider";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MealBridge - Rescue Food, Feed Community",
    template: "%s | MealBridge",
  },
  description:
    "Connect food surplus with people who need it. Rescue meals, reduce waste, build community. Free platform for restaurants, bakeries, and households to share surplus food.",
  keywords: [
    "food rescue",
    "food waste",
    "community",
    "free food",
    "surplus food",
    "donate food",
    "food sharing",
  ],
  authors: [{ name: "MealBridge" }],
  creator: "MealBridge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mealbridge.vercel.app",
    siteName: "MealBridge",
    title: "MealBridge - Rescue Food, Feed Community",
    description:
      "Connect food surplus with people who need it. Rescue meals, reduce waste, build community.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MealBridge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MealBridge - Rescue Food, Feed Community",
    description:
      "Connect food surplus with people who need it. Rescue meals, reduce waste, build community.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
