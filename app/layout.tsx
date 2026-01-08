import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Roast My Landing Page",
  description: "Get your landing page brutally roasted by AI. Find out your AI Slop Score.",
  keywords: ["landing page", "roast", "AI", "copy review", "design feedback"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jetbrains.variable} font-mono bg-black text-white min-h-screen antialiased selection:bg-lime-400 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
