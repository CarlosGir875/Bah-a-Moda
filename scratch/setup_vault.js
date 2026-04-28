const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer manualmente el archivo .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBucket() {
  const bucketName = 'receipts';
  
  console.log(`Checking if bucket "${bucketName}" exists...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }

  const exists = buckets.find(b => b.name === bucketName);

  if (!exists) {
    console.log(`Creating bucket "${bucketName}"...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error("Error creating bucket:", error);
    } else {
      console.log(`Bucket "${bucketName}" created successfully and set to PUBLIC.`);
    }
  } else {
    console.log(`Bucket "${bucketName}" already exists.`);
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true
    });
    if (updateError) console.error("Error updating bucket to public:", updateError);
    else console.log(`Bucket "${bucketName}" is now confirmed as PUBLIC.`);
  }
}

setupBucket();
