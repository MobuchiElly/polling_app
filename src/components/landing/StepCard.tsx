import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StepCardProps {
    stepNumber: number;
    title: string;
    description: string;
}

export function StepCard({ stepNumber, title, description }: StepCardProps) {
    return (
        <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                {stepNumber}
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
                <CardDescription className="text-gray-600">{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}