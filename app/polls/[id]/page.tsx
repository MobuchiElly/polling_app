'use client';

import { use } from 'react'; // React 18 hook for unwrapping promises
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

const mockPollData: PollData = {
  id: '123',
  question: 'What is your favorite programming language?',
  options: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'],
};

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  // unwrap the promise passed in by Next.js dynamic route
  const { id } = use(params);

  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleVote = () => {
    if (selectedOption) {
      console.log(`Voted for: ${selectedOption} on poll ${id}`);
      setVoted(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{mockPollData.question}</CardTitle>
          <CardDescription>Poll ID: {id}</CardDescription>
        </CardHeader>

        <CardContent>
          {!voted ? (
            <>
              <RadioGroup
                onValueChange={(value) => setSelectedOption(value)}
                className="space-y-3"
              >
                {mockPollData.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
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
            <div className="text-center">
              <p className="text-lg font-semibold">Thanks for voting!</p>
              <p className="text-gray-500 mt-2">
                You voted for: <span className="font-bold">{selectedOption}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}