const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envFile.split('\n').find(line => line.startsWith(key))?.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('*');
  console.log("Error:", error);
  console.log("Count:", data?.length);
  if (data && data.length > 0) {
    console.log("First product keys:", Object.keys(data[0]));
  }
}

checkProducts();
