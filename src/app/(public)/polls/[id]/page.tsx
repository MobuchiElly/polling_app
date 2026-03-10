import { VotePage } from '@/components/vote-page';
import { createClient } from "@/lib/supabase/serverForComp";
// import {cookies} from "next-headers";

interface PollPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PollPageProps) {
  const { id: pollId } = await params;

  let singlePoll = null;
  const supabase = await createClient();
  try {
    const { data:pollData, error: _pollError } = await supabase
      .from("polls")
      .select(`
                    id,
                    title,
                    description,
                    creator_id,
                    created_at,
                    poll_options (
                        id,
                        option_text,
                        votes (
                            id
                        )
                    ),
                    votes (
                        id
                    )
                `)
      .eq("id", pollId)
      .maybeSingle();
    singlePoll = pollData;
  } catch(err){
    console.error("An error occurred:", err)
  }

  if (!singlePoll) {
    return {
      title: 'Poll Not Found',
      description: 'The poll you are looking for does not exist.',
    };
  }

  return {
    title: `${singlePoll.title} - PopPoll`,
    description: singlePoll.description || 'Vote on this poll and see live results',
    openGraph: {
      title: singlePoll.title,
      description: singlePoll.description,
      type: 'website',
    },
  };
}

export default async function PollPage({ params }: PollPageProps) {
  const { id:pollId } = await params;
  let singlePoll = null;
  try {
    const supabase = await createClient();
    const {data: {user:_userData}, error:_authError} = await supabase.auth.getUser();
    const { data: pollData, error: _pollError } = await supabase
      .from("polls")
      .select(`
        id,
        title,
        description,
        creator_id,
        created_at,
        poll_options (
          id,
          option_text,
          votes (
            id,
            voter_id
          )
        )
      `)
      .eq("id", pollId)
      .maybeSingle();
    if (!pollData){
      return <div className="flex justify-center pt-20">Not found</div>
    }
    const poll_options = pollData.poll_options.map((poll_option) => ({
      id: poll_option.id,
      option_text: poll_option.option_text,
      vote_count: poll_option.votes.length,
      hasVoted: poll_option.votes.some(v => String(v.voter_id) === process.env.USER_ID)
    }))  //Fix to fetch the actual logged in user
    const totalVotes = poll_options.reduce((sum, option) => sum + option.vote_count, 0);
    singlePoll = { ...pollData, poll_options, totalVotes, createdBy: "NA" }
  } catch(err){
    console.error("An error occurred:", err);
  }


  if (!singlePoll) {
    return<div>
        This poll does not exist
    </div>;
  }

  return <VotePage poll={singlePoll} />;
}