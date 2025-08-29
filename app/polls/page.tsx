// import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import PollCard from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseClient";

export default async function PollsDashboard() {
    const user = {
        id: "user_12345",
        email: "testuser@example.com",
        name: "Test User",
        role: "admin"
    };
    const polls = [
        {
          id: "poll_1",
          question: "What’s your favorite programming language?",
          created_at: "2025-08-25T12:00:00Z",
        },
        {
          id: "poll_2",
          question: "Do you prefer dark mode or light mode?",
          created_at: "2025-08-24T10:30:00Z",
        },
        {
          id: "poll_3",
          question: "Which frontend framework do you use the most?",
          created_at: "2025-08-23T09:15:00Z",
        },
      ];
  // ✅ Get current user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

  if (!user) {
    // if not logged in, send to login
    redirect("/auth/login");
  }

  // ✅ Fetch polls created by this user
//   const { data: polls, error } = await supabase
//     .from("polls")
//     .select("id, question, created_at")
//     .eq("creator_id", user.id)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log("Error fetching polls:", error);
//   }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {(!polls || polls.length === 0) ? (
        <p className="text-gray-500">You haven’t created any polls yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}