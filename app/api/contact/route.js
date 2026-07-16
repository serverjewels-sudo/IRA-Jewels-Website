import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const OWNER_EMAIL = process.env.OWNER_ALERT_EMAIL;

    if (!RESEND_API_KEY || !OWNER_EMAIL) {
      console.warn("Missing RESEND_API_KEY or OWNER_ALERT_EMAIL. Skipping contact email send.");
      // Return 200 so the frontend still succeeds
      return NextResponse.json({ success: true, warning: "Email skipped due to missing config" }, { status: 200 });
    }

    const ownerHtml = `
      <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #2E3135;">
        <h2 style="font-size: 20px; font-weight: 500; color: #CDB38B;">New Contact Enquiry</h2>
        
        <div style="padding: 24px; background-color: #F3F1EC; border-radius: 8px; margin: 24px 0;">
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 0;">Customer Information</h3>
          <p style="font-size: 14px; margin: 0; line-height: 1.6;">
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone || 'N/A'}<br>
          </p>
          
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 24px;">Message</h3>
          <p style="font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    const ownerReqBody = {
      from: 'orders@tatvaan.com',
      to: [OWNER_EMAIL],
      subject: `New Contact Enquiry from ${name}`,
      html: ownerHtml
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ownerReqBody)
    });

    const data = await res.json();
    if (data.error) {
      console.error("Contact email sending failed via Resend:", data.error);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/contact route:", error);
    // Still return 200 to the client so we don't break frontend flows unexpectedly
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 200 });
  }
}
