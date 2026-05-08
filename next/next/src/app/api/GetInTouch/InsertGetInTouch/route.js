import { getAnonymousToken } from "@/utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertGetInTouch triggered");
    
    // Parse the incoming JSON data
    const { name = "", email = "", phoneNumber = "", message = "", address = "" } = await req.json();
    console.log("Request data received:", { name, email, phoneNumber, message, address });
    
    const token = await getAnonymousToken();
    
    // Prepare the request to the external API
    const apiUrl = 'https://testing.rakshanatv.com/api/GetInTouch/InsertGetInTouch';
    
    const requestBody = {
      name,
      email,
      phoneNumber,
      message,
      address
    };
    
    console.log('Sending to external API:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      agent,
    });

    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('API Error:', response.status, responseData);
      return new Response(JSON.stringify({
        success: false,
        message: responseData.message || 'Failed to submit form',
        status: response.status
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(responseData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("💥 InsertGetInTouch route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}