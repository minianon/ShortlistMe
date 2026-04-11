import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShortlistMe — AI Portfolio Generator",
    template: "%s | ShortlistMe",
  },
  description:
    "Upload your resume and get a stunning, shareable portfolio in seconds. Powered by AI.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${manrope.variable} ${inter.variable} h-full`}
        data-scroll-behavior="smooth"
        style={
          {
            "--font-display": "var(--font-manrope)",
            "--font-body": "var(--font-inter)",
          } as React.CSSProperties
        }
      >
        <body className="min-h-full flex flex-col antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
