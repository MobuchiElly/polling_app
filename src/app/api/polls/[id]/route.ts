import { createClient } from '@/lib/supabase/server';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import polls from "../../../../lib/mock_data/polls.json";

export async function GET(
  _request: NextRequest, 
{ params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // const supabase = await createClient();

    // const { data: { user }, error: userError } = await supabase.auth.getUser();
    // if (userError) return NextResponse.json({ error: "User authentication required" }, { status: 401 });

    // const { data:pollData, error: pollError } = await supabase
    //   .from("polls")
    //   .select("*, poll_options(*)")
    //   .eq("id", id)
    //   .maybeSingle();

    // if (pollError) return NextResponse.json({ "error": pollError }, { status: 500 });
    // if (!pollData) return NextResponse.json({ "error": "Poll not found" }, { status: 404 });
    const pollData = polls.find((poll) => poll.id == id);
    if (!pollData) return NextResponse.json({ "error": "Poll not found" }, { status: 404 });
    console.log("poll id:", id);
    console.log("poll:", pollData);
    return NextResponse.json({
      success: true,
      message: "request successful",
      poll: pollData
    },{status: 200})
  } catch(err){
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, check if the user is the creator of the poll
    const { data: poll, error: fetchError } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (fetchError || !poll) {
      console.error('Error fetching poll or poll not found:', fetchError);
      return NextResponse.json({ error: 'Poll not found or access denied' }, { status: 404 });
    }

    if (poll.creator_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You are not the creator of this poll' }, { status: 403 });
    }

    // Delete associated poll options first due to foreign key constraint
    const { error: optionsError } = await supabase
      .from('poll_options')
      .delete()
      .eq('poll_id', id);

    if (optionsError) {
      console.error('Supabase poll options delete error:', optionsError);
      return NextResponse.json({ error: optionsError.message }, { status: 500 });
    }

    // Then delete the poll itself
    const { error: pollError } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);

    if (pollError) {
      console.error('Supabase poll delete error:', pollError);
      return NextResponse.json({ error: pollError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Poll deleted successfully' }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}