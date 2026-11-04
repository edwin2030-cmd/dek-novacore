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
-- 6) NEGOCIOS (los clientes que pagan la suscripcion de NovaCore)
--    Solo el administrador (tu) los crea, cobra y suspende.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.negocios (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid unique references auth.users(id) on delete set null,
  email           text not null check (email = lower(btrim(email)) and email like '%@%'),
  nombre          text not null,
  contacto        text,
  telefono        text,
  rubro           text not null default 'otro',
  tipos           text[],
  precio_mensual  numeric(10,2) not null default 20 check (precio_mensual >= 0),
  estado          text not null default 'activo' check (estado in ('activo','suspendido')),
  pagado_hasta    date not null default current_date,
  notas           text,
  created_at      timestamptz not null default now()
);
create unique index if not exists negocios_email_uq on public.negocios (email);

create table if not exists public.pagos_suscripcion (
  id           uuid primary key default gen_random_uuid(),
  negocio_id   uuid not null references public.negocios(id) on delete cascade,
  monto        numeric(10,2) not null check (monto >= 0),
  meses        int not null check (meses between 1 and 24),
  fecha        date not null default current_date,
  metodo_pago  text,
  desde        date not null,
  hasta        date not null,
  created_at   timestamptz not null default now()
);
create index if not exists pagos_sus_neg_idx on public.pagos_suscripcion (negocio_id, fecha desc);

-- Los ingresos ahora pueden ser de tipo "suscripcion"
alter table public.ingresos drop constraint if exists ingresos_tipo_check;
alter table public.ingresos add constraint ingresos_tipo_check
  check (tipo in ('anticipo','abono','pago_completo','mantenimiento','suscripcion','otro'));

-- Dias de gracia despues de la fecha de pago antes de bloquear la cuenta
create or replace function public.dias_gracia() returns int
language sql immutable as $$ select 3 $$;

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

create or replace function public.cuenta_activa() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.es_admin() or exists (
    select 1 from public.negocios n
     where n.user_id = (select auth.uid())
       and n.estado = 'activo'
       and current_date <= n.pagado_hasta + public.dias_gracia());
$$;

-- ---------------------------------------------------------------------
-- 7) SEGURIDAD (RLS): cada usuario SOLO ve y edita sus propios datos,
--    y solo si su suscripcion esta al dia.
-- ---------------------------------------------------------------------
alter table public.clientes          enable row level security;
alter table public.proyectos         enable row level security;
alter table public.ingresos          enable row level security;
alter table public.gastos            enable row level security;
alter table public.admins            enable row level security;
alter table public.negocios          enable row level security;
alter table public.pagos_suscripcion enable row level security;

drop policy if exists "clientes_propios"  on public.clientes;
drop policy if exists "proyectos_propios" on public.proyectos;
drop policy if exists "ingresos_propios"  on public.ingresos;
drop policy if exists "gastos_propios"    on public.gastos;
drop policy if exists "admins_propio"     on public.admins;
drop policy if exists "negocios_admin"    on public.negocios;
drop policy if exists "pagos_sus_admin"   on public.pagos_suscripcion;

create policy "clientes_propios" on public.clientes
  for all to authenticated
  using ((select auth.uid()) = user_id and (select public.cuenta_activa()))
  with check ((select auth.uid()) = user_id and (select public.cuenta_activa()));

create policy "proyectos_propios" on public.proyectos
  for all to authenticated
  using ((select auth.uid()) = user_id and (select public.cuenta_activa()))
  with check ((select auth.uid()) = user_id and (select public.cuenta_activa()));

create policy "ingresos_propios" on public.ingresos
  for all to authenticated
  using ((select auth.uid()) = user_id and (select public.cuenta_activa()))
  with check ((select auth.uid()) = user_id and (select public.cuenta_activa()));

create policy "gastos_propios" on public.gastos
  for all to authenticated
  using ((select auth.uid()) = user_id and (select public.cuenta_activa()))
  with check ((select auth.uid()) = user_id and (select public.cuenta_activa()));

create policy "admins_propio" on public.admins
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "negocios_admin" on public.negocios
  for all to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

create policy "pagos_sus_admin" on public.pagos_suscripcion
  for all to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

grant select, insert, update, delete on public.clientes, public.proyectos, public.ingresos, public.gastos to authenticated;
grant select, insert, update, delete on public.negocios, public.pagos_suscripcion to authenticated;
grant select on public.admins to authenticated;
revoke all on public.clientes, public.proyectos, public.ingresos, public.gastos,
              public.negocios, public.pagos_suscripcion, public.admins from anon;

-- ---------------------------------------------------------------------
-- 8) FUNCIONES QUE USA EL SISTEMA
-- ---------------------------------------------------------------------
-- Datos de la cuenta que inicio sesion (su negocio y su suscripcion)
create or replace function public.mi_cuenta() returns json
language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'es_admin', public.es_admin(),
    'activa',   public.cuenta_activa(),
    'gracia',   public.dias_gracia(),
    'hoy',      current_date,
    'negocio',  (select json_build_object(
                   'nombre', n.nombre, 'telefono', n.telefono, 'rubro', n.rubro, 'tipos', n.tipos,
                   'precio_mensual', n.precio_mensual, 'estado', n.estado, 'pagado_hasta', n.pagado_hasta)
                   from public.negocios n where n.user_id = (select auth.uid())));
