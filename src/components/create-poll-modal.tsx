'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from "react-hot-toast";


interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (pollData: {
    title: string;
    description?: string;
    options: string[];
  }) => Promise<{
    success: boolean;
    message: string;
  } | undefined>;
}

export function CreatePollModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePollModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Poll title is required");
      return;
    }
    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      toast.error("At least 2 poll options are required");
      return;
    }

    //setIsSubmitting(true);
    const response = await onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      options: validOptions
    });
    
    if (response?.success) {
      // setTitle('');
      // setDescription('');
      // setOptions(['', '']);
      setIsSubmitting(false);
      // onClose();
      toast.success("Your poll has been created");
      return
    } else {
      toast.error("Poll creation failed");
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
          <DialogDescription>
            Create a poll and share it with others to get their opinions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Poll Title *
            </label>
            <Input
              placeholder="What's your question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description (optional)
            </label>
            <Textarea
              placeholder="Add more context to your poll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary text-foreground min-h-20 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Poll Options *
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="bg-secondary text-foreground"
                  />
                  {options.length > 2 && (
                    <Button
                      onClick={() => handleRemoveOption(index)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleAddOption}
              variant="outline"
              className="w-full mt-2 bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}