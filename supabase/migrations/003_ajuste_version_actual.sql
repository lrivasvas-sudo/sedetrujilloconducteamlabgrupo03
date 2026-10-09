-- Ajuste de la base de datos a la versión actual de la app.
-- Ejecutar si ya corriste una versión anterior de 002 (la columna se llamaba «estado»).
-- Es seguro ejecutarlo más de una vez.

-- 1. Renombrar la columna de estado de ánimo, si todavía tiene el nombre anterior.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'estados_animo' and column_name = 'estado'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'estados_animo' and column_name = 'estado_animo'
  ) then
    alter table public.estados_animo rename column estado to estado_animo;
  end if;
end $$;

-- 2. Tablas que faltan.
create table if not exists public.usuarios_registrados (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.usuarios_registrados enable row level security;
alter table public.administradores enable row level security;
alter table public.estados_animo enable row level security;
alter table public.accesos enable row level security;

-- 3. Funciones de permiso.
create or replace function public.es_usuario_registrado()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.usuarios_registrados where user_id = auth.uid());
$$;

create or replace function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.administradores where user_id = auth.uid());
$$;

revoke execute on function public.es_usuario_registrado() from public;
revoke execute on function public.es_administrador() from public;
grant execute on function public.es_usuario_registrado() to authenticated;
grant execute on function public.es_administrador() to authenticated;

-- 4. Reglas de acceso: se vuelven a crear para quedar iguales a la versión actual.
drop policy if exists "Ver mi registro de usuario" on public.usuarios_registrados;
create policy "Ver mi registro de usuario"
  on public.usuarios_registrados for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Ver si soy administrador" on public.administradores;
create policy "Ver si soy administrador"
  on public.administradores for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Registrar mi estado de ánimo" on public.estados_animo;
create policy "Registrar mi estado de ánimo"
  on public.estados_animo for insert
  to authenticated
  with check (user_id = auth.uid() and public.es_usuario_registrado());

drop policy if exists "Ver mi estado de ánimo" on public.estados_animo;
create policy "Ver mi estado de ánimo"
  on public.estados_animo for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Administrador ve estados de ánimo" on public.estados_animo;
create policy "Administrador ve estados de ánimo"
  on public.estados_animo for select
  to authenticated
  using (public.es_administrador());

drop policy if exists "Registrar mi ingreso" on public.accesos;
create policy "Registrar mi ingreso"
  on public.accesos for insert
  to authenticated
  with check (user_id = auth.uid() and public.es_usuario_registrado());

drop policy if exists "Ver mis ingresos" on public.accesos;
create policy "Ver mis ingresos"
  on public.accesos for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Administrador ve ingresos" on public.accesos;
create policy "Administrador ve ingresos"
  on public.accesos for select
  to authenticated
  using (public.es_administrador());
