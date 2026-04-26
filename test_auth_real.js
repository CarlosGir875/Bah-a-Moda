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
  // Using a more realistic email to bypass basic filters
  const testEmail = `test.bahiamoda.${Date.now()}@gmail.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'password123#',
  });
  
  if (authError) {
    console.error("Signup failed:", authError);
    return;
  }
  
  console.log("Logged in as:", authData.user.id);
  
  console.log("\n2. Fetching profile as auth user...");
  const start2 = Date.now();
  const { data: profile, error: prError } = await supabase.from('cliente_perfiles').select('*').eq('id', authData.user.id).maybeSingle();
  console.log(`Profile fetched in ${Date.now() - start2}ms.`);
  if (prError) {
      console.error("❌ PROFILE ERROR:", prError);
  } else {
      console.log("✅ PROFILE SUCCESS:", !!profile);
  }

  console.log("\n3. Fetching products as auth user...");
  const start = Date.now();
  const { data: products, error: pError } = await supabase.from('products').select('*').limit(1);
  console.log(`Products fetched in ${Date.now() - start}ms.`);
  if (pError) {
      console.error("❌ PRODUCTS ERROR:", pError);
  } else {
      console.log("✅ PRODUCTS SUCCESS:", products ? products.length : 0);
  }

  console.log("\n4. Fetching orders as auth user...");
  const start4 = Date.now();
  const { data: orders, error: oError } = await supabase.from('pedidos').select('*').limit(1);
  console.log(`Orders fetched in ${Date.now() - start4}ms.`);
  if (oError) {
      console.error("❌ ORDERS ERROR:", oError);
  } else {
      console.log("✅ ORDERS SUCCESS:", orders ? orders.length : 0);
  }
}

runTest();
