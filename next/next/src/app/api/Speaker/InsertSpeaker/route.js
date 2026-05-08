import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    const token = await getAnonymousToken();
    if (!token) throw new Error("Failed to get anonymous token");

    const formData = await req.formData();

    const res = await fetch(
      "https://testing.rakshanatv.com/api/Speaker/InsertSpeaker",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        agent,
      }
    );

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
