"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, signOut } = useAuth();
  
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        PollApp
      </Link>
      <div className="space-x-4">
        {
          user ? (
            <button onClick={() => signOut()} className="hover:text-blue-500">Signout</button>
          ) : (
            <Link href="/auth/register" className="hover:text-slate-700 border-1 border-[#007bf1] bg-blue-50 rounded-2xl px-4 py-2">Get started</Link>
          )
        }
        <Link href="/polls" className="hover:text-blue-500">Polls</Link>
        {user && <Link href="/polls/new" className="hover:text-blue-500">Create Poll</Link>}
      </div>
    </nav>
  );
}