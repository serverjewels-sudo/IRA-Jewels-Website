import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;

    // Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Insert order into Supabase
    // Using supabaseAdmin if available, else fallback to standard client
    const client = supabaseAdmin || supabase;

    const { data: newOrder, error } = await client
      .from("orders")
      .insert([orderData])
      .select();

    if (error) {
      console.error("Error inserting order into Supabase:", error);
      return NextResponse.json({ error: "Error saving order details" }, { status: 500 });
    }

    if (!newOrder || newOrder.length === 0) {
      return NextResponse.json({ error: "No order data returned" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: newOrder[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in verify payment route:", error);
    return NextResponse.json(
      { error: "Error verifying payment. Please try again." },
      { status: 500 }
    );
  }
}
