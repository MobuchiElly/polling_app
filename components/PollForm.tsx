"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PollForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // require at least 2 options
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || options.some((opt) => !opt.trim())) {
      alert("Poll title and all options are required!");
      return;
    }

    setLoading(true);

    // Structure options with votes initialized
    const formattedOptions = options.map((text, idx) => ({
      id: `opt_${idx + 1}`,
      text,
      votes: 0,
    }));

    // TODO: replace with actual user ID from Supabase Auth
    const user_id = "user_12345";

    const { data, error } = await supabase
      .from("polls")
      .insert([
        {
          question: title,
          description,
          options: formattedOptions,
          user_id,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Error creating poll:", error);
      alert("Something went wrong creating the poll.");
    } else {
      router.push(`/polls/${data.id}`);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Poll Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Poll Question
          </label>
          <input
            type="text"
            placeholder="e.g. What’s your favorite programming language?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Poll Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description (optional)
          </label>
          <textarea
            placeholder="Add more context about this poll..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Poll Options */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Options
          </label>
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