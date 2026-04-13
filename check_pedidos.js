const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 

async function check() { 
  console.log("--- Checking 'pedidos' table ---");
  const { data, error } = await supabase.from('pedidos').select('*').limit(1);
  if (error) console.error("Pedidos table error:", error.message);
  else {
    console.log("Pedidos table exists.");
    console.log("Sample record keys:", Object.keys(data[0] || {}));
  }
} 
check();
