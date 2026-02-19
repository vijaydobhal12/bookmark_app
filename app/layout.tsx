import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/app/components/AOSInit";

/* ✅ NEW: Import Bottom Tabs component */
import BottomTabs from "@/app/components/BottomTabs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmarks App",
  description: "A simple bookmark manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        /* ✅ CHANGED: Added bottom padding so content is not hidden behind tabs */
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20`}
      >
        <AOSInit />

        {children}

        {/* ✅ NEW: Bottom Tab Navigation */}
        <BottomTabs />
      </body>
    </html>
  );
}
