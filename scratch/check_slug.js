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

async function checkSlug() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .ilike('slug', 'ring-%');

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log("=== Matching Products ===");
  data.forEach(p => {
    console.log(`ID: ${p.id} | Name: "${p.name}" | Slug: "${p.slug}"`);
  });
}

checkSlug();
