export async function getAnonymousToken() {
  // detect if running on server
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/auth/anonymous`);

  const data = await res.json();

  if (!data.success) {
    throw new Error("Token fetch failed: " + data.message);
  }

  return data.token;
}
