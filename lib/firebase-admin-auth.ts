import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export function getAdminAuth() {
  return getAuth(getFirebaseAdmin());
}
