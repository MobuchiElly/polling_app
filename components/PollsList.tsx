import PollCard from "@/components/PollCard";
import { createClient } from "@/lib/supabase/server";

export default async function PollsList() {
  const supabase = createClient();

  const { data: polls, error } = await supabase
    .from("polls")
    .select(
      `
      id,
      question,
      created_at,
      votes(count)
    `
    );

  if (error) {
    console.error("Error fetching polls:", error);
    return <p className="text-red-500">Could not fetch polls.</p>;
  }

  if (polls.length === 0) {
    return <p className="text-gray-500">You haven’t created any polls yet.</p>;
  }

  const formattedPolls = polls.map((poll) => ({
    ...poll,
    vote_count: poll.votes?.[0]?.count || 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {formattedPolls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
