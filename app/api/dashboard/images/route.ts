import { randomUUID } from "node:crypto";
import { getAdminDb, getAdminStorage, verifyAdminRequest } from "@/lib/firebase-admin";
import { getAdminPhotoEditorData } from "@/lib/admin-content-store";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function asText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getAdminPhotoEditorData();
  return Response.json(data);
}

export async function POST(request: Request) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return Response.json({ error: "Upload form data is missing." }, { status: 400 });
  }

  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 400 });
  }

  const label = asText(formData.get("label")) || file.name.replace(/\.[a-z0-9]+$/i, "");
  const alt = asText(formData.get("alt")) || label;
  const width = Number(asText(formData.get("width")) || "0");
  const height = Number(asText(formData.get("height")) || "0");
  const buffer = Buffer.from(await file.arrayBuffer());
  const assetId = randomUUID();
  const storagePath = `site-images/${assetId}-${file.name.replace(/[^a-z0-9.\-_]+/gi, "-").toLowerCase()}`;

  await getAdminStorage()
    .bucket()
    .file(storagePath)
    .save(buffer, {
      contentType: file.type,
      resumable: false,
      public: false,
      metadata: {
        metadata: {
          uploadedBy: user.uid,
        },
      },
    });

  const now = new Date().toISOString();
  await getAdminDb().collection("imageAssets").doc(assetId).set({
    label,
    alt,
    storagePath,
    width: Number.isFinite(width) && width > 0 ? width : 1200,
    height: Number.isFinite(height) && height > 0 ? height : 900,
    status: "active",
    contentType: file.type,
    sizeBytes: file.size,
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ ok: true, assetId }, { status: 201 });
}
