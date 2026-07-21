const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  // Try collection_products
  const { data, error } = await supabase.from('collection_products').select('*').limit(1);
  console.log("collection_products:", {data, error: error?.message});
  
  // Try to inspect the products row directly
  const { data: prodData } = await supabase.from('products').select('*').limit(1);
  if (prodData && prodData.length) {
    console.log("products columns:", Object.keys(prodData[0]));
  }
}
check();
