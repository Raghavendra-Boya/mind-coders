import { getAnonymousToken } from "@/utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("ProgramID");

    if (!programId) {
      return new Response(
        JSON.stringify({ success: false, message: "ProgramID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = await getAnonymousToken();
    if (!token) throw new Error("Failed to get token");

    const apiUrl = `https://testing.rakshanatv.com/api/ProgramEpisode/GetProgramEpisodes?ProgramID=${encodeURIComponent(
      programId
    )}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      agent,
    });

    const text = await res.text();
    console.log("GetProgramEpisodes upstream status:", res.status);
    console.log("GetProgramEpisodes upstream raw body:", text);

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
    console.error("GetProgramEpisodes Error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
