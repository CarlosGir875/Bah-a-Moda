const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jfxgjlswbvbzaqtsnany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGdqbHN3YnZiemFxdHNuYW55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU2NzcwNSwiZXhwIjoyMDkwMTQzNzA1fQ.Iv95ichJd8WtSWN6ZSqrndUFfNqIo-xjEhye8hztbus'); 
async function check() { 
  const { data, error } = await supabase.rpc('query_policies_or_something'); // rpc won't work if they don't have it.
  // We can query pg_policies!
  const { data: pData, error: pError } = await supabase.from('pg_policies').select('*').eq('tablename', 'profiles');
  // wait we can't query pg_policies via standard api easily if it's protected by restful exposure.
}
check();
