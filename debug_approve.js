const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 

async function debugApprove(requestId) {
  console.log("--- DEBUGGING APPROVAL for ID:", requestId, "---");
  
  // 1. Fetch the request
  const { data: request, error: fetchErr } = await supabase.from('solicitudes_pedidos').select('*').eq('id', requestId).single();
  if (fetchErr) return console.error("Fetch request error:", fetchErr.message);
  
  console.log("Request found:", request.cliente_nombre);
  console.log("Items count:", request.items.length);

  // 2. Fetch all products to get costs (the logic in store.tsx fails here because it expects item.product)
  const { data: products } = await supabase.from('products').select('*');
  
  const inversionTotal = request.items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    const cost = product ? (product.cost || 0) : 0;
    return sum + (cost * (item.quantity || 1));
  }, 0);
  
  console.log("Calculated Inversion:", inversionTotal);

  // 3. Try INSERT into pedidos
  console.log("Testing 'pedidos' insert...");
  const { error: orderError } = await supabase
    .from('pedidos')
    .insert([{
      cliente_id: request.user_id, // Potential issue if null
      nombre_cliente: request.cliente_nombre,
      items: request.items,
      total: request.total,
      anticipo: request.anticipo,
      inversion: inversionTotal,
      estado: 'recibido',
      tipo_entrega: request.tipo_entrega,
      ubicacion_entrega: request.ubicacion,
      visto: false
    }]);

  if (orderError) {
    console.error("PEDIDOS INSERT FAILED:", orderError.message);
    console.error("Details:", orderError.details);
    console.error("Hint:", orderError.hint);
  } else {
    console.log("PEDIDOS INSERT SUCCESS.");
  }

  // 4. Try INSERT into finanzas
  console.log("Testing 'finanzas' insert...");
  const { error: finError } = await supabase.from('finanzas').insert([{
    tipo: 'ingreso',
    monto: request.total,
    concepto: `TEST REVENUE Pedido #${requestId.split('-')[0]}`,
    pedido_id: requestId
  }]);

  if (finError) {
    console.error("FINANZAS INSERT FAILED:", finError.message);
  } else {
    console.log("FINANZAS INSERT SUCCESS.");
  }
}

// Get the first pending ID to test
async function getTestId() {
  const { data } = await supabase.from('solicitudes_pedidos').select('id').eq('estado', 'pendiente').limit(1);
  if (data && data.length > 0) debugApprove(data[0].id);
  else console.log("No pending orders found to test.");
}

getTestId();
