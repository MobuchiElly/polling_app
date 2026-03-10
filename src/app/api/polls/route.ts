import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

type OptionType = {
    id: string;
    option_text: string;
    votes: {
        id: string,
    }[];   
}
type PollType = {
    id: string;
    title: string;
    description: string;
    poll_options: OptionType[];
    votes: {id:string}[],
    created_at: string,
    creator_id: string
}

export async function POST(request: Request) {
    try {
        const { title, description, options } = await request.json();
        //Validation check would be implemented using zod
        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorised request'
            }, { status: 401 });
        }
        
        const { data: pollType, error: pollError } = await supabase
            .from('polls')
            .insert([{
                title,
                description: description?.trim() ? description.trim() : null,
                creator_id: userData.user.id,
            }])
            .select()
            .single();
        if (pollError) return NextResponse.json({
            success: false,
            error: pollError.message
        }, { status: 500 });

        const pollId = pollType.id;
        const optionsRow = options.map((option: string) => ({
            poll_id: pollId,
            option_text: option
        }))
        const { data: pollOptionsData, error: pollOptionsError } = await supabase
            .from('poll_options')
            .insert(optionsRow)
            .select();

        if (pollOptionsError) {
            return NextResponse.json({
                success: false,
                error: pollOptionsError.message
            }, { status: 500 });
        }

        const pollTypeResponse = {
            id: pollType.id,
            title: pollType.title,
            description: pollType.description,
            options: pollOptionsData.map((option: OptionType) => ({
                id: option.id,
                text: option.option_text,
                votes: 0
            })),
            totalVotes: 0,
            createdAt: pollType.created_at,
            createdBy: pollType.creator_id,
            isOwned: true,
        }
        return NextResponse.json({
            success: true,
            message: "sucessfully created poll",
            poll: pollTypeResponse
        }, { status: 201 }
        );
    } catch (err) {
        console.error("err:", err);
        return NextResponse.json({
            success: false,
            error: err
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const voted = url.searchParams.get('voted') === 'true';

        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            return NextResponse.json({
                success: false,
                error: 'User not authenticated'
            }, { status: 401 });
        }
        const userId = userData.user.id;
        let query;
        
        if (voted) {
            // Fetch polls the user has voted on
            const { data: votedPollIds, error: votedPollIdsError } = await supabase
                .from("votes")
                .select("poll_id")
                .eq("voter_id", userId);

            if (votedPollIdsError) {
                console.error('Error fetching voted poll IDs:', votedPollIdsError);
                return NextResponse.json({ success: false, error: votedPollIdsError.message }, { status: 500 });
            }

            const pollIds = votedPollIds.map(v => v.poll_id);
            if (pollIds.length === 0) {
                return NextResponse.json({ success: true, polls: [], message: "No voted polls found" }, { status: 200 });
            }

            query = supabase
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
                .in("id", pollIds);
        } else {
            // Fetch polls created by the user
            query = supabase
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
                .eq("creator_id", userId);
        }

        const { data: polls, error: pollError } = await query;

        if (pollError) {
            console.error('Error fetching polls:', pollError);
            return NextResponse.json({ success: false, error: pollError.message }, { status: 500 });
        }

        const formattedPolls = polls.map((poll: PollType) => {
            const totalVotes = poll.votes ? poll.votes.length : 0;
            return {
                id: poll.id,
                title: poll.title,
                description: poll.description,
                options: poll.poll_options.map((option: OptionType) => ({
                    id: option.id,
                    text: option.option_text,
                    votes: option.votes ? option.votes.length : 0
                })),
                totalVotes: totalVotes,
                createdAt: poll.created_at,
                creator: {
                    id: poll.creator_id,
                    name: "NA"
                },
                createdBy: poll.creator_id,
                isOwned: poll.creator_id === userId,
            };
        });

        return NextResponse.json({
            success: true,
            polls: formattedPolls,
            message: "Request Successful"
        }, { status: 200 });

    } catch (err) {
        console.error("Error in GET /api/polls:", err);
        return NextResponse.json({
            success: false,
            error: (err as Error).message || "An unexpected error occurred"
        }, { status: 500 });
    }
}