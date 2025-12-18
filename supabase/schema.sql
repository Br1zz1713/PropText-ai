-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  stripe_customer_id text,
  subscription_status text,
  credits_left integer default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create generations table
create table public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  input_data jsonb not null,
  output_text text not null,
  language text,
  style text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.generations enable row level security;

-- Create policies for generations
create policy "Users can view their own generations" on public.generations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own generations" on public.generations
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own generations" on public.generations
  for delete using (auth.uid() = user_id);
