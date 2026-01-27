-- 1. Users table (Supabase already provides `auth.users`)
-- We’ll reference it using user_id = auth.uid()

-- 2. Polls table
create table polls (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete cascade,
  question text not null,
  created_at timestamp with time zone default now()
);

-- 3. Poll options table
create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  option_text text not null
);

-- 4. Votes table
create table votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  option_id uuid references poll_options(id) on delete cascade,
  voter_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (poll_id, voter_id) -- one vote per user per poll
);

alter table polls enable row level security;
alter table poll_options enable row level security;
alter table votes enable row level security;

-- Anyone can read polls
create policy "Public can read polls"
on polls for select
using (true);

-- Only logged in users can insert
create policy "Users can create polls"
on polls for insert
with check (auth.uid() = creator_id);

-- Only creator can update/delete their polls
create policy "Creators manage own polls"
on polls for update using (auth.uid() = creator_id);
create policy "Creators delete own polls"
on polls for delete using (auth.uid() = creator_id);

-- Anyone can view options
create policy "Public can read poll options"
on poll_options for select
using (true);

-- Only poll creator can insert options
create policy "Creators add poll options"
on poll_options for insert
with check (
  auth.uid() = (select creator_id from polls where id = poll_id)
);

-- Only poll creator can delete options
create policy "Creators delete poll options"
on poll_options for delete
using (
  auth.uid() = (select creator_id from polls where id = poll_id)
);

-- Anyone can read votes (optional, could restrict later)
create policy "Public can read votes"
on votes for select
using (true);

-- Only logged in users can vote
create policy "Users can vote once"
on votes for insert
with check (
  auth.uid() = voter_id
);