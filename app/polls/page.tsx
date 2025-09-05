"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PollCard from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

/**
 * PollsDashboard
 *
 * This page displays all polls created by the authenticated user,
 * along with their vote counts. It acts as the central hub for poll
 * management, allowing users to view existing polls and navigate to
 * create new ones.
 *
 * Why it's needed:
 * - Serves as the main "dashboard" where users can manage their polls.
 * - Provides visibility into existing polls and their popularity
 *   (measured by vote counts).
 * - Offers a clear path for creating new polls.
 *
 * Assumptions:
 * - The user is already authenticated (via `useAuth`).
 * - The `polls` table in Supabase contains `id`, `question`, and `created_at`.
 * - The `votes` table is set up with a relation to `polls` so that
 *   Supabase can return aggregated counts with `.select("votes(count)")`.
 *
 * Edge Cases:
 * - If Supabase returns an error, the dashboard still renders but
 *   without polls (error is logged in the console).
 * - If there are no polls, a message is displayed instead of empty UI.
 * - While loading, a spinner/message is shown to avoid flicker.
 *
 * Connections:
 * - Relies on `PollCard` to display individual poll details.
 * - Relies on `AuthContext` to know whether to link "Create New Poll"
 *   to the poll creation page or the login page.
 * - Integrates directly with Supabase for persistent data.
 */
export default function PollsDashboard() {
  const { user } = useAuth(); // Access logged-in user state from global context
  const [polls, setPolls] = useState<any[]>([]); // Stores list of polls fetched from Supabase
  const [loading, setLoading] = useState(true);  // Tracks loading state for conditional rendering

  useEffect(() => {
    /**
     * fetchPolls
     *
     * Fetches all polls from the Supabase `polls` table, including
     * aggregated vote counts, and normalizes them into a format
     * the UI can consume.
     *
     * Why it's needed:
     * - Central data-fetching function that populates the dashboard.
     * - Ensures votes are flattened into a simple `vote_count` number,
     *   since Supabase returns nested results.
     *
     * Assumptions:
     * - Supabase connection is correctly configured in `supabaseClient`.
     * - The `votes` relation is properly set up with `polls`.
     *
     * Edge Cases:
     * - If Supabase fails, logs error and leaves `polls` empty.
     * - Ensures `vote_count` defaults to 0 if a poll has no votes yet.
     *
     * Connections:
     * - Data feeds directly into `PollCard` components for rendering.
     */
    const fetchPolls = async () => {
      setLoading(true);

      // Fetch polls along with aggregated vote counts
      const { data, error } = await supabase
        .from("polls")
        .select(`
          id,
          question,
          created_at,
          votes(count)
        `);

      if (error) {
        // Log error for debugging, but don't break the UI
        console.error("Error fetching polls:", error);
      } else {
        // Flatten vote count from Supabase's nested structure
        const formatted = data.map((poll) => ({
          ...poll,
          vote_count: poll.votes?.[0]?.count || 0, // Default to 0 if no votes exist
        }));
        setPolls(formatted);
      }

      setLoading(false);
    };

    fetchPolls();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page header with "Create Poll" CTA */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Polls</h1>

        {/* If user is logged in, link to new poll creation. Otherwise, link to login. */}
        <Link href={user ? "/polls/new" : "/auth/login"}>
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {/* Conditional UI states: loading, empty, or polls grid */}
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