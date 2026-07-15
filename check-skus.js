const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envFile.split('\n').find(line => line.startsWith(key))?.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, sku, category, name')
    .order('sku', { ascending: true });
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log(`Found ${products.length} products.`);
  products.forEach(p => console.log(`${p.sku} | ${p.category} | ${p.name} | ${p.id}`));
}

run();
