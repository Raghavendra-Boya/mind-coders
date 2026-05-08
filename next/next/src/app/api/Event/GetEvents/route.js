import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    console.log("🚀 Fetching events...");

    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    const res = await fetch(
      "https://testing.rakshanatv.com/api/Event/GetEvents", // fixed typo
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        agent, // only works in Node environment
      }
    );

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 GetEvents route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
