import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

/**
 * Handles POST requests to create a new note.
 *
 * @param {Request} request - The incoming request object containing the note data.
 * @returns {Promise<NextResponse>} A JSON response with the created note or an error message.
 */
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

/**
 * Handles GET requests to retrieve all notes for the authenticated user.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} A JSON response with an array of notes or an error message.
 */
export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { data: polls, error: pollError } = await supabase
      .from('polls')
      .select('*, poll_options(*)')
      .eq('creator_id', userData.user.id);
    if (pollError) {
        console.error('Error fetching notes:', pollError);
        return NextResponse.json({ error: pollError.message }, { status: 500 });
    }
    return NextResponse.json({
        success: true,
        message: "Request Successfull",
        polls
    }, 
    { status: 200 });
}