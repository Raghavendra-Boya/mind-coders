import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  console.log("🚀 /api/Category/GetCategories called");

  try {
    const token = await getAnonymousToken();
    console.log("Token obtained:", token);

    const res = await fetch(
      "https://testing.rakshanatv.com/api/Category/GetCategories",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        agent, // ignore SSL errors if testing
      }
    );

    console.log("External API status:", res.status);

    const text = await res.text();
    console.log("External API response text:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", err);
      data = { raw: text };
    }

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to fetch", data }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Server error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
