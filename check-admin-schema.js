
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .limit(1);
    
  if (error) {
    console.error("Error fetching admin_users:", error);
  } else {
    console.log("admin_users sample row:", data);
  }
}

checkSchema();
