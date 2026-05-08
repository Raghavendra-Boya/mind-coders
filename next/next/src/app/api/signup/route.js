export async function POST(req) {
  try {
    const body = await req.json();

    // Call backend API
    const res = await fetch("http://118.139.165.5/rakshanaapi/User/InsertUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "Signup failed", error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
