import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Necesario para leer todas las subscripciones
);

webpush.setVapidDetails(
  'mailto:bahiamodapuerto@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, body, url } = await req.json();

    // 1. Obtener todos los administradores subscritos
    // Buscamos usuarios con rol admin en una tabla de perfiles o similar
    // Por ahora, traemos todas las subscripciones habilitadas
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription');

    if (error) throw error;

    const notifications = subscriptions.map((sub: any) => 
      webpush.sendNotification(sub.subscription, JSON.stringify({
        title,
        body,
        url
      })).catch(err => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Token expirado, podríamos eliminarlo de la DB
           console.log("Token expirado para subscripción");
        }
      })
    );

    await Promise.all(notifications);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
