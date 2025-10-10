'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

/**
 * AuthContextType - Defines the shape of the authentication context.
 *
 * Fields:
 * - user: Supabase User object or null if not authenticated.
 * - session: Supabase Session object or null.
 * - loading: boolean indicating if the auth state is being initialized.
 * - signIn: function to log in users using email and password.
 * - signUp: function to register new users with email and password.
 * - signOut: function to log out the current user.
 *
 * Why it exists:
 * - Provides a centralized way to manage user authentication state across the app.
 * - Ensures all components have consistent access to user and session data.
 */
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 *
 * Wraps the application and provides authentication context to all child components.
 * Handles initial session retrieval, auth state changes, and provides signIn/signUp/signOut functions.
 *
 * Assumptions:
 * - Supabase client is initialized and connected properly.
 * - Auth state may change externally (e.g., in another tab) and is synchronized via onAuthStateChange.
 *
 * Edge Cases Handled:
 * - Prevents rendering children until auth state is determined.
 * - Handles null session and user gracefully.
 *
 * Connected Components/Files:
 * - Supabase client (`supabaseClient.ts`) handles actual auth requests.
 * - Consumed by `useAuth` hook in functional components like `LoginForm` or `RegisterForm`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /**
     * getInitialSession - Fetches the current session from Supabase on mount.
     * 
     * Why:
     * - Ensures the app knows whether a user is logged in before rendering protected routes.
     * - Prevents flashing of unauthenticated state in UI.
     */
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    /**
     * Subscribes to auth state changes in Supabase.
     *
     * Why:
     * - Keeps the app in sync with login/logout events (even from other tabs).
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe() // Cleanup subscription on unmount
  }, [])

  /**
   * signIn - Logs in a user using email and password.
   *
   * @param email - User's email
   * @param password - User's password
   * @returns Object containing any error from Supabase
   *
   * Why:
   * - Provides a centralized login method accessible throughout the app.
   *
   * Assumptions:
   * - User already exists in Supabase.
   *
   * Edge Cases:
   * - Invalid credentials are returned as an error object.
   * - Network issues may also produce an error.
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  /**
   * signUp - Registers a new user with email and password.
   *
   * @param email - User's email
   * @param password - User's password
   * @returns Object containing any error from Supabase
   *
   * Why:
   * - Allows new users to create an account.
   * - Can be extended to send verification emails (Supabase supports this).
   *
   * Edge Cases:
   * - Email already registered returns an error.
   * - Weak passwords are rejected by Supabase.
   */
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  /**
   * signOut - Logs out the current user.
   *
   * Why:
   * - Clears session and user state.
   * - Ensures protected routes are no longer accessible after logout.
   *
   * Edge Cases:
   * - Supabase session may be invalid; method ensures client-side cleanup regardless.
   */
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = { user, session, loading, signIn, signUp, signOut }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Prevent rendering until auth state is initialized */}
    </AuthContext.Provider>
  )
}

/**
 * useAuth - Custom hook to consume AuthContext.
 *
 * Why:
 * - Provides a convenient way for functional components to access auth state and methods.
 * - Throws an error if used outside of AuthProvider to enforce proper context usage.
 *
 * Edge Cases:
 * - Ensures developers cannot accidentally use auth outside of provider, preventing runtime errors.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}