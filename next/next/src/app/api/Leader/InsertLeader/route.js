import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    // 1️⃣ Parse incoming multipart/form-data (Name, Designation, Description, LeaderImage)
    let formData;
    try {
      formData = await req.formData();
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid form-data body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2️⃣ Get token
    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    // 3️⃣ Forward the same form-data to backend API
    const backendFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }

    const res = await fetch("https://testing.rakshanatv.com/api/Leader/InsertLeader", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
      agent,
    });

    // 4️⃣ Parse backend response safely
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      return new Response(JSON.stringify({ success: false, message: "Invalid JSON from backend", raw: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 5️⃣ Return response
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("💥 InsertLeader route error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
