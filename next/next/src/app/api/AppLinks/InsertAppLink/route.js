import { getAnonymousToken } from "@/utils/auth";
import https from "https";

export const runtime = "nodejs";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertAppLink triggered");

    const token = await getAnonymousToken();

    // Parse JSON data from request
    const data = await req.json();

    const response = await fetch(
      "https://testing.rakshanatv.com/api/AppLinks/InsertAppLink",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        agent,
      }
    );

    const text = await response.text();

    let finalResponse;
    try {
      finalResponse = JSON.parse(text);
    } catch {
      finalResponse = { success: false, message: text };
    }

    return Response.json(finalResponse, { status: response.status });
  } catch (err) {
    console.error("💥 InsertAppLink route error:", err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
