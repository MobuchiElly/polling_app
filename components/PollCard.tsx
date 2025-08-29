import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PollCard({ poll }: { poll: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold">{poll.question}</h2>
        <p className="text-sm text-gray-500">
          Created: {new Date(poll.created_at).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href={`/polls/${poll.id}`}>
          <Button>View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}