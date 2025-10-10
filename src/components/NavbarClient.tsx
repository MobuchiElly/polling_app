"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavbarClient({user}: any) {
  const [userState, setUserState] = useState(user);

const signout = async () => {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (!res.ok) 
    {
      setUserState(null);
      throw new Error("Failed to sign out");
    }
    window.location.reload();
  } catch (err) {
    console.error("Signout error:", err);
  }
};

  
  return(
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center h-full w-full">
          <Link href="/" className="text-xl font-bold text-blue-600">
            PollApp
          </Link>
          <div className="space-x-4">
            {
              userState ? (
                <button onClick={signout} className="hover:text-blue-500">Signout</button>
              ) : (
                <Link href="/auth/register" className="hover:text-slate-700 border-1 border-[#007bf1] bg-blue-50 rounded-2xl px-4 py-2">Get started</Link>
              )
            }
            <Link href="/polls" className="hover:text-blue-500">Polls</Link>
            {userState && <Link href="/polls/new" className="hover:text-blue-500">Create Poll</Link>}
          </div>
        </div>
    )
}