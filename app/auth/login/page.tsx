import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

/**
 * LoginPage Component
 *
 * Renders the login page where users can sign in with their credentials.
 * This page is a key entry point for the application, gating access
 * to protected routes such as `/polls` dashboard.
 *
 * Responsibilities:
 * - Provides a visually structured layout using Card components.
 * - Hosts the LoginForm component to handle authentication.
 * - Offers navigation to the registration page for new users.
 *
 * Why it exists:
 * - Protects poll management, voting, and other authenticated functionalities.
 * - Centralizes authentication UI in a single, maintainable page.
 *
 * Assumptions:
 * - LoginForm handles its own validation, submission, and error handling.
 * - AuthProvider wraps the app so LoginForm can use useAuth safely.
 * - Next.js App Router is configured for `/auth/register` route.
 *
 * Edge Cases:
 * - Responsiveness: Card width is constrained to max width for readability on large screens.
 * - Link fallback: if Next.js routing fails, the user may not navigate to the register page.
 *
 * Connected Components/Files:
 * - `LoginForm` handles all login logic and integrates with AuthContext.
 * - `Card`, `CardHeader`, `CardContent`, etc., standardize UI layout and styling.
 * - `/auth/register` is the registration page route for new users.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Centered card container */}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Page title */}
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          {/* Page description */}
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login form handles authentication */}
          <LoginForm />
          {/* Link to registration page for users without accounts */}
          <div className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}