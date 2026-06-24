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
  if (!existingItem) return Response.json({ error: "Unknown item" }, { status: 404 });

  const payload = await request.json().catch(() => null);
  const name = asText(payload?.name);
  const description = asText(payload?.description);
  const price = asText(payload?.price);
  const imageAssetId = asText(payload?.imageAssetId) || null;
  const tags = asTags(payload?.tags);

  if (!name || !description || !price) {
    return Response.json({ error: "Name, description, and price are required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  await getAdminDb().collection("menuItemOverrides").doc(itemId).set({
    itemId,
    sectionId: existingItem.sectionId,
    name,
    description,
    price,
    tags,
    popular: Boolean(payload?.popular),
    cateringFriendly: Boolean(payload?.cateringFriendly),
    imageAssetId,
    updatedAt: now,
  });

  return Response.json({ ok: true });
}
