import { getAdminDb, verifyAdminRequest } from "@/lib/firebase-admin";
import { flattenMenuItems, defaultMenuSections } from "@/lib/menu";

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

export async function PUT(request: Request, context: RouteContext<"/api/dashboard/menu/[itemId]">) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await context.params;
  const existingItem = flattenMenuItems(defaultMenuSections).find((item) => item.id === itemId);
  const customItem = await getAdminDb().collection("menuCustomItems").doc(itemId).get();
  if (!existingItem && !customItem.exists) return Response.json({ error: "Unknown item" }, { status: 404 });

  const payload = await request.json().catch(() => null);
  const sectionId = asText(payload?.sectionId);
  const name = asText(payload?.name);
  const description = asText(payload?.description);
  const price = asText(payload?.price);
  const imageAssetId = asText(payload?.imageAssetId) || null;
  const tags = asTags(payload?.tags);

  if (!name || !description || !price) {
    return Response.json({ error: "Name, description, and price are required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  if (customItem.exists) {
    await customItem.ref.set(
      {
        sectionId: defaultMenuSections.some((section) => section.id === sectionId)
          ? sectionId
          : String(customItem.data()?.sectionId ?? "specials"),
        name,
        description,
        price,
        tags,
        popular: Boolean(payload?.popular),
        cateringFriendly: Boolean(payload?.cateringFriendly),
        available: typeof payload?.available === "boolean" ? payload.available : true,
        imageAssetId,
        updatedAt: now,
      },
      { merge: true },
    );

    return Response.json({ ok: true });
  }

  await getAdminDb().collection("menuItemOverrides").doc(itemId).set({
    itemId,
    sectionId: existingItem?.sectionId,
    name,
    description,
    price,
    tags,
    popular: Boolean(payload?.popular),
    cateringFriendly: Boolean(payload?.cateringFriendly),
    available: typeof payload?.available === "boolean" ? payload.available : true,
    imageAssetId,
    updatedAt: now,
  });

  return Response.json({ ok: true });
}

export async function DELETE(request: Request, context: RouteContext<"/api/dashboard/menu/[itemId]">) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await context.params;
  const customItem = await getAdminDb().collection("menuCustomItems").doc(itemId).get();
  if (customItem.exists) {
    await customItem.ref.delete();
    return Response.json({ ok: true });
  }

  const existingItem = flattenMenuItems(defaultMenuSections).find((item) => item.id === itemId);
  if (!existingItem) return Response.json({ error: "Unknown item" }, { status: 404 });

  await getAdminDb().collection("menuItemOverrides").doc(itemId).delete();

  return Response.json({ ok: true });
}
