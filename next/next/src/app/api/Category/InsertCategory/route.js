import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    const jsonBody = await req.json();
    console.log("📥 Received JSON:", jsonBody);

    const token = await getAnonymousToken();
    if (!token) throw new Error("Failed to get anonymous token");

    const res = await fetch(
      "https://testing.rakshanatv.com/api/Category/InsertCategory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonBody),
        agent,
      }
    );

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 InsertCategory error:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
