-- Tablas de estado de ánimo e ingresos a Nara, para el panel de administración.
-- Ejecutar en el SQL Editor de Supabase (proyecto uqxewwuvulrfindxcvkh).
--
-- Privacidad: cada persona solo puede crear y leer sus propios registros.
-- Los administradores (tabla «administradores») pueden leer todos.
-- Nadie puede modificar ni borrar el historial desde la app.
-- La app todavía no inicia sesión, así que estas reglas se activarán cuando exista el acceso con cuenta.

-- Administradores: cada fila es una cuenta de Supabase Auth con acceso de lectura global.
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Estado de ánimo registrado, con fecha y hora. Los valores coinciden con src/config/moods.ts.
create table if not exists public.estados_animo (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  estado text not null check (
    estado in ('muy-bien', 'bien', 'tranquilo', 'regular', 'ansioso', 'triste', 'enojado', 'abrumado')
  ),
  registrado_en timestamptz not null default now()
);

create index if not exists estados_animo_usuario_fecha
  on public.estados_animo (user_id, registrado_en desc);

-- Cada fila es un ingreso a la app. Contar las filas de una persona da sus veces de ingreso.
create table if not exists public.accesos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  ingresado_en timestamptz not null default now()
);

create index if not exists accesos_usuario_fecha
  on public.accesos (user_id, ingresado_en desc);

alter table public.administradores enable row level security;
alter table public.estados_animo enable row level security;
alter table public.accesos enable row level security;

-- Función que indica si la cuenta actual es administradora.
-- Es «security definer» para poder consultar «administradores» sin depender de sus reglas.
create or replace function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.administradores where user_id = auth.uid());
$$;

revoke execute on function public.es_administrador() from public;
grant execute on function public.es_administrador() to authenticated;

-- Administradores: cada cuenta solo ve su propia fila.
create policy "Ver si soy administrador"
  on public.administradores for select
  to authenticated
  using (user_id = auth.uid());

-- Estado de ánimo: la persona registra y lee lo suyo; el administrador lee todo.
create policy "Registrar mi estado de ánimo"
  on public.estados_animo for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Ver mi estado de ánimo"
  on public.estados_animo for select
  to authenticated
  using (user_id = auth.uid());

create policy "Administrador ve estados de ánimo"
  on public.estados_animo for select
  to authenticated
  using (public.es_administrador());

-- Ingresos: la persona registra y lee lo suyo; el administrador lee todo.
create policy "Registrar mi ingreso"
  on public.accesos for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Ver mis ingresos"
  on public.accesos for select
  to authenticated
  using (user_id = auth.uid());

create policy "Administrador ve ingresos"
  on public.accesos for select
  to authenticated
  using (public.es_administrador());

-- Para dar acceso de administrador a una cuenta, copia su ID desde
-- Authentication > Users en el panel de Supabase y ejecuta:
--
-- insert into public.administradores (user_id) values ('ID-DE-LA-CUENTA');
--
-- Ejemplos de consultas para el administrador:
--
-- Veces que ingresa cada usuario:
--   select user_id, count(*) as ingresos from public.accesos group by user_id order by ingresos desc;
--
-- Estados de ánimo más frecuentes:
--   select estado, count(*) from public.estados_animo group by estado order by count(*) desc;
