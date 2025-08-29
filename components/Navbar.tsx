"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        PollApp
      </Link>
      <div className="space-x-4">
        <Link href="/polls" className="hover:text-blue-500">Polls</Link>
        <Link href="/polls/new" className="hover:text-blue-500">Create Poll</Link>
      </div>
    </nav>
  );
}