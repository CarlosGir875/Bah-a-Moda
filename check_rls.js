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

async function check() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('Service role fetch products length:', data ? data.length : 0);
  
  // Try to query pg_policies using rest API (might need special privileges, but service role usually has them if exposed, otherwise we just query the table)
  // Actually, we can just insert a row and see if auth users can read it? No, we just need to know if auth users can read.
  
  // Let's create an authenticated client using a dummy JWT
  // But wait, we can just look at the policies directly via sql if we had the connection string, but we only have the REST URL.
}

check();
