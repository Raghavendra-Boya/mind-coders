"use server";

import { getAnonymousToken } from "@/utils/auth";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export async function GET() {
  try {
    const token = await getAnonymousToken();
    if (!token) throw new Error("Anonymous token not generated");

    const res = await fetch(
      "https://testing.rakshanatv.com/api/MoreLinks/GetSlotBookings",
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
    console.log("📌 RAW:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // Convert data.UserData into array
    let finalList = [];

    if (Array.isArray(data?.UserData)) {
      finalList = data.UserData;
    } else if (data?.UserData && typeof data.UserData === "object") {
      finalList = [data.UserData];
    } else {
      finalList = [];
    }

    // ⭐ Normalize fields so UI never crashes
    finalList = finalList.map((item) => ({
      id: item.SNo ?? "",
      fullName: item.FullName ?? "",
      mobileNo: item.MobileNo ?? "",
      email: item.Email ?? "",
      location: item.Location ?? "",
      slotBookingDate: item.BookingDate ?? "",
      slotBookingTime: item.BookingTime ?? "",
      message: item.Message ?? "",
      raw: item,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: finalList,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
