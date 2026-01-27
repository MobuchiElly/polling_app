import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="flex-shrink-0 w-full w-1/2 md:w-1/4 flex flex-col items-center text-center py-12 px-4 md:px-8 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="w-full gap-3 px-0">
        <div className="text-4xl text-blue-600 flex justify-center">{icon}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}