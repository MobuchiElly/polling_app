import { FeatureCard } from "./FeatureCard";
import { Lightbulb, Share2, BarChart2 } from "lucide-react"; // You might need to install lucide-react: npm install lucide-react

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Empower Your Decisions with Our Key Features
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Discover how our polling app makes gathering insights effortless and effective.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Lightbulb />}
            title="Intuitive Poll Creation"
            description="Craft engaging polls in minutes with our user-friendly interface. No coding required!"
          />
          <FeatureCard
            icon={<Share2 />}
            title="Seamless Sharing Options"
            description="Distribute your polls effortlessly via unique links, QR codes, or social media."
          />
          <FeatureCard
            icon={<BarChart2 />}
            title="Real-time Analytics"
            description="Gain instant insights with live updates and comprehensive visualizations of your poll results."
          />
        </div>
      </div>
    </section>
  );
}