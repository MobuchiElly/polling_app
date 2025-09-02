'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

interface PollOption {
  option_text: string;
}

interface PollData {
  id: string;
  question: string;
  creator_id: string;
  poll_options: PollOption[];
}

export default function PollPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      const { data, error } = await supabase
        .from("polls")
        .select("id, question, creator_id, poll_options(option_text)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching poll:", error);
      } else {
        setPoll(data as PollData);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = () => {
    if (selectedOption) {
      console.log(`Voted for: ${selectedOption} on poll ${id}`);
      setVoted(true);
    }
  };

  const handleDelete = async () => {
    if (!poll) return;

    const { error } = await supabase.from("polls").delete().eq("id", poll.id);
    if (error) {
      console.error("Error deleting poll:", error);
    } else {
      router.push("/polls"); // Redirect back to polls list
    }
  };

  const handleEdit = () => {
    if (!poll) return;
    router.push(`/polls/${poll.id}/edit`);
  };

  if (!poll) {
    return <div className="flex justify-center items-center min-h-screen">Loading poll...</div>;
  }

  const isCreator = user?.id === poll.creator_id;

  return (
    <div className="m-0 flex justify-center items-center min-h-[86vh] bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl py-10 space-y-4">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold">{poll.question}</CardTitle>
            <CardDescription>Poll ID: {id}</CardDescription>
          </div>

          {isCreator && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-1 border-slate-400" onClick={handleEdit}>
                Edit
              </Button>
              <Button size="sm" className="border-1 bg-transparent text-destructive border-destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {!voted ? (
            <>
              <RadioGroup
                onValueChange={(value) => setSelectedOption(value)}
                className="space-y-3"
              >
                {poll.poll_options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.option_text} id={option.option_text} />
                    <Label htmlFor={option.option_text}>{option.option_text}</Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                onClick={handleVote}
                disabled={!selectedOption}
                className="w-full mt-4"
              >
                Submit Vote
              </Button>
            </>
          ) : (
            <div className="text-center relative">
              <p className="text-lg font-semibold">Thanks for voting!</p>
              <p className="text-gray-500 mt-2">
                You voted for: <span className="font-bold">{selectedOption}</span>
              </p>
              <Button
                onClick={() => router.push('/polls')}
                variant="outline"
                className="mt-4"
              >
                Back to Polls
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}