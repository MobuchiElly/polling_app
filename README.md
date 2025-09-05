# Poll App

A full-stack polling application built with **Next.js 15**, **TypeScript**, **Supabase**, and **Tailwind CSS**.  
Users can create polls, add options, and vote in real time.  

---

## Features

- 🔐 Authentication with Supabase Auth  
- 📊 Create and manage polls  
- ✅ One vote per user per poll (enforced at DB level)  
- 🎨 Responsive UI with Tailwind CSS  
- 🗄️ Secure with Supabase Row Level Security (RLS)  

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript  
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Backend**: Supabase (Postgres + RLS + Auth)  
- **Testing**: Jest + React Testing Library  

---

## Database Schema

This app uses **Supabase (Postgres + RLS)** with the following schema:

### 1. Users
- Supabase provides `auth.users` automatically for authentication.
- We reference it using `creator_id` or `voter_id`.

### 2. Polls Table

```sql
create table polls (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete cascade,
  question text not null,
  created_at timestamp with time zone default now()
);
````

### 3. Poll Options Table

```sql
create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  option_text text not null
);
```

### 4. Votes Table

```sql
create table votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  option_id uuid references poll_options(id) on delete cascade,
  voter_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (poll_id, voter_id) -- one vote per user per poll
);
```

### 5. Row Level Security (RLS) Policies

* **Polls**

  * Anyone can read polls.
  * Only logged-in users can create polls.
  * Only the poll creator can update/delete their polls.
* **Poll Options**

  * Anyone can read options.
  * Only the poll creator can add/delete options.
* **Votes**

  * Anyone can read votes (configurable).
  * Only logged-in users can vote once per poll.

---

### ER Diagram (Conceptual)

```
auth.users (id)
      │
      ├── polls (id, creator_id, question)
      │         │
      │         └── poll_options (id, poll_id, option_text)
      │
      └── votes (id, poll_id, option_id, voter_id)
```

This schema ensures:

* **Data integrity**: Foreign keys + `on delete cascade`.
* **Security**: Row-level security enforces ownership rules.
* **Scalability**: Supports many polls, each with multiple options and votes.

---

## Setup & Installation

1. Clone the repo

   ```bash
   git clone https://github.com/MobuchiElly/polling_app.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env.local` file with your Supabase credentials and project base URL:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   > Replace `http://localhost:3000` with your deployed project URL when running in production.

4. (For testing) Create a `.env.test` file with the following variables:

   ```env
   TEST_USER_EMAIL=your-test-email@example.com
   TEST_USER_PASSWORD=your-test-password
   ```

5. Run the dev server

   ```bash
   npm run dev
   ```

---

## Testing

Run the test suite with:

```bash
npm run test
```

---

## License

MIT © 2025 Eleazer Mobuchi Ugwu