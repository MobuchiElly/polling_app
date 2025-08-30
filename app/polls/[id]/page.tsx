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
const mockPollData: PollData = {
  id: '123',
  question: 'What is your favorite programming language?',
  options: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'],
};

export default function PollPage({ params }: { params: { id: string } }) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Access the id from params using React.use()
  const { id } = params;

  const handleVote = () => {
    if (selectedOption) {
      // In a real application, you would send this vote to your backend
      console.log(`Voted for: ${selectedOption} on poll ${params.id}`);
      setVoted(true);
    }
  };

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