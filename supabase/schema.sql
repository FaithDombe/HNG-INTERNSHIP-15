-- Run this once in Supabase Dashboard > SQL Editor > New query.
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  items jsonb not null,
  total numeric(12, 2) not null check (total >= 0),
  status text not null default 'placed' check (status in ('placed', 'processing', 'shipped', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Customers can place their own orders" on public.orders;
create policy "Customers can place their own orders"
  on public.orders for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Customers can view their own orders" on public.orders;
create policy "Customers can view their own orders"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);
grant insert, select on public.orders to authenticated;
