import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    console.log("🚀 Fetching programs...");

    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    const res = await fetch(
      "https://testing.rakshanatv.com/api/Program/GetPrograms",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        agent,
      }
    );

    console.log("GetPrograms backend status:", res.status);

    const text = await res.text();
    console.log("GetPrograms backend body (first 500 chars):", text.slice(0, 500));

    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("💥 GetPrograms route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
