"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/AuthContext";
import { registerSchema } from "@/schemas/auth";
import { RegisterFormValues } from "@/types/auth";

/**
 * RegisterForm Component
 *
 * This component renders a registration form for new users to create an account.
 * It handles user input validation, password visibility toggling, and submission
 * via the AuthContext's `signUp` method. It connects directly to Supabase
 * authentication and navigational flows after successful registration.
 *
 * Why this component exists:
 * - Provides a secure way for users to register with email/password.
 * - Integrates form validation and handles error messaging.
 * - Connects to the broader authentication system (AuthContext) used across the app.
 *
 * Assumptions:
 * - `signUp` from AuthContext handles all API calls and returns errors in a consistent shape.
 * - Email is unique and Supabase is set up to enforce uniqueness.
 * - Password validation rules are defined in `registerSchema`.
 *
 * Edge cases handled:
 * - Registration failure due to duplicate email or network error.
 * - Unexpected errors during API call.
 * - Loading state prevents multiple submissions.
 */
export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * onSubmit handler
   *
   * Handles the registration logic when the user submits the form.
   * Calls the `signUp` method from AuthContext, manages loading state,
   * and displays alerts for success or error conditions.
   *
   * Why this function is needed:
   * - Encapsulates the registration workflow logic.
   * - Ensures consistent error handling and UX feedback.
   *
   * Assumptions:
   * - `values.email` and `values.password` are valid according to `registerSchema`.
   * - `signUp` communicates correctly with Supabase.
   *
   * Edge cases:
   * - Network errors or unexpected API errors are caught and logged.
   * - Prevents double submission while loading.
   *
   * @param values - The user's input from the form, validated by react-hook-form and Zod.
   */
  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const { email, password, confirmPassword } = values;
      const res = await axios.post("/api/auth/register", {
        email, password
      });
     if (res.status === 200){
        router.push("/auth/login");
     }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ?  error?.response?.data.error : "Error: Registration unsuccessfull."
      alert(errorMessage);
      console.log("error: ", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                  {/* Toggle password visibility */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}