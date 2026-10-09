-- Tablas de usuarios registrados, estado de ánimo e ingresos a Nara.
-- Ejecutar en el SQL Editor de Supabase (proyecto uqxewwuvulrfindxcvkh).
--
-- Flujo: la persona inicia sesión con correo y contraseña (Supabase Auth).
-- Solo puede entrar si su cuenta está en «usuarios_registrados». Cada ingreso
-- queda en «accesos» y cada estado de ánimo en «estados_animo».
--
-- Privacidad: cada persona solo puede crear y leer sus propios registros.
-- Los administradores (tabla «administradores») pueden leer todos.
-- Nadie puede modificar ni borrar el historial desde la app.

-- Usuarios registrados: las cuentas que el administrador autoriza para usar Nara.
create table if not exists public.usuarios_registrados (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

-- Administradores: cada fila es una cuenta con acceso de lectura global.
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Estado de ánimo registrado, con fecha y hora. Los valores coinciden con src/config/moods.ts.
create table if not exists public.estados_animo (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  estado_animo text not null check (
    estado_animo in ('muy-bien', 'bien', 'tranquilo', 'regular', 'ansioso', 'triste', 'enojado', 'abrumado')
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

alter table public.usuarios_registrados enable row level security;
alter table public.administradores enable row level security;
alter table public.estados_animo enable row level security;
alter table public.accesos enable row level security;

-- Indica si la cuenta actual está registrada. «security definer» permite consultar
-- la tabla sin depender de sus reglas.
create or replace function public.es_usuario_registrado()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.usuarios_registrados where user_id = auth.uid());
$$;

-- Indica si la cuenta actual es administradora.
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

-- Usuarios registrados: cada cuenta solo ve su propia fila.
create policy "Ver mi registro de usuario"
  on public.usuarios_registrados for select
  to authenticated
  using (user_id = auth.uid());

-- Administradores: cada cuenta solo ve su propia fila.
create policy "Ver si soy administrador"
  on public.administradores for select
  to authenticated
  using (user_id = auth.uid());

-- Estado de ánimo: solo usuarios registrados registran lo suyo; el administrador lee todo.
create policy "Registrar mi estado de ánimo"
  on public.estados_animo for insert
  to authenticated
  with check (user_id = auth.uid() and public.es_usuario_registrado());

create policy "Ver mi estado de ánimo"
  on public.estados_animo for select
  to authenticated
  using (user_id = auth.uid());

create policy "Administrador ve estados de ánimo"
  on public.estados_animo for select
  to authenticated
  using (public.es_administrador());

-- Ingresos: solo usuarios registrados registran sus ingresos; el administrador lee todo.
create policy "Registrar mi ingreso"
  on public.accesos for insert
  to authenticated
  with check (user_id = auth.uid() and public.es_usuario_registrado());

create policy "Ver mis ingresos"
  on public.accesos for select
  to authenticated
  using (user_id = auth.uid());

create policy "Administrador ve ingresos"
  on public.accesos for select
  to authenticated
  using (public.es_administrador());

-- Cómo autorizar una cuenta (el correo debe existir antes en Authentication > Users):
--
-- insert into public.usuarios_registrados (user_id)
-- select id from auth.users where email = 'correo@ejemplo.com';
--
-- Cómo dar acceso de administrador:
--
-- insert into public.administradores (user_id)
-- select id from auth.users where email = 'correo@ejemplo.com';
--
-- Consultas para el administrador:
--
-- Veces que ingresa cada usuario:
--   select user_id, count(*) as ingresos from public.accesos group by user_id order by ingresos desc;
--
-- Estados de ánimo más frecuentes:
--   select estado_animo, count(*) from public.estados_animo group by estado_animo order by count(*) desc;
