/* =====================================================
   NovaCore - Sistema de gestion para negocios de servicios
   Proyectos · Ingresos/Abonos · Gastos · Clientes · Reportes
   ===================================================== */
(function () {
  'use strict';

  const CFG = window.NOVACORE_CONFIG || {};
  const $app = document.getElementById('app');
  const $modal = document.getElementById('modal-root');
  const $toast = document.getElementById('toast-root');
  const LOCALE = CFG.LOCALE || 'es-EC';

  // ---------- Iconos ----------
  const ICON = {
    dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    proyectos: 'M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z',
    ingresos: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
    gastos: 'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z',
    clientes: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    reportes: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',
    logout: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
    plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    cash: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    up: 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',
    down: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z',
    negocios: 'M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z',
    ajustes: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    wa: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
    pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    play: 'M8 5v14l11-7z',
    lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[n]}"/></svg>`;
  const logo = () => {
    const nombre = S.cuenta?.negocio?.nombre;
    return `<span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19V5l12 14V5"/></svg></span><span>${esc(nombre || 'NovaCore')}<small>${nombre ? 'con NovaCore' : 'Gestión de trabajos y finanzas'}</small></span>`;
  };

  // ---------- Catalogos ----------
  const ESTADOS = { cotizacion: 'Cotización', en_progreso: 'En progreso', pausado: 'Pausado', terminado: 'Terminado', cancelado: 'Cancelado' };
  const TIPOS_INGRESO = { anticipo: 'Anticipo', abono: 'Abono', pago_completo: 'Pago completo', mantenimiento: 'Mantenimiento', suscripcion: 'Suscripción', otro: 'Otro' };
  const GASTOS_DEV = {
    hosting: 'Hosting / Dominio', software: 'Software / Licencias', equipo: 'Equipo / Hardware',
    servicios: 'Internet / Luz / Servicios', publicidad: 'Publicidad', freelancers: 'Freelancers / Ayudantes',
    transporte: 'Transporte', comida: 'Comida', impuestos: 'Impuestos / Comisiones', otros: 'Otros',
  };
  const GASTOS_SERV = {
    materiales: 'Materiales / Repuestos', herramientas: 'Herramientas / Equipo', ayudantes: 'Ayudantes / Mano de obra',
    transporte: 'Transporte / Combustible', alquiler: 'Alquiler del local', servicios: 'Luz / Agua / Internet',
    publicidad: 'Publicidad', software: 'Software / Suscripciones', comida: 'Comida', impuestos: 'Impuestos / Comisiones', otros: 'Otros',
  };
  // Cada rubro trae sus palabras, tipos de trabajo y categorias de gasto
  const RUBROS = {
    desarrollo: { label: 'Desarrollo web y sistemas', p: 'proyecto', gastos: GASTOS_DEV, ej: 'Sistema de inventario para ferretería', ejGasto: 'Hosting anual',
      tipos: ['Sistema web', 'Página web', 'App móvil', 'E-commerce', 'Sistema de escritorio', 'API / Backend', 'Mantenimiento', 'Soporte', 'Otro'] },
    diseno: { label: 'Diseño, publicidad y marketing', p: 'proyecto', gastos: GASTOS_SERV, ej: 'Logo y redes para panadería', ejGasto: 'Impresión de volantes',
      tipos: ['Logo / Identidad', 'Diseño para redes', 'Campaña', 'Impresión', 'Video', 'Fotografía', 'Otro'] },
    construccion: { label: 'Construcción y remodelación', p: 'trabajo', gastos: GASTOS_SERV, ej: 'Remodelación de baño – Casa Pérez', ejGasto: 'Cemento y bloques',
      tipos: ['Remodelación', 'Construcción', 'Plomería', 'Electricidad', 'Pintura', 'Soldadura', 'Otro'] },
    taller: { label: 'Taller y reparaciones', p: 'trabajo', gastos: GASTOS_SERV, ej: 'Cambio de frenos – Toyota Hilux', ejGasto: 'Repuestos',
      tipos: ['Reparación', 'Mantenimiento', 'Instalación', 'Diagnóstico', 'Garantía', 'Otro'] },
    eventos: { label: 'Eventos y fotografía', p: 'evento', gastos: GASTOS_SERV, ej: 'Boda López – decoración', ejGasto: 'Alquiler de sillas',
      tipos: ['Boda', 'Cumpleaños', 'Quinceañero', 'Corporativo', 'Sesión de fotos', 'Decoración', 'Otro'] },
    profesional: { label: 'Servicios profesionales', p: 'servicio', gastos: GASTOS_SERV, ej: 'Contabilidad mensual – Mini súper Luz', ejGasto: 'Papelería',
      tipos: ['Asesoría', 'Contabilidad mensual', 'Trámite', 'Declaración de impuestos', 'Consultoría', 'Otro'] },
    otro: { label: 'Otro servicio', p: 'trabajo', gastos: GASTOS_SERV, ej: 'Instalación de aire acondicionado', ejGasto: 'Materiales',
      tipos: ['Servicio', 'Instalación', 'Mantenimiento', 'Otro'] },
  };
  const CAT_LABEL = { ...GASTOS_DEV, ...GASTOS_SERV };
  const METODOS = ['Yappy', 'Transferencia', 'Efectivo', 'Depósito', 'Tarjeta', 'PayPal', 'Otro'];

  // Palabras y catalogos del negocio que inicio sesion (se llenan en aplicarRubro)
  let R = RUBROS.desarrollo, W = {}, CATEGORIAS_GASTO = GASTOS_DEV, TIPOS_PROYECTO = R.tipos;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function aplicarRubro() {
    const n = S.cuenta?.negocio;
    R = RUBROS[n?.rubro] || RUBROS.desarrollo;
    W = { p: R.p, P: cap(R.p), ps: R.p + 's', Ps: cap(R.p) + 's' };
    CATEGORIAS_GASTO = R.gastos;
    TIPOS_PROYECTO = n?.tipos?.length ? n.tipos : R.tipos;
  }
  const navItems = () => [
    ['dashboard', 'Panel'], ['proyectos', W.Ps], ['ingresos', 'Ingresos'],
    ['gastos', 'Gastos'], ['clientes', 'Clientes'], ['reportes', 'Reportes'],
    ...(S.cuenta?.es_admin ? [['negocios', 'Negocios']] : []), ['ajustes', 'Ajustes'],
  ];

  // ---------- Utilidades ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let nf;
  try { nf = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CFG.CURRENCY || 'USD' }); }
  catch { nf = new Intl.NumberFormat('es', { style: 'currency', currency: 'USD' }); }
  const money = (n) => nf.format(Number(n) || 0);
  const compact = (n) => new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => ymd(new Date());
  const fmtDate = (s) => { if (!s) return '—'; const [y, m, d] = s.slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
  const sum = (arr, f = 'monto') => arr.reduce((a, x) => a + (Number(x[f]) || 0), 0);
  const byId = (arr, id) => arr.find((x) => x.id === id);
  const opts = (obj) => Object.entries(obj).map(([value, label]) => ({ value, label }));
  // Categorias del rubro + las que ya se usaron (para no perder etiquetas viejas)
  const catOpts = (usadas = []) => [...new Set([...Object.keys(CATEGORIAS_GASTO), ...usadas.filter(Boolean)])].map((k) => ({ value: k, label: CAT_LABEL[k] || k }));
  const matchQ = (q, ...fields) => { if (!q) return true; const s = q.toLowerCase().trim(); return fields.some((f) => String(f || '').toLowerCase().includes(s)); };
  const empty = (msg) => `<div class="empty">${msg}</div>`;
  const monthLabel = (key, long = false) => {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return long
      ? d.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' })
      : d.toLocaleDateString(LOCALE, { month: 'short' }).replace('.', '');
  };
  const monthKeyOffset = (offset) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + offset); return ymd(d).slice(0, 7); };
  const lastDayOf = (key) => { const [y, m] = key.split('-').map(Number); return `${key}-${pad(new Date(y, m, 0).getDate())}`; };
  const groupSum = (arr, keyFn) => { const m = new Map(); arr.forEach((x) => { const k = keyFn(x); m.set(k, (m.get(k) || 0) + (Number(x.monto) || 0)); }); return [...m.entries()].sort((a, b) => b[1] - a[1]); };

  // ---------- Estado ----------
  const S = { user: null, cuenta: null, clientes: [], proyectos: [], ingresos: [], gastos: [], negocios: [], pagosSus: [], route: 'dashboard', filters: {} };
  aplicarRubro();
  const SOPORTE = String(CFG.SOPORTE_WHATSAPP || '').replace(/\D/g, '');
  const APP_URL = CFG.APP_URL || location.origin + location.pathname;
  const waNum = (tel) => { const d = String(tel || '').replace(/\D/g, ''); return d.length === 8 ? '507' + d : d; };
  const waLink = (num, text) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  const diasHasta = (fecha) => Math.round((new Date(fecha + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 86400000);
  const projName = (id) => (id && byId(S.proyectos, id)?.nombre) || '';
  const cliName = (id) => (id && byId(S.clientes, id)?.nombre) || '';
  const projOpts = () => S.proyectos.map((p) => ({ value: p.id, label: p.nombre + (p.cliente_nombre ? ` — ${p.cliente_nombre}` : '') }));
  const cliOpts = () => S.clientes.map((c) => ({ value: c.id, label: c.nombre + (c.empresa ? ` (${c.empresa})` : '') }));

  // ---------- Toast ----------
  function toast(msg, type = 'ok') {
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    $toast.appendChild(el);
    setTimeout(() => el.classList.add('out'), 2800);
    setTimeout(() => el.remove(), 3200);
  }

  // =====================================================
  //  ARRANQUE
  // =====================================================
  const configured = CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY &&
    !CFG.SUPABASE_URL.includes('TU-PROYECTO') && CFG.SUPABASE_ANON_KEY !== 'TU_ANON_KEY';

  if (!window.supabase || !configured) { renderSetup(!window.supabase); return; }

  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);

  sb.auth.onAuthStateChange((event, session) => {
    // setTimeout evita bloqueos de supabase-js al llamar a la API dentro del callback
    setTimeout(() => {
      if (event === 'PASSWORD_RECOVERY') { S.user = session?.user || null; renderRecovery(); return; }
      const u = session?.user || null;
      if (u && (!S.user || S.user.id !== u.id)) { S.user = u; boot(); }
      else if (!u) { S.user = null; S.cuenta = null; S.clientes = S.proyectos = S.ingresos = S.gastos = S.negocios = S.pagosSus = []; S.filters = {}; aplicarRubro(); $modal.innerHTML = ''; renderAuth('login'); }
    }, 0);
  });

  window.addEventListener('hashchange', () => { S.route = routeFromHash(); if (S.user) render(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $modal.innerHTML) $modal.innerHTML = ''; });
  $app.addEventListener('click', onAction);
  $modal.addEventListener('click', onAction);

  function routeFromHash() { const r = location.hash.replace(/^#\/?/, ''); return PAGES[r] ? r : 'dashboard'; }

  async function boot() {
    $app.innerHTML = '<div class="boot"><div class="spinner"></div></div>';
    S.route = routeFromHash();
    try {
      const { data: cuenta, error } = await sb.rpc('mi_cuenta');
      if (error) throw error;
      S.cuenta = cuenta; aplicarRubro();
      if (!cuenta.activa) return renderBloqueo();
      await loadAll();
      render();
    } catch (err) {
      const missing = /relation|does not exist|schema cache|proyectos_resumen|mi_cuenta/i.test(err.message || '');
      $app.innerHTML = `<div class="auth-wrap"><div class="auth-card setup"><div class="brand big">${logo()}</div>
        <h3 style="margin-top:20px">No se pudieron cargar los datos</h3>
        <p class="muted">${missing ? 'Parece que las tablas no existen todavía. Abre <b>supabase.sql</b>, cópialo y ejecútalo en <b>Supabase → SQL Editor</b>. Luego recarga esta página.' : esc(err.message)}</p>
        <div style="display:flex;gap:8px;margin-top:16px"><button class="btn primary" onclick="location.reload()">Reintentar</button><button class="btn ghost" data-act="logout">Cerrar sesión</button></div>
      </div></div>`;
    }
  }

  async function loadAll() {
    const [c, p, i, g] = await Promise.all([
      sb.from('clientes').select('*').order('nombre'),
      sb.from('proyectos_resumen').select('*').order('created_at', { ascending: false }),
      sb.from('ingresos').select('*').order('fecha', { ascending: false }).order('created_at', { ascending: false }),
      sb.from('gastos').select('*').order('fecha', { ascending: false }).order('created_at', { ascending: false }),
    ]);
    const err = c.error || p.error || i.error || g.error;
    if (err) throw err;
    S.clientes = c.data; S.proyectos = p.data; S.ingresos = i.data; S.gastos = g.data;
    if (S.cuenta?.es_admin) {
      const [n, ps] = await Promise.all([
        sb.from('negocios').select('*').order('nombre'),
        sb.from('pagos_suscripcion').select('*').order('fecha', { ascending: false }).order('created_at', { ascending: false }),
      ]);
      if (n.error || ps.error) throw n.error || ps.error;
      S.negocios = n.data.filter((x) => x.user_id !== S.user.id); S.pagosSus = ps.data;
    }
  }

  async function recargarCuenta() {
    const { data, error } = await sb.rpc('mi_cuenta');
    if (error) throw error;
    S.cuenta = data; aplicarRubro();
    return data;
  }

  async function refresh() {
    try { await loadAll(); } catch (e) { toast(e.message, 'err'); }
    render();
  }

  async function save(table, data, id) {
    const { error } = id ? await sb.from(table).update(data).eq('id', id) : await sb.from(table).insert(data);
    if (error) throw error;
    closeModal();
    toast(id ? 'Cambios guardados' : 'Registro guardado');
    await refresh();
  }

  async function removeRow(table, id, msg) {
    if (!confirm(msg || '¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
    const { error } = await sb.from(table).delete().eq('id', id);
    if (error) return toast(error.message, 'err');
    $modal.innerHTML = '';
    toast('Eliminado');
    await refresh();
  }

  // =====================================================
  //  PANTALLAS DE ACCESO
  // =====================================================
  function renderSetup(noLib) {
    $app.innerHTML = `<div class="auth-wrap"><div class="auth-card setup"><div class="brand big">${logo()}</div>
      <h3 style="margin-top:22px">${noLib ? 'No se pudo cargar Supabase' : 'Falta conectar tu base de datos'}</h3>
      ${noLib ? '<p class="muted">Revisa tu conexión a internet y recarga la página.</p>' : `
      <ol>
        <li>Crea un proyecto en <b>supabase.com</b>.</li>
        <li>En <b>SQL Editor</b> pega y ejecuta el archivo <code>supabase.sql</code>.</li>
        <li>Ve a <b>Project Settings → API</b> y copia el <b>Project URL</b> y la <b>anon / publishable key</b>.</li>
        <li>Pégalos en el archivo <code>config.js</code> y recarga esta página.</li>
      </ol>`}
    </div></div>`;
  }

  const AUTH_ERRORS = {
    'Invalid login credentials': 'Correo o contraseña incorrectos.',
    'Email not confirmed': 'Primero confirma tu correo (revisa tu bandeja de entrada o spam).',
    'User already registered': 'Ese correo ya tiene una cuenta. Inicia sesión.',
    'Signups not allowed for this instance': 'La activación de cuentas está apagada. Avísale a tu proveedor de NovaCore.',
    'Database error saving new user': 'Ese correo no tiene una cuenta de NovaCore. Usa el mismo correo que diste al contratar, o escríbenos por WhatsApp.',
  };
  const authErr = (e) => AUTH_ERRORS[e.message] || (/NOVACORE_SIN_INVITACION/.test(e.message) ? AUTH_ERRORS['Database error saving new user'] : '') || (/rate limit/i.test(e.message) ? 'Demasiados intentos. Espera unos minutos.' : /at least 6/i.test(e.message) ? 'La contraseña debe tener al menos 6 caracteres.' : e.message);

  function renderAuth(mode = 'login', msg = null) {
    const allowSignup = CFG.ALLOW_SIGNUP !== false;
    if (mode === 'signup' && !allowSignup) mode = 'login';
    const sub = { login: 'Inicia sesión para ver tu negocio', signup: '¿Ya contrataste NovaCore? Escribe el correo que diste y crea tu contraseña.', reset: 'Te enviaremos un enlace para crear una nueva contraseña' }[mode];
    const cta = { login: 'Iniciar sesión', signup: 'Activar mi cuenta', reset: 'Enviar enlace' }[mode];
    $app.innerHTML = `<div class="auth-wrap"><div class="auth-card">
      <div class="brand big">${logo()}</div>
      <p class="muted">${sub}</p>
      ${mode !== 'reset' && allowSignup ? `<div class="tabs"><button type="button" data-mode="login" class="${mode === 'login' ? 'on' : ''}">Iniciar sesión</button><button type="button" data-mode="signup" class="${mode === 'signup' ? 'on' : ''}">Activar mi cuenta</button></div>` : ''}
      <form id="auth-form" class="stack" novalidate>
        <label class="field"><span>Correo electrónico</span><input type="email" name="email" required autocomplete="email" placeholder="tucorreo@ejemplo.com"></label>
        ${mode !== 'reset' ? `<label class="field"><span>Contraseña</span><input type="password" name="password" required minlength="6" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}" placeholder="••••••••"></label>` : ''}
        ${mode === 'signup' ? '<label class="field"><span>Confirmar contraseña</span><input type="password" name="password2" required minlength="6" autocomplete="new-password" placeholder="••••••••"></label>' : ''}
        <div class="auth-msg ${msg ? 'show' : ''} ${msg?.ok ? 'ok' : ''}" id="auth-msg">${esc(msg?.text)}</div>
        <button class="btn primary block" type="submit">${cta}</button>
      </form>
      ${mode === 'login' ? '<button type="button" class="link" data-mode="reset">¿Olvidaste tu contraseña?</button>' : ''}
      ${mode === 'reset' ? '<button type="button" class="link" data-mode="login">← Volver a iniciar sesión</button>' : ''}
    </div></div>`;

    $app.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => renderAuth(b.dataset.mode)));
    const form = document.getElementById('auth-form');
    const $msg = document.getElementById('auth-msg');
    const show = (text, ok = false) => { $msg.textContent = text; $msg.className = 'auth-msg show' + (ok ? ' ok' : ''); };
    form.email.focus();

    form.onsubmit = async (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password?.value || '';
      if (!/^\S+@\S+\.\S+$/.test(email)) return show('Escribe un correo válido.');
      if (mode !== 'reset' && password.length < 6) return show('La contraseña debe tener al menos 6 caracteres.');
      if (mode === 'signup' && password !== form.password2.value) return show('Las contraseñas no coinciden.');

      const btn = form.querySelector('[type=submit]');
      btn.disabled = true; btn.textContent = 'Un momento…';
      try {
        if (mode === 'login') {
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else if (mode === 'signup') {
          const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
          if (error) throw error;
          if (!data.session) return renderAuth('login', { text: 'Cuenta activada. Revisa tu correo (también en spam) y toca el enlace de confirmación para poder entrar.', ok: true });
        } else {
          const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
          if (error) throw error;
          return renderAuth('login', { text: 'Te enviamos un enlace a tu correo para restablecer la contraseña.', ok: true });
        }
      } catch (err) {
        show(authErr(err));
        btn.disabled = false; btn.textContent = cta;
      }
    };
  }

  function renderRecovery() {
    $app.innerHTML = `<div class="auth-wrap"><div class="auth-card">
      <div class="brand big">${logo()}</div>
      <p class="muted">Escribe tu nueva contraseña</p>
      <form id="rec-form" class="stack">
        <label class="field"><span>Nueva contraseña</span><input type="password" name="p1" required minlength="6" autocomplete="new-password"></label>
        <label class="field"><span>Confirmar contraseña</span><input type="password" name="p2" required minlength="6" autocomplete="new-password"></label>
        <div class="auth-msg" id="auth-msg"></div>
        <button class="btn primary block" type="submit">Guardar contraseña</button>
      </form></div></div>`;
    const form = document.getElementById('rec-form');
    const $msg = document.getElementById('auth-msg');
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (form.p1.value !== form.p2.value) { $msg.textContent = 'Las contraseñas no coinciden.'; $msg.className = 'auth-msg show'; return; }
      const { data, error } = await sb.auth.updateUser({ password: form.p1.value });
      if (error) { $msg.textContent = authErr(error); $msg.className = 'auth-msg show'; return; }
      toast('Contraseña actualizada');
      history.replaceState(null, '', location.pathname);
      S.user = data.user; boot();
    };
  }

  // Suscripcion vencida, suspendida o cuenta sin negocio
  function renderBloqueo() {
    const n = S.cuenta?.negocio;
    let titulo, texto;
    if (!n) { titulo = 'Tu cuenta no tiene un negocio asignado'; texto = 'Escríbenos para revisarlo.'; }
    else if (n.estado === 'suspendido') { titulo = 'Tu cuenta está suspendida'; texto = 'Escríbenos para reactivarla.'; }
    else { titulo = 'Tu suscripción venció'; texto = `El último día pagado fue el <b>${fmtDate(n.pagado_hasta)}</b>. Paga la mensualidad de <b>${money(n.precio_mensual)}</b> por Yappy o transferencia y mándanos el comprobante.`; }
    const msg = `Hola, soy de ${n?.nombre || 'un negocio'} (${S.user.email}). Quiero ${n?.estado === 'suspendido' ? 'reactivar' : 'renovar'} mi cuenta de NovaCore.`;
    $app.innerHTML = `<div class="auth-wrap"><div class="auth-card setup"><div class="brand big">${logo()}</div>
      <div class="lock-ic">${ic('lock')}</div>
      <h3>${titulo}</h3>
      <p class="muted">${texto}</p>
      <p class="muted sm">Tus datos siguen guardados y seguros. En cuanto se registre el pago puedes entrar de nuevo.</p>
      <div class="stack" style="margin-top:16px">
        ${SOPORTE ? `<a class="btn primary block" href="${waLink(SOPORTE, msg)}" target="_blank" rel="noopener">${ic('wa')}<span>Escribir por WhatsApp</span></a>` : ''}
        <button class="btn block" data-act="revisar-cuenta">Ya pagué, revisar de nuevo</button>
        <button class="btn ghost block" data-act="logout">${ic('logout')}<span>Cerrar sesión</span></button>
      </div>
    </div></div>`;
  }

  // Aviso cuando faltan pocos dias para que venza la suscripcion
  function avisoVencimiento() {
    const n = S.cuenta?.negocio;
    if (!n || S.cuenta.es_admin) return '';
    const d = diasHasta(n.pagado_hasta);
    if (d > 5) return '';
    const txt = d > 1 ? `Tu suscripción vence en ${d} días (${fmtDate(n.pagado_hasta)}).`
      : d === 1 ? 'Tu suscripción vence mañana.' : d === 0 ? 'Tu suscripción vence hoy.'
      : `Tu suscripción venció el ${fmtDate(n.pagado_hasta)}. Tienes ${Math.max(0, (S.cuenta.gracia ?? 3) + d)} día(s) más antes de que se bloquee.`;
    const msg = `Hola, soy de ${n.nombre}. Quiero pagar la mensualidad de NovaCore.`;
    return `<div class="banner ${d < 0 ? 'danger' : ''}"><span>${txt} Mensualidad: <b>${money(n.precio_mensual)}</b>.</span>${SOPORTE ? `<a class="btn sm" href="${waLink(SOPORTE, msg)}" target="_blank" rel="noopener">${ic('wa')}<span>Pagar</span></a>` : ''}</div>`;
  }

  // =====================================================
  //  LAYOUT
  // =====================================================
  function render() {
    if (!S.user) return;
    if (S.route === 'negocios' && !S.cuenta?.es_admin) S.route = 'dashboard';
    const route = PAGES[S.route] ? S.route : 'dashboard';
    const page = PAGES[route]();
    $app.innerHTML = `<div class="shell">
      <aside class="sidebar">
        <div class="brand">${logo()}</div>
        <nav>${navItems().map(([k, l]) => `<a href="#/${k}" class="${k === route ? 'on' : ''}">${ic(k)}<span>${l}</span></a>`).join('')}</nav>
        <div class="side-foot">
          <div class="who" title="${esc(S.user.email)}">${esc(S.user.email)}</div>
          <button class="btn ghost sm" data-act="logout">${ic('logout')}<span>Cerrar sesión</span></button>
        </div>
      </aside>
      <main class="main">
        <div class="mobile-top"><div class="brand">${logo()}</div><button class="icon-btn" data-act="logout" aria-label="Cerrar sesión">${ic('logout')}</button></div>
        ${avisoVencimiento()}
        <header class="page-head">
          <div><h1>${page.title}</h1>${page.sub ? `<p class="muted">${page.sub}</p>` : ''}</div>
          <div class="head-actions">${page.actions || ''}</div>
        </header>
        ${page.html}
      </main>
    </div>`;
    page.mount && page.mount();
  }

  const rowActs = (kind, id, extra = '') =>
    `${extra}<button class="icon-btn" data-act="edit-${kind}" data-id="${id}" title="Editar" aria-label="Editar">${ic('edit')}</button><button class="icon-btn danger" data-act="del-${kind}" data-id="${id}" title="Eliminar" aria-label="Eliminar">${ic('trash')}</button>`;
  const estadoBadge = (e) => `<span class="badge s-${esc(e)}">${esc(ESTADOS[e] || e)}</span>`;
  const progressBar = (p) => {
    const pct = p.precio_total > 0 ? Math.min(100, (p.total_cobrado / p.precio_total) * 100) : 0;
    return `<div class="progress ${pct >= 100 ? 'done' : ''}" title="${pct.toFixed(0)}% cobrado"><div style="width:${pct.toFixed(1)}%"></div></div>`;
  };
  const btnNew = (act, label) => `<button class="btn primary" data-act="${act}">${ic('plus')}<span>${label}</span></button>`;

  // Filtros de las listas: actualiza solo la tabla sin perder el foco del buscador
  function bindList(f, body) {
    const $l = document.getElementById('list');
    document.querySelectorAll('[data-filter]').forEach((el) => {
      const k = el.dataset.filter;
      el.value = f[k] ?? '';
      el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { f[k] = el.value; $l.innerHTML = body(); });
    });
  }
  const searchBox = (ph) => `<div class="search">${ic('search')}<input type="search" data-filter="q" placeholder="${ph}"></div>`;
  const monthSelect = (arr) => {
    const months = [...new Set(arr.map((x) => x.fecha.slice(0, 7)))].sort().reverse();
    return `<select data-filter="mes"><option value="">Todos los meses</option>${months.map((m) => `<option value="${m}">${monthLabel(m, true)}</option>`).join('')}</select>`;
  };

  // ---------- Grafico de barras (SVG) ----------
  function barChart(months) {
    const W = 640, H = 240, pl = 52, pr = 8, pt = 14, pb = 28, ih = H - pt - pb;
    const rawMax = Math.max(1, ...months.flatMap((m) => [m.ing, m.gas]));
    const p10 = 10 ** Math.floor(Math.log10(rawMax)), n = rawMax / p10;
    const max = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p10;
    const cw = (W - pl - pr) / months.length, bw = Math.max(6, Math.min(24, cw / 3.2));
    let g = '';
    for (let t = 0; t <= 4; t++) {
      const y = pt + ih * (1 - t / 4);
      g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" class="grid"/><text x="${pl - 8}" y="${y + 4}" text-anchor="end" class="axis">${compact((max * t) / 4)}</text>`;
    }
    months.forEach((m, i) => {
      const cx = pl + cw * i + cw / 2, base = H - pb;
      const h1 = Math.max(m.ing ? 2 : 0, (ih * m.ing) / max), h2 = Math.max(m.gas ? 2 : 0, (ih * m.gas) / max);
      g += `<rect x="${cx - bw - 2}" y="${base - h1}" width="${bw}" height="${h1}" rx="3" class="bar-in"><title>Ingresos ${m.label}: ${money(m.ing)}</title></rect>`;
      g += `<rect x="${cx + 2}" y="${base - h2}" width="${bw}" height="${h2}" rx="3" class="bar-out"><title>Gastos ${m.label}: ${money(m.gas)}</title></rect>`;
      g += `<text x="${cx}" y="${H - 8}" text-anchor="middle" class="axis">${esc(m.label)}</text>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Ingresos vs gastos por mes">${g}</svg>`;
  }
  const legend = '<div class="legend"><span><i style="background:var(--pos)"></i>Ingresos</span><span><i style="background:var(--neg)"></i>Gastos</span></div>';
  const monthSeries = (keys, ing, gas, withYear) => keys.map((k) => ({
    label: monthLabel(k) + (withYear ? ` ${k.slice(2, 4)}` : ''),
    ing: sum(ing.filter((x) => x.fecha.startsWith(k))),
    gas: sum(gas.filter((x) => x.fecha.startsWith(k))),
  }));

  // =====================================================
  //  PAGINAS
  // =====================================================
  const PAGES = {
    // ---------------- PANEL ----------------
    dashboard() {
      const mk = today().slice(0, 7), prev = monthKeyOffset(-1);
      const iM = sum(S.ingresos.filter((x) => x.fecha.startsWith(mk)));
      const gM = sum(S.gastos.filter((x) => x.fecha.startsWith(mk)));
      const iP = sum(S.ingresos.filter((x) => x.fecha.startsWith(prev)));
      const net = iM - gM;
      const vivos = S.proyectos.filter((p) => p.estado !== 'cancelado');
      const porCobrar = sum(vivos, 'saldo_pendiente');
      const conDeuda = vivos.filter((p) => p.saldo_pendiente > 0).length;
      const activos = S.proyectos.filter((p) => p.estado === 'en_progreso' || p.estado === 'pausado');
      const delta = iP > 0 ? ((iM - iP) / iP) * 100 : null;
      const totalHist = sum(S.ingresos) - sum(S.gastos);
      const keys = Array.from({ length: 6 }, (_, i) => monthKeyOffset(i - 5));
      const movs = [...S.ingresos.map((x) => ({ ...x, _in: true })), ...S.gastos.map((x) => ({ ...x, _in: false }))]
        .sort((a, b) => b.fecha.localeCompare(a.fecha) || String(b.created_at).localeCompare(String(a.created_at)))
        .slice(0, 7);
      const vacio = !S.proyectos.length && !S.ingresos.length && !S.gastos.length;

      return {
        title: `Hola 👋`,
        sub: `Resumen de ${monthLabel(mk, true)}`,
        actions: `<button class="btn" data-act="new-gasto">${ic('gastos')}<span>Gasto</span></button>${btnNew('new-ingreso', 'Ingreso / abono')}`,
        html: `
        ${vacio ? `<div class="card welcome" style="margin-bottom:16px"><h3>Bienvenido a NovaCore</h3>
          <ol><li>Registra tus <a href="#/clientes"><b>clientes</b></a>.</li><li>Crea tus <a href="#/proyectos"><b>${W.ps}</b></a> con el precio total acordado.</li>
          <li>Cada vez que te paguen, registra el <b>abono</b> en <a href="#/ingresos"><b>Ingresos</b></a>.</li><li>Anota tus <a href="#/gastos"><b>gastos</b></a> y mira tu ganancia real aquí.</li></ol></div>` : ''}
        <div class="grid g-4">
          <div class="card kpi" style="--c:var(--pos)"><div class="lbl"><span class="dot" style="background:var(--pos)"></span>Ingresos del mes</div><div class="val">${money(iM)}</div>
            <div class="foot">${delta === null ? 'Sin datos del mes anterior' : `<span class="${delta >= 0 ? 'pos' : 'neg'}">${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta).toFixed(0)}%</span> vs mes anterior`}</div></div>
          <div class="card kpi" style="--c:var(--neg)"><div class="lbl"><span class="dot" style="background:var(--neg)"></span>Gastos del mes</div><div class="val">${money(gM)}</div><div class="foot">${((n) => `${n} gasto${n === 1 ? '' : 's'} registrado${n === 1 ? '' : 's'}`)(S.gastos.filter((x) => x.fecha.startsWith(mk)).length)}</div></div>
          <div class="card kpi" style="--c:var(--accent)"><div class="lbl"><span class="dot" style="background:var(--accent)"></span>Ganancia neta del mes</div><div class="val ${net < 0 ? 'neg' : ''}">${money(net)}</div><div class="foot">Total histórico: <b class="${totalHist < 0 ? 'neg' : ''}">${money(totalHist)}</b></div></div>
          <div class="card kpi" style="--c:var(--warn)"><div class="lbl"><span class="dot" style="background:var(--warn)"></span>Por cobrar</div><div class="val">${money(porCobrar)}</div><div class="foot">${conDeuda} ${conDeuda === 1 ? W.p : W.ps} con saldo pendiente</div></div>
        </div>

        <div class="grid g-2 mt">
          <div class="card"><div class="card-head"><h3>Ingresos vs gastos · últimos 6 meses</h3>${legend}</div>${barChart(monthSeries(keys, S.ingresos, S.gastos))}</div>
          <div class="card"><div class="card-head"><h3>Últimos movimientos</h3><a class="muted sm" href="#/reportes">Ver reportes →</a></div>
            <div class="list">${movs.map((m) => `<div class="list-item">
              <div class="mov-ic ${m._in ? 'in' : 'out'}">${ic(m._in ? 'up' : 'down')}</div>
              <div class="grow"><div class="t">${esc(m.concepto)}</div><div class="muted sm">${fmtDate(m.fecha)} · ${esc(m._in ? (projName(m.proyecto_id) || TIPOS_INGRESO[m.tipo] || 'Ingreso') : (CAT_LABEL[m.categoria] || m.categoria))}</div></div>
              <strong class="${m._in ? 'pos' : 'neg'} nowrap">${m._in ? '+' : '−'}${money(m.monto)}</strong></div>`).join('') || empty('Aún no hay movimientos')}</div>
          </div>
        </div>

        <div class="card mt"><div class="card-head"><h3>${W.Ps} activos (${activos.length})</h3><a class="muted sm" href="#/proyectos">Ver todos →</a></div>
          <div class="list">${activos.slice(0, 6).map((p) => `<div class="list-item">
            <div class="grow" style="cursor:pointer" data-act="ver-proyecto" data-id="${p.id}"><div class="t">${esc(p.nombre)}</div><div class="muted sm">${esc(p.cliente_nombre || 'Sin cliente')} · Entrega ${fmtDate(p.fecha_entrega)}</div></div>
            <div style="width:min(220px,30%)">${progressBar(p)}<div class="muted sm" style="margin-top:4px">${money(p.total_cobrado)} de ${money(p.precio_total)}</div></div>
            <div class="r nowrap" style="min-width:110px"><div class="sm muted">Pendiente</div><strong>${money(p.saldo_pendiente)}</strong></div>
            <button class="icon-btn money" data-act="abono" data-id="${p.id}" title="Registrar abono" aria-label="Registrar abono">${ic('cash')}</button>
          </div>`).join('') || empty('No tienes ${W.ps} en progreso')}</div>
        </div>`,
      };
    },

    // ---------------- PROYECTOS ----------------
    proyectos() {
      const f = (S.filters.proy ||= { q: '', estado: 'activos' });
      const rows = () => S.proyectos.filter((p) =>
        (f.estado === '' || (f.estado === 'activos' ? ['cotizacion', 'en_progreso', 'pausado'].includes(p.estado) : p.estado === f.estado)) &&
        matchQ(f.q, p.nombre, p.cliente_nombre, p.tipo, p.descripcion));
      const body = () => {
        const r = rows();
        if (!r.length) return `<div class="table-wrap">${empty(S.proyectos.length ? `No hay ${W.ps} con este filtro` : `Aún no tienes ${W.ps}. Crea el primero con “Nuevo ${W.p}”.`)}</div>`;
        return `<div class="summary"><span><strong>${r.length}</strong> ${r.length === 1 ? W.p : W.ps}</span><span>Valor total <strong>${money(sum(r, 'precio_total'))}</strong></span><span>Cobrado <strong class="pos">${money(sum(r, 'total_cobrado'))}</strong></span><span>Pendiente <strong>${money(sum(r.filter((p) => p.estado !== 'cancelado'), 'saldo_pendiente'))}</strong></span></div>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>${W.P}</th><th>Estado</th><th class="r">Precio</th><th class="r">Cobrado</th><th class="r">Pendiente</th><th style="width:140px">Avance de pago</th><th>Entrega</th><th></th></tr></thead><tbody>
        ${r.map((p) => `<tr>
          <td class="clickable" data-act="ver-proyecto" data-id="${p.id}"><strong>${esc(p.nombre)}</strong><div class="muted sm">${esc(p.cliente_nombre || 'Sin cliente')}${p.tipo ? ' · ' + esc(p.tipo) : ''}</div></td>
          <td>${estadoBadge(p.estado)}</td>
          <td class="r nowrap">${money(p.precio_total)}</td>
          <td class="r nowrap pos">${money(p.total_cobrado)}</td>
          <td class="r nowrap">${p.estado === 'cancelado' ? '<span class="muted">—</span>' : money(p.saldo_pendiente)}</td>
          <td>${progressBar(p)}</td>
          <td class="nowrap">${fmtDate(p.fecha_entrega)}</td>
          <td class="acts">${rowActs('proyecto', p.id, `<button class="icon-btn money" data-act="abono" data-id="${p.id}" title="Registrar abono" aria-label="Registrar abono">${ic('cash')}</button><button class="icon-btn" data-act="ver-proyecto" data-id="${p.id}" title="Ver detalle" aria-label="Ver detalle">${ic('eye')}</button>`)}</td>
        </tr>`).join('')}</tbody></table></div>`;
      };
      return {
        title: W.Ps, sub: `Tus ${W.ps}, su precio y cuánto te han pagado`,
        actions: btnNew('new-proyecto', `Nuevo ${W.p}`),
        html: `<div class="toolbar">${searchBox(`Buscar ${W.p} o cliente…`)}
          <select data-filter="estado"><option value="activos">Activos</option><option value="">Todos</option>${opts(ESTADOS).map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div id="list">${body()}</div>`,
        mount: () => bindList(f, body),
      };
    },

    // ---------------- INGRESOS ----------------
    ingresos() {
      const f = (S.filters.ing ||= { q: '', mes: '', tipo: '' });
      const rows = () => S.ingresos.filter((x) => (!f.mes || x.fecha.startsWith(f.mes)) && (!f.tipo || x.tipo === f.tipo) &&
        matchQ(f.q, x.concepto, projName(x.proyecto_id), cliName(x.cliente_id), x.notas, x.metodo_pago));
      const body = () => {
        const r = rows();
        if (!r.length) return `<div class="table-wrap">${empty(S.ingresos.length ? 'No hay ingresos con este filtro' : 'Aún no registras ingresos. Cuando te hagan un abono, regístralo aquí.')}</div>`;
        return `<div class="summary"><span><strong>${r.length}</strong> registro${r.length === 1 ? '' : 's'}</span><span>Total <strong class="pos">${money(sum(r))}</strong></span></div>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>Fecha</th><th>Concepto</th><th>${W.P} / Cliente</th><th>Tipo</th><th>Método</th><th class="r">Monto</th><th></th></tr></thead><tbody>
        ${r.map((x) => `<tr>
          <td class="nowrap">${fmtDate(x.fecha)}</td>
          <td><strong>${esc(x.concepto)}</strong>${x.notas ? `<div class="muted sm">${esc(x.notas)}</div>` : ''}</td>
          <td>${esc(projName(x.proyecto_id) || '—')}<div class="muted sm">${esc(cliName(x.cliente_id))}</div></td>
          <td><span class="tag">${esc(TIPOS_INGRESO[x.tipo] || x.tipo)}</span></td>
          <td>${esc(x.metodo_pago || '—')}</td>
          <td class="r nowrap pos"><strong>${money(x.monto)}</strong></td>
          <td class="acts">${rowActs('ingreso', x.id)}</td></tr>`).join('')}</tbody></table></div>`;
      };
      return {
        title: 'Ingresos y abonos', sub: 'Todo el dinero que te entra: anticipos, abonos, pagos completos, mantenimientos',
        actions: btnNew('new-ingreso', 'Nuevo ingreso'),
        html: `<div class="toolbar">${searchBox(`Buscar concepto, ${W.p} o cliente…`)}${monthSelect(S.ingresos)}
          <select data-filter="tipo"><option value="">Todos los tipos</option>${opts(TIPOS_INGRESO).map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div id="list">${body()}</div>`,
        mount: () => bindList(f, body),
      };
    },

    // ---------------- GASTOS ----------------
    gastos() {
      const f = (S.filters.gas ||= { q: '', mes: '', cat: '' });
      const rows = () => S.gastos.filter((x) => (!f.mes || x.fecha.startsWith(f.mes)) && (!f.cat || x.categoria === f.cat) &&
        matchQ(f.q, x.concepto, projName(x.proyecto_id), x.notas, CAT_LABEL[x.categoria]));
      const body = () => {
        const r = rows();
        if (!r.length) return `<div class="table-wrap">${empty(S.gastos.length ? 'No hay gastos con este filtro' : 'Aún no registras gastos.')}</div>`;
        return `<div class="summary"><span><strong>${r.length}</strong> gasto${r.length === 1 ? '' : 's'}</span><span>Total <strong class="neg">${money(sum(r))}</strong></span></div>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>Fecha</th><th>Concepto</th><th>Categoría</th><th>${W.P}</th><th>Método</th><th class="r">Monto</th><th></th></tr></thead><tbody>
        ${r.map((x) => `<tr>
          <td class="nowrap">${fmtDate(x.fecha)}</td>
          <td><strong>${esc(x.concepto)}</strong>${x.notas ? `<div class="muted sm">${esc(x.notas)}</div>` : ''}</td>
          <td><span class="tag">${esc(CAT_LABEL[x.categoria] || x.categoria)}</span></td>
          <td>${esc(projName(x.proyecto_id) || 'General')}</td>
          <td>${esc(x.metodo_pago || '—')}</td>
          <td class="r nowrap neg"><strong>${money(x.monto)}</strong></td>
          <td class="acts">${rowActs('gasto', x.id)}</td></tr>`).join('')}</tbody></table></div>`;
      };
      return {
        title: 'Gastos', sub: 'Lo que gastas para trabajar: materiales, transporte, servicios…',
        actions: btnNew('new-gasto', 'Nuevo gasto'),
        html: `<div class="toolbar">${searchBox('Buscar gasto…')}${monthSelect(S.gastos)}
          <select data-filter="cat"><option value="">Todas las categorías</option>${catOpts(S.gastos.map((x) => x.categoria)).map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select></div>
          <div id="list">${body()}</div>`,
        mount: () => bindList(f, body),
      };
    },

    // ---------------- CLIENTES ----------------
    clientes() {
      const f = (S.filters.cli ||= { q: '' });
      const stats = (c) => {
        const ps = S.proyectos.filter((p) => p.cliente_id === c.id);
        return { n: ps.length, pagado: sum(S.ingresos.filter((x) => x.cliente_id === c.id)), pend: sum(ps.filter((p) => p.estado !== 'cancelado'), 'saldo_pendiente') };
      };
      const body = () => {
        const r = S.clientes.filter((c) => matchQ(f.q, c.nombre, c.empresa, c.email, c.telefono));
        if (!r.length) return `<div class="table-wrap">${empty(S.clientes.length ? 'No se encontraron clientes' : 'Aún no tienes clientes registrados.')}</div>`;
        return `<div class="summary"><span><strong>${r.length}</strong> cliente${r.length === 1 ? '' : 's'}</span></div>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Contacto</th><th class="r">${W.Ps}</th><th class="r">Te ha pagado</th><th class="r">Te debe</th><th></th></tr></thead><tbody>
        ${r.map((c) => { const s = stats(c); return `<tr>
          <td><strong>${esc(c.nombre)}</strong>${c.empresa ? `<div class="muted sm">${esc(c.empresa)}</div>` : ''}</td>
          <td>${c.telefono ? esc(c.telefono) : ''}${c.email ? `<div class="muted sm">${esc(c.email)}</div>` : ''}${!c.telefono && !c.email ? '<span class="muted">—</span>' : ''}</td>
          <td class="r">${s.n}</td>
          <td class="r nowrap pos">${money(s.pagado)}</td>
          <td class="r nowrap ${s.pend > 0 ? '' : 'muted'}">${money(s.pend)}</td>
          <td class="acts">${rowActs('cliente', c.id)}</td></tr>`; }).join('')}</tbody></table></div>`;
      };
      return {
        title: 'Clientes', sub: 'Las personas y empresas para las que trabajas',
        actions: btnNew('new-cliente', 'Nuevo cliente'),
        html: `<div class="toolbar">${searchBox('Buscar cliente…')}</div><div id="list">${body()}</div>`,
        mount: () => bindList(f, body),
      };
    },

    // ---------------- REPORTES ----------------
    reportes() {
      const f = (S.filters.rep ||= presetRange('anio'));
      const inR = (x) => x.fecha >= f.from && x.fecha <= f.to;
      const ing = S.ingresos.filter(inR), gas = S.gastos.filter(inR);
      const tI = sum(ing), tG = sum(gas), net = tI - tG, margen = tI > 0 ? (net / tI) * 100 : 0;

      const fechas = [...ing, ...gas].map((x) => x.fecha).sort();
      let chart = empty('Sin movimientos en este rango');
      if (fechas.length) {
        const start = fechas[0] > f.from ? fechas[0] : f.from;
        const end = f.to < today() ? f.to : today();
        const keys = monthRange(start, end > start ? end : start);
        const multiYear = keys.length && keys[0].slice(0, 4) !== keys[keys.length - 1].slice(0, 4);
        chart = barChart(monthSeries(keys, ing, gas, multiYear));
      }

      const cats = groupSum(gas, (x) => x.categoria || 'otros').map(([k, v]) => ({ label: CAT_LABEL[k] || k, value: v }));
      const clis = groupSum(ing.filter((x) => x.cliente_id), (x) => x.cliente_id).slice(0, 8).map(([k, v]) => ({ label: cliName(k) || 'Cliente eliminado', value: v }));

      const proj = S.proyectos.map((p) => {
        const c = sum(ing.filter((x) => x.proyecto_id === p.id)), g = sum(gas.filter((x) => x.proyecto_id === p.id));
        return { p, c, g, n: c - g };
      }).filter((r) => r.c || r.g).sort((a, b) => b.n - a.n);
      const sinProyI = sum(ing.filter((x) => !x.proyecto_id)), sinProyG = sum(gas.filter((x) => !x.proyecto_id));

      const hbars = (items, alt) => {
        const mx = Math.max(1, ...items.map((i) => i.value));
        return items.map((i) => `<div class="hbar"><div class="hbar-top"><span>${esc(i.label)}</span><strong>${money(i.value)}</strong></div><div class="hbar-track"><div class="hbar-fill ${alt ? 'alt' : ''}" style="width:${((i.value / mx) * 100).toFixed(1)}%"></div></div></div>`).join('') || empty('Sin datos en este rango');
      };
      const preset = (k, l) => `<button class="chip ${f.preset === k ? 'on' : ''}" data-act="rep-preset" data-id="${k}">${l}</button>`;

      return {
        title: 'Reportes', sub: `Cuánto ganas realmente, en qué gastas y qué ${W.ps} te dejan más`,
        actions: `<button class="btn" data-act="export-csv">${ic('download')}<span>Exportar a Excel (CSV)</span></button>`,
        html: `
        <div class="toolbar">
          <div class="chips">${preset('mes', 'Este mes')}${preset('mes_ant', 'Mes pasado')}${preset('trim', 'Últimos 3 meses')}${preset('anio', 'Este año')}${preset('todo', 'Todo')}</div>
          ${f.preset === 'todo' ? '' : `<input type="date" id="rep-from" value="${f.from}" aria-label="Desde"><input type="date" id="rep-to" value="${f.to}" aria-label="Hasta">`}
        </div>
        <div class="grid g-4">
          <div class="card kpi" style="--c:var(--pos)"><div class="lbl">Ingresos</div><div class="val pos">${money(tI)}</div><div class="foot">${ing.length} registros</div></div>
          <div class="card kpi" style="--c:var(--neg)"><div class="lbl">Gastos</div><div class="val neg">${money(tG)}</div><div class="foot">${gas.length} registros</div></div>
          <div class="card kpi" style="--c:var(--accent)"><div class="lbl">Ganancia neta</div><div class="val ${net < 0 ? 'neg' : ''}">${money(net)}</div><div class="foot">Lo que realmente te queda</div></div>
          <div class="card kpi" style="--c:var(--accent2)"><div class="lbl">Margen de ganancia</div><div class="val">${tI > 0 ? margen.toFixed(1) + '%' : '—'}</div><div class="foot">De cada $100 te quedan ${tI > 0 ? '$' + Math.max(0, margen).toFixed(0) : '—'}</div></div>
        </div>
        <div class="card mt"><div class="card-head"><h3>Ingresos vs gastos por mes</h3>${legend}</div>${chart}</div>
        <div class="grid g-2e mt">
          <div class="card"><div class="card-head"><h3>Gastos por categoría</h3></div>${hbars(cats)}</div>
          <div class="card"><div class="card-head"><h3>Clientes que más te pagaron</h3></div>${hbars(clis, true)}</div>
        </div>
        <div class="card mt" style="padding:0"><div class="card-head" style="padding:18px 18px 0"><h3>Ganancia por ${W.p}</h3></div>
          ${proj.length || sinProyI || sinProyG ? `<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>${W.P}</th><th>Estado</th><th class="r">Cobrado</th><th class="r">Gastos</th><th class="r">Ganancia</th></tr></thead><tbody>
          ${proj.map((r) => `<tr><td class="clickable" data-act="ver-proyecto" data-id="${r.p.id}"><strong>${esc(r.p.nombre)}</strong><div class="muted sm">${esc(r.p.cliente_nombre || 'Sin cliente')}</div></td><td>${estadoBadge(r.p.estado)}</td><td class="r pos nowrap">${money(r.c)}</td><td class="r neg nowrap">${money(r.g)}</td><td class="r nowrap"><strong class="${r.n < 0 ? 'neg' : ''}">${money(r.n)}</strong></td></tr>`).join('')}
          ${sinProyI || sinProyG ? `<tr><td><strong>Sin ${W.p} / generales</strong><div class="muted sm">Ingresos y gastos no asignados</div></td><td></td><td class="r pos nowrap">${money(sinProyI)}</td><td class="r neg nowrap">${money(sinProyG)}</td><td class="r nowrap"><strong class="${sinProyI - sinProyG < 0 ? 'neg' : ''}">${money(sinProyI - sinProyG)}</strong></td></tr>` : ''}
          </tbody></table></div>` : empty('Sin datos en este rango')}
        </div>`,
        mount() {
          const a = document.getElementById('rep-from'), b = document.getElementById('rep-to');
          if (!a) return;
          const upd = () => { if (a.value && b.value) { f.from = a.value; f.to = b.value; f.preset = ''; render(); } };
          a.onchange = upd; b.onchange = upd;
        },
      };
    },

    // ---------------- NEGOCIOS (solo administrador) ----------------
    negocios() {
      const f = (S.filters.neg ||= { q: '', estado: '' });
      const rows = () => S.negocios.filter((n) => (!f.estado || estadoNegocio(n).k === f.estado) &&
        matchQ(f.q, n.nombre, n.contacto, n.email, n.telefono));
      const activos = S.negocios.filter((n) => ['activo', 'pronto'].includes(estadoNegocio(n).k));
      const pronto = S.negocios.filter((n) => estadoNegocio(n).k === 'pronto' || estadoNegocio(n).k === 'gracia');
      const caidos = S.negocios.filter((n) => ['vencido', 'suspendido'].includes(estadoNegocio(n).k));
      const mk = today().slice(0, 7);
      const cobradoMes = sum(S.pagosSus.filter((x) => x.fecha.startsWith(mk)));
      const body = () => {
        const r = rows();
        if (!r.length) return `<div class="table-wrap">${empty(S.negocios.length ? 'No hay negocios con este filtro' : 'Aún no tienes negocios. Crea el primero con “Nuevo negocio” y mándale la invitación por WhatsApp.')}</div>`;
        return `<div class="table-wrap"><table class="tbl"><thead><tr><th>Negocio</th><th>Contacto</th><th>Estado</th><th>Pagado hasta</th><th class="r">Mensual</th><th></th></tr></thead><tbody>
        ${r.map((n) => { const e = estadoNegocio(n), d = diasHasta(n.pagado_hasta); return `<tr>
          <td class="clickable" data-act="ver-negocio" data-id="${n.id}"><strong>${esc(n.nombre)}</strong><div class="muted sm">${esc(RUBROS[n.rubro]?.label || n.rubro)}</div></td>
          <td>${esc(n.contacto || '')}${n.telefono ? `<div class="muted sm">${esc(n.telefono)}</div>` : ''}<div class="muted sm">${esc(n.email)}</div></td>
          <td><span class="badge ${e.cls}">${e.label}</span></td>
          <td class="nowrap">${fmtDate(n.pagado_hasta)}<div class="muted sm">${d > 0 ? `faltan ${d} día${d === 1 ? '' : 's'}` : d === 0 ? 'vence hoy' : `hace ${-d} día${d === -1 ? '' : 's'}`}</div></td>
          <td class="r nowrap">${money(n.precio_mensual)}</td>
          <td class="acts"><button class="icon-btn money" data-act="pago-negocio" data-id="${n.id}" title="Registrar pago" aria-label="Registrar pago">${ic('cash')}</button><button class="icon-btn" data-act="wa-negocio" data-id="${n.id}" title="${n.user_id ? 'Recordatorio por WhatsApp' : 'Mandar invitación por WhatsApp'}" aria-label="WhatsApp">${ic('wa')}</button>${rowActs('negocio', n.id)}</td>
        </tr>`; }).join('')}</tbody></table></div>`;
      };
      return {
        title: 'Negocios', sub: 'Los negocios que pagan NovaCore: sus cuentas, pagos y vencimientos',
        actions: btnNew('new-negocio', 'Nuevo negocio'),
        html: `<div class="grid g-4">
          <div class="card kpi" style="--c:var(--pos)"><div class="lbl"><span class="dot" style="background:var(--pos)"></span>Negocios activos</div><div class="val">${activos.length}</div><div class="foot">de ${S.negocios.length} en total</div></div>
          <div class="card kpi" style="--c:var(--accent)"><div class="lbl"><span class="dot" style="background:var(--accent)"></span>Ingreso mensual</div><div class="val">${money(sum(activos, 'precio_mensual'))}</div><div class="foot">Cobrado este mes: <b>${money(cobradoMes)}</b></div></div>
          <div class="card kpi" style="--c:var(--warn)"><div class="lbl"><span class="dot" style="background:var(--warn)"></span>Por cobrar pronto</div><div class="val">${pronto.length}</div><div class="foot">Vencen en 7 días o ya están en gracia</div></div>
          <div class="card kpi" style="--c:var(--neg)"><div class="lbl"><span class="dot" style="background:var(--neg)"></span>Bloqueados</div><div class="val">${caidos.length}</div><div class="foot">Vencidos o suspendidos</div></div>
        </div>
        <div class="toolbar mt">${searchBox('Buscar negocio, contacto o correo…')}
          <select data-filter="estado"><option value="">Todos</option>${Object.entries(ESTADOS_NEG).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}</select></div>
        <div id="list">${body()}</div>`,
        mount: () => bindList(f, body),
      };
    },

    // ---------------- AJUSTES ----------------
    ajustes() {
      const n = S.cuenta?.negocio || {};
      const admin = S.cuenta?.es_admin;
      const d = n.pagado_hasta ? diasHasta(n.pagado_hasta) : null;
      const tipos = (n.tipos?.length ? n.tipos : []).join('\n');
      return {
        title: 'Ajustes', sub: 'Los datos de tu negocio, tu suscripción y tu contraseña',
        html: `<div class="grid g-2e">
          <form class="card stack" id="f-negocio">
            <div class="card-head"><h3>Tu negocio</h3></div>
            <label class="field"><span>Nombre del negocio *</span><input name="nombre" required value="${esc(n.nombre || '')}"></label>
            <label class="field"><span>Teléfono / WhatsApp</span><input name="telefono" type="tel" value="${esc(n.telefono || '')}"></label>
            <label class="field"><span>¿A qué se dedica?</span><select name="rubro">${Object.entries(RUBROS).map(([k, r]) => `<option value="${k}" ${k === (n.rubro || 'desarrollo') ? 'selected' : ''}>${esc(r.label)}</option>`).join('')}</select></label>
            <label class="field"><span>Tipos de ${esc(W.p)} (uno por línea)</span><textarea name="tipos" rows="5" placeholder="${esc(R.tipos.join('\n'))}">${esc(tipos)}</textarea></label>
            <p class="muted sm" style="margin:0">Si lo dejas vacío se usan los de tu rubro.</p>
            <div><button class="btn primary" type="submit">Guardar cambios</button></div>
          </form>
          <div class="stack">
            <div class="card"><div class="card-head"><h3>Suscripción</h3></div>
              ${admin ? '<p class="muted">Esta es la cuenta de administrador: no vence.</p>' : `
              <div class="mini-kpis">
                <div><span>Mensualidad</span><strong>${money(n.precio_mensual)}</strong></div>
                <div><span>Pagado hasta</span><strong>${fmtDate(n.pagado_hasta)}</strong></div>
                <div><span>Estado</span><strong class="${d !== null && d < 0 ? 'neg' : 'pos'}">${d === null ? '—' : d >= 0 ? `Al día (${d} día${d === 1 ? '' : 's'})` : 'Vencida'}</strong></div>
              </div>
              <p class="muted sm">Paga por Yappy o transferencia y manda el comprobante por WhatsApp.</p>
              ${SOPORTE ? `<a class="btn" href="${waLink(SOPORTE, `Hola, soy de ${n.nombre}. Quiero pagar la mensualidad de NovaCore.`)}" target="_blank" rel="noopener">${ic('wa')}<span>Escribir a soporte</span></a>` : ''}`}
            </div>
            <form class="card stack" id="f-clave">
              <div class="card-head"><h3>Cambiar contraseña</h3></div>
              <label class="field"><span>Nueva contraseña</span><input type="password" name="p1" minlength="6" required autocomplete="new-password"></label>
              <label class="field"><span>Repetir contraseña</span><input type="password" name="p2" minlength="6" required autocomplete="new-password"></label>
              <div><button class="btn" type="submit">Cambiar contraseña</button></div>
            </form>
            <p class="muted sm">Sesión iniciada como ${esc(S.user.email)}</p>
          </div>
        </div>`,
        mount() {
          const fn = document.getElementById('f-negocio');
          fn.onsubmit = async (e) => {
            e.preventDefault();
            const btn = fn.querySelector('[type=submit]'); btn.disabled = true;
            try {
              const lista = fn.tipos.value.split('\n').map((t) => t.trim()).filter(Boolean);
              const { error } = await sb.rpc('actualizar_mi_negocio', { p_nombre: fn.nombre.value, p_telefono: fn.telefono.value, p_rubro: fn.rubro.value, p_tipos: lista });
              if (error) throw error;
              await recargarCuenta();
              toast('Datos del negocio guardados');
              render();
            } catch (err) { toast(err.message, 'err'); btn.disabled = false; }
          };
          const fc = document.getElementById('f-clave');
          fc.onsubmit = async (e) => {
            e.preventDefault();
            if (fc.p1.value.length < 6) return toast('La contraseña debe tener al menos 6 caracteres', 'err');
            if (fc.p1.value !== fc.p2.value) return toast('Las contraseñas no coinciden', 'err');
            const { error } = await sb.auth.updateUser({ password: fc.p1.value });
            if (error) return toast(authErr(error), 'err');
            fc.reset(); toast('Contraseña cambiada');
          };
        },
      };
    },
  };

  // ---------- Negocios: estado, formularios y WhatsApp ----------
  const ESTADOS_NEG = {
    activo: { label: 'Al día', cls: 's-terminado' }, pronto: { label: 'Vence pronto', cls: 's-pausado' },
    gracia: { label: 'En gracia', cls: 's-pausado' }, vencido: { label: 'Vencido', cls: 's-cancelado' },
    suspendido: { label: 'Suspendido', cls: 's-cancelado' }, sin_activar: { label: 'Sin activar', cls: 's-cotizacion' },
  };
  function estadoNegocio(n) {
    const d = diasHasta(n.pagado_hasta), g = S.cuenta?.gracia ?? 3;
    const k = n.estado === 'suspendido' ? 'suspendido' : d < -g ? 'vencido' : d < 0 ? 'gracia' : !n.user_id ? 'sin_activar' : d <= 7 ? 'pronto' : 'activo';
    return { k, ...ESTADOS_NEG[k] };
  }

  function negocioForm(n) {
    const nuevo = !n;
    const v = n ? { ...n } : { rubro: 'otro', precio_mensual: CFG.PRECIO_MENSUAL ?? 20, primer_pago: 'si' };
    openForm({
      title: nuevo ? 'Nuevo negocio' : 'Editar negocio', values: v,
      subtitle: nuevo ? 'Después le mandas la invitación por WhatsApp: entra con este correo y crea su contraseña.' : (n.user_id ? 'La cuenta ya está activada.' : 'Todavía no activa su cuenta.'),
      fields: [
        { name: 'nombre', label: 'Nombre del negocio', required: true, ph: 'Ej: Taller El Rápido' },
        { name: 'contacto', label: 'Persona de contacto', ph: 'Ej: Carlos Gómez' },
        { name: 'email', label: 'Correo para entrar', type: 'email', required: true, ph: 'correo@ejemplo.com' },
        { name: 'telefono', label: 'WhatsApp', type: 'tel', ph: '6000-0000' },
        { name: 'rubro', label: '¿A qué se dedica?', type: 'select', options: Object.entries(RUBROS).map(([k, r]) => ({ value: k, label: r.label })) },
        { name: 'precio_mensual', label: 'Mensualidad', type: 'number', required: true, ph: '20.00' },
        ...(nuevo ? [{ name: 'primer_pago', label: '¿Ya pagó el primer mes?', type: 'select', options: [{ value: 'si', label: 'Sí, registrar el pago ahora' }, { value: 'prueba', label: 'No, darle 7 días de prueba' }], full: true }]
          : [{ name: 'pagado_hasta', label: 'Pagado hasta', type: 'date', required: true }]),
        { name: 'notas', label: 'Notas (solo las ves tú)', type: 'textarea', full: true },
      ],
      onSubmit: async (d) => {
        d.email = String(d.email || '').trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(d.email)) throw new Error('Escribe un correo válido');
        if (!(d.precio_mensual >= 0)) throw new Error('La mensualidad no es válida');
        const primer = d.primer_pago; delete d.primer_pago;
        if (nuevo) {
          d.pagado_hasta = primer === 'prueba' ? ymd(new Date(Date.now() + 7 * 86400000)) : today();
          const { data, error } = await sb.from('negocios').insert(d).select().single();
          if (error) throw /negocios_email_uq|duplicate/i.test(error.message) ? new Error('Ya hay un negocio con ese correo') : error;
          if (primer === 'si') {
            const r = await sb.rpc('registrar_pago_suscripcion', { p_negocio: data.id, p_meses: 1, p_monto: d.precio_mensual, p_fecha: today(), p_metodo: null });
            if (r.error) throw r.error;
          }
          closeModal(); toast('Negocio creado. Ahora mándale la invitación.');
          await refresh();
          return negocioDetalle(data.id);
        }
        const { error } = await sb.from('negocios').update(d).eq('id', n.id);
        if (error) throw /negocios_email_uq|duplicate/i.test(error.message) ? new Error('Ya hay un negocio con ese correo') : error;
        closeModal(); toast('Cambios guardados'); await refresh();
      },
    });
  }

  function pagoNegocioForm(n) {
    if (!n) return;
    openForm({
      title: 'Registrar pago', submitLabel: 'Registrar pago',
      subtitle: `${esc(n.nombre)} · Pagado hasta <b>${fmtDate(n.pagado_hasta)}</b>. El pago se suma a tus Ingresos.`,
      values: { meses: '1', monto: n.precio_mensual, fecha: today(), metodo_pago: 'Yappy' },
      fields: [
        { name: 'meses', label: 'Meses que paga', type: 'select', options: [1, 2, 3, 6, 12].map((m) => ({ value: String(m), label: m === 1 ? '1 mes' : `${m} meses` })),
          onChange: (form) => { form.elements.monto.value = (n.precio_mensual * Number(form.elements.meses.value)).toFixed(2); } },
        { name: 'monto', label: 'Monto recibido', type: 'number', required: true },
        { name: 'fecha', label: 'Fecha del pago', type: 'date', required: true },
        { name: 'metodo_pago', label: 'Método', type: 'select', options: METODOS.map((m) => ({ value: m, label: m })) },
      ],
      onSubmit: async (d) => {
        if (!(d.monto >= 0)) throw new Error('El monto no es válido');
        const { data, error } = await sb.rpc('registrar_pago_suscripcion', { p_negocio: n.id, p_meses: Number(d.meses), p_monto: d.monto, p_fecha: d.fecha, p_metodo: d.metodo_pago });
        if (error) throw error;
        closeModal(); toast(`Pago registrado. Ahora está pagado hasta el ${fmtDate(data)}`);
        await refresh();
      },
    });
  }

  function negocioDetalle(id) {
    const n = byId(S.negocios, id);
    if (!n) return;
    const e = estadoNegocio(n), pagos = S.pagosSus.filter((x) => x.negocio_id === id);
    $modal.innerHTML = `<div class="modal-backdrop"><div class="modal wide" role="dialog" aria-modal="true" aria-label="${esc(n.nombre)}">
      <div class="modal-head"><div><h3>${esc(n.nombre)}</h3><p class="muted">${esc(RUBROS[n.rubro]?.label || n.rubro)} · <span class="badge ${e.cls}">${e.label}</span></p></div>
        <button type="button" class="icon-btn" data-close aria-label="Cerrar">${ic('close')}</button></div>
      <div class="mini-kpis">
        <div><span>Mensualidad</span><strong>${money(n.precio_mensual)}</strong></div>
        <div><span>Pagado hasta</span><strong>${fmtDate(n.pagado_hasta)}</strong></div>
        <div><span>Total pagado</span><strong class="pos">${money(sum(pagos))}</strong></div>
        <div><span>Cliente desde</span><strong>${fmtDate(n.created_at)}</strong></div>
      </div>
      <p class="muted sm" style="margin:10px 0 0">${esc(n.contacto || '')}${n.contacto ? ' · ' : ''}${esc(n.email)}${n.telefono ? ' · ' + esc(n.telefono) : ''}</p>
      ${n.notas ? `<p style="white-space:pre-wrap;margin:12px 0 0">${esc(n.notas)}</p>` : ''}
      <h4>Pagos (${pagos.length})</h4><div class="list">${pagos.map((x) => `<div class="list-item"><div class="mov-ic in">${ic('up')}</div>
        <div class="grow"><div class="t">${x.meses === 1 ? '1 mes' : x.meses + ' meses'} · del ${fmtDate(x.desde)} al ${fmtDate(x.hasta)}</div><div class="muted sm">${fmtDate(x.fecha)}${x.metodo_pago ? ' · ' + esc(x.metodo_pago) : ''}</div></div>
        <strong class="pos nowrap">${money(x.monto)}</strong></div>`).join('') || empty('Todavía no hay pagos')}</div>
      <div class="modal-actions" style="margin-top:20px">
        <button class="btn ghost" data-act="toggle-negocio" data-id="${n.id}">${ic(n.estado === 'suspendido' ? 'play' : 'pause')}<span>${n.estado === 'suspendido' ? 'Reactivar' : 'Suspender'}</span></button>
        <button class="btn ghost" data-act="edit-negocio" data-id="${n.id}">${ic('edit')}<span>Editar</span></button>
        <button class="btn" data-act="wa-negocio" data-id="${n.id}">${ic('wa')}<span>${n.user_id ? 'Recordatorio' : 'Invitación'}</span></button>
        <button class="btn primary" data-act="pago-negocio" data-id="${n.id}">${ic('cash')}<span>Registrar pago</span></button>
      </div>
    </div></div>`;
    bindModalClose();
  }

  // Abre WhatsApp con el mensaje listo (o lo copia si no hay telefono)
  async function mandarWhatsApp(n, texto) {
    const num = waNum(n.telefono);
    if (num) { window.open(waLink(num, texto), '_blank', 'noopener'); return; }
    try { await navigator.clipboard.writeText(texto); toast('No tiene WhatsApp guardado: copié el mensaje para que lo pegues'); }
    catch { prompt('Copia este mensaje:', texto); }
  }
  function invitar(n) {
    if (!n) return;
    const hola = n.contacto ? n.contacto.split(' ')[0] : '';
    return mandarWhatsApp(n, `Hola${hola ? ' ' + hola : ''} 👋 Ya está lista tu cuenta de NovaCore para *${n.nombre}*.\n\n1. Entra a ${APP_URL}\n2. Toca "Activar mi cuenta"\n3. Escribe este correo: ${n.email}\n4. Crea tu contraseña y confirma el correo que te llega (revisa también spam).\n\nCualquier duda me escribes por aquí.`);
  }
  function recordar(n) {
    const d = diasHasta(n.pagado_hasta);
    const hola = n.contacto ? n.contacto.split(' ')[0] : '';
    const cuando = d > 0 ? `vence el ${fmtDate(n.pagado_hasta)}` : d === 0 ? 'vence hoy' : `venció el ${fmtDate(n.pagado_hasta)}`;
    return mandarWhatsApp(n, `Hola${hola ? ' ' + hola : ''}, te recuerdo que la mensualidad de NovaCore de *${n.nombre}* ${cuando}. Son ${money(n.precio_mensual)} y puedes pagar por Yappy o transferencia; me mandas el comprobante por aquí. ¡Gracias!`);
  }
  async function toggleNegocio(n) {
    if (!n) return;
    const suspender = n.estado !== 'suspendido';
    if (suspender && !confirm(`¿Suspender a ${n.nombre}? No podrá entrar hasta que lo reactives. Sus datos no se borran.`)) return;
    const { error } = await sb.from('negocios').update({ estado: suspender ? 'suspendido' : 'activo' }).eq('id', n.id);
    if (error) return toast(error.message, 'err');
    closeModal(); toast(suspender ? 'Negocio suspendido' : 'Negocio reactivado');
    await refresh();
  }

  function presetRange(k) {
    const t = today(), m = t.slice(0, 7);
    if (k === 'mes') return { preset: k, from: `${m}-01`, to: t };
    if (k === 'mes_ant') { const p = monthKeyOffset(-1); return { preset: k, from: `${p}-01`, to: lastDayOf(p) }; }
    if (k === 'trim') return { preset: k, from: `${monthKeyOffset(-2)}-01`, to: t };
    if (k === 'todo') return { preset: k, from: '1900-01-01', to: '9999-12-31' };
    return { preset: 'anio', from: `${t.slice(0, 4)}-01-01`, to: t };
  }

  function monthRange(from, to) {
    const out = [];
    let [y, m] = from.slice(0, 7).split('-').map(Number);
    const [ey, em] = to.slice(0, 7).split('-').map(Number);
    while ((y < ey || (y === ey && m <= em)) && out.length < 2400) {
      out.push(`${y}-${pad(m)}`);
      if (++m > 12) { m = 1; y++; }
    }
    return out.slice(-12);
  }

  function exportCsv() {
    const f = S.filters.rep || presetRange('anio');
    const inR = (x) => x.fecha >= f.from && x.fecha <= f.to;
    const rows = [
      ...S.ingresos.filter(inR).map((x) => [x.fecha, 'Ingreso', x.concepto, TIPOS_INGRESO[x.tipo] || x.tipo, projName(x.proyecto_id), cliName(x.cliente_id), x.metodo_pago || '', Number(x.monto).toFixed(2)]),
      ...S.gastos.filter(inR).map((x) => [x.fecha, 'Gasto', x.concepto, CAT_LABEL[x.categoria] || x.categoria, projName(x.proyecto_id), '', x.metodo_pago || '', (-Number(x.monto)).toFixed(2)]),
    ].sort((a, b) => a[0].localeCompare(b[0]));
    if (!rows.length) return toast('No hay movimientos en este rango', 'err');
    rows.unshift(['Fecha', 'Tipo', 'Concepto', 'Categoría / Tipo', 'Proyecto', 'Cliente', 'Método', 'Monto']);
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `NovaCore_${f.preset === 'todo' ? 'todo' : f.from + '_a_' + f.to}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // =====================================================
  //  FORMULARIOS (modal)
  // =====================================================
  function fieldHtml(f, v) {
    const val = v ?? f.default ?? '';
    const req = f.required ? 'required' : '';
    let input;
    if (f.type === 'select') {
      input = `<select name="${f.name}" ${req}>${f.placeholder !== undefined ? `<option value="">${esc(f.placeholder)}</option>` : ''}${f.options.map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(val) ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
    } else if (f.type === 'textarea') {
      input = `<textarea name="${f.name}" rows="3" ${req} placeholder="${esc(f.ph || '')}">${esc(val)}</textarea>`;
    } else {
      const num = f.type === 'number' ? `step="0.01" min="${f.min ?? 0}" inputmode="decimal"` : '';
      input = `<input name="${f.name}" type="${f.type || 'text'}" value="${esc(val)}" ${req} ${num} placeholder="${esc(f.ph || '')}">`;
    }
    return `<label class="field${f.full ? ' full' : ''}"><span>${esc(f.label)}${f.required ? ' *' : ''}</span>${input}</label>`;
  }

  function closeModal() { $modal.innerHTML = ''; }
  function bindModalClose() {
    $modal.querySelectorAll('[data-close]').forEach((b) => (b.onclick = closeModal));
    const bd = $modal.querySelector('.modal-backdrop');
    bd.addEventListener('mousedown', (e) => { if (e.target === bd) closeModal(); });
  }

  function openForm({ title, subtitle, fields, values = {}, submitLabel = 'Guardar', onSubmit }) {
    $modal.innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head"><div><h3>${esc(title)}</h3>${subtitle ? `<p class="muted">${subtitle}</p>` : ''}</div><button type="button" class="icon-btn" data-close aria-label="Cerrar">${ic('close')}</button></div>
      <form class="form-grid">${fields.map((f) => fieldHtml(f, values[f.name])).join('')}
        <div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="submit" class="btn primary">${esc(submitLabel)}</button></div>
      </form></div></div>`;
    bindModalClose();
    const form = $modal.querySelector('form');
    fields.forEach((f) => { if (f.onChange) form.elements[f.name].addEventListener('change', () => f.onChange(form)); });
    form.querySelector('input,select,textarea')?.focus();

    form.onsubmit = async (e) => {
      e.preventDefault();
      const data = {};
      fields.forEach((f) => {
        let v = form.elements[f.name].value.trim();
        if (f.type === 'number') v = v === '' ? null : Number(v.replace(',', '.'));
        else if (v === '') v = null;
        data[f.name] = v;
      });
      const btn = form.querySelector('[type=submit]');
      btn.disabled = true; btn.textContent = 'Guardando…';
      try { await onSubmit(data); }
      catch (err) { toast(err.message || 'Ocurrió un error', 'err'); btn.disabled = false; btn.textContent = submitLabel; }
    };
  }

  function clienteForm(c) {
    openForm({
      title: c ? 'Editar cliente' : 'Nuevo cliente', values: c || {},
      fields: [
        { name: 'nombre', label: 'Nombre', required: true, ph: 'Ej: Juan Pérez' },
        { name: 'empresa', label: 'Empresa / negocio', ph: 'Opcional' },
        { name: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel' },
        { name: 'email', label: 'Correo', type: 'email' },
        { name: 'notas', label: 'Notas', type: 'textarea', full: true },
      ],
      onSubmit: (d) => save('clientes', d, c?.id),
    });
  }

  function proyectoForm(p) {
    const v = p ? { ...p } : { estado: 'en_progreso', fecha_inicio: today() };
    openForm({
      title: p ? `Editar ${W.p}` : `Nuevo ${W.p}`, values: v,
      subtitle: S.clientes.length ? '' : 'Tip: primero registra al cliente en la sección <b>Clientes</b> para poder asignarlo.',
      fields: [
        { name: 'nombre', label: `Nombre del ${W.p}`, required: true, full: true, ph: 'Ej: ' + R.ej },
        { name: 'cliente_id', label: 'Cliente', type: 'select', placeholder: 'Sin cliente', options: cliOpts() },
        { name: 'tipo', label: 'Tipo', type: 'select', placeholder: '—', options: [...new Set([...TIPOS_PROYECTO, ...(v.tipo ? [v.tipo] : [])])].map((t) => ({ value: t, label: t })) },
        { name: 'precio_total', label: 'Precio total acordado', type: 'number', required: true, ph: '0.00' },
        { name: 'estado', label: 'Estado', type: 'select', options: opts(ESTADOS) },
        { name: 'fecha_inicio', label: 'Fecha de inicio', type: 'date' },
        { name: 'fecha_entrega', label: 'Fecha de entrega', type: 'date' },
        { name: 'descripcion', label: 'Descripción / alcance', type: 'textarea', full: true },
      ],
      onSubmit: (d) => save('proyectos', d, p?.id),
    });
  }

  function ingresoForm(i, preset = {}) {
    const v = i ? { ...i } : { fecha: today(), tipo: 'abono', metodo_pago: 'Transferencia', ...preset };
    let subtitle = '';
    if (!i && preset.proyecto_id) {
      const p = byId(S.proyectos, preset.proyecto_id);
      if (p) {
        v.cliente_id = p.cliente_id;
        v.concepto = `Abono – ${p.nombre}`;
        if (Number(p.total_cobrado) === 0) v.tipo = 'anticipo';
        subtitle = `Precio ${money(p.precio_total)} · Cobrado ${money(p.total_cobrado)} · <b>Pendiente ${money(p.saldo_pendiente)}</b>`;
      }
    }
    openForm({
      title: i ? 'Editar ingreso' : 'Registrar ingreso / abono', subtitle, values: v,
      fields: [
        { name: 'concepto', label: 'Concepto', required: true, full: true, ph: 'Ej: Abono 50% – ' + R.ej },
        { name: 'monto', label: 'Monto recibido', type: 'number', required: true, min: 0.01, ph: '0.00' },
        { name: 'fecha', label: 'Fecha', type: 'date', required: true },
        {
          name: 'proyecto_id', label: W.P, type: 'select', placeholder: `Sin ${W.p}`, options: projOpts(),
          onChange: (form) => {
            const p = byId(S.proyectos, form.elements.proyecto_id.value);
            if (!p) return;
            if (p.cliente_id) form.elements.cliente_id.value = p.cliente_id;
            if (!form.elements.concepto.value.trim()) form.elements.concepto.value = `Abono – ${p.nombre}`;
          },
        },
        { name: 'cliente_id', label: 'Cliente', type: 'select', placeholder: 'Sin cliente', options: cliOpts() },
        { name: 'tipo', label: 'Tipo de ingreso', type: 'select', options: opts(TIPOS_INGRESO) },
        { name: 'metodo_pago', label: 'Método de pago', type: 'select', placeholder: '—', options: METODOS.map((m) => ({ value: m, label: m })) },
        { name: 'notas', label: 'Notas', type: 'textarea', full: true, ph: 'Ej: N° de comprobante, banco…' },
      ],
      onSubmit: (d) => {
        if (!(d.monto > 0)) throw new Error('El monto debe ser mayor a 0');
        if (d.proyecto_id && !d.cliente_id) d.cliente_id = byId(S.proyectos, d.proyecto_id)?.cliente_id || null;
        return save('ingresos', d, i?.id);
      },
    });
  }

  function gastoForm(g, preset = {}) {
    const v = g ? { ...g } : { fecha: today(), categoria: 'otros', ...preset };
    openForm({
      title: g ? 'Editar gasto' : 'Registrar gasto', values: v,
      fields: [
        { name: 'concepto', label: 'Concepto', required: true, full: true, ph: 'Ej: ' + R.ejGasto },
        { name: 'monto', label: 'Monto', type: 'number', required: true, min: 0.01, ph: '0.00' },
        { name: 'fecha', label: 'Fecha', type: 'date', required: true },
        { name: 'categoria', label: 'Categoría', type: 'select', options: catOpts([v.categoria]) },
        { name: 'metodo_pago', label: 'Método de pago', type: 'select', placeholder: '—', options: METODOS.map((m) => ({ value: m, label: m })) },
        { name: 'proyecto_id', label: `¿Es de un ${W.p}?`, type: 'select', placeholder: 'No, es un gasto general', options: projOpts(), full: true },
        { name: 'notas', label: 'Notas', type: 'textarea', full: true },
      ],
      onSubmit: (d) => {
        if (!(d.monto > 0)) throw new Error('El monto debe ser mayor a 0');
        d.categoria = d.categoria || 'otros';
        return save('gastos', d, g?.id);
      },
    });
  }

  function proyectoDetalle(id) {
    const p = byId(S.proyectos, id);
    if (!p) return;
    const ing = S.ingresos.filter((x) => x.proyecto_id === id);
    const gas = S.gastos.filter((x) => x.proyecto_id === id);
    const item = (x, isIn) => `<div class="list-item"><div class="mov-ic ${isIn ? 'in' : 'out'}">${ic(isIn ? 'up' : 'down')}</div>
      <div class="grow"><div class="t">${esc(x.concepto)}</div><div class="muted sm">${fmtDate(x.fecha)} · ${esc(isIn ? (TIPOS_INGRESO[x.tipo] || x.tipo) : (CAT_LABEL[x.categoria] || x.categoria))}${x.metodo_pago ? ' · ' + esc(x.metodo_pago) : ''}</div></div>
      <strong class="${isIn ? 'pos' : 'neg'} nowrap">${money(x.monto)}</strong></div>`;
    $modal.innerHTML = `<div class="modal-backdrop"><div class="modal wide" role="dialog" aria-modal="true" aria-label="${esc(p.nombre)}">
      <div class="modal-head"><div><h3>${esc(p.nombre)}</h3><p class="muted">${esc(p.cliente_nombre || 'Sin cliente')}${p.tipo ? ' · ' + esc(p.tipo) : ''} · ${estadoBadge(p.estado)}</p></div>
        <button type="button" class="icon-btn" data-close aria-label="Cerrar">${ic('close')}</button></div>
      <div class="mini-kpis">
        <div><span>Precio</span><strong>${money(p.precio_total)}</strong></div>
        <div><span>Cobrado</span><strong class="pos">${money(p.total_cobrado)}</strong></div>
        <div><span>Pendiente</span><strong>${money(p.saldo_pendiente)}</strong></div>
        <div><span>Gastos</span><strong class="neg">${money(p.total_gastos)}</strong></div>
        <div><span>Ganancia</span><strong class="${p.ganancia < 0 ? 'neg' : ''}">${money(p.ganancia)}</strong></div>
      </div>
      ${progressBar(p)}
      <p class="muted sm" style="margin:8px 0 0">Inicio ${fmtDate(p.fecha_inicio)} · Entrega ${fmtDate(p.fecha_entrega)}</p>
      ${p.descripcion ? `<p style="white-space:pre-wrap;margin:14px 0 0">${esc(p.descripcion)}</p>` : ''}
      <h4>Abonos y pagos (${ing.length})</h4><div class="list">${ing.map((x) => item(x, true)).join('') || empty('Todavía no hay abonos')}</div>
      <h4>Gastos del ${W.p} (${gas.length})</h4><div class="list">${gas.map((x) => item(x, false)).join('') || empty('Sin gastos asignados')}</div>
      <div class="modal-actions" style="margin-top:20px">
        <button class="btn ghost" data-act="edit-proyecto" data-id="${p.id}">${ic('edit')}<span>Editar</span></button>
        <button class="btn" data-act="gasto-proy" data-id="${p.id}">${ic('gastos')}<span>Registrar gasto</span></button>
        <button class="btn primary" data-act="abono" data-id="${p.id}">${ic('cash')}<span>Registrar abono</span></button>
      </div>
    </div></div>`;
    bindModalClose();
  }

  // =====================================================
  //  ACCIONES (clics en botones con data-act)
  // =====================================================
  const ACTIONS = {
    logout: async () => { await sb.auth.signOut(); },
    'new-cliente': () => clienteForm(),
    'edit-cliente': (id) => clienteForm(byId(S.clientes, id)),
    'del-cliente': (id) => removeRow('clientes', id, `¿Eliminar este cliente? Sus ${W.ps} e ingresos se conservan, pero quedarán sin cliente.`),
    'new-proyecto': () => proyectoForm(),
    'edit-proyecto': (id) => proyectoForm(byId(S.proyectos, id)),
    'del-proyecto': (id) => removeRow('proyectos', id, `¿Eliminar este ${W.p}? Los abonos y gastos registrados se conservan (quedarán como "sin ${W.p}").`),
    'ver-proyecto': (id) => proyectoDetalle(id),
    abono: (id) => ingresoForm(null, { proyecto_id: id }),
    'gasto-proy': (id) => gastoForm(null, { proyecto_id: id }),
    'new-ingreso': () => ingresoForm(),
    'edit-ingreso': (id) => ingresoForm(byId(S.ingresos, id)),
    'del-ingreso': (id) => removeRow('ingresos', id),
    'new-gasto': () => gastoForm(),
    'edit-gasto': (id) => gastoForm(byId(S.gastos, id)),
    'del-gasto': (id) => removeRow('gastos', id),
    'rep-preset': (k) => { S.filters.rep = presetRange(k); render(); },
    'export-csv': () => exportCsv(),
    'new-negocio': () => negocioForm(),
    'edit-negocio': (id) => negocioForm(byId(S.negocios, id)),
    'del-negocio': (id) => removeRow('negocios', id, '¿Eliminar este negocio y su historial de pagos? Si ya activó su cuenta, no podrá volver a entrar. Sus datos no se borran (para borrarlos, elimina su usuario en Supabase → Authentication).'),
    'ver-negocio': (id) => negocioDetalle(id),
    'pago-negocio': (id) => pagoNegocioForm(byId(S.negocios, id)),
    'wa-negocio': (id) => { const n = byId(S.negocios, id); if (n) return n.user_id ? recordar(n) : invitar(n); },
    'toggle-negocio': (id) => toggleNegocio(byId(S.negocios, id)),
    'revisar-cuenta': async () => { const c = await recargarCuenta(); if (c.activa) boot(); else { renderBloqueo(); toast('Todavía no aparece el pago. Si ya pagaste, escríbenos.', 'err'); } },
  };

  function onAction(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = ACTIONS[el.dataset.act];
    if (!fn) return;
    e.preventDefault();
    Promise.resolve(fn(el.dataset.id)).catch((err) => toast(err.message || 'Error', 'err'));
  }
})();
