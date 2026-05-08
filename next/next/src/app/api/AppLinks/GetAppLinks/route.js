// app/api/SectionHeadings/GetSectionHeadings/route.js
import { getAnonymousToken } from "@/utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const token = await getAnonymousToken();

    const response = await fetch(
      "https://testing.rakshanatv.com/api/AppLinks/GetAppLinks",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        agent,
      }
    );

    const text = await response.text();
    return new Response(text, { status: response.status });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}
