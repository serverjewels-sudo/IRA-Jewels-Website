const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentOrder() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, created_at, items')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log("No orders found.");
    return;
  }

  console.log(`Found ${orders.length} recent orders.`);
  
  orders.forEach((order, index) => {
    console.log(`\n--- Order ${index + 1} (ID: ${order.id}, Date: ${order.created_at}) ---`);
    if (order.items && order.items.length > 0) {
      const item = order.items[0];
      console.log("First Item Data:");
      console.log("Name:", item.name);
      console.log("Category:", item.category);
      console.log("Selected Shape:", item.selectedShape);
      console.log("Selected Size:", item.selectedSize);
      console.log("Style Number:", item.style_number);
      console.log("Full Item Keys:", Object.keys(item));
    } else {
      console.log("No items in this order.");
    }
  });
}

checkRecentOrder();
