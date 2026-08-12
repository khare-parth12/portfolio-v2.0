import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parth Khare — Full-Stack Developer & Builder",
  description:
    "Portfolio of Parth Khare — a full-stack developer specialising in React, TypeScript, and building B2B micro-SaaS products.",
  keywords: [
    "Parth Khare",
    "Full-Stack Developer",
    "React",
    "TypeScript",
    "Python",
    "Next.js",
    "B2B SaaS",
    "Portfolio",
  ],
  authors: [{ name: "Parth Khare" }],
  openGraph: {
    title: "Parth Khare — Full-Stack Developer & Builder",
    description:
      "Full-stack developer specialising in React, TypeScript, and building B2B micro-SaaS products.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Khare — Full-Stack Developer & Builder",
    description:
      "Full-stack developer specialising in React, TypeScript, and building B2B micro-SaaS products.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Parth Khare",
  jobTitle: "Full-Stack Developer",
  description:
    "Full-stack developer specialising in React, TypeScript, Python, and building B2B micro-SaaS products.",
  knowsAbout: [
    "React",
    "TypeScript",
    "Python",
    "Next.js",
    "Node.js",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
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
