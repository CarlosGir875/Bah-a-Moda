const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 

async function inspect() {
  // We can use a failed search to see columns if RPC fails
  // But let's try to get one row or error
  const { data, error } = await supabase.from('pedidos').select('*').limit(1);
  if (error) {
    console.log("Error selecting:", error.message);
  } else {
    // If table is empty, this is hard. Let's try to insert a dummy and see what it says is missing.
    console.log("Table exists. Checking columns via dummy insert...");
  }
}
inspect();
