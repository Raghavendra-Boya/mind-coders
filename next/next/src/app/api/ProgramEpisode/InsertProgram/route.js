import { getAnonymousToken } from "@/utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    const token = await getAnonymousToken();
    if (!token) throw new Error("Failed to get token");

    
    const formData = await req.formData();

    console.log("FormData received:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? "File" : value);
    }

    const res = await fetch(
      "https://testing.rakshanatv.com/api/ProgramEpisode/InsertProgramEpisode",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        agent,
      }
    );

    const text = await res.text();
    console.log("InsertProgramEpisode upstream status:", res.status);
    console.log("InsertProgramEpisode upstream raw body:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("InsertProgramEpisode Error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
