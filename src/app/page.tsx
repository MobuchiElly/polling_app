import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CallToActionSection } from "@/components/landing/CallToActionSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polling App - Create and Share Polls Easily',
  description: 'Quickly create, share, and analyze polls with unique links and QR codes. Gather opinions and view real-time results effortlessly.',
  openGraph: {
    title: 'Polling App - Create and Share Polls Easily',
    description: 'Quickly create, share, and analyze polls with unique links and QR codes. Gather opinions and view real-time results effortlessly.',
    url: 'https://polling-app.app.vercel', // To be replaced with actual domain upon deployment
    siteName: 'Polling App',
    images: [
      {
        url: 'https://your-polling-app.com/og-image.jpg', // To be replace with a relevant image for social sharing
        width: 1200,
        height: 630,
        alt: 'Polling App - Create and Share Polls Easily',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polling App - Create and Share Polls Easily',
    description: 'Quickly create, share, and analyze polls with unique links and QR codes. Gather opinions and view real-time results effortlessly.',
    creator: '@your_twitter_handle', // To be replace with your Twitter handle
    images: ['https://your-polling-app.com/twitter-image.jpg'], // To be replaced with a relevant image for Twitter
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToActionSection />
    </main>
  );
}