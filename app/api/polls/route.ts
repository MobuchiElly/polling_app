import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as z from 'zod';

// Define the Zod schema for poll creation on the server-side
const pollSchema = z.object({
  title: z.string().trim().min(1, 'Poll title is required!'),
  description: z.string().optional(),
  options: z.array(z.string().trim().min(1, 'All poll options are required!')).min(2, 'A poll must have at least 2 options.'),
}).superRefine((data, ctx) => {
  const normalized = data.options.map((o) => o.trim().toLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['options'],
      message: 'Options must be unique.',
    });
  }
});

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = pollSchema.parse(body);

    // 1. Insert poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert([{ question: validatedData.title, description: validatedData.description, creator_id: user.id }])
      .select()
      .single();

    if (pollError) {
      console.error('Supabase poll insert error:', pollError);
      return NextResponse.json({ error: pollError.message }, { status: 500 });
    }

    // 2. Insert poll options
    const formattedOptions = validatedData.options.map((text) => ({
      option_text: text,
      poll_id: poll.id,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(formattedOptions);

    if (optionsError) {
      console.error('Supabase poll options insert error:', optionsError);
      return NextResponse.json({ error: optionsError.message }, { status: 500 });
    }

    return NextResponse.json({ pollId: poll.id }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}