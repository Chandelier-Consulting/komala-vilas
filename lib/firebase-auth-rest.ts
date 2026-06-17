export async function verifyFirebaseIdToken(token: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  ).catch(() => null);

  if (!response?.ok) return null;

  const body = await response.json().catch(() => null);
  return body?.users?.[0] ?? null;
}
