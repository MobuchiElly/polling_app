"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PollCard from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function PollsDashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);

      // Fetch polls with vote counts
      const { data, error } = await supabase
        .from("polls")
        .select(`
          id,
          question,
          created_at,
          votes(count)
        `);

      if (error) {
        console.error("Error fetching polls:", error);
      } else {
        // Flatten vote count since supabase returns an array
        const formatted = data.map((poll) => ({
          ...poll,
          vote_count: poll.votes?.[0]?.count || 0,
        }));
        setPolls(formatted);
      }

      setLoading(false);
    };

    fetchPolls();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Polls</h1>
        <Link href={user ? "/polls/new" : "/auth/login"}>
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading polls...</p>
      ) : polls.length === 0 ? (
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