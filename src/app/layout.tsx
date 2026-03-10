import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
//import { AuthProvider } from "@/lib/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/ClientLayout";

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
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}