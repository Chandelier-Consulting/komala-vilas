import { pruneUnusedUploadedImageAssets } from "@/lib/admin-content-store";
import { verifyAdminRequest } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pruneUnusedUploadedImageAssets();
  return Response.json({ ok: true, ...result });
}
