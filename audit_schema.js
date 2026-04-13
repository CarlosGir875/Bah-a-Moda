const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 

async function audit() {
  console.log("--- AUDITING SCHEMAS ---");

  // Get one row from each to check columns
  const { data: solData } = await supabase.from('solicitudes_pedidos').select('*').limit(1);
  const { data: pedData } = await supabase.from('pedidos').select('*').limit(1);
  const { data: prodData } = await supabase.from('products').select('*').limit(1);

  console.log("solicitudes_pedidos columns:", Object.keys(solData && solData[0] ? solData[0] : {}));
  console.log("pedidos columns:", Object.keys(pedData && pedData[0] ? pedData[0] : {}));
  console.log("products columns:", Object.keys(prodData && prodData[0] ? prodData[0] : {}));

  // If tables are empty, we try a dummy insert to see what columns exist via error messages
  if (!pedData || pedData.length === 0) {
      console.log("\n--- Testing 'pedidos' dummy insert for column audit ---");
      const { error } = await supabase.from('pedidos').insert([{}]);
      // The error might list invalid columns if we try to insert a specific one
      const trial = await supabase.from('pedidos').insert([{ 
          cliente_id: '00000000-0000-0000-0000-000000000000',
          nombre_cliente: 'test',
          items: [],
          total: 0,
          anticipo: 0,
          inversion: 0,
          estado: 'test',
          tipo_entrega: 'test',
          ubicacion_entrega: 'test',
          visto: false
      }]);
      console.log("Pedidios Insert Trial Result:", trial.error ? trial.error.message : "Success (all cols exist)");
  }
}
audit();
