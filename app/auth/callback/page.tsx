"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("session:", session);
      if (session) {
        //router.push("/polls"); // redirect to your main app
      } else {
        router.push("/auth/login");
      }
    };

    handleSession();
  }, [router]);

  return (
    <main className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>

        {/* Message */}
        <h1 className="text-lg font-medium tracking-tight">
          Processing authentication
        </h1>
        <p className="text-sm text-gray-500">Please wait a moment...</p>
      </div>
    </main>
  );
}