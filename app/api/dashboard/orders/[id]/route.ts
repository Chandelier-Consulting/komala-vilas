import { getAdminDb, verifyAdminRequest } from "@/lib/firebase-admin";
import { isValidOrderStatus } from "@/lib/orders";

export async function PATCH(request: Request, context: RouteContext<"/api/dashboard/orders/[id]">) {
  const user = await verifyAdminRequest(request);
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
