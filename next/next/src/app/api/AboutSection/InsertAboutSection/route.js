import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertAboutSection triggered");

    const token = await getAnonymousToken();
    const form = await req.formData();

    const response = await fetch(
      "https://testing.rakshanatv.com/api/AboutSection/InsertAboutSection",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
        agent,
      }
    );

    // Get raw text
    const text = await response.text();

    // Try to parse JSON safely
    let finalResponse = {};
    try {
      finalResponse = JSON.parse(text); // if valid JSON
    } catch (e) {
      finalResponse = { success: false, message: text }; // backend returned plain text
    }

    return Response.json(finalResponse, { status: response.status });
  } catch (err) {
    console.error("💥 InsertAboutSection route error:", err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
