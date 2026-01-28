"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {User} from "lucide-react";
// import {createClient} from "@/lib/supabase/server";


export default function NavbarClient() {
  // const supabase = await createClient();
  // const {data: {user}} = await supabase.auth.getUser();
  //const [userState, setUserState] = useState(user);
  //const [userState, setUserState] = useState("John Doe");
  const [userProfileActive, setUserProfileActive] = useState(false);

  // const signout = async () => {
  //   try {
  //     const res = await fetch("/api/auth/logout", { method: "POST" });
  //     if (!res.ok) {
  //       setUserState(null);
  //       throw new Error("Failed to sign out");
  //     }
  //     window.location.reload();
  //   } catch (err) {
  //     console.error("Signout error:", err);
  //   }
  // };
  
  return(
        <nav className="fixed top-0 z-50 bg-white/95 w-full">
          <div className="shadow-md px-6 flex justify-between items-center relative">
            <Link href="/" className="text-xl font-bold text-blue-600">
              <Image
              src="/img/poppoll-nobg.png"
              alt=""
              height="80" width="80" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/polls" className="hover:text-blue-500">Polls</Link>
              <Link href="/dashboard/polls/new" className="bg-gradient-to-r from-blue-500 to-purple-600 py-2 px-4 text-white rounded-lg">Create Poll</Link>
              <div className="" onClick={() => setUserProfileActive(!userProfileActive) }>
                <User className="h-7 w-7 hover:scale-105"/>
                { userProfileActive &&
                  <div className="absolute bg-white/85 rounded-lg top-18 right-0 z-50 py-6 pl-4 pr-6 space-y-2">
                    <button className="cursor-pointer hover:scale-105 text-left font-bold w-full bg-white pl-4 py-2 rounded-md text-purple-900">
                      <Link href="/dashboard">Dashboard</Link>
                    </button>
                    <button className="cursor-pointer hover:scale-105 font-bold w-full bg-purple-600 p-2 rounded-md text-white">
                      <Link
                        href="/auth/login"
                        className="w-full">Login</Link>
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </nav>
    )
}