const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 
async function check() { 
  const { data, error } = await supabase.from('solicitudes_pedidos').insert([{
    user_id: null,
    cliente_nombre: "TEST",
    cliente_telefono: "123",
    cliente_email: null,
    items: [],
    total: 0,
    anticipo: 0,
    tipo_entrega: "domicilio",
    ubicacion: "Test",
    estado: "pendiente",
    visto: false
  }]); 
  console.log("ERROR:", error); 
} 
check();
