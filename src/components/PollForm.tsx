"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, {AxiosError} from "axios";
import { useAuth } from "@/lib/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the Zod schema for poll creation
const pollFormSchema = z
  .object({
    title: z.string().trim().min(1, "Poll title is required!"),
    description: z.string().optional(),
    options: z
      .array(z.string().trim().min(1, "All poll options are required!"))
      .min(2, "A poll must have at least 2 options."),
  })
  .superRefine((data, ctx) => {
    const normalized = data.options.map((o) => o.trim().toLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Options must be unique.",
      });
    }
  });


type PollFormValues = z.infer<typeof pollFormSchema>;

/**
 * PollForm Component
 *
 * This component renders a form that allows authenticated users to create a new poll.
 * It handles:
 *  - Poll question and description input
 *  - Dynamic poll options management (add/remove/change)
 *  - Validation before submission
 *  - Saving poll and options into the Supabase database
 *  - Redirecting to the poll’s detail page upon successful creation
 *
 * Why it’s needed:
 * This is the core entry point for user-generated content in the app. Without this,
 * there is no way to create polls, making it central to the app’s functionality.
 *
 * Assumptions:
 * - The user must be authenticated (checked via AuthContext).
 * - Supabase tables `polls` and `poll_options` exist and have the expected schema.
 * - A poll must have at least 2 non-empty options.
 *
 * Edge Cases:
 * - If the user is not logged in → auto-redirects to `/auth/login`.
 * - If fewer than 2 options exist, the last remove attempt is ignored.
 * - Handles Supabase errors gracefully and displays them to the user.
 */
export default function PollForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, control, watch, formState: { errors }, setValue, getValues } = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      options: ["", ""]
    },
  });

  const options = watch("options"); 

  /**
   * handleOptionChange
   *
   * Updates a specific poll option when the user types into its input field.
   *
   * Why: Ensures controlled input state so React keeps the form data in sync.
   *
   * @param index - Index of the option being modified
   * @param value - New string value entered by the user
   */
  const handleOptionChange = (index: number, value: string) => {
    const currentOptions = getValues("options");
    const updated = [...currentOptions];
    updated[index] = value;
    setValue("options", updated, { shouldValidate: true });
  };

  /**
   * addOption
   *
   * Adds a new empty option field.
   *
   * Why: Gives users flexibility to add more than the default 2 options.
   * Assumption: The database supports any reasonable number of options.
   */
  const addOption = () => {
    setValue("options", [...options, ""], { shouldValidate: true });
  };

  /**
   * removeOption
   *
   * Removes an option field at the given index.
   *
   * Why: Users may want to reduce choices after adding extra ones.
   * Edge case: Prevents removing below 2 options (minimum requirement for a poll).
   *
   * @param index - Index of the option to remove
   */
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Enforce minimum of 2 options
    setValue("options", options.filter((_, i) => i !== index), { shouldValidate: true });
  };

  /**
   * handleSubmit
   *
   * Handles form submission: validates input, creates poll in Supabase,
   * inserts its options, then redirects to the new poll page.
   *
   * Why: Central logic that bridges the UI form with backend persistence.
   *
   * Assumptions:
   * - Supabase `polls` table has `question` and `creator_id` columns.
   * - Supabase `poll_options` table has `option_text` and `poll_id` columns.
   *
   * Edge Cases:
   * - Empty title → shows error message.
   * - Any blank option → shows error message.
   * - Database/network error → shows user-friendly error message.
   *
   * @param e - React form submission event
   */
  const onSubmit = async (data: PollFormValues) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create poll.");
      }
      const result = await response.json();
      const pollId = result.pollId;
      //router.push(`/dashboard/polls/${pollId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Internal server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Error Icon */}
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 
                  1.414L8.586 10l-1.293 1.293a1 1 0 
                  101.414 1.414L10 11.414l1.293 
                  1.293a1 1 0 001.414-1.414L11.414 
                  10l1.293-1.293a1 1 0 
                  00-1.414-1.414L10 8.586 
                  8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            {/* Dismiss Button */}
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 
                      0L10 8.586l4.293-4.293a1 1 0 
                      111.414 1.414L11.414 10l4.293 
                      4.293a1 1 0 01-1.414 1.414L10 
                      11.414l-4.293 4.293a1 1 0 
                      01-1.414-1.414L8.586 10 4.293 
                      5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Poll Title */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Poll Question
        </label>
        <input
          type="text"
          placeholder="e.g. What's your favorite programming language?"
          {...register("title")}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Poll Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          placeholder="Add more context about this poll..."
          {...register("description")}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Poll Options */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Options</label>
        <div className="space-y-3">
          {options.map((opt, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
        >
          ➕ Add Option
        </button>
        {errors.options && (
          <p className="text-red-500 text-sm mt-1">{errors.options.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#0f172b] hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </form>
  );
}