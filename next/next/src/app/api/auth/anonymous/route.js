import { NextResponse } from "next/server";

export const runtime = "nodejs"; // force Node runtime

export async function GET() {
  try {
    // ✅ Allow self-signed certs (only in dev)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const res = await fetch(
      "https://testing.rakshanatv.com/User/AnonymousLogin?ClientID=12345",
      { method: "GET" }
    );

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.statusText}`);
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      token: data?.Bearer,
      message: data?.Message,
    });
  } catch (err) {
    console.error("💥 AnonymousLogin error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
