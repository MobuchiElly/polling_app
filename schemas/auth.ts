import { z } from "zod";

/**
 * loginSchema
 * 
 * What it does:
 * - Defines validation rules for the login form using Zod.
 * - Ensures the email is both present and correctly formatted.
 * - Ensures the password is present and meets a minimum length requirement.
 * 
 * Why it exists in the app:
 * - Prevents invalid login attempts before they are sent to Supabase, reducing unnecessary network calls.
 * - Improves user experience by giving instant feedback on form errors (e.g., missing fields).
 * - Acts as a safeguard to ensure the backend only receives well-structured input.
 * 
 * Assumptions:
 * - The frontend form (`LoginForm`) will call this schema before triggering `signIn` in `AuthProvider`.
 * - Users are expected to have already registered with valid credentials.
 * 
 * Edge cases:
 * - Empty email field: triggers `"Email is required"`.
 * - Invalid email format: triggers `"Please enter a valid email address"`.
 * - Password too short (<6 characters): triggers `"Password must be at least 6 characters"`.
 * 
 * Connected Components:
 * - `LoginForm` → imports and uses this schema for client-side validation.
 * - `AuthProvider.signIn` → relies on validated input before making a Supabase call.
 */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"), // redundant safeguard in case form sends empty password
});

/**
 * registerSchema
 * 
 * What it does:
 * - Defines validation rules for the registration form.
 * - Validates email format, ensures a minimum password length, and enforces password confirmation.
 * - Uses `refine` to guarantee that `password` and `confirmPassword` match.
 * 
 * Why it exists in the app:
 * - Prevents invalid user registrations before hitting Supabase.
 * - Improves user experience by handling common mistakes (e.g., mismatched passwords).
 * - Reduces backend load by enforcing input rules client-side.
 * 
 * Assumptions:
 * - Used in `RegisterForm` before calling `AuthProvider.signUp`.
 * - Registration requires password confirmation for security and UX clarity.
 * 
 * Edge cases:
 * - Invalid email → `"Invalid email address."`.
 * - Password shorter than 6 characters → `"Password must be at least 6 characters."`.
 * - `password` and `confirmPassword` do not match → `"Passwords don't match."`.
 * - Empty fields: Zod ensures all fields are required.
 * 
 * Connected Components:
 * - `RegisterForm` → imports and applies this schema.
 * - `AuthProvider.signUp` → assumes only validated credentials are passed through.
 * - Tied into the authentication flow with Supabase via the callback page.
 */
const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // highlight confirmPassword field if mismatch
  });

export { loginSchema, registerSchema };