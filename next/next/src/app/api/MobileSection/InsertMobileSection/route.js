import { NextResponse } from "next/server";
import { getAnonymousToken } from "../../../../utils/auth";
import https from "https";

export const dynamic = "force-dynamic";
const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req) {
  try {
    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    const body = await req.json();

    // Forward to remote API
    const res = await fetch(
      "https://testing.rakshanatv.com/api/MobileSection/InsertMobileSection",
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

    const text = await res.text();

    // try parse, otherwise return raw
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: res.status });
    } catch {
      return NextResponse.json({ success: false, raw: text }, { status: res.status });
    }
  } catch (err) {
    console.error("InsertMobileSection error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
