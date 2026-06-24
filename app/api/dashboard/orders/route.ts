import { getAdminDb, verifyAdminRequest } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const user = await verifyAdminRequest(request);
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
