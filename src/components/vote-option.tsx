'use client';

import { Button } from '@/components/ui/button';

interface VoteOptionProps {
  name: string;
  votes: number;
  totalVotes: number;
  isSelected: boolean;
  isVoted: boolean;
  onSelect: () => void;
}

export function VoteOption({
  name,
  votes,
  totalVotes,
  isSelected,
  isVoted,
  onSelect
}: VoteOptionProps) {
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

  return (
    <Button
      onClick={onSelect}
      disabled={isVoted}
      variant="outline"
      className={`relative w-full h-auto overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-200 ${
        isSelected && !isVoted
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/20'
      } ${isVoted ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className="absolute inset-0 rounded-lg  border border-purple-600/50 shadow-sm">
        <div
          className="h-full bg-gradient-to-r from-primary/10 to-accent/10 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-foreground text-base leading-tight">
            {name}
          </p>
        </div>

        {isVoted && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">{percentage}%</p>
              <p className="text-xs text-muted-foreground">{votes} votes</p>
            </div>
          </div>
        )}
      </div>
    </Button>
  );
}