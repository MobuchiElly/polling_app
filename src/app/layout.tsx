import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";


export const metadata: Metadata = {
  title: "PollApp",
  description: "Polling app with QR code sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ErrorBoundary>
            <Navbar />
            <main className="flex-1 mb-10">
              {children}
            </main>
            <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}