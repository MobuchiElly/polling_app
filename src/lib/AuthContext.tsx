'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, User, AuthError, Session } from '@supabase/supabase-js';

/**
 * Initialize Supabase client
 *
 * Why:
 * - Provides the core API to interact with Supabase Auth (signIn, signUp, signOut, session tracking).
 * 
 * Assumptions:
 * - Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Defines the shape of the AuthContext.
 *
 * Fields:
 * - user: Current authenticated user or null.
 * - signIn: Function to log in with email/password.
 * - signUp: Function to create a new user account.
 * - signOut: Function to log out the current user.
 *
 * Why it exists:
 * - Provides a centralized authentication state and methods to all components via React Context.
 */
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 *
 * Wraps the app and provides authentication context to all children.
 * Manages user state, session, and Supabase auth events.
 *
 * Assumptions:
 * - Supabase client is correctly initialized.
 * - Children components are React functional components that consume auth state via `useAuth`.
 *
 * Edge Cases:
 * - Handles null session and user on initialization.
 * - Keeps user state in sync with Supabase across tabs/windows via onAuthStateChange.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    /**
     * Subscribes to auth state changes in Supabase.
     * Updates user state whenever login/logout occurs.
     */
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    /**
     * Fetches initial session on mount.
     * Prevents flashing unauthenticated state on page load.
     */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe(); // Cleanup subscription on unmount
    };
  }, []);

  /**
   * signIn - Authenticates user via email and password
   *
   * @param email - User email
   * @param password - User password
   * @returns Object containing user, session, and any auth error
   *
   * Why:
   * - Centralized login function used throughout the app for forms like LoginForm.
   *
   * Edge Cases:
   * - Invalid credentials return error from Supabase.
   * - Network failures return an error object.
   * 
   * Connected Components:
   * - Consumed in LoginForm component via `useAuth`.
   */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Update user state on successful login
    setUser(data.user);

    // Optional: handle/log errors (do not expose sensitive info to client)
    if (error) {
      const errMessage = error.message.split(":")[1] || "";
      console.warn('Sign-in error:', errMessage);
    }

    return { user: data.user, session: data.session, error };
  };

  /**
   * signUp - Registers a new user account
   *
   * @param email - User email
   * @param password - User password
   * @returns Object containing user, session, and any auth error
   *
   * Why:
   * - Centralized signup function for forms like RegisterForm.
   * - Optionally supports email verification redirect.
   *
   * Edge Cases:
   * - Email already registered returns error.
   * - Weak passwords are rejected by Supabase.
   *
   * Connected Components:
   * - Consumed in RegisterForm component via `useAuth`.
   */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` }
    });

    setUser(data.user);

    if (error) {
      const errMessage = error.message.split(":")[1] || "";
      console.warn('Sign-up error:', errMessage);
    }

    return { user: data.user, session: data.session, error };
  };

  /**
   * signOut - Logs out the current user
   *
   * Why:
   * - Clears auth state and prevents access to protected routes.
   *
   * Edge Cases:
   * - Supabase session may be invalid; client state is still reset.
   *
   * Connected Components:
   * - Used in Navbar, Logout buttons, or anywhere the user can sign out.
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);

    if (error) {
      const errMessage = error.message.split(":")[1] || "";
      console.warn('Sign-out error:', errMessage);
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - Custom hook to access AuthContext
 *
 * Why:
 * - Provides a convenient way for components to consume auth state and methods.
 *
 * Edge Cases:
 * - Throws error if used outside AuthProvider to enforce correct context usage.
 *
 * Connected Components:
 * - Used in LoginForm, RegisterForm, Navbar, or any component that requires authentication.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};