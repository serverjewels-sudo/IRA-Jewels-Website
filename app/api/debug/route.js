import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { SETTING_STYLES } from "@/lib/constants";
import fs from "fs";
import path from "path";

export async function GET() {
  const { data: settingsAll, error } = await supabaseAdmin.from('homepage_settings').select('*');
  const { data: singleSettings, error: singleError } = await supabaseAdmin.from('homepage_settings').select('visible_setting_styles').single();

  const out = {
    settingsAll,
    singleSettings
  };
  
  // Write to a local file for perfect inspection
  fs.writeFileSync(path.join(process.cwd(), "debug-output.json"), JSON.stringify(out, null, 2));

  return NextResponse.json(out);
}
