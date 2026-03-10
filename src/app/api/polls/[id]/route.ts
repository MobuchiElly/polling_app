import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest, 
{ params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();

    const { data: _userData, error: userError } = await supabase.auth.getUser();
   
    if (userError) return NextResponse.json({ error: "User authentication required" }, { status: 401 });

    const { data:pollData, error: pollError } = await supabase
      .from("polls")
      .select("*, poll_options(*)")
      .eq("id", id)
      .maybeSingle();

    if (pollError) return NextResponse.json({ "error": pollError }, { status: 500 });
    if (!pollData) return NextResponse.json({ "error": "Poll not found" }, { status: 404 });
   
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
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: error?.message || 'Unauthorized to carry out this request' }, { status: 401 });
    }
    const userId = user.id;
    // First, check if the user is the creator of the poll
    const { data: poll, error: fetchError } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', id)
      .single();
    if (fetchError || !poll) {
      return NextResponse.json({ error: 'This request could not be completed because the resource cannot be found' }, { status: 404 });
    }

    if (poll.creator_id !== userId) {
      return NextResponse.json({ error: 'You are unauthorised to carry out this request' }, { status: 403 });
    }

    // Delete votes associated with the poll
    const {error: voteError} = await supabase
      .from('votes')
      .delete()
      .eq('poll_id', id);
    if(voteError) return NextResponse.json({ error: voteError.message || "Server error" }, { status: 500 });

    // Delete associated poll options
    const { error: optionsError } = await supabase
      .from('poll_options')
      .delete()
      .eq('poll_id', id);
    if (optionsError) return NextResponse.json({ error: optionsError.message }, { status: 500 });

    // Delete poll
    const { error: pollError } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);
    if (pollError) return NextResponse.json({ error: pollError.message }, { status: 500 });

    return NextResponse.json({ message: 'Poll deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// export async function PATCH(_request: NextRequest, 
//   {_params}: { params: Promise<{_id: string}>}
// ){
//   return NextResponse.json({ message: "Tracking"}, {status: 200});
// }