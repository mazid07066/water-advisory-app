import type { Metadata } from "next";

import AppHeader from "@/components/AppHeader";
import { getLanguage } from "@/lib/getLanguage";

import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pani Bondhu Water Advisor",
  description:
    "Bilingual IoT-based water-quality monitoring and advisory platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getLanguage();

  return (
    <html lang={language}>
      <body>
        <AppHeader language={language} />
        {children}
      </body>
    </html>
  );
}