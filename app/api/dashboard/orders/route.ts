import { getAdminDb } from "@/lib/firebase-admin";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth-rest";

async function verifyRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return verifyFirebaseIdToken(token);
}

export async function GET(request: Request) {
  const user = await verifyRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await getAdminDb()
    .collection("cateringOrders")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  return Response.json({
    orders: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  });
}
