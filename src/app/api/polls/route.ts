import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import polls from "../../../lib/mock_data/polls.json";

export async function POST(request: Request) {
    const { title: question, description, options } = await request.json();
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        return NextResponse.json({ error: 'Unauthorised request' }, { status: 401 });
    }

    const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert([{ 
            question,
            creator_id: userData.user.id }])
        .select()
        .single();

    if (pollError) return NextResponse.json({ error: pollError.message }, { status: 500 });

    const pollId = pollData.id;    
    const optionsRow = options.map((option: string) => ({
        poll_id: pollId,
        option_text: option
    }))

    const {data:pollOptionsData, error: pollOptionsError} = await supabase
        .from('poll_options')
        .insert(optionsRow)
        .select();
    if (pollOptionsError) return NextResponse.json({ error: pollOptionsError.message }, { status: 500 });
    const pollDataReponsponse = {...pollData, ...pollOptionsData};
    console.log("pollDataReponsponse:", pollDataReponsponse);
    return NextResponse.json({
        success: true, 
        message: "sucessfully created poll",
        poll: pollDataReponsponse
        },
        { status: 201 }
    );
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || 'user';
    
    // const supabase = await createClient();
    // const { data: userData, error: userError } = await supabase.auth.getUser();
    
    // if (userError || !userData?.user) {
    //     return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    // }

    // let query = supabase.from('polls').select('*, poll_options(*), votes(count)');
    // // Filter by user's polls only if filter is 'user'
    // if (filter === 'user') {
    //     query = query.eq('creator_id', userData.user.id);
    // }
    
    // const { data: polls, error: pollError } = await query;
    // if (pollError) {
    //     console.error('Error fetching polls:', pollError);
    //     return NextResponse.json({ error: pollError.message }, { status: 500 });
    // }
    //Temporarily fetch mock data for now

    return NextResponse.json({
        success: true,
        message: "Request Successful",
        polls
    }, 
    { status: 200 });
}