import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plenus Obras | Construção de Casas Personalizadas",
  description:
    "Você sonha, a Plenus realiza. Especialistas em terreno + construção personalizada com economia de até 40%. 8 anos transformando sonhos em realidade.",
  keywords: [
    "construção de casas",
    "terreno e construção",
    "casas personalizadas",
    "construtora Indaiatuba",
    "construtora Jundiaí",
    "Plenus Obras",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
