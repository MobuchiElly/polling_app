"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabaseClient";

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
  created_at: string;
  user_id?: string;
}

const user = {
  id: "user_12345",
  email: "testuser@example.com",
  name: "Test User",
};

const polls: Poll[] = [
  {
    id: "poll_1",
    question: "What’s your favorite programming language?",
    created_at: "2025-08-25T12:00:00Z",
    user_id: "user_12345",
    options: [
      { id: "opt_1", text: "JavaScript", votes: 5 },
      { id: "opt_2", text: "Python", votes: 8 },
      { id: "opt_3", text: "Rust", votes: 2 },
    ],
  },
  {
    id: "poll_2",
    question: "Do you prefer dark mode or light mode?",
    created_at: "2025-08-24T10:30:00Z",
    user_id: "user_67890",
    options: [
      { id: "opt_1", text: "Dark Mode", votes: 10 },
      { id: "opt_2", text: "Light Mode", votes: 3 },
    ],
  },
];

export default function PollPage() {
  const { id } = useParams();
  const router = useRouter();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const data = polls.find((p) => p.id === id);
    setPoll(data || null);

    setLoading(false);
  }, [id]);

  const handleVoteSubmit = async () => {
    if (!poll || !selectedOption) return;

    const updatedOptions = poll.options.map((opt) =>
      opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
    );

    const { error } = await supabase
      .from("polls")
      .update({ options: updatedOptions })
      .eq("id", poll.id);

    if (error) {
      console.error("Error voting:", error);
    } else {
      setPoll({ ...poll, options: updatedOptions });
      setVoted(true);
    }
  };

  const handleDelete = async () => {
    if (!poll) return;
    if (!confirm("Are you sure you want to delete this poll?")) return;

    const { error } = await supabase.from("polls").delete().eq("id", poll.id);

    if (error) {
      console.error("Error deleting poll:", error);
    } else {
      router.push("/polls");
    }
  };

  const handleEdit = () => {
    if (!poll) return;
    router.push(`/polls/${poll.id}/edit`);
  };

  const handleCopyLink = async (pollUrl: string) => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading poll...</p>;
  if (!poll) return <p className="text-center mt-10">Poll not found.</p>;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const pollUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/polls/${poll.id}`
      : "";

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push("/polls")}
          className="px-4 py-2 bg-white border hover:bg-gray-200 text-blue-500 rounded-lg font-medium transition"
        >
          ← Back to Polls
        </button>

        {poll.user_id === user.id && (
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="py-2 px-4 bg-white border hover:bg-yellow-500 font-medium rounded-lg transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-white border hover:bg-slate-200 text-red-600 font-medium rounded-lg transition"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* Poll Question */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {poll.question}
      </h1>

      {/* Voting Section */}
      {!voted ? (
        <div className="space-y-4">
          {poll.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center justify-between border rounded-xl px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="vote"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="h-5 w-5"
                />
                <span className="text-gray-700 font-medium">
                  {option.text}
                </span>
              </div>
            </label>
          ))}

          <button
            onClick={handleVoteSubmit}
            disabled={!selectedOption}
            className="mt-6 py-3 px-4 bg-slate-900 hover:bg-slate-950 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            Submit Vote
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Results</h2>
          <ul className="space-y-4">
            {poll.options.map((option) => {
              const percent =
                totalVotes > 0
                  ? Math.round((option.votes / totalVotes) * 100)
                  : 0;
              return (
                <li key={option.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{option.text}</span>
                    <span className="font-bold text-gray-900">
                      {percent}% ({option.votes})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Share Section */}
      <div className="mt-10 text-center border-t pt-6">
        <p className="mb-2 text-gray-700 text-lg">Share this poll:</p>
        <div className="flex items-center justify-center gap-3">
          {/* <a
            href={pollUrl}
            className="text-blue-600 underline font-medium break-all"
          >
            {pollUrl}
          </a> */}
          <button
            onClick={() => handleCopyLink(pollUrl)}
            className="px-3 py-1 bg-gray-100 border rounded-lg text-sm hover:bg-gray-200 transition"
          >
            {copied ? "✅ Copied!" : "📋 Copy Link"}
          </button>
        </div>
        <div className="mt-6 flex justify-center">
          <QRCodeCanvas value={pollUrl} size={140} />
        </div>
      </div>
    </div>
  );
}