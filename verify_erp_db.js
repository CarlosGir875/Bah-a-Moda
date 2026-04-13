const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 

async function check() { 
  console.log("--- Checking 'products' table columns ---");
  const { data: pCols, error: pErr } = await supabase.rpc('get_table_columns', { table_name: 'products' });
  // Since I might not have the RPC, I'll try a dummy select or insert
  const { data: pData, error: pDataErr } = await supabase.from('products').select('cost, stock').limit(1);
  if (pDataErr) console.error("Products column error:", pDataErr.message);
  else console.log("Products columns 'cost' and 'stock' exist.");

  console.log("--- Checking 'finanzas' table ---");
  const { data: fData, error: fErr } = await supabase.from('finanzas').select('*').limit(1);
  if (fErr) console.error("Finanzas table error:", fErr.message);
  else console.log("Finanzas table exists.");
} 
check();
