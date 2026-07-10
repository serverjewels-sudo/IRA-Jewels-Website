const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => envFile.split('\n').find(line => line.startsWith(key))?.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("1. Querying 'bridal' collection...");
  const { data: collection, error: colError } = await supabase
    .from('collections')
    .select('id, slug, name')
    .eq('slug', 'bridal')
    .single();
    
  if (colError) {
    console.error("Error fetching collection:", colError);
  } else {
    console.log("Bridal Collection:", collection);
  }

  console.log("\n2. Querying products for collection_ids...");
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, collection_ids');
    
  if (prodError) {
    console.error("Error fetching products:", prodError);
  } else {
    const productsWithCollections = products.filter(p => p.collection_ids && p.collection_ids.length > 0);
    console.log(`Found ${productsWithCollections.length} products with ANY collection_ids.`);
    if (productsWithCollections.length > 0) {
      const p = productsWithCollections[0];
      console.log(`Example - ID: ${p.id}, Title: ${p.title}, collection_ids:`, p.collection_ids, `(Type: ${typeof p.collection_ids}, isArray: ${Array.isArray(p.collection_ids)})`);
    }
    
    if (collection) {
      console.log(`\nProducts matching Bridal collection ID (${collection.id}):`);
      const bridalProducts = products.filter(p => p.collection_ids && Array.isArray(p.collection_ids) && p.collection_ids.includes(collection.id));
      console.log(bridalProducts.map(p => p.title));
      
      console.log(`\nProducts matching if collection_ids is a string:`);
      const bridalProductsString = products.filter(p => p.collection_ids && !Array.isArray(p.collection_ids) && String(p.collection_ids).includes(collection.id));
      console.log(bridalProductsString.map(p => p.title));
    }
  }
}

run();
