// =====================================================
//  D.E.K NovaCore - Configuracion
//  Supabase -> Project Settings -> API  (o "Connect")
// =====================================================
window.NOVACORE_CONFIG = {
  // Pega aqui tu "Project URL"
  SUPABASE_URL: 'https://yemvvkwtdffckhylstjt.supabase.co',

  // Pega aqui tu "anon public" key  (o la "publishable key" sb_publishable_...)
  // OJO: NUNCA pongas aqui la "service_role" / "secret" key.
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbXZ2a3d0ZGZmY2toeWxzdGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Njk3NTksImV4cCI6MjEwODA0NTc1OX0.kcKJNBhyKsV3wl0IfkyBghCqF7mHYTphxtaQvWesrOQ',

  // Moneda e idioma de los montos
  CURRENCY: 'USD',
  LOCALE: 'es-EC',

  // Cuando ya hayas creado TU cuenta, ponlo en false para ocultar "Crear cuenta"
  // (y desactiva los registros en Supabase: Authentication -> Sign In / Providers)
  ALLOW_SIGNUP: false,
};
