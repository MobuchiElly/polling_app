import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import PollSkeleton from "@/components/PollSkeleton";
import PollsList from "@/components/PollsList";
import { createClient } from "@/lib/supabase/server";

export default async function PollsDashboard() {
  //const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //Temporarily hard code user
  const user = "John Doe";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Polls</h1>
        <Link href={user ? "/polls/new" : "/auth/login"}>
          <Button>Create New Poll</Button>
        </Link>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PollSkeleton key={i} />
          ))}
        </div>
      }>
        <PollsList />
      </Suspense>
    </div>
  );
}