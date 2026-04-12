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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-gray-200">
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
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
