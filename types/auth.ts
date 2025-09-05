import { z } from "zod";
import { loginSchema } from "@/schemas/auth";
import { registerSchema } from "@/schemas/auth";

/**
 * LoginFormData
 * 
 * What it does:
 * - Derives a TypeScript type from the `loginSchema` defined with Zod.
 * - Ensures form data passed to login-related components (e.g., `LoginForm`) 
 *   is always consistent with the validation schema.
 * 
 * Why it exists in the app:
 * - Creates a single source of truth for login form structure and validation.
 * - Avoids discrepancies between frontend form handling and schema validation.
 * - Improves developer experience by providing strong type-checking and IntelliSense in the editor.
 * 
 * Assumptions:
 * - The `loginSchema` already handles required validation (e.g., email format, password length).
 * - This type will be used in React components (likely with `react-hook-form` or similar).
 * 
 * Edge cases:
 * - If `loginSchema` changes (e.g., adds a new field), this type will automatically update,
 *   which could break components until they align with the schema. This is intentional, 
 *   as it forces consistency across the app.
 * 
 * Connected Components:
 * - `LoginForm` → uses this type to define its form state.
 * - `AuthProvider.signIn` → indirectly benefits, since only validated and typed data
 *   should be passed from the form.
 */
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * RegisterFormValues
 * 
 * What it does:
 * - Derives a TypeScript type from the `registerSchema` defined with Zod.
 * - Guarantees that data collected during user registration matches the validation rules.
 * 
 * Why it exists in the app:
 * - Provides type safety for the registration form, ensuring developers cannot accidentally 
 *   pass unvalidated or incorrectly shaped data to `AuthProvider.signUp`.
 * - Helps bridge Zod validation with TypeScript's type system, reducing runtime bugs.
 * 
 * Assumptions:
 * - Registration requires `email`, `password`, and `confirmPassword`, with validation logic 
 *   handled inside the schema.
 * - Components consuming this type (e.g., `RegisterForm`) rely on it for strong typing.
 * 
 * Edge cases:
 * - Any future changes in `registerSchema` (like adding username or stricter password policies) 
 *   will immediately propagate here, enforcing updates in all dependent components.
 * 
 * Connected Components:
 * - `RegisterForm` → uses this type to strongly type its form data and ensure validation consistency.
 * - `AuthProvider.signUp` → expects form values shaped according to this type.
 */
type RegisterFormValues = z.infer<typeof registerSchema>;

export type { LoginFormData, RegisterFormValues };