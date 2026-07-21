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

async function checkLatestOrder() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .not('promo_code_used', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return;
  }

  console.log("=== TOP-LEVEL FIELDS ===");
  console.log("Order ID:", data.id);
  console.log("Promo Code Used:", data.promo_code_used);
  console.log("Total Discount Amount:", data.total_discount_amount);
  console.log("Subtotal:", data.subtotal);
  console.log("Pre-tax Subtotal:", data.pre_tax_subtotal);
  console.log("Total GST Amount:", data.total_gst_amount);
  console.log("Final Total:", data.total);

  console.log("\n=== ITEMS ARRAY ===");
  console.log(JSON.stringify(data.items, null, 2));
}

checkLatestOrder();
