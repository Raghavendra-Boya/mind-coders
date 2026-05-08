import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

// // ✅ Only disable SSL verification in local development
// if (process.env.NODE_ENV === "development") {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// }

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertEvent triggered");

    // ✅ Get a fresh token first
    const token = await getAnonymousToken();
    if (!token) {
      throw new Error("Failed to get anonymous token");
    }

    // ✅ Forward the request to your backend API
    const res = await fetch(
      "https://testing.rakshanatv.com/api/Event/InsertEvent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: await req.formData(),
        agent, // ✅ use https agent to bypass SSL locally
      }
    );

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("💥 InsertEvent route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
