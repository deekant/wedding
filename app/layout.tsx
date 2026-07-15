import type { Metadata } from "next";
import { Gilda_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const gildaDisplay = Gilda_Display({
  weight: "400",
  variable: "--font-gilda",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vadym & Mariya",
  description: "Wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gildaDisplay.variable} ${inter.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
