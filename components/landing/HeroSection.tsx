import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
      {/* Background Image/Visual Element Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.webp"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-30"
        />
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Easily Create and Share Polls
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Quickly gather opinions and view real-time results with unique links and QR codes.
        </p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          Create Your First Poll Now
        </Button>
      </div>
    </section>
  );
}