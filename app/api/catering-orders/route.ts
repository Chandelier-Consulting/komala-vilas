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

  const email = await sendCateringOrderEmail(result.order, doc.id).catch((error) => {
    console.error("Catering email send crashed", error);
    return { skipped: false, sent: false, error: "email_send_failed" };
  });

  return Response.json({ ok: true, orderId: doc.id, email }, { status: 201 });
}
