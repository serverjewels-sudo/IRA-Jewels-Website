const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProduct() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, created_at')
    .eq('id', 'f385fea1-f798-47f4-a20a-d6efbadc8c90')
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return;
  }

  console.log("=== Product Details ===");
  console.log("ID:", data.id);
  console.log("Name:", `"${data.name}"`);
  console.log("Slug:", `"${data.slug}"`);
  console.log("Created At:", data.created_at);
}

checkProduct();
