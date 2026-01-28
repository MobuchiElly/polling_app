"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * AuthCallback Component
 * 
 * Handles the redirect callback from Supabase authentication (e.g., OAuth or email link verification).
 * 
 * What it does:
 * - Checks the current session with Supabase when the component mounts.
 * - Redirects the user based on session existence:
 *    - If a valid session exists, the user can be redirected to the main app (currently commented `/polls`).
 *    - If no session exists, the user is redirected to the login page.
 * - Displays a loading spinner and informational message while the session is being verified.
 * 
 * Why it exists:
 * - Necessary for OAuth flows or email verification links that redirect users back to the app.
 * - Ensures that only authenticated users can access protected routes.
 * - Provides feedback to users during the authentication processing phase.
 * 
 * Assumptions:
 * - Supabase client is correctly initialized and configured.
 * - Redirect URIs are properly set up in Supabase (e.g., NEXT_PUBLIC_BASE_URL/auth/callback).
 * - `useRouter` is available via Next.js App Router.
 * 
 * Edge Cases:
 * - No session exists: user is redirected to login to prevent unauthorized access.
 * - Session retrieval fails (network issues or Supabase downtime): currently unhandled, could be improved with error UI.
 * - User refreshes the callback page: session check will run again.
 * 
 * Connected Components/Files:
 * - `lib/supabaseClient.ts` contains Supabase initialization.
 * - Protected routes like `/polls` rely on this flow to ensure authentication.
 * - Works in conjunction with `LoginForm` and `RegisterForm` which initiate authentication.
 */
export default function AuthCallback() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Debugging: log the session object
      console.log("session:", session);

      if (session) {
        // User is authenticated
        router.push("/polls");
      } else {
        // No session: redirect user to login page to re-authenticate
        router.push("/auth/login");
      }
    };

    handleSession();
  }, [router, supabase]);

  return (
    <main className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Spinner displayed while session is being verified */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>

        {/* Informational message for users */}
        <h1 className="text-lg font-medium tracking-tight">
          Processing authentication
        </h1>
        <p className="text-sm text-gray-500">Please wait a moment...</p>
      </div>
    </main>
  );
}