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

async function checkRingSlugs() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .ilike('slug', '%ring%');

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log("=== Matching Products ===");
  data.forEach(p => {
    // Show exact char codes to confirm zero hidden characters
    const charCodes = [...p.slug].map(char => char.charCodeAt(0)).join(', ');
    console.log(`ID: ${p.id}`);
    console.log(`Name: "${p.name}"`);
    console.log(`Slug: "${p.slug}" (Length: ${p.slug.length})`);
    console.log(`Char Codes: [${charCodes}]`);
    console.log('---');
  });
}

checkRingSlugs();
