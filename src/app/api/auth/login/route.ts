import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST(request: Request) {
    const { email, password } = await request.json();
    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 }
        );
    };
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) {
            return NextResponse.json({ 
                success: false,
                error: error?.message || "Connection issue", 
                user: null,
                session: null        
            }, 
            { status: 400 });
        }
        return NextResponse.json(
            {
                success: true,
                message: "user login successful",
                user: data.user,
                session: data.session,
            }, { status: 200 }
        );
    } catch (error) {
        console.error("error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { 
                success: false,
                error: message,
                user: null,
                session: null
            }, { status: 500 }
        );
    }
}