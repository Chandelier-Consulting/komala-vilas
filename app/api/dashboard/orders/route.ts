import { getAdminAuth } from "@/lib/firebase-admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";

async function verifyRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return getAdminAuth().verifyIdToken(token).catch(() => null);
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
