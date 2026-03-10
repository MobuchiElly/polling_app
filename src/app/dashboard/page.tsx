'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PollCard } from '@/components/poll-card';
import { ShareModal } from '@/components/share-modal';
import { PollResults } from '@/components/poll-results';
import { CreatePollModal } from '@/components/create-poll-modal';
import { toast } from "react-hot-toast";

type OptionProps = {
    id: string;
    option_text: string;
    votes: number;   
}
type PollProps = {
    id: string;
    title: string;
    description: string;
    options: OptionProps[];
    totalVotes: number,
    isOwned: boolean
    createdAt: string,
    creator: {
      id: string,
      name: string
    }
    createdBy: string
}

export default function Dashboard() {
  const [polls, setPollsCreated] = useState<PollProps[]>([]);
  const [pollsVoted, setPollsVoted] = useState<PollProps[]>([]);
  const [selectedSharePoll, setSelectedSharePoll] = useState<PollProps | null>(null);
  const [selectedResultsPoll, setSelectedResultsPoll] = useState<PollProps | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleShare = (pollId: string) => {
    const poll = polls.find((p) => p.id === pollId);
    if (poll) {
      setSelectedSharePoll(poll);
    }
  };

  const handleViewResults = (pollId: string) => {
    const allPolls = [...polls, ...pollsVoted];
    const poll = allPolls.find((p) => p.id === pollId);
    if (poll) {
      setSelectedResultsPoll(poll);
    }
  };

  const handleEdit = (_pollId: string) => {
    toast("This feature would be implemented shortly");
  };

  const handleDelete = async (pollId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json"
        }
      });
      const response = await res.json();
      if (!res.ok){
        toast.error(response.error || "Failed to delete poll");
        return;
      }
      toast.success("Poll deleted successfully");
      setPollsCreated((prev) => prev.filter(p => p.id !== pollId));
      setPollsVoted((prev) => prev.filter(p => p.id !== pollId));
      setLoading(false);
    } catch (error) {
      console.error("error:", error);
      setLoading(false);
      toast.error("Request failed");
    }
  };

  const handleCreatePoll = async (pollData: {
    title: string;
    description?: string;
    options: string[];
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          title: pollData.title,
          description: pollData.description ? pollData.description : undefined,
          options: pollData.options,
        })
      });
      const newPoll = await res.json();
      return res.ok ? { success: true, message: "Poll creation successfull" } : { success: false, message: "Poll creation failed" };
      setPollsCreated([newPoll?.poll, ...polls]);
    } catch (error) {
      console.error("error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchUserCreatedPolls = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/polls");
        const resData = await res.json();
        if (res.ok) setPollsCreated(resData.polls);
        setLoading(false);
      } catch (error) {
        console.error("error:", error);
        setLoading(false);
      }
    }
    fetchUserCreatedPolls();
  }, []);

  useEffect(() => {
    const fetchUserVotedPolls = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/polls?voted=true");
        const resData = await res.json();
        if (res.ok) setPollsVoted(resData.polls);
        setLoading(false);
      } catch (error) {
        console.error("error:", error);
        setLoading(false);
      }
    }
    fetchUserVotedPolls();
  }, []);

  if (loading){
    return <div className="flex justify-center pt-24">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                PopPoll
              </h1>
              <p className="mt-2 text-muted-foreground">
                Create polls, share with others, and get instant feedback
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:bg-blue-700 font-semibold text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Poll
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="created" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="created">
              My Polls ({polls.length})
            </TabsTrigger>
            <TabsTrigger value="voted">
              Voted ({pollsVoted.length})
            </TabsTrigger>
          </TabsList>

          {/* Created Polls Tab */}
          <TabsContent value="created" className="space-y-4">
            {polls.length === 0 && loading ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-secondary/30 px-4 py-12 text-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No polls yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Create your first poll to get started
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  Create Poll
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {polls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    id={poll.id}
                    title={poll.title}
                    description={poll.description}
                    totalVotes={poll.totalVotes}
                    options={poll.options}
                    createdAt={poll.createdAt}
                    onShare={handleShare}
                    onViewResults={handleViewResults}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isOwned={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Voted Polls Tab */}
          <TabsContent value="voted" className="space-y-4">
            {pollsVoted.length === 0 && loading ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-secondary/30 px-4 py-12 text-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No polls voted yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Polls shared with you will appear here
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {pollsVoted.map((poll) => (
                  <PollCard
                    key={poll.id}
                    id={poll.id}
                    title={poll.title}
                    description={poll.description}
                    totalVotes={poll.totalVotes}
                    options={poll.options}
                    createdAt={poll.createdAt}
                    onShare={handleShare}
                    onViewResults={handleViewResults}
                    isOwned={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePoll}
      />

      {selectedSharePoll && (
        <ShareModal
          isOpen={!!selectedSharePoll}
          onClose={() => setSelectedSharePoll(null)}
          pollId={selectedSharePoll.id}
          pollTitle={selectedSharePoll.title}
        />
      )}

      {selectedResultsPoll && (
        <PollResults
          isOpen={!!selectedResultsPoll}
          onClose={() => setSelectedResultsPoll(null)}
          title={selectedResultsPoll.title}
          description={selectedResultsPoll.description}
          options={selectedResultsPoll.options}
          totalVotes={selectedResultsPoll.totalVotes}
          createdAt={selectedResultsPoll.createdAt}
        />
      )}
    </main>
  );
}