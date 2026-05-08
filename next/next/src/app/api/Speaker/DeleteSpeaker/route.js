import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");

    if (!userID) {
      return new Response(JSON.stringify({ success: false, message: "userID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    // Call backend API to delete speaker
    const res = await fetch(
      `https://testing.rakshanatv.com/api/Speaker/DeleteSpeaker?userID=${userID}`,
      {
        method: "POST", // your backend expects POST
        headers: {
          Authorization: `Bearer ${token}`,
        },
        agent,
      }
    );

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 DeleteSpeaker route error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
