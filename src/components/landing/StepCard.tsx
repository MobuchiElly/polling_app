// StepCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StepCardProps {
  stepNumber: number
  title: string
  description: string
}

export function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="relative flex flex-col items-center p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white group">
        <div className="absolute -top-6 w-14 h-14 flex items-center justify-center rounded-full bg-purple-700 text-primary-foreground text-2xl font-bold shadow-md">
          {stepNumber}
        </div>

        <CardContent className="mt-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
