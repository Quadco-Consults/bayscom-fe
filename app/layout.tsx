import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FuelConfigProvider } from "@/contexts/FuelConfigContext";
import { MonthScopeProvider } from "@/contexts/MonthScopeContext";
import { FleetConfigProvider } from "@/contexts/FleetConfigContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bayscom Energy - ERP System",
  description: "Integrated ERP system for Bayscom Energy operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FuelConfigProvider>
          <FleetConfigProvider>
            <MonthScopeProvider>
              {children}
            </MonthScopeProvider>
          </FleetConfigProvider>
        </FuelConfigProvider>
      </body>
    </html>
  );
}
