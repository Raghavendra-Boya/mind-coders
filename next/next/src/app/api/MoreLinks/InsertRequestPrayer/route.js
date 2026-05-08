import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertRequestPrayer triggered");

    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    const body = await req.json();
    console.log("Request body:", body);

    const res = await fetch(
      "https://testing.rakshanatv.com/api/MoreLinks/InsertRequestPrayer",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        agent,
      }
    );

    const text = await res.text();
    console.log("API Response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, message: data?.Message || "Failed to save prayer request" }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Prayer request saved successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("💥 InsertRequestPrayer error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
