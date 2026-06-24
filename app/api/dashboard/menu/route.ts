import { getAdminMenuEditorData } from "@/lib/admin-content-store";
import { verifyAdminRequest } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const user = await verifyAdminRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getAdminMenuEditorData();
  return Response.json(data);
}
