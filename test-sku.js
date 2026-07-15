const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envFile.split('\n').find(line => line.startsWith(key))?.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSkuForCategory(prefix) {
  const { data, error } = await supabase
    .from("products")
    .select("sku")
    .ilike("sku", `${prefix}-%`)
    .order("sku", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching max SKU:", error);
    return `${prefix}-0001`;
  }

  let nextNum = 1;
  if (data && data.length > 0 && data[0].sku) {
    const lastSku = data[0].sku;
    const parts = lastSku.split('-');
    if (parts.length > 1) {
      const numStr = parts[parts.length - 1];
      const parsed = parseInt(numStr, 10);
      if (!isNaN(parsed)) {
        nextNum = parsed + 1;
      }
    }
  }

  const formattedNum = String(nextNum).padStart(4, "0");
  return `${prefix}-${formattedNum}`;
}

async function run() {
  const testCategoryPrefix = "RIN";
  console.log(`Testing SKU Generation for prefix: ${testCategoryPrefix}`);
  
  const generatedSku = await generateSkuForCategory(testCategoryPrefix);
  console.log(`Next SKU generated: ${generatedSku}`);
}

run();
