import { NextResponse } from "next/server";
import { sendOrderEmails } from "@/lib/emailUtils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderData } = body;

    if (!orderData) {
      return NextResponse.json({ error: "Missing orderData" }, { status: 400 });
    }

    // Call the email utility asynchronously (don't wait for it to finish to respond)
    // Wait, since Next.js serverless functions might die if we don't await, 
    // we should await it, but the utility itself catches and suppresses errors.
    await sendOrderEmails(orderData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/send-order-emails route:", error);
    // Still return 200 to the client so we don't break frontend flows unexpectedly
    return NextResponse.json({ success: false, error: "Failed to send emails" }, { status: 200 });
  }
}
