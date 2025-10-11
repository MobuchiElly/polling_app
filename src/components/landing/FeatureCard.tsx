import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="flex flex-col items-center text-center py-8 px-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ">
      <CardHeader className="w-full flex gap-4">
        <div className="text-4xl text-blue-600">{icon}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}