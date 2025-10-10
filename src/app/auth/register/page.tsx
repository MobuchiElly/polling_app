import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * RegisterPage Component
 *
 * Renders the registration page where new users can create an account.
 * This page is a key entry point for onboarding users into the application.
 *
 * Responsibilities:
 * - Provides a visually structured layout using Card components.
 * - Hosts the RegisterForm component to handle user registration.
 * - Offers navigation to the login page for existing users.
 *
 * Why it exists:
 * - Facilitates new user onboarding and account creation.
 * - Ensures new users can access protected routes such as `/polls` after registration.
 *
 * Assumptions:
 * - RegisterForm handles its own validation, submission, and error handling.
 * - AuthProvider wraps the app so RegisterForm can use `useAuth` safely.
 * - Next.js App Router is configured for `/auth/login` route.
 *
 * Edge Cases:
 * - Responsiveness: Card width is constrained for readability on large screens.
 * - Link fallback: if Next.js routing fails, the user may not navigate to the login page.
 *
 * Connected Components/Files:
 * - `RegisterForm` handles registration logic and integrates with AuthContext.
 * - `Card`, `CardHeader`, `CardContent`, etc., standardize UI layout and styling.
 * - `/auth/login` is the login page route for existing users.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Centered card container */}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Page title */}
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          {/* Page description */}
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Registration form handles user creation */}
          <RegisterForm />
          {/* Link to login page for users who already have accounts */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}