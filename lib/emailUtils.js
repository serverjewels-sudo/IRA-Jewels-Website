export async function sendOrderEmails(orderData) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const OWNER_EMAIL = process.env.OWNER_ALERT_EMAIL;
    
    if (!RESEND_API_KEY || !OWNER_EMAIL) {
      console.warn("Missing RESEND_API_KEY or OWNER_ALERT_EMAIL. Skipping emails.");
      return;
    }

    const formatPrice = (amount) => "₹" + Number(amount).toLocaleString("en-IN");
    
    const itemsHtml = orderData.items.map(item => {
      const variationDetails = [
        item.selectedSize ? `Size: ${item.selectedSize}` : null,
        item.selectedColour ? `Colour: ${item.selectedColour}` : null,
        item.selectedShape ? `Shape: ${item.selectedShape.charAt(0).toUpperCase() + item.selectedShape.slice(1)}` : null,
        item.selectedDiamondWeight ? `Diamond: ${item.selectedDiamondWeight}` : null,
        item.karat ? `Karat: ${item.karat}` : null,
        item.hasEngraving ? `Engraving: "${item.engravingText}" (${item.engravingFont})` : null,
        item.category ? `Category: ${item.category}` : null,
        item.weight_grams ? `Weight: ${item.weight_grams}g` : null,
        item.metal_type ? `Metal: ${item.metal_type}` : null,
        item.stone_type ? `Stone: ${item.stone_type}` : null
      ].filter(Boolean).join(" | ");

      return `
        <tr style="border-bottom: 1px solid #E8E6E1;">
          <td style="padding: 16px 0;">
            <p style="margin: 0; font-weight: 500; color: #2E3135; font-size: 14px;">${item.name}</p>
            ${variationDetails ? `<p style="margin: 4px 0 0; color: #888888; font-size: 13px;">${variationDetails}</p>` : ''}
            <p style="margin: 4px 0 0; color: #888888; font-size: 13px;">Qty: ${item.quantity}</p>
          </td>
          <td style="padding: 16px 0; text-align: right; font-weight: 500; color: #2E3135; font-size: 14px;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>
      `;
    }).join("");

    const shippingAddress = orderData.shipping_address;
    const addressHtml = `
      ${shippingAddress.address}<br>
      ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
    `;

    // 1. Customer Email HTML
    const customerHtml = `
      <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #2E3135; background-color: #ffffff;">
        <div style="text-align: center; padding: 32px 0;">
          <h1 style="font-family: 'Cormorant', serif; font-size: 32px; font-weight: 400; color: #2E3135; margin: 0;">TATVAAN</h1>
        </div>
        
        <div style="padding: 32px; background-color: #F3F1EC; border-radius: 8px;">
          <h2 style="font-size: 20px; font-weight: 500; margin-top: 0; margin-bottom: 16px;">Thank you for your order, ${orderData.customer_name}!</h2>
          <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            We've successfully received your order <strong>${orderData.order_number}</strong>. 
            Our artisans will begin preparing your exquisite pieces right away.
          </p>
          
          <h3 style="font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #E8E6E1; padding-bottom: 8px; margin-bottom: 8px;">Order Summary</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 16px 0 8px; color: #888888; font-size: 14px;">Subtotal</td>
                <td style="padding: 16px 0 8px; text-align: right; color: #2E3135; font-size: 14px;">${formatPrice(orderData.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888888; font-size: 14px;">Shipping</td>
                <td style="padding: 8px 0; text-align: right; color: #2E3135; font-size: 14px;">${orderData.shipping > 0 ? formatPrice(orderData.shipping) : 'Free'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 0 0; font-weight: 600; color: #2E3135; font-size: 16px; border-top: 1px solid #E8E6E1;">Total</td>
                <td style="padding: 16px 0 0; text-align: right; font-weight: 600; color: #CDB38B; font-size: 16px; border-top: 1px solid #E8E6E1;">${formatPrice(orderData.total)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 32px;">
            <h3 style="font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 1px solid #E8E6E1; padding-bottom: 8px; margin-bottom: 16px;">Delivery Details</h3>
            <p style="color: #4A4A4A; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong>${orderData.customer_name}</strong><br>
              ${addressHtml}<br>
              Phone: ${orderData.customer_phone}
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 32px 0; color: #888888; font-size: 12px;">
          <p>If you have any questions, reply to this email or contact us.</p>
          <p>© ${new Date().getFullYear()} TATVAAN. All rights reserved.</p>
        </div>
      </div>
    `;

    // 2. Owner Alert Email HTML
    const ownerHtml = `
      <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #2E3135;">
        <h2 style="font-size: 20px; font-weight: 500; color: #E53E3E;">New Order Alert!</h2>
        <p style="font-size: 15px;">A new order (<strong>${orderData.order_number}</strong>) has just been placed via <strong>${orderData.payment_method.toUpperCase()}</strong>.</p>
        
        <div style="padding: 24px; background-color: #F3F1EC; border-radius: 8px; margin: 24px 0;">
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 0;">Customer Information</h3>
          <p style="font-size: 14px; margin: 0;">
            Name: ${orderData.customer_name}<br>
            Email: ${orderData.customer_email}<br>
            Phone: ${orderData.customer_phone}
          </p>
          
          <h3 style="font-size: 14px; font-weight: 600; margin-top: 24px;">Shipping Address</h3>
          <p style="font-size: 14px; margin: 0;">
            ${addressHtml}
          </p>

          <h3 style="font-size: 14px; font-weight: 600; margin-top: 24px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding-top: 16px; font-weight: 600; font-size: 14px; border-top: 1px solid #E8E6E1;">Total</td>
                <td style="padding-top: 16px; text-align: right; font-weight: 600; font-size: 14px; color: #CDB38B; border-top: 1px solid #E8E6E1;">${formatPrice(orderData.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;

    // Send emails using Resend REST API
    const resendReqBody = {
      from: 'orders@tatvaan.com',
      to: [orderData.customer_email],
      subject: `Your TATVAAN Order Confirmation — ${orderData.order_number}`,
      html: customerHtml
    };

    const ownerReqBody = {
      from: 'orders@tatvaan.com',
      to: [OWNER_EMAIL],
      subject: `New Order Received — ${orderData.order_number}`,
      html: ownerHtml
    };

    // Fire both requests concurrently
    await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resendReqBody)
      }).then(r => r.json()).then(data => {
        if (data.error) console.error("Customer email sending failed:", data.error);
      }).catch(err => console.error("Customer email fetch failed:", err)),
      
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ownerReqBody)
      }).then(r => r.json()).then(data => {
        if (data.error) console.error("Owner alert email sending failed:", data.error);
      }).catch(err => console.error("Owner email fetch failed:", err))
    ]);

  } catch (error) {
    console.error("Critical error in sendOrderEmails utility:", error);
    // Suppress error so we don't crash checkout
  }
}
