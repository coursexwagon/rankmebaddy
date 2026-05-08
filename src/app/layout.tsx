import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RankMeBaddy — Rank Everywhere. Autonomously.",
  description:
    "AI SEO partner that ranks content everywhere — Google, YouTube, Amazon, TikTok, AI Search. Just tell it what to rank.",
  keywords: [
    "RankMeBaddy",
    "AI SEO",
    "content ranking",
    "SEO",
    "autonomous ranking",
    "multi-platform SEO",
  ],
  authors: [{ name: "RankMeBaddy" }],
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
