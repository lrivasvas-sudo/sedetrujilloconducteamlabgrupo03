-- Tablas de universidades y carreras profesionales de Nara.
-- Ejecutar en el SQL Editor de Supabase (proyecto uqxewwuvulrfindxcvkh).
--
-- Seguridad: la lectura es pública (es un catálogo de datos no personales).
-- Las escrituras NO tienen política para anon ni authenticated, así que solo
-- pueden hacerlas el propietario del proyecto o el servicio con clave secreta.

create table if not exists public.universidades (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  creada_en timestamptz not null default now()
);

create table if not exists public.carreras_profesionales (
  id bigint generated always as identity primary key,
  universidad_id bigint not null references public.universidades (id) on delete cascade,
  nombre text not null,
  creada_en timestamptz not null default now(),
  unique (universidad_id, nombre)
);

alter table public.universidades enable row level security;
alter table public.carreras_profesionales enable row level security;

create policy "Lectura pública de universidades"
  on public.universidades for select
  to anon, authenticated
  using (true);

create policy "Lectura pública de carreras profesionales"
  on public.carreras_profesionales for select
  to anon, authenticated
  using (true);

-- Universidad de la app (ver src/config/site.ts).
insert into public.universidades (nombre)
values ('Universidad César Vallejo')
on conflict (nombre) do nothing;

-- Carreras profesionales: pendientes de confirmar con la lista oficial de admisión.
-- Plantilla para agregarlas una por una:
--
-- insert into public.carreras_profesionales (universidad_id, nombre)
-- select id, 'Nombre de la carrera'
-- from public.universidades
-- where nombre = 'Universidad César Vallejo'
-- on conflict (universidad_id, nombre) do nothing;
