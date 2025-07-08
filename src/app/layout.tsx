import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from '@/components/SupabaseProvider'
import RequireAuth from "@/components/RequireAuth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Controle Pastoral",
  description: "Sistema de check-in e eventos",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <SupabaseProvider>
          <RequireAuth>{children}</RequireAuth>
        </SupabaseProvider>
      </body>
    </html>
  );
}
