import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const token = await getAnonymousToken();

    const res = await fetch("https://testing.rakshanatv.com/api/Leader/GetLeaders", {
      headers: { Authorization: `Bearer ${token}` },
      agent,
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
