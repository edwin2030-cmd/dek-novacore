-- =====================================================================
--  D.E.K NovaCore  -  Base de datos (Supabase / PostgreSQL)
-- ---------------------------------------------------------------------
--  COMO USARLO:
--   1. Entra a https://supabase.com  ->  tu proyecto
--   2. Menu izquierdo: "SQL Editor"  ->  "New query"
--   3. Copia TODO este archivo, pegalo y presiona "Run"
--   4. Debe decir "Success. No rows returned"
--  Se puede ejecutar varias veces sin romper nada (no borra tus datos).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1) CLIENTES  (las personas / empresas que te pagan)
-- ---------------------------------------------------------------------
create table if not exists public.clientes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre      text not null,
  empresa     text,
  email       text,
  telefono    text,
  notas       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2) PROYECTOS  (sistemas, apps, webs que desarrollas)
-- ---------------------------------------------------------------------
create table if not exists public.proyectos (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cliente_id     uuid references public.clientes(id) on delete set null,
  nombre         text not null,
  descripcion    text,
  tipo           text,
  estado         text not null default 'en_progreso'
                 check (estado in ('cotizacion','en_progreso','pausado','terminado','cancelado')),
  precio_total   numeric(12,2) not null default 0 check (precio_total >= 0),
  fecha_inicio   date default current_date,
  fecha_entrega  date,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3) INGRESOS  (abonos, anticipos, pagos completos, mantenimientos...)
--    Se ingresan manualmente desde el sistema
-- ---------------------------------------------------------------------
create table if not exists public.ingresos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  proyecto_id  uuid references public.proyectos(id) on delete set null,
  cliente_id   uuid references public.clientes(id) on delete set null,
  tipo         text not null default 'abono'
               check (tipo in ('anticipo','abono','pago_completo','mantenimiento','otro')),
  concepto     text not null,
  monto        numeric(12,2) not null check (monto > 0),
  fecha        date not null default current_date,
  metodo_pago  text,
  notas        text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4) GASTOS  (hosting, licencias, equipo, internet...)
--    Se ingresan manualmente desde el sistema
-- ---------------------------------------------------------------------
create table if not exists public.gastos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  proyecto_id  uuid references public.proyectos(id) on delete set null,
  categoria    text not null default 'otros',
  concepto     text not null,
  monto        numeric(12,2) not null check (monto > 0),
  fecha        date not null default current_date,
  metodo_pago  text,
  notas        text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5) INDICES (para que todo cargue rapido)
-- ---------------------------------------------------------------------
create index if not exists clientes_user_idx   on public.clientes  (user_id);
create index if not exists proyectos_user_idx  on public.proyectos (user_id);
create index if not exists proyectos_cli_idx   on public.proyectos (cliente_id);
create index if not exists ingresos_user_idx   on public.ingresos  (user_id, fecha desc);
create index if not exists ingresos_proy_idx   on public.ingresos  (proyecto_id);
create index if not exists ingresos_cli_idx    on public.ingresos  (cliente_id);
create index if not exists gastos_user_idx     on public.gastos    (user_id, fecha desc);
create index if not exists gastos_proy_idx     on public.gastos    (proyecto_id);

-- ---------------------------------------------------------------------
-- 6) SEGURIDAD (RLS): cada usuario SOLO ve y edita sus propios datos
-- ---------------------------------------------------------------------
alter table public.clientes  enable row level security;
alter table public.proyectos enable row level security;
alter table public.ingresos  enable row level security;
alter table public.gastos    enable row level security;

drop policy if exists "clientes_propios"  on public.clientes;
drop policy if exists "proyectos_propios" on public.proyectos;
drop policy if exists "ingresos_propios"  on public.ingresos;
drop policy if exists "gastos_propios"    on public.gastos;

create policy "clientes_propios" on public.clientes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "proyectos_propios" on public.proyectos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "ingresos_propios" on public.ingresos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "gastos_propios" on public.gastos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.clientes, public.proyectos, public.ingresos, public.gastos to authenticated;
revoke all on public.clientes, public.proyectos, public.ingresos, public.gastos from anon;

-- ---------------------------------------------------------------------
-- 7) VISTA: resumen de cada proyecto (cuanto te han pagado y cuanto falta)
--    security_invoker = respeta la seguridad RLS de arriba
-- ---------------------------------------------------------------------
drop view if exists public.proyectos_resumen;

create view public.proyectos_resumen
with (security_invoker = true) as
select
  p.*,
  c.nombre                                                   as cliente_nombre,
  coalesce(i.total_cobrado, 0)                               as total_cobrado,
  greatest(p.precio_total - coalesce(i.total_cobrado, 0), 0) as saldo_pendiente,
  coalesce(g.total_gastos, 0)                                as total_gastos,
  coalesce(i.total_cobrado, 0) - coalesce(g.total_gastos, 0) as ganancia
from public.proyectos p
left join public.clientes c on c.id = p.cliente_id
left join (select proyecto_id, sum(monto) as total_cobrado
             from public.ingresos where proyecto_id is not null
            group by proyecto_id) i on i.proyecto_id = p.id
left join (select proyecto_id, sum(monto) as total_gastos
             from public.gastos where proyecto_id is not null
            group by proyecto_id) g on g.proyecto_id = p.id;

grant select on public.proyectos_resumen to authenticated;
revoke all on public.proyectos_resumen from anon;

-- =====================================================================
--  LISTO. Ahora ve a la carpeta del sistema, abre config.js y pega tu
--  Project URL y tu anon / publishable key (Project Settings -> API).
-- =====================================================================
