import { Resend } from "resend";
import type { CateringOrder } from "@/lib/orders";

let resendClient: Resend | null = null;

function getRecipients() {
  return (process.env.CATERING_ORDER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function getResendClient() {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendCateringOrderEmail(order: CateringOrder, orderId: string) {
  const recipients = getRecipients();
  const resend = getResendClient();
  if (recipients.length === 0 || !resend) return { skipped: true };

  await resend.emails.send({
    from: process.env.CATERING_EMAIL_FROM ?? "Komala Vilas <orders@komalavilas.com>",
    to: recipients,
    subject: `New catering order: ${order.packageName} for ${order.guestCount}`,
    text: [
      `Order: ${orderId}`,
      `Name: ${order.name}`,
      `Email: ${order.email}`,
      `Phone: ${order.phone}`,
      `Date: ${order.eventDate}`,
      `Guests: ${order.guestCount}`,
      `Package: ${order.packageName}`,
      `Window: ${order.pickupWindow}`,
      `Notes: ${order.notes || "None"}`,
    ].join("\n"),
  });

  return { skipped: false };
}
