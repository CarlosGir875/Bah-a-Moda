import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Admin client — uses service_role key, no rate limits, server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const { email, password, fullName, celular, direccion, punto_encuentro } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Crear usuario con admin API (sin límite de rate, sin email de confirmación)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Se confirma automáticamente, sin necesitar correo
      user_metadata: { full_name: fullName },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Guardar perfil completo en cliente_perfiles
    if (data.user) {
      const { error: profileError } = await supabaseAdmin
        .from('cliente_perfiles')
        .upsert({
          id: data.user.id,
          nombre_completo: fullName,
          celular: celular ?? null,
          direccion: direccion ?? null,
          punto_encuentro: punto_encuentro ?? null,
          rol: 'cliente',
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Error guardando perfil:', JSON.stringify(profileError, null, 2));
      }
    }

    return NextResponse.json({ success: true, userId: data.user?.id });

  } catch (err: any) {
    console.error('Signup API error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
