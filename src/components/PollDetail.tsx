'use client'

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import axios from 'axios';
import { useState } from 'react';

interface PollData {
  id: string
  question: string
  poll_options: { id: string; option_text: string }[]
  creator_id: string
}

const PollDetail = ({ poll }: { poll: PollData }) => {
  const [voted, setVoted] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  const handleVote = async () => {
    if (!selectedOption) return
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/votes/${id}`,
        { option_id: selectedOption }
      )
      if (res.status === 201) {
        setVoted(true)
      } else {
        setError('Unable to process your vote')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
    }
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Poll not found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {poll.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={setSelectedOption}
              value={selectedOption || ''}
              className="space-y-3"
            >
              {poll.poll_options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 border rounded-lg px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="text-gray-800 cursor-pointer"
                  >
                    {option.option_text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}

            <Button
              onClick={handleVote}
              className="mt-6 w-full text-lg font-semibold"
              disabled={!selectedOption}
            >
              Submit Vote
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={voted} onOpenChange={setVoted}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="">
            <DialogTitle>Thank you for voting!</DialogTitle>
            <DialogDescription>
              Your vote for{' '}
              <strong>
                {poll.poll_options.find((opt) => opt.id === selectedOption)
                  ?.option_text}
              </strong>{' '}
              has been recorded successfully.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PollDetail;