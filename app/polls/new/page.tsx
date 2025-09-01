"use client";

import PollForm from "@/components/PollForm";


export default function NewPollPage() {

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Create a New Poll
      </h1>
      <PollForm />
    </div>
  );
}