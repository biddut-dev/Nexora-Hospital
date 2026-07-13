import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexora Hospital — Smart Healthcare, Powered by Intelligence",
  description:
    "Nexora Hospital is an AI-powered enterprise hospital management system offering OPD, IPD, Emergency Services, Bed Management, EMR, Pharmacy, Laboratory, and more.",
  keywords: ["hospital", "healthcare", "HIMS", "EMR", "OPD", "IPD", "emergency"],
  authors: [{ name: "Nexora Healthcare Systems" }],
  openGraph: {
    title: "Nexora Hospital — Smart Healthcare, Powered by Intelligence",
    description: "Enterprise-grade AI-powered hospital management system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