$$;

-- El negocio cambia su nombre, telefono, rubro y tipos de trabajo (no el pago)
create or replace function public.actualizar_mi_negocio(p_nombre text, p_telefono text, p_rubro text, p_tipos text[])
returns void language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(btrim(p_nombre), '') = '' then raise exception 'Escribe el nombre del negocio'; end if;
  update public.negocios
     set nombre = btrim(p_nombre), telefono = nullif(btrim(p_telefono), ''),
         rubro = coalesce(nullif(p_rubro, ''), 'otro'),
         tipos = case when coalesce(array_length(p_tipos, 1), 0) = 0 then null else p_tipos end
   where user_id = (select auth.uid());
  if not found then raise exception 'Tu cuenta no tiene un negocio asignado'; end if;
end $$;

-- El administrador registra un pago: alarga "pagado hasta" y lo suma a sus ingresos
create or replace function public.registrar_pago_suscripcion(
  p_negocio uuid, p_meses int, p_monto numeric, p_fecha date, p_metodo text)
returns date language plpgsql security definer set search_path = '' as $$
declare
  n public.negocios;
  v_desde date;
  v_hasta date;
begin
  if not public.es_admin() then raise exception 'Solo el administrador puede registrar pagos'; end if;
  if p_meses is null or p_meses < 1 or p_meses > 24 then raise exception 'Los meses deben ser de 1 a 24'; end if;
  if p_monto is null or p_monto < 0 then raise exception 'El monto no es valido'; end if;
  select * into n from public.negocios where id = p_negocio for update;
  if not found then raise exception 'Ese negocio no existe'; end if;
  -- Si estaba vencido, el nuevo periodo empieza hoy; si no, sigue desde su fecha
  v_desde := greatest(n.pagado_hasta, current_date);
  v_hasta := (v_desde + make_interval(months => p_meses))::date;
  update public.negocios set pagado_hasta = v_hasta, estado = 'activo' where id = p_negocio;
  insert into public.pagos_suscripcion (negocio_id, monto, meses, fecha, metodo_pago, desde, hasta)
  values (p_negocio, p_monto, p_meses, coalesce(p_fecha, current_date), p_metodo, v_desde, v_hasta);
  if p_monto > 0 then
    insert into public.ingresos (user_id, tipo, concepto, monto, fecha, metodo_pago, notas)
    values ((select auth.uid()), 'suscripcion',
            'Suscripcion NovaCore - ' || n.nombre, p_monto, coalesce(p_fecha, current_date), p_metodo,
            p_meses || (case when p_meses = 1 then ' mes' else ' meses' end) || ', hasta ' || to_char(v_hasta, 'DD/MM/YYYY'));
  end if;
  return v_hasta;
end $$;

revoke all on function public.mi_cuenta(), public.actualizar_mi_negocio(text, text, text, text[]),
  public.registrar_pago_suscripcion(uuid, int, numeric, date, text), public.es_admin(), public.cuenta_activa()
  from public, anon;
grant execute on function public.mi_cuenta(), public.actualizar_mi_negocio(text, text, text, text[]),
  public.registrar_pago_suscripcion(uuid, int, numeric, date, text), public.es_admin(), public.cuenta_activa()
  to authenticated;

-- ---------------------------------------------------------------------
-- 9) REGISTRO SOLO CON INVITACION
--    Solo puede crear cuenta un correo que el administrador dio de alta
--    en "Negocios". Cualquier otro registro se rechaza.
-- ---------------------------------------------------------------------
create or replace function public.novacore_nuevo_usuario() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.negocios set user_id = new.id
   where email = lower(btrim(new.email)) and user_id is null;
  if not found then
    raise exception 'NOVACORE_SIN_INVITACION';
  end if;
  return new;
end $$;

drop trigger if exists novacore_nuevo_usuario on auth.users;
create trigger novacore_nuevo_usuario
  after insert on auth.users
  for each row execute function public.novacore_nuevo_usuario();

-- ---------------------------------------------------------------------
-- 10) TU CUENTA DE ADMINISTRADOR
--     La primera cuenta creada (la tuya) queda como administrador y
--     con su propio negocio "D.E.K NovaCore" sin vencimiento.
-- ---------------------------------------------------------------------
insert into public.admins (user_id)
select id from auth.users
 where not exists (select 1 from public.admins)
 order by created_at limit 1;

insert into public.negocios (user_id, email, nombre, rubro, precio_mensual, pagado_hasta)
select a.user_id, lower(u.email), 'D.E.K NovaCore', 'desarrollo', 0, date '2099-12-31'
  from public.admins a join auth.users u on u.id = a.user_id
 where not exists (select 1 from public.negocios n where n.user_id = a.user_id)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- 11) VISTA: resumen de cada proyecto (cuanto te han pagado y cuanto falta)
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
--  LISTO. Debe decir "Success. No rows returned".
--  Despues: Authentication -> Sign In / Providers -> activa
--  "Allow new users to sign up" (solo entran los correos invitados).
-- =====================================================================
