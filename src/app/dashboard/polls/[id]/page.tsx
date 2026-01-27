'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


interface PollData {
  id: string;
  question: string;
  poll_options: { id: string; option_text: string }[]; // Update poll_options type
  creator_id: string; // Add creator_id
}

export default function PollPage({ params }: { params: { id: string } }) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(true);

  const {id} = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchPollAndUser() {
      try {
        const res = await fetch(`/api/polls/${id}`, {
          method: "GET"
        });
        const data = await res.json();
        // console.log("res:", data);
        setPoll(data.poll);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPollAndUser();
  }, [id, supabase]);
console.log("hello");

  const handleVote = async () => {
    if (selectedOption && poll) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const voterId = user ? user.id : null;

        const { error: voteError } = await supabase.from('votes').insert([
          {
            poll_id: poll.id,
            option_id: selectedOption, // Assuming selectedOption is the option_id
            voter_id: voterId,
          },
        ]);

        if (voteError) {
          throw new Error(voteError.message);
        }

        console.log(`Voted for: ${selectedOption} on poll ${params.id}`);
        setVoted(true);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleDeletePoll = async () => {
    if (confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/polls/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete poll');
        }

        alert('Poll deleted successfully!');
        router.push('/'); // Redirect to home page after deletion
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Poll not found.</p>
      </div>
    );
  }

  if (voted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Thank you for voting!</CardTitle>
            <CardDescription>Your vote has been recorded.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You voted for: {poll.poll_options.find(opt => opt.id === selectedOption)?.option_text}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ''}>
            {poll.poll_options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`}>{option.option_text}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button onClick={handleVote} className="mt-4 w-full" disabled={!selectedOption}>
            Submit Vote
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}