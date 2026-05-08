import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const leaderID = searchParams.get("leaderID");
    if (!leaderID) {
      return new Response(JSON.stringify({ success: false, message: "leaderID is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const token = await getAnonymousToken();

    const res = await fetch(`https://testing.rakshanatv.com/api/Leader/DeleteLeader?leaderID=${leaderID}`, {
      method: "POST", // backend expects POST for deletion
      headers: { Authorization: `Bearer ${token}` },
      agent,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : { success: true, message: "No content" };
    } catch (err) {
      data = { success: false, message: "Invalid JSON from backend", raw: text };
    }

    return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
