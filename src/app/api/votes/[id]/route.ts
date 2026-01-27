import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const {option_id} = await request.json();
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "User authentication required" }, { status: 401 });

    const { data, error } = await supabase
      .from("votes")
      .insert([{
        poll_id: id,
        option_id,
        voter_id: user.id
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ "error": error }, { status: 500 });

    return NextResponse.json({
      success: true,
      message: "request successful"
    },{status: 201})
  } catch(err:any){
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}