import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection"; // Import FeaturesSection

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}