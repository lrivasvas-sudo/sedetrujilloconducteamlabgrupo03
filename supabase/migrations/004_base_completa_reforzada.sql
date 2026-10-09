-- Esquema completo de Nara, reforzado. Reemplaza el propósito de 002 y 003 para
-- bases nuevas o desactualizadas. Ejecutar en el SQL Editor de Supabase.
--
-- Es seguro ejecutarlo más de una vez y en cualquier estado previo:
--   - Base vacía: crea todo.
--   - Base con 002 ejecutado: no falla (las políticas se recrean).
--   - Base con 002 y columna «estado» antigua: la renombra a «estado_animo».
--   - Base con 003 ejecutado: no cambia nada que no esté ya correcto.
--
-- Reglas de privacidad:
--   - Cada persona registrada solo crea y lee sus propios registros.
--   - Los administradores leen todos los registros.
--   - Nadie puede modificar ni borrar el historial desde la app (sin UPDATE ni DELETE).

-- 1. Renombrar la columna antigua de estado de ánimo, si existe.
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

-- 2. Tablas.

-- Usuarios autorizados por el administrador para usar Nara.
create table if not exists public.usuarios_registrados (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

-- Cuentas con lectura global del historial.
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Estado de ánimo con fecha y hora. Los valores coinciden con src/config/moods.ts.
create table if not exists public.estados_animo (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  estado_animo text not null check (
    estado_animo in ('muy-bien', 'bien', 'tranquilo', 'regular', 'ansioso', 'triste', 'enojado', 'abrumado')
  ),
  registrado_en timestamptz not null default now()
);

-- Cada fila es un ingreso a la app. Contar las filas de una persona da sus veces de ingreso.
create table if not exists public.accesos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  ingresado_en timestamptz not null default now()
);

create index if not exists estados_animo_usuario_fecha
  on public.estados_animo (user_id, registrado_en desc);

create index if not exists accesos_usuario_fecha
  on public.accesos (user_id, ingresado_en desc);

-- 3. Seguridad de tablas: RLS activo y sin acceso para usuarios anónimos.
alter table public.usuarios_registrados enable row level security;
alter table public.administradores enable row level security;
alter table public.estados_animo enable row level security;
alter table public.accesos enable row level security;

revoke all on public.usuarios_registrados from anon;
revoke all on public.administradores from anon;
revoke all on public.estados_animo from anon;
revoke all on public.accesos from anon;

-- Historial inmutable desde la app: se quita UPDATE, DELETE y TRUNCATE a los usuarios
-- autenticados. Las políticas RLS tampoco los permiten (ver sección 5).
revoke update, delete, truncate on public.estados_animo from authenticated;
revoke update, delete, truncate on public.accesos from authenticated;

-- 4. Funciones de permiso. «security definer» permite leer las tablas de permisos
-- sin depender de sus propias reglas. «search_path» fijo evita desvíos.
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

revoke execute on function public.es_usuario_registrado() from public, anon;
revoke execute on function public.es_administrador() from public, anon;
grant execute on function public.es_usuario_registrado() to authenticated;
grant execute on function public.es_administrador() to authenticated;

-- 5. Políticas. Cada una se borra antes de crearse para que el script pueda repetirse.

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

-- 6. Autorizar cuentas (el correo debe existir antes en Authentication > Users):
--
--   insert into public.usuarios_registrados (user_id)
--   select id from auth.users where email = 'correo@ejemplo.com'
--   on conflict do nothing;
--
--   insert into public.administradores (user_id)
--   select id from auth.users where email = 'correo@ejemplo.com'
--   on conflict do nothing;
--
-- Consultas para el administrador:
--
--   select user_id, count(*) as ingresos from public.accesos group by user_id order by ingresos desc;
--   select estado_animo, count(*) from public.estados_animo group by estado_animo order by count(*) desc;
