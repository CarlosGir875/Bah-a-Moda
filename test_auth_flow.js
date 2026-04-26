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
  console.log("1. Signing up test user...");
  const testEmail = `test_${Date.now()}@test.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'password123',
  });
  
  if (authError) {
    console.error("Signup failed:", authError);
    return;
  }
  
  console.log("Logged in as:", authData.user.id);
  
  console.log("2. Fetching products as auth user...");
  const start = Date.now();
  
  const { data: products, error: pError } = await supabase.from('products').select('*');
  console.log(`Products fetched in ${Date.now() - start}ms. Count:`, products ? products.length : 0);
  if (pError) console.error("Products error:", pError);
  
  console.log("3. Fetching profile...");
  const start2 = Date.now();
  const { data: profile, error: prError } = await supabase.from('cliente_perfiles').select('*').eq('id', authData.user.id).maybeSingle();
  console.log(`Profile fetched in ${Date.now() - start2}ms. Exists:`, !!profile);
  if (prError) console.error("Profile error:", prError);

  console.log("4. Fetching horarios...");
  const start3 = Date.now();
  const { data: horarios, error: hError } = await supabase.from('reservas_horarios').select('*');
  console.log(`Horarios fetched in ${Date.now() - start3}ms. Count:`, horarios ? horarios.length : 0);
  if (hError) console.error("Horarios error:", hError);
}

runTest();
