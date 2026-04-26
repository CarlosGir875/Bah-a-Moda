const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY="([^"]+)"/);

if (!urlMatch || !keyMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function dumpPolicies() {
  // Use a raw SQL query to get policies
  const { data, error } = await supabase.from('pg_policies').select('*').in('tablename', ['products', 'cliente_perfiles', 'pedidos']);
  
  if (error) {
    console.log("Could not read pg_policies directly. Trying alternative.");
    console.error(error);
  } else {
    console.log("POLICIES:");
    console.log(JSON.stringify(data, null, 2));
  }
}

dumpPolicies();
