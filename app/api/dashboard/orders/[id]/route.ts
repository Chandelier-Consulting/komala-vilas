import { getAdminDb } from "@/lib/firebase-admin";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth-rest";
import { isValidOrderStatus } from "@/lib/orders";

async function verifyRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return verifyFirebaseIdToken(token);
}

export async function PATCH(request: Request, context: RouteContext<"/api/dashboard/orders/[id]">) {
  const user = await verifyRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);

  if (!isValidOrderStatus(payload?.status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  await getAdminDb().collection("cateringOrders").doc(id).update({
    status: payload.status,
    updatedAt: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
