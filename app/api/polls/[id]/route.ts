import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

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
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}