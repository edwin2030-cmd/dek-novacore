// =====================================================
//  NovaCore - Configuracion
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

  // Muestra la pestana "Activar mi cuenta". Solo pueden activarla los correos
  // que diste de alta en "Negocios" (la base de datos rechaza a los demas).
  // En Supabase: Authentication -> Sign In / Providers -> "Allow new users to sign up" ENCENDIDO.
  ALLOW_SIGNUP: true,

  // Tu WhatsApp de soporte (con codigo de pais) y la mensualidad sugerida
  SOPORTE_WHATSAPP: '50766952340',
  PRECIO_MENSUAL: 20,

  // Enlace del sistema que va en las invitaciones (vacio = la direccion actual)
  APP_URL: '',
};
