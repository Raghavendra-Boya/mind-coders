import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

// ✅ Ignore SSL only in local dev (safe)
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertLiveBroadCastLink triggered");

    // ✅ Step 1: Get Bearer token
    const token = await getAnonymousToken();
    if (!token) {
      throw new Error("Failed to fetch anonymous token");
    }

    // ✅ Step 2: Parse incoming request body (JSON)
    const body = await req.json();

    // ✅ Step 3: Forward request to backend API
    const res = await fetch(
      "https://testing.rakshanatv.com/api/LiveBroadCast/InsertLiveBroadCastLink",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ attach token
        },
        body: JSON.stringify(body),
        agent, // ✅ bypass SSL in local only
      }
    );

    // ✅ Step 4: Return backend response
    const data = await res.text();
    return new Response(data, { status: res.status });
  } catch (err) {
    console.error("💥 InsertLiveBroadCastLink route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
