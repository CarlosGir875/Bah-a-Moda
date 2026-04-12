import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@supabase/supabase-js';

// Servidor-side check para Admin
async function isAdmin(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Obtenemos el token de las cookies o el header Authorization
  const authHeader = request.headers.get('Authorization');
  let token = '';
  
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Intentar obtener de cookies
    const cookieHeader = request.headers.get('cookie');
    const tokenCookie = cookieHeader?.split(';').find(c => c.trim().startsWith('sb-jfxgjlswbvbzaqtsnany-auth-token='));
    if (tokenCookie) {
      const cookieValue = tokenCookie.split('=')[1];
      try {
        const decoded = JSON.parse(decodeURIComponent(cookieValue));
        token = decoded.access_token;
      } catch (e) {}
    }
  }

  if (!token) return false;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return false;

  // Verificar rol en cliente_perfiles
  const { data: profile } = await supabaseAdmin
    .from('cliente_perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  return profile?.rol === 'admin';
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'No autorizado. Se requiere rol de administrador.' }, { status: 403 });
    }

    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (updateError) {
      console.error("Supabase Admin auth error:", updateError);
      return NextResponse.json({ error: 'Error al cambiar la contraseña en Supabase Auth.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Error force-reset:", err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
