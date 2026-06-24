import { getAdminDb, verifyAdminRequest } from "@/lib/firebase-admin";

export async function PATCH(request: Request, context: RouteContext<"/api/dashboard/images/[assetId]">) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { assetId } = await context.params;
  const payload = await request.json().catch(() => null);

  const nextStatus = payload?.status === "archived" ? "archived" : "active";
  const nextAlt = typeof payload?.alt === "string" ? payload.alt.trim() : undefined;
  const nextLabel = typeof payload?.label === "string" ? payload.label.trim() : undefined;

  await getAdminDb().collection("imageAssets").doc(assetId).set(
    {
      ...(nextAlt ? { alt: nextAlt } : {}),
      ...(nextLabel ? { label: nextLabel } : {}),
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return Response.json({ ok: true });
}
