import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    console.log("🚀 InsertSocialMediaLink triggered");

    const token = await getAnonymousToken();

    // Read incoming multipart/form-data (SocialMediaName, SocialMediaLink, SocialMediaIcon)
    const formData = await req.formData();

    const backendFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }

    const response = await fetch(
      "https://testing.rakshanatv.com/api/SocialMediaLinks/InsertSocialMediaLink",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: backendFormData,
        agent,
      }
    );

    const text = await response.text();
    return new Response(text, { status: response.status });
  } catch (err) {
    console.error("💥 InsertSocialMediaLink route error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}