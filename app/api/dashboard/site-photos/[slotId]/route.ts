import { getAdminDb, verifyAdminRequest } from "@/lib/firebase-admin";
import { defaultSitePhotoSlots } from "@/lib/site-photos";

export async function PUT(request: Request, context: RouteContext<"/api/dashboard/site-photos/[slotId]">) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { slotId } = await context.params;
  if (!defaultSitePhotoSlots[slotId]) {
    return Response.json({ error: "Unknown photo slot" }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const assetId =
    typeof payload?.assetId === "string" && payload.assetId.trim().length > 0
      ? payload.assetId.trim()
      : null;

  if (!assetId) {
    return Response.json({ error: "Choose an image asset." }, { status: 400 });
  }

  await getAdminDb().collection("sitePhotoAssignments").doc(slotId).set({
    assetId,
    updatedAt: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
