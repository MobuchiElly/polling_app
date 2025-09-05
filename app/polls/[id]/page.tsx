'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PollData {
  id: string;
  question: string;
  options: string[];
}

// Mock poll data for demonstration
// This will eventually be replaced by a database query (Supabase).
const mockPollData: PollData = {
  id: '123',
  question: 'What is your favorite programming language?',
  options: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'],
};

/**
 * PollPage
 *
 * Page component responsible for displaying a single poll and handling user votes.
 *
 * Why it’s needed:
 * - Acts as the main entry point for end-users to interact with an individual poll.
 * - Demonstrates client-side voting behavior before backend integration.
 * - Will later connect to Supabase or another backend service for real poll data and vote persistence.
 *
 * Assumptions:
 * - A valid `params.id` is always provided (from Next.js dynamic routing).
 * - For now, poll data is mocked; in production, poll data would be fetched based on `params.id`.
 *
 * Edge cases handled:
 * - Users cannot vote until they select an option (`Submit Vote` button disabled).
 * - Users cannot vote more than once in a session (`voted` state enforces thank-you screen).
 *
 * Connections:
 * - Works with the `PollForm` component (which creates polls).
 * - Future versions will depend on backend services (e.g., Supabase) to fetch poll details and persist votes.
 */
export default function PollPage({ params }: { params: { id: string } }) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Extract poll id from route parameters (provided by Next.js).
  const { id } = params;

  /**
   * handleVote
   *
   * Handles user vote submission.
   * - Logs the chosen option for now (mock behavior).
   * - Updates local state so the UI transitions to a "thank you" message.
   *
   * Why it’s needed:
   * - Encapsulates vote submission logic in one place.
   * - Prepares for future backend integration where votes will be saved to the database.
   */
  const handleVote = () => {
    if (selectedOption) {
      console.log(`Voted for: ${selectedOption} on poll ${params.id}`);
      setVoted(true);
    }
  };

  // If the user has already voted, show a thank-you screen instead of the poll
  if (voted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Thank you for voting!</CardTitle>
            <CardDescription>Your vote has been recorded.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You voted for: {selectedOption}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default UI: display poll question and voting options
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{mockPollData.question}</CardTitle>
          <CardDescription>Poll ID: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ''}>
            {mockPollData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
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