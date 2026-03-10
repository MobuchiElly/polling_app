'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoteOption } from './vote-option';
import { ShareModal } from './share-modal';
import {toast} from "react-hot-toast";


interface OptionProps {
  id: string,
  option_text: string,
  vote_count: number,
  hasVoted: boolean
}
interface VotePageProps {
  poll: {
    id: string,
    title: string,
    description: string,
    creator_id: string,
    poll_options: {
      id: string,
      option_text: string,
      vote_count: number,
      hasVoted: boolean
    }[],
    totalVotes: number,
    created_at: string,
    createdBy: string
  }
}

const dateFormatter = (ISOString:string) => {
  const date = new Date(ISOString);
  return date.toLocaleString();
}

export function VotePage({ poll }: VotePageProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoted, _setIsVoted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [votedData, _setVotedData] = useState<OptionProps[]>(poll.poll_options);

  

  //console.log("poll:", poll);
  //console.log("ToatlVotes:", poll.votes.length)

  const handleVote = async() => {
    try {
      if (!selectedOption) return;
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          option_id: selectedOption
        })
      });
  
      const data = await response.json();
      console.log("track:", response.status, data);
      if (response.status === 201) toast.success("Thank you for voting!!")
      return;
      // const updatedOptions = votedData.map((opt) =>
      //   opt.id === selectedOption ? { ...opt, votes: [opt.votes, selectedOption] } : opt
      // );
      // setVotedData(updatedOptions);
      // setIsVoted(true);
    } catch(err){
      console.error("error:", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-purple-400/25 bg-card p-2 lg:p-8 pt-4">
          <div className="mx-auto max-w-2xl mb-8">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setShareOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <div className='px-3'>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {poll.title}
              </h1>
              {poll.description && (
                <p className="text-base text-muted-foreground">{poll.description}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Created by {poll.createdBy}</span>
                <span>•</span>
                <span>{dateFormatter(poll.created_at)}</span>
                <span>•</span>
                <span>{poll.totalVotes > 1 ? `{poll.totalVotes} total votes` : "1 total vote"}</span>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              {votedData.map((option) => (
                <VoteOption
                  key={option.id}
                  name={option.option_text}
                  votes={option.vote_count}
                  totalVotes={poll.totalVotes}
                  isSelected={selectedOption === option.id && !isVoted}
                  isVoted={isVoted ? isVoted : option.hasVoted}
                  onSelect={() => {
                    if (!isVoted) setSelectedOption(option.id)
                  }}
                />
              ))}
            </div>
            {!isVoted ? (
              <div className="space-y-4">
                <button
                  onClick={handleVote}
                  disabled={!selectedOption}
                  // size="lg"
                  className="w-full bg-gradient-to-r from-purple-900 to-blue-950 py-4 rounded-lg text-white/95 font-semibold"
                >
                  Submit Vote
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  Select an option above to vote
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Vote recorded!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You voted for <span className="font-medium text-foreground">{selectedOption}</span>
                    </p>
                  </div>
                </div>
                <div className="pt-3 space-y-2">
                  <Button
                    onClick={() => setShareOpen(true)}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share This Poll
                  </Button>
                </div>
              </div>
            )}
                    </div>
          </div>

        <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            About This Poll
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • This poll was created by <span className="text-foreground font-medium">{poll.createdBy ? poll.createdBy : "N\/A"}</span>
            </li>
            <li>• All responses are public and visible to other participants</li>
            <li>• You can view live results after submitting your vote</li>
            <li>• Share this poll with others to get more responses</li>
          </ul>
        </div>
      </main>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        pollId={poll.id}
        pollTitle={poll.title}
      />
    </div>
  );
}
