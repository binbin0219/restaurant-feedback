-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Anyone (anonymous customers) can submit feedback
create policy "Anyone can insert feedback"
  on public.feedback
  for insert
  to anon
  with check (true);

-- Only logged-in users (the restaurant owner) can read feedback
create policy "Authenticated users can read feedback"
  on public.feedback
  for select
  to authenticated
  using (true);

-- After running this, create the owner's login in
-- Supabase Dashboard > Authentication > Users > Add user
-- (email + password). That's the account used to sign in at /admin.
