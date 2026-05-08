import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const token = await getAnonymousToken();

    console.log("➡️ GetSectionHeadings - Requesting");

    const response = await fetch(
      "https://testing.rakshanatv.com/api/SectionHeadings/GetSectionHeadings",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        agent,
      }
    );

    const text = await response.text();
    console.log("⬅️ GetSectionHeadings - Raw API Response:", text);

    let finalJson = {};
    try {
      finalJson = JSON.parse(text);
    } catch (e) {
      finalJson = { Status: response.status, Message: text };
    }

    let httpStatus = response.status;
    if (finalJson.Status && finalJson.Status !== "200") {
      httpStatus = 400;
    }

    return Response.json(finalJson, { status: httpStatus });
  } catch (err) {
    console.error("💥 GetSectionHeadings API Error:", err);

    return Response.json(
      { Status: 500, Message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}