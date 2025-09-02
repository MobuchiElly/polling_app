import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Replace with the test user's credentials
const TEST_USER_EMAIL = process.env.NEXT_PUBLIC_TEST_EMAIL;
const TEST_USER_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD;

// Test tables
const POLLS_TABLE = "test_polls";
const OPTIONS_TABLE = "test_poll_options";

describe("PollForm integration with Supabase (test tables)", () => {
  let pollId: string | null = null;
  let authSupabase = supabaseClient; // will hold the signed-in client

  beforeAll(async () => {
    // Sign in the user before running tests
    const { data: session, error } = await supabaseClient.auth.signInWithPassword({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    if (error) throw error;

    // Use a client authenticated with the signed-in user's access token
    authSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${session.session?.access_token}`,
        },
      },
    });
  });

  afterAll(async () => {
    if (pollId) {
      // Cleanup poll options first (FK constraint)
      await authSupabase.from(OPTIONS_TABLE).delete().eq("poll_id", pollId);

      // Cleanup poll
      await authSupabase.from(POLLS_TABLE).delete().eq("id", pollId);
    }
  });

  it("should create a poll and its options in the test tables", async () => {
    // Step 1: Insert poll
    const { data: poll, error: pollError } = await authSupabase
      .from(POLLS_TABLE)
      .insert([{ question: "Integration Test Poll" }])
      .select()
      .single();

    expect(pollError).toBeNull();
    expect(poll).toBeTruthy();
    expect(poll!.question).toBe("Integration Test Poll");

    pollId = poll!.id;

    // Step 2: Insert options
    const { error: optionsError } = await authSupabase.from(OPTIONS_TABLE).insert([
      { option_text: "Option A", poll_id: pollId },
      { option_text: "Option B", poll_id: pollId },
    ]);

    expect(optionsError).toBeNull();

    // Step 3: Verify poll options exist
    const { data: options, error: fetchError } = await authSupabase
      .from(OPTIONS_TABLE)
      .select("*")
      .eq("poll_id", pollId);

    expect(fetchError).toBeNull();
    expect(options).toHaveLength(2);
    expect(options?.map((o) => o.option_text)).toEqual(
      expect.arrayContaining(["Option A", "Option B"])
    );
  });
});
