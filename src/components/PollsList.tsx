import {cookies} from "next/headers";
import PollCard from "@/components/PollCard";


export default async function PollsList() {
  const cookieHeader = await cookies();
  const cookieHeaderStr = cookieHeader.toString();
  let polls = [];

  try{
    const res = await fetch("http://localhost:3000/api/polls", {
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
  }catch(err: any){
    const errorMessage = err.message || "error fetching data";
    return <p className="text-red-500">Could not fetch polls.</p>;
  }

  if (polls.length === 0) {
    return <p className="text-gray-500">You haven’t created any polls yet.</p>;
  }

  const formattedPolls = polls.map((poll: any) => ({
    ...poll,
    vote_count: poll.votes?.[0]?.count || 0,
  }));
  console.log("formattedPolls:", formattedPolls);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {formattedPolls.length > 0 && formattedPolls.map((poll:any) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}