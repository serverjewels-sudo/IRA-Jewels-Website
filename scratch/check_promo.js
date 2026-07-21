const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

async function runDiagnostic() {
  console.log("=== DIAGNOSTIC: PROMO CODES ===");
  
  // 1. Query using Service Role
  const { data: serviceData, error: serviceError } = await serviceClient
    .from('promo_codes')
    .select('id, code, is_active, show_in_banner, start_date, end_date, collection_id');
  
  console.log("\n1. REAL TABLE VALUES (Service Role bypasses RLS):");
  if (serviceError) console.error("Error:", serviceError);
  else console.log(JSON.stringify(serviceData, null, 2));

  // 2. Query using Anon Client (Subject to RLS)
  const { data: anonData, error: anonError } = await anonClient
    .from('promo_codes')
    .select('*, collections(name)')
    .eq('is_active', true)
    .eq('show_in_banner', true);
    
  console.log("\n2. ANNOUNCEMENT BANNER QUERY (Anon Client, subject to RLS):");
  if (anonError) console.error("Error:", anonError);
  else console.log(JSON.stringify(anonData, null, 2));
}

runDiagnostic();
