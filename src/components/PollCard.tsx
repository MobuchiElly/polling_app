import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Poll {
  id: string;
  question: string;
  created_at: string;
  vote_count: number;
}

export default function PollCard({ poll }: { poll: Poll }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold">{poll.question}?</h2>
        <p className="text-sm text-gray-500">
          Created: {new Date(poll.created_at).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-md text-gray-500"><span className="font-bold">{poll.vote_count}</span> votes</p>
        <Link href={`/polls/${poll.id}`}>
          <Button>View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}