create extension if not exists pgcrypto;

create table if not exists societies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  unit_number text,
  block text,
  owner_name text,
  name text,
  type text default 'society',
  created_at timestamptz default now()
);

create table if not exists operators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  society_id uuid references societies(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  name text,
  phone text,
  role text not null check (role in ('super_admin', 'admin', 'operator', 'guard', 'resident')),
  is_on_duty boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists visitor_entries (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  operator_id uuid references operators(id) on delete set null,
  name text,
  phone text,
  purpose text,
  visitor_type text,
  face_photo_url text,
  id_photo_url text,
  check_in_time timestamptz default now(),
  check_out_time timestamptz,
  is_vip boolean default false,
  verified boolean default false,
  status text default 'checked_in',
  spoken_text text,
  flat_or_room text,
  security_verification jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists pre_approved_visitors (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  resident_user_id uuid references auth.users(id) on delete set null,
  name text,
  phone text,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz default now()
);

create table if not exists notification_settings (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  operator_id uuid references operators(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  whatsapp_enabled boolean default true,
  email_enabled boolean default false,
  created_at timestamptz default now()
);

create table if not exists notification_logs (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  operator_id uuid references operators(id) on delete set null,
  visitor_entry_id uuid references visitor_entries(id) on delete set null,
  title text,
  body text,
  channel text default 'system',
  created_at timestamptz default now()
);

create table if not exists recurring_visitors (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  name text,
  phone text,
  visitor_type text,
  last_seen_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists scheduled_tasks (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id) on delete cascade,
  name text not null,
  cron text not null,
  function_name text not null,
  function_args jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function current_operator_society_id()
returns uuid
language sql
stable
as $$
  select society_id
  from operators
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function current_operator_role()
returns text
language sql
stable
as $$
  select role
  from operators
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce(current_operator_role() = 'super_admin', false);
$$;

alter table societies enable row level security;
alter table properties enable row level security;
alter table operators enable row level security;
alter table visitor_entries enable row level security;
alter table pre_approved_visitors enable row level security;
alter table notification_settings enable row level security;
alter table notification_logs enable row level security;
alter table recurring_visitors enable row level security;
alter table scheduled_tasks enable row level security;

create policy "super admins manage societies"
on societies for all
using (is_super_admin())
with check (is_super_admin());

create policy "society scoped properties"
on properties for all
using (is_super_admin() or society_id = current_operator_society_id())
with check (is_super_admin() or society_id = current_operator_society_id());

create policy "society scoped operators"
on operators for select
using (is_super_admin() or society_id = current_operator_society_id());

create policy "admins manage operators"
on operators for all
using (
  is_super_admin()
  or (society_id = current_operator_society_id() and current_operator_role() = 'admin')
  or user_id = auth.uid()
)
with check (
  is_super_admin()
  or (society_id = current_operator_society_id() and current_operator_role() = 'admin')
  or user_id = auth.uid()
);

create policy "guards operators manage visitor entries"
on visitor_entries for select
using (
  is_super_admin()
  or society_id = current_operator_society_id()
  or (
    current_operator_role() = 'resident'
    and property_id in (
      select property_id from operators where user_id = auth.uid()
    )
  )
);

create policy "guards operators create visitor entries"
on visitor_entries for insert
with check (
  is_super_admin()
  or (
    society_id = current_operator_society_id()
    and current_operator_role() in ('admin', 'operator', 'guard')
  )
);

create policy "guards operators update visitor entries"
on visitor_entries for update
using (
  is_super_admin()
  or (
    society_id = current_operator_society_id()
    and current_operator_role() in ('admin', 'operator', 'guard')
  )
)
with check (
  is_super_admin()
  or (
    society_id = current_operator_society_id()
    and current_operator_role() in ('admin', 'operator', 'guard')
  )
);

create policy "society scoped pre approved visitors"
on pre_approved_visitors for all
using (is_super_admin() or society_id = current_operator_society_id())
with check (is_super_admin() or society_id = current_operator_society_id());

create policy "society scoped notification settings"
on notification_settings for all
using (is_super_admin() or society_id = current_operator_society_id())
with check (is_super_admin() or society_id = current_operator_society_id());

create policy "society scoped notification logs"
on notification_logs for all
using (is_super_admin() or society_id = current_operator_society_id())
with check (is_super_admin() or society_id = current_operator_society_id());

create policy "society scoped recurring visitors"
on recurring_visitors for all
using (is_super_admin() or society_id = current_operator_society_id())
with check (is_super_admin() or society_id = current_operator_society_id());

create policy "society scoped scheduled tasks"
on scheduled_tasks for all
using (is_super_admin() or society_id = current_operator_society_id())
with check (is_super_admin() or society_id = current_operator_society_id());
