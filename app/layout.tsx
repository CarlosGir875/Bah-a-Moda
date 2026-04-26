import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { SidebarLeft } from "@/components/SidebarLeft";
import { CartSidebar } from "@/components/CartSidebar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DisableInspect } from "@/components/DisableInspect";
import { AuthModal } from "@/components/AuthModal";
import { ProfileModal } from "@/components/ProfileModal";
import { FloatingStatus } from "@/components/FloatingStatus";
import { Toaster } from "@/components/Toaster";
import { PackageTrackerPremium } from "@/components/PackageTrackerPremium";
import type { Viewport } from 'next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bahía Moda | Moda Global en el Puerto",
  description: "Tienda online de ropa, lociones artesanales, zapatos y productos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bahía Moda",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Permit accessibility zoom but control initial layout
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-gray-200 overflow-x-hidden w-full">
        <StoreProvider>
          <DisableInspect />
          <LoadingScreen />
          <SidebarLeft />
          <CartSidebar />
          <AuthModal />
          <ProfileModal />
          <Navbar />
          <FloatingStatus />
          <Toaster />
          <PackageTrackerPremium />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
