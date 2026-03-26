interface PollProps {
    id: string;
    description: string;
    totalVotes: number;
    poll_options: PollOptionsProps;
}

interface PollOptionsProps {
    id: string;
    option_text: string;
    vote_count: number;
    hasVoted: boolean;
}