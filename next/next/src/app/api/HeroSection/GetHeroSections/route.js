import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const token = await getAnonymousToken();

    const res = await fetch(
      "https://testing.rakshanatv.com/api/HeroSection/GetHeroSections",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
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

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to fetch", data }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
