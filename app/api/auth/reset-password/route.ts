import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    // 1. Verificar si la petición existe y está aprobada
    const { data: requestData, error: findError } = await supabaseAdmin
      .from('peticiones_reset')
      .select('id, user_id, estado')
      .eq('email', email.toLowerCase())
      .eq('token', token)
      .eq('estado', 'aprobada')
      .single();

    if (findError || !requestData) {
      return NextResponse.json({ error: 'La solicitud no existe, no ha sido aprobada o el código es incorrecto.' }, { status: 403 });
    }

    // 2. Cambiar la contraseña usando el Admin Client
    const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
      requestData.user_id,
      { password: newPassword }
    );

    if (resetError) {
      console.error("Error al resetear clave:", resetError);
      return NextResponse.json({ error: 'No se pudo actualizar la contraseña. Contacta a soporte.' }, { status: 500 });
    }

    // 3. Marcar la solicitud como completada para invalidar el token
    await supabaseAdmin
      .from('peticiones_reset')
      .update({ estado: 'completada' })
      .eq('id', requestData.id);

    return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente.' });

  } catch (err: any) {
    console.error("Error reset-password:", err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
