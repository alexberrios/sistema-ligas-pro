import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SouthGo Ligas Pro",
  description: "Plataforma Premium de Gestión Deportiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${teko.variable} antialiased selection:bg-blue-500 selection:text-white bg-slate-950`}
      >
        <div className="noise-bg"></div>
        {children}
      </body>
    </html>
  );
}
