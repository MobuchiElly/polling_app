"use client";
// HowItWorksSection.tsx
import { StepCard } from "./StepCard"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    stepNumber: 1,
    title: "Create Your Poll",
    description:
      "Design your poll with custom questions and multiple answer options in seconds.",
  },
  {
    stepNumber: 2,
    title: "Share Instantly",
    description:
      "Send your poll via link or QR code to your audience and start collecting responses.",
  },
  {
    stepNumber: 3,
    title: "Analyze Insights",
    description:
      "Track real-time responses and analytics to understand trends at a glance.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
        >
          How It Works
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          Just three easy steps to create, share, and analyze your polls effortlessly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}