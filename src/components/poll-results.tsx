'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Option {
  id: string;
  option_text: string;
  votes: number;
}

interface PollResultsProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  options: Option[];
  totalVotes: number;
  createdAt: string;
}

export function PollResults({
  isOpen,
  onClose,
  title,
  description,
  options,
  totalVotes,
  createdAt,
}: PollResultsProps) {
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Votes</p>
              <p className="text-3xl font-bold text-foreground">{totalVotes}</p>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm text-muted-foreground mb-1">Created</p>
              <p className="text-sm text-foreground pt-2">{createdAt}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Results</h3>
            {sortedOptions.map((option, index) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-foreground">
                        {option.option_text}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {percentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.votes} votes
                      </p>
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
