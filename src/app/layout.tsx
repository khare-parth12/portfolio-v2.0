import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parthkhare.dev"),
  title: "Parth Khare — AI Engineer & Full-Stack Developer",
  description:
    "Portfolio of Parth Khare — an AI Engineer & Full-Stack Developer specialising in production-ready LLM-integrated systems, B2B micro-SaaS applications, and modern web experiences.",
  keywords: [
    "Parth Khare",
    "AI Engineer",
    "Full-Stack Developer",
    "LLM",
    "React",
    "TypeScript",
    "Python",
    "Next.js",
    "FastAPI",
    "B2B SaaS",
    "Portfolio",
  ],
  authors: [{ name: "Parth Khare" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Parth Khare — AI Engineer & Full-Stack Developer",
    description:
      "AI Engineer & Full-Stack Developer specialising in production-ready LLM-integrated systems and B2B micro-SaaS applications.",
    type: "website",
    locale: "en_US",
    url: "https://parthkhare.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Khare — AI Engineer & Full-Stack Developer",
    description:
      "AI Engineer & Full-Stack Developer specialising in production-ready LLM-integrated systems and B2B micro-SaaS applications.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Parth Khare",
  jobTitle: "AI Engineer & Full-Stack Developer",
  description:
    "AI Engineer & Full-Stack Developer specialising in production-ready LLM-integrated systems, Python, TypeScript, and B2B micro-SaaS applications.",
  knowsAbout: [
    "Artificial Intelligence",
    "LLM Integration",
    "React",
    "TypeScript",
    "Python",
    "Next.js",
    "FastAPI",
    "Docker",
    "Full-Stack Development",
    "B2B SaaS",
  ],
  url: "https://parthkhare.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
