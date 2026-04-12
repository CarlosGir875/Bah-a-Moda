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

  // Verificar rol en profiles
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  return profile?.rol === 'admin';
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
    }

    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json({ error: 'Falta el ID de la petición.' }, { status: 400 });
    }

    // 1. Aprobar la petición
    const { data: requestData, error: updateError } = await supabaseAdmin
      .from('peticiones_reset')
      .update({ estado: 'aprobada' })
      .eq('id', requestId)
      .select('email, token')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Error al aprobar la solicitud.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Error approve-reset:", err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
