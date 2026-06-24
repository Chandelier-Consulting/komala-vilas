import { randomUUID } from "node:crypto";
import { getAdminMenuEditorData } from "@/lib/admin-content-store";
import { getAdminDb, verifyAdminRequest } from "@/lib/firebase-admin";
import { defaultMenuSections } from "@/lib/menu";

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

export async function GET(request: Request) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getAdminMenuEditorData();
  return Response.json(data);
}

export async function POST(request: Request) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await request.json().catch(() => null);
  const sectionId = asText(payload?.sectionId);
  const name = asText(payload?.name);
  const description = asText(payload?.description);
  const price = asText(payload?.price);
  const imageAssetId = asText(payload?.imageAssetId) || null;
  const tags = asTags(payload?.tags);

  if (!defaultMenuSections.some((section) => section.id === sectionId)) {
    return Response.json({ error: "Choose a valid menu section." }, { status: 400 });
  }

  if (!name || !description || !price) {
    return Response.json({ error: "Name, description, and price are required." }, { status: 400 });
  }

  const itemId = `custom-${randomUUID()}`;
  const now = new Date().toISOString();
  await getAdminDb().collection("menuCustomItems").doc(itemId).set({
    sectionId,
    name,
    description,
    price,
    tags,
    popular: Boolean(payload?.popular),
    cateringFriendly: Boolean(payload?.cateringFriendly),
    available: typeof payload?.available === "boolean" ? payload.available : true,
    imageAssetId,
    createdAt: now,
    updatedAt: now,
    createdBy: user.uid,
  });

  return Response.json({ ok: true, itemId }, { status: 201 });
}
