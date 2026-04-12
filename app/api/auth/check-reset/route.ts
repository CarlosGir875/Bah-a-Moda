import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json({ error: 'Faltan parámetros.' }, { status: 400 });
    }

    const { data: requestData, error } = await supabaseAdmin
      .from('peticiones_reset')
      .select('estado')
      .eq('email', email.toLowerCase())
      .eq('token', token)
      .single();

    if (error || !requestData) {
      return NextResponse.json({ aprobada: false });
    }

    return NextResponse.json({ 
      aprobada: requestData.estado === 'aprobada' || requestData.estado === 'completada' 
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
