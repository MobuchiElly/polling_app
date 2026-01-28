import { cookies } from "next/headers";
import PollCard from "@/components/PollCard";

interface Poll {
  id: string;
  question: string;
  created_at: string;
  vote_count: number;
  votes: [{
    option: string;
    count: number;
  }]
}
interface PollsListProps {
  filter?: 'user' | 'all';
}

export default async function PollsList({ filter = 'user' }: PollsListProps) {
  const cookieHeader = await cookies();
  const cookieHeaderStr = cookieHeader.toString();
  let polls = [];

  try {
    const res = await fetch(`http://localhost:3000/api/polls?filter=${filter}`, {
        method: "GET",
        headers: {
          Cookie: cookieHeaderStr
        }
      }
    );

    if (!res.ok) {
      return <p className="text-red-500">Could not fetch polls.</p>;
    }
    const data = await res.json();
    polls = data.polls;
    console.log("polls:", polls);
  } catch(err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    console.error(errorMessage);
    return <p className="text-red-500">Could not fetch polls.</p>;
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {filter === 'user' 
            ? "You haven't created any polls yet." 
            : "No polls available at the moment."}
        </p>
      </div>
    );
  }

  const formattedPolls = polls.map((poll: Poll) => ({
    ...poll,
    vote_count: poll.votes?.[0]?.count || 0,
  }));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {formattedPolls.length > 0 && formattedPolls.map((poll: Poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}