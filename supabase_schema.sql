-- Create cards table
create table if not exists cards (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  creator text not null,
  image text not null,
  likes int default 0,
  category text not null,
  aspect_ratio text not null default 'portrait',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table cards enable row level security;

-- Create policy to allow public read access
create policy "Public cards are viewable by everyone"
  on cards for select
  using ( true );

-- Create policy to allow authenticated users to insert (if auth is used)
-- For now, allow public insert for demo/migration purposes, or restrict as needed.
-- create policy "Public can insert cards" on cards for insert with check ( true );
