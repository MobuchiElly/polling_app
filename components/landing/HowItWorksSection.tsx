import { StepCard } from "./StepCard";

const steps = [
  {
    stepNumber: 1,
    title: "Create Your Poll",
    description:
      "Easily design your poll with custom questions and multiple answer options.",
  },
  {
    stepNumber: 2,
    title: "Share with Your Audience",
    description:
      "Distribute your poll via a unique link or QR code to gather responses.",
  },
  {
    stepNumber: 3,
    title: "Analyze Results in Real-time",
    description:
      "View live updates and detailed analytics as votes come in.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          How Our Polling App Works
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Get started in three simple steps to create, share, and analyze your polls.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.stepNumber} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}