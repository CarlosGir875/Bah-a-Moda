import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { SidebarLeft } from "@/components/SidebarLeft";
import { CartSidebar } from "@/components/CartSidebar";
import { SplashScreen } from "@/components/SplashScreen";
import { DisableInspect } from "@/components/DisableInspect";
import { AuthModal } from "@/components/AuthModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bahía Moda | Moda Global en el Puerto",
  description: "Tienda online de ropa, lociones artesanales, zapatos y productos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-gray-200">
        <StoreProvider>
          <DisableInspect />
          <SplashScreen />
          <SidebarLeft />
          <CartSidebar />
          <AuthModal />
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
