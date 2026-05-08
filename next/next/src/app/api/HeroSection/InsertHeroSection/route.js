import { getAnonymousToken } from "@/utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertHeroSection triggered");

    const token = await getAnonymousToken();

    const response = await fetch(
      "https://testing.rakshanatv.com/api/HeroSection/InsertHeroSection",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANT: Do not set Content-Type for multipart/form-data here,
          // Next will set the correct boundary automatically when streaming formData
        },
        body: await req.formData(),
        agent,
      }
    );

    const text = await response.text();
    return new Response(text, { status: response.status });
  } catch (err) {
    console.error("💥 InsertHerosection route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}