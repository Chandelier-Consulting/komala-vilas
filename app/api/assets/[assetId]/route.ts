import { getAdminStorage } from "@/lib/firebase-admin";
import { getUploadedImageAsset } from "@/lib/admin-content-store";

export async function GET(_request: Request, context: RouteContext<"/api/assets/[assetId]">) {
  const { assetId } = await context.params;
  const asset = await getUploadedImageAsset(assetId);

  if (!asset?.storagePath) {
    return new Response("Not found", { status: 404 });
  }

  const [buffer] = await getAdminStorage().bucket().file(asset.storagePath).download();

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "content-type": asset.contentType || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
