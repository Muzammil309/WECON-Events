import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/aivent-globals.css";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import { BackgroundAnimation } from "@/components/ui/BackgroundAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WECON Masawat",
  description: "Futuristic, elegant event platform",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-900`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <BackgroundAnimation variant="default" intensity="medium" />
          <ServiceWorkerRegister />
          <Navbar />
          <main className="w-full relative z-10">
            <RouteTransition>
              {children}
            </RouteTransition>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
