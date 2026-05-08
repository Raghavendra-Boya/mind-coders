import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    const token = await getAnonymousToken();
    const body = await req.json(); 

    console.log("➡️ Sending Body:", body);

    const response = await fetch(
      "https://testing.rakshanatv.com/api/SectionHeadings/InsertSectionHeading",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        agent,
      }
    );

    const text = await response.text();
    console.log("⬅️ Raw API Response:", text);

    let finalJson = {};

    try {
      finalJson = JSON.parse(text); // If valid JSON
    } catch (e) {
      finalJson = { Status: response.status, Message: text }; // If plain text
    }

    return Response.json(finalJson, { status: response.status });

  } catch (err) {
    console.error("💥 API Error:", err);

    return Response.json(
      { Status: 500, Message: err.message },
      { status: 500 }
    );
  }
}
