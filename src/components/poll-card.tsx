'use client';

import { useState } from 'react';
import { MoreVertical, Share2, BarChart3, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface PollCardProps {
  id: string;
  title: string;
  description?: string;
  totalVotes: number;
  options: Array<{ id: string, option_text: string; votes: number }>;
  createdAt: string;
  onShare: (pollId: string) => void;
  onViewResults: (pollId: string) => void;
  onEdit?: (pollId: string) => void;
  onDelete?: (pollId: string) => void;
  isOwned?: boolean;
}

export function PollCard({
  id,
  title,
  description,
  totalVotes,
  options,
  createdAt,
  onShare,
  onViewResults,
  onEdit,
  onDelete,
  isOwned = false,
}: PollCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete?.(id);
    }, 300);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${
        isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {isOwned && (
              <Badge variant="secondary" className="text-xs">
                Your Poll
              </Badge>
            )}
          </div>
          {description && (
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          )}

          <div className="space-y-2">
            {options.map((option) => {
              const percentage =
                totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              return (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm text-foreground">
                        {option.option_text}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-700 to-purple-400/40 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{totalVotes} votes</span>
            <span>•</span>
            <span>{createdAt}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onViewResults(id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="h-4 w-4" />
              View Results
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onShare(id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              Share Poll
            </DropdownMenuItem>
            {isOwned && onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit2 className="h-4 w-4" />
                Edit Poll
              </DropdownMenuItem>
            )}
            {isOwned && onDelete && (
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete Poll
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
