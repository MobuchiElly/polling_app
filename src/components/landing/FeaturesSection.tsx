"use client";

import { useState, useEffect, useRef } from "react";
import { FeatureCard } from "./FeatureCard";
import { Lightbulb, Share2, BarChart2 } from "lucide-react";

export function FeaturesSection() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  //const [scrollPosition, setScrollPosition] = useState(0);


 useEffect(() => {
  if (!containerRef.current || isHovered) return;
  
    const container = containerRef.current;
    const scrollLeft = Math.floor(container.scrollLeft);
    //console.log("1 container.scrollLeft:", container.scrollLeft);
  const step = 1; // small value = smoother motion

  const interval = setInterval(() => {
    const loopPoint = container.scrollWidth / 2;
    if (scrollLeft >= loopPoint) {
      console.log("yes:", container.scrollLeft)
      container.scrollLeft = 0; // instant jump, no smooth
    } else { 
      console.log("no:", container.scrollLeft);
      container.scrollLeft += step;
    }
  }, 16); // ~60fps

  return () => clearInterval(interval);
  }, [isHovered]);


  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   const interval = setInterval(() => {
  //     if (containerRef.current){  
  //         const maxScroll = containerRef.current?.scrollWidth - containerRef.current?.clientWidth;
  //         setScrollPosition((prev) => {
  //           const nextPosition = prev + 300;
  //           return nextPosition >= maxScroll ? 0 : nextPosition
  //         })
  //       }
  //     }, 2000);
  //     return () => clearInterval(interval);
  // }, [isHovered]);

  // useEffect(() => {
  //   if(containerRef.current){
  //     containerRef.current.scrollTo({
  //       left: scrollPosition,
  //       behavior: "smooth"
  //     })
  //   }
  // }, [scrollPosition]);

  const features = [
    {
      id: 1,
      icon: <Lightbulb />,
      title: "Intuitive Poll Creation",
      description: "Craft engaging polls in minutes with our user-friendly interface. No coding required!",
    },
    {
      id: 2,
      icon: <Share2 />,
      title: "Seamless Sharing Options",
      description: "Distribute your polls effortlessly via unique links, QR codes, or social media.",
    },
    {
      id: 3,
      icon: <BarChart2 />,
      title: "Real-time Analytics",
      description: "Gain instant insights with live updates and comprehensive visualizations of your poll results.",
    },
    {
      id: 4,
      icon: <Lightbulb />,
      title: "Intuitive Poll Creation",
      description: "Craft engaging polls in minutes with our user-friendly interface. No coding required!",
    },
    {
      id: 5,
      icon: <Share2 />,
      title: "Seamless Sharing Options",
      description: "Distribute your polls effortlessly via unique links, QR codes, or social media.",
    },
    {
      id: 6,
      icon: <BarChart2 />,
      title: "Real-time Analytics",
      description: "Gain instant insights with live updates and comprehensive visualizations of your poll results.",
    },
  ]


  return (
    <section className="mt-24 px-4 md:px-8">
      <div className="max-w-sm md:max-w-5xl lg:max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Empower Your Decisions with Our Key Features
        </h2>
        <p className="text-lg text-gray-600">
          Discover how our polling app makes gathering insights effortless and effective.
        </p>

        <div 
          ref = {containerRef}
          className="flex gap-6 mt-20 overflow-hidden scroll-smooth" 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}>
          {
            features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))
          }
        </div>
      </div>
    </section>
  );
}