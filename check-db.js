const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envFile.split('\n').find(line => line.startsWith(key))?.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('name, diamond_weight_variants, diamond_price_matrix');
  console.log("Error:", error);
  console.log("Total Products:", data?.length);
  
  if (data && data.length > 0) {
    const keys = Object.keys(data[0]);
    console.log("Contains diamond_price_matrix?", keys.includes('diamond_price_matrix'));
    
    const usingOldDiamondVariants = data.filter(p => p.diamond_weight_variants && p.diamond_weight_variants.length > 0);
    console.log("Products using old diamond_weight_variants:", usingOldDiamondVariants.length);
    if (usingOldDiamondVariants.length > 0) {
      console.log("Example:", JSON.stringify(usingOldDiamondVariants[0], null, 2));
    }
  }
}

checkProducts();
