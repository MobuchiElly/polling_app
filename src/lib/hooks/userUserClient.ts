import { useAuth } from '../AuthContext';
import { createClient } from '@/lib/supabase/client';

/**
 * Custom Hook: useUserClient
 *
 * Provides a convenience wrapper around Supabase queries that are scoped
 * to the currently authenticated user. By combining `useAuth` with
 * Supabase queries, it ensures we never fetch user-specific data unless
 * the user is logged in.
 *
 * Why it's needed:
 * - Centralizes the logic of "only fetch polls for the logged-in user."
 * - Prevents duplicate logic (auth + query) across multiple components.
 * - Makes components simpler by hiding Supabase query details inside the hook.
 *
 * Assumptions:
 * - `useAuth` returns a valid `user` object when logged in, otherwise `null`.
 * - Supabase is properly configured and the "polls" table has a `created_by` field
 *   that matches the `user.id` from Auth.
 *
 * Edge Cases:
 * - If `user` is not logged in, `fetchPolls` will throw immediately.
 *   Consumers of this hook must handle that error gracefully.
 * - If Supabase returns an error, it’s passed through so components can handle it.
 *
 * Connections:
 * - Intended to be used in dashboard or profile-related pages where the app
 *   needs to display polls created by the logged-in user.
 * - Relies on `AuthContext` (for user state) and `supabaseClient` (for queries).
 */
export const useUserClient = () => {
  const supabase = createClient();
  const { user } = useAuth();

  /**
   * Fetches all polls created by the currently authenticated user.
   *
   * @returns An object containing `data` (array of polls) and `error` (if any).
   * @throws Error if no user is logged in (consumer must catch this).
   */
  const fetchPolls = async () => {
    if (!user) throw new Error('User not logged in');

    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('created_by', user.id);

    return { data, error };
  };

  return { user, fetchPolls };
};