import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertProgram triggered");

    const token = await getAnonymousToken();

    const response = await fetch(
      "https://testing.rakshanatv.com/api/Program/InsertProgram",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: await req.formData(),
        agent, // ✅ same agent used here too
      }
    );

    const text = await response.text();
    return new Response(text, { status: response.status });
  } catch (err) {
    console.error("💥 InsertProgram route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
