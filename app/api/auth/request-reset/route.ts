import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { email, punto_encuentro } = await request.json();

    if (!email || !punto_encuentro) {
      return NextResponse.json({ error: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    // 1. Buscar perfil por email (necesitamos unir auth.users con profiles)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, punto_encuentro, email:id(email)')
      .eq('email:id.email', email.toLowerCase()) // Esta sintaxis depende de cómo se llame la relación o si guardas el email en profiles
      .single();

    // NOTA: Si no guardamos el email en profiles, tenemos que buscarlo en auth.admin
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const user = listData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'No se encontró una cuenta con ese correo.' }, { status: 404 });
    }

    // 2. Obtener el punto de encuentro real del perfil
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('punto_encuentro, nombre_completo')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'No se pudo verificar el perfil.' }, { status: 500 });
    }

    // 3. Validar punto de encuentro (comparación flexible)
    const normalize = (s: string) => s.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (normalize(profile.punto_encuentro || "") !== normalize(punto_encuentro)) {
      return NextResponse.json({ error: 'El Punto de Encuentro no coincide con nuestros registros.' }, { status: 403 });
    }

    // 4. Generar Token de 6 caracteres
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Crear la petición
    const { error: insertError } = await supabaseAdmin
      .from('peticiones_reset')
      .insert([{
        email: email.toLowerCase(),
        user_id: user.id,
        token: token,
        punto_encuentro: punto_encuentro,
        estado: 'pendiente'
      }]);

    if (insertError) {
      console.error("Error insertando petición:", insertError);
      return NextResponse.json({ error: 'Error al procesar la solicitud.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      token, 
      nombre: profile.nombre_completo 
    });

  } catch (err: any) {
    console.error("Error request-reset:", err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
