import { validateCateringOrder } from "@/lib/orders";
import { getAdminDb } from "@/lib/firebase-admin";
import { sendCateringOrderEmail } from "@/lib/email";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const result = validateCateringOrder(payload ?? {});

  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const now = new Date().toISOString();
  const doc = await getAdminDb().collection("cateringOrders").add({
    ...result.order,
    createdAt: now,
    updatedAt: now,
  });

  await sendCateringOrderEmail(result.order, doc.id);

  return Response.json({ ok: true, orderId: doc.id }, { status: 201 });
}
