import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import PollsList from '@/components/PollsList';
import PollSkeleton from '@/components/PollSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Polling App',
  description: 'View and manage your polls',
};

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Link href="/dashboard/polls/new">
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            Create New Poll
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="my-polls" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="my-polls">My Polls</TabsTrigger>
          <TabsTrigger value="all-polls">All Polls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-polls">
          <h2 className="text-2xl font-semibold mb-4">My Polls</h2>
          <Suspense fallback={<PollsLoadingSkeleton />}>
            <PollsList filter="user" />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="all-polls">
          <h2 className="text-2xl font-semibold mb-4">All Polls</h2>
          <Suspense fallback={<PollsLoadingSkeleton />}>
            <PollsList filter="all" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PollsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <PollSkeleton key={i} />
      ))}
    </div>
  );
}