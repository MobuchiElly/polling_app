import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "./lib/supabase/server";

export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const cookieStore = cookies();

    const supabase = await createClient();
    const { data:{session} } = await supabase.auth.getSession();

    if(req.nextUrl.pathname.startsWith("/dashboard")){
        if(!session){
            //Redirect unauthenticated users to the auth page
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = "/auth/login";
            redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }
    return res;
};

export const config = {
    matcher: [
        '/dashboard/:path',
        '/auth/login'
    ]
};