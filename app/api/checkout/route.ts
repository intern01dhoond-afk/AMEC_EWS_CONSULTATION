import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not defined in environment variables.");
      return NextResponse.json(
        { error: 'Webhook URL not configured on server' }, 
        { status: 500 }
      );
    }
    
    // We forward the request using fetch.
    // Setting redirect to 'follow' is essential since Google Apps Script redirects with a 302.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("Google Sheets Webhook responded with error status:", response.status, text);
      throw new Error(`Failed to send data to Google Sheets: ${response.statusText}`);
    }
    
    let result = { result: 'success' };
    try {
      result = await response.json();
    } catch (e) {
      // Sometimes Apps Script might return text even with application/json header, 
      // or redirect follow results in opaque/empty responses.
      console.log("Response body parsing as JSON failed, proceeding with generic success.", e);
    }
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error saving to Google Sheets:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
