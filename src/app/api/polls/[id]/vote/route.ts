import { createClient } from '@/lib/supabase/server';
// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { option_id } = await request.json();
    
    if (!option_id) return NextResponse.json(
        { error: 'option_id is required' },
        { status: 400 }
    )
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        const userId = user.id;
   
        const { data: _data, error } = await supabase
            .from("votes")
            .upsert({
            poll_id: id,
            option_id,
            voter_id: userId
            }, {
                onConflict: "poll_id,voter_id",
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) {
            console.error("Error upserting vote:", error);
            return NextResponse.json({ "error": error.message || "Server error" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "request successful"
        },{status: 201})
    } catch(error){
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}