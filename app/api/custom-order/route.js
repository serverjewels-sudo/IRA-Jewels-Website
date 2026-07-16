import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      fullName, phone, email, jewelleryType, preferredMetal, 
      karat, preferredStone, budget, occasion, vision, 
      heardAboutUs, imageUrl 
    } = body;

    if (!fullName || !email || !phone || !vision) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const OWNER_EMAIL = process.env.OWNER_ALERT_EMAIL;

    if (!RESEND_API_KEY || !OWNER_EMAIL) {
      console.warn("Missing RESEND_API_KEY or OWNER_ALERT_EMAIL. Skipping custom order email send.");
      return NextResponse.json({ success: true, warning: "Email skipped due to missing config" }, { status: 200 });
    }

    const imageSection = imageUrl 
      ? `
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 24px;">Reference Image</h3>
          <p style="font-size: 14px; margin: 0; line-height: 1.6;">
            <a href="${imageUrl}" target="_blank" style="color: #CDB38B; text-decoration: underline;">
              View Uploaded Reference Image
            </a>
          </p>
        `
      : '';

    const ownerHtml = `
      <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #2E3135;">
        <h2 style="font-size: 20px; font-weight: 500; color: #CDB38B;">New Custom Order Request</h2>
        
        <div style="padding: 24px; background-color: #F3F1EC; border-radius: 8px; margin: 24px 0;">
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 0;">Customer Information</h3>
          <p style="font-size: 14px; margin: 0; line-height: 1.6;">
            <strong>Name:</strong> ${fullName}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone}<br>
          </p>
          
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 24px;">Order Details</h3>
          <p style="font-size: 14px; margin: 0; line-height: 1.6;">
            <strong>Jewellery Type:</strong> ${jewelleryType || 'N/A'}<br>
            <strong>Preferred Metal:</strong> ${preferredMetal || 'N/A'}<br>
            <strong>Karat:</strong> ${karat || 'N/A'}<br>
            <strong>Preferred Stone:</strong> ${preferredStone || 'N/A'}<br>
            <strong>Budget:</strong> ${budget || 'N/A'}<br>
            <strong>Occasion:</strong> ${occasion || 'N/A'}<br>
            <strong>Heard About Us:</strong> ${heardAboutUs || 'N/A'}<br>
          </p>

          <h3 style="font-size: 14px; font-weight: 600; margin-top: 24px;">Vision / Description</h3>
          <p style="font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${vision}</p>
          
          ${imageSection}
        </div>
      </div>
    `;

    const ownerReqBody = {
      from: 'orders@tatvaan.com',
      to: [OWNER_EMAIL],
      subject: `New Custom Order Request from ${fullName}`,
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
      console.error("Custom Order email sending failed via Resend:", data.error);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/custom-order route:", error);
    // Return 200 to not break frontend UI on email failure
    return NextResponse.json({ success: false, error: "Failed to send custom order email" }, { status: 200 });
  }
}
