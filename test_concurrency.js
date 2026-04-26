const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]+)"/);

if (!urlMatch || !keyMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function runTest() {
  const testEmail = `test.bahiamoda.simul.${Date.now()}@gmail.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'password123#',
  });
  
  if (authError) {
    console.error("Signup failed:", authError);
    return;
  }
  
  const uid = authData.user.id;
  console.log("Logged in as:", uid);
  console.log("Starting concurrent fetches...");

  const promises = [
    (async () => {
        const start = Date.now();
        const { error } = await supabase.from('products').select('*').limit(1);
        console.log(`[Products] finished in ${Date.now() - start}ms`, error ? error.message : "OK");
    })(),
    (async () => {
        const start = Date.now();
        const { error } = await supabase.from('cliente_perfiles').select('*').eq('id', uid).maybeSingle();
        console.log(`[Profile] finished in ${Date.now() - start}ms`, error ? error.message : "OK");
    })(),
    (async () => {
        const start = Date.now();
        const { error } = await supabase.from('reservas_horarios').select('*').limit(1);
        console.log(`[Reservas] finished in ${Date.now() - start}ms`, error ? error.message : "OK");
    })(),
    (async () => {
        const start = Date.now();
        const { error } = await supabase.from('pedidos').select('*').eq('cliente_id', uid).limit(1);
        console.log(`[Pedidos] finished in ${Date.now() - start}ms`, error ? error.message : "OK");
    })()
  ];

  await Promise.all(promises);
  console.log("All fetches completed.");
}

runTest();
