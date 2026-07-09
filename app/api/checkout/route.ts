import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      companyName,
      gstNo,
      address,
      city,
      stateName,
      zip,
      siteLocation,
      areaToCover,
      application,
      paymentId,
      qty,
      subtotal,
      taxAmount,
      totalCommitment
    } = body;

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not defined in environment variables.");
      return NextResponse.json(
        { error: 'Webhook URL not configured on server' }, 
        { status: 500 }
      );
    }
    
    // 1. Forward the request to Google Sheets webhook
    const googleResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
    
    if (!googleResponse.ok) {
      const text = await googleResponse.text();
      console.error("Google Sheets Webhook responded with error status:", googleResponse.status, text);
      throw new Error(`Failed to send data to Google Sheets: ${googleResponse.statusText}`);
    }
    
    let result = { result: 'success' };
    try {
      result = await googleResponse.json();
    } catch (e) {
      console.log("Response body parsing as JSON failed, proceeding with generic success.", e);
    }

    // 2. Send Confirmation Email via Resend API (HTTP REST Call)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && email) {
      try {
        const senderEmail = process.env.SENDER_EMAIL || 'sales@amectechnology.com';
        const formattedSubtotal = subtotal ? subtotal.toLocaleString('en-IN') : '0';
        const formattedTax = taxAmount ? taxAmount.toLocaleString('en-IN') : '0';
        const formattedTotal = totalCommitment ? totalCommitment.toLocaleString('en-IN') : '0';
        
        const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - AMEC Technology</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;">
          
          <!-- Header Accent Banner -->
          <tr>
            <td height="6" style="background: linear-gradient(to right, #f04424, #ba1a1a, #f04424);"></td>
          </tr>

          <!-- Header Logo / Brand -->
          <tr>
            <td align="center" style="padding: 30px 40px 25px; background-color: #09090b;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-family: Montserrat, sans-serif; font-family: 'Montserrat', sans-serif;">AMEC TECHNOLOGY</h2>
                    <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Intelligent Perimeter Protection</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                
                <!-- Greeting -->
                <tr>
                  <td>
                    <h1 style="margin: 0 0 16px; color: #09090b; font-size: 22px; font-weight: 700;">Order Confirmation</h1>
                    <p style="margin: 0 0 30px; color: #52525b; font-size: 14px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
                    <p style="margin: 0 0 30px; color: #52525b; font-size: 14px; line-height: 1.6;">Thank you for acquiring the AMEC Multipurpose Early Warning System. Your payment has been successfully processed, and your order details are recorded below.</p>
                  </td>
                </tr>

                <!-- Order Details Card -->
                <tr>
                  <td style="padding: 24px; background-color: #fafafa; border-radius: 12px; border: 1px solid #f0f0f0; margin-bottom: 30px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #eaeaea;">
                          <h4 style="margin: 0; color: #09090b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Mission Summary</h4>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 6px; color: #71717a; font-size: 13px;">Item</td>
                        <td align="right" style="padding: 12px 0 6px; color: #09090b; font-size: 13px; font-weight: 600;">AMEC Early Warning System Node</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">Quantity</td>
                        <td align="right" style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">${qty} ${qty === 1 ? 'Node' : 'Nodes'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">Subtotal</td>
                        <td align="right" style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">₹${formattedSubtotal}.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">Tax (18% GST)</td>
                        <td align="right" style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">₹${formattedTax}.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0; border-top: 1px solid #eaeaea; color: #09090b; font-size: 14px; font-weight: 700;">Total Amount Paid</td>
                        <td align="right" style="padding: 12px 0 0; border-top: 1px solid #eaeaea; color: #ba1a1a; font-size: 16px; font-weight: 800;">₹${formattedTotal}.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 0; color: #71717a; font-size: 11px;">Payment Reference ID</td>
                        <td align="right" style="padding: 16px 0 0; color: #09090b; font-size: 11px; font-family: monospace;">${paymentId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Spacer -->
                <tr><td height="25"></td></tr>

                <!-- B2B & Client details -->
                <tr>
                  <td style="padding: 24px; border-radius: 12px; border: 1px solid #eaeaea;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #eaeaea;">
                          <h4 style="margin: 0; color: #09090b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Corporate Profile</h4>
                        </td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding: 12px 0 6px; color: #71717a; font-size: 13px;">Company Name</td>
                        <td style="padding: 12px 0 6px; color: #09090b; font-size: 13px; font-weight: 600;">${companyName}</td>
                      </tr>
                      ${gstNo ? `
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">GST Number</td>
                        <td style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">${gstNo}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">Phone</td>
                        <td style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">${phone}</td>
                      </tr>
                      <tr>
                        <td valign="top" style="padding: 6px 0; color: #71717a; font-size: 13px;">Delivery Address</td>
                        <td style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600; line-height: 1.4;">${address}, ${city}, ${stateName} - ${zip}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Spacer -->
                <tr><td height="25"></td></tr>

                <!-- Deployment specs -->
                <tr>
                  <td style="padding: 24px; border-radius: 12px; border: 1px solid #eaeaea;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #eaeaea;">
                          <h4 style="margin: 0; color: #09090b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Deployment Parameters</h4>
                        </td>
                      </tr>
                      <tr>
                        <td width="35%" style="padding: 12px 0 6px; color: #71717a; font-size: 13px;">Site Location</td>
                        <td style="padding: 12px 0 6px; color: #09090b; font-size: 13px; font-weight: 600;">${siteLocation || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">Area to Cover</td>
                        <td style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">${areaToCover || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a; font-size: 13px;">Application Type</td>
                        <td style="padding: 6px 0; color: #09090b; font-size: 13px; font-weight: 600;">${application}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Spacer -->
                <tr><td height="30"></td></tr>

                <!-- What happens next -->
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px; color: #09090b; font-size: 16px; font-weight: 700;">What Happens Next?</h3>
                    <ol style="margin: 0; padding-left: 20px; color: #52525b; font-size: 13px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;"><strong>Quantity & Layout Consultation:</strong> Our technical deployment experts will contact you within 24 hours to review your site parameters, verify the sensor placement layout, and schedule shipping.</li>
                      <li style="margin-bottom: 8px;"><strong>Order Dispatch:</strong> Your hardware nodes will be mesh-configured at our factory and dispatched to your site.</li>
                      <li style="margin-bottom: 8px;"><strong>Commissioning:</strong> Our team will guide your staff or installer partner through placing the sensor nodes and activating the LoRa gateway hub.</li>
                    </ol>
                  </td>
                </tr>

                <!-- Spacer -->
                <tr><td height="35"></td></tr>

                <!-- Footer contact info -->
                <tr>
                  <td align="center" style="border-top: 1px solid #eaeaea; padding-top: 25px; color: #71717a; font-size: 12px; line-height: 1.6;">
                    <p style="margin: 0 0 8px; font-weight: 600; color: #09090b;">AMEC Technology Support Desk</p>
                    <p style="margin: 0 0 4px;">Sales Helpline: +91 7887870040 | Service Helpline: +91 8087758405</p>
                    <p style="margin: 0;">Email: <a href="mailto:sales@amectechnology.com" style="color: #ba1a1a; text-decoration: none;">sales@amectechnology.com</a></p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: `AMEC Technology <${senderEmail}>`,
            to: email,
            subject: `AMEC Technology Order Confirmation - ${qty} ${qty === 1 ? 'Node' : 'Nodes'}`,
            html: emailHtml
          })
        });

        if (!emailResponse.ok) {
          const errText = await emailResponse.text();
          console.error("Resend API responded with error:", emailResponse.status, errText);
        } else {
          console.log("Confirmation email sent successfully via Resend API.");
        }
      } catch (emailErr) {
        console.error("Error sending confirmation email:", emailErr);
      }
    } else {
      console.warn("Resend API key (RESEND_API_KEY) or user email missing, skipping confirmation email.");
    }
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error in backend checkout route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
