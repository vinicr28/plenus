import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// TODO: Replace SITE_URL with actual domain when available
const SITE_URL = 'https://plenusobras.com.br'; // placeholder

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Plenus Obras | Construção de Casas Personalizadas",
    template: "%s | Plenus Obras",
  },
  description:
    "Você sonha, a Plenus realiza. Especialistas em terreno + construção personalizada com economia de até 40%. 9 anos transformando sonhos em realidade em Indaiatuba e Jundiaí.",
  keywords: [
    "construção de casas",
    "terreno e construção",
    "casas personalizadas",
    "construtora Indaiatuba",
    "construtora Jundiaí",
    "Plenus Obras",
    "construção residencial",
    "financiamento imobiliário",
  ],
  authors: [{ name: "Plenus Obras" }],
  creator: "Plenus Obras",
  publisher: "Plenus Obras",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Plenus Obras",
    title: "Plenus Obras | Construção de Casas Personalizadas",
    description:
      "Você sonha, a Plenus realiza. Especialistas em terreno + construção personalizada com economia de até 40%. 9 anos transformando sonhos em realidade.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Plenus Obras - Construção de Casas Personalizadas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plenus Obras | Construção de Casas Personalizadas",
    description:
      "Você sonha, a Plenus realiza. Especialistas em terreno + construção personalizada com economia de até 40%.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

// JSON-LD Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Plenus Obras",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Especialistas em terreno + construção personalizada com economia de até 40%. 9 anos transformando sonhos em realidade.",
  foundingDate: "2016",
  areaServed: [
    {
      "@type": "City",
      name: "Indaiatuba",
      containedInPlace: {
        "@type": "State",
        name: "São Paulo",
      },
    },
    {
      "@type": "City",
      name: "Jundiaí",
      containedInPlace: {
        "@type": "State",
        name: "São Paulo",
      },
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-19-99205-7955",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
  sameAs: [
    "https://www.instagram.com/plenusobras",
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "Plenus Obras",
  image: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
  telephone: "+55-19-99205-7955",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indaiatuba",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -23.0903,
    longitude: -47.2181,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "50",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
