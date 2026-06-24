import { Resend } from "resend";
import type { CateringOrder } from "@/lib/orders";

type CateringEmailResult =
  | { skipped: true; reason: "missing_recipients" | "missing_api_key" }
  | { skipped: false; sent: true; id: string | undefined }
  | { skipped: false; sent: false; error: string };

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

function getSender() {
  return process.env.CATERING_EMAIL_FROM ?? "Komala Vilas <onboarding@resend.dev>";
}

function getOrderLines(order: CateringOrder, orderId: string) {
  return [
    "Komala Vilas catering request",
    `Order ID: ${orderId}`,
    "",
    "Customer",
    `Name: ${order.name}`,
    `Email: ${order.email}`,
    `Phone: ${order.phone}`,
    "",
    "Event",
    `Date: ${order.eventDate}`,
    `Guests: ${order.guestCount}`,
    `Package: ${order.packageName}`,
    `Window: ${order.pickupWindow}`,
    "",
    "Notes",
    order.notes || "None",
  ];
}

function getOrderHtml(order: CateringOrder, orderId: string) {
  const details = [
    ["Contact", order.name],
    ["Email", order.email],
    ["Phone", order.phone],
    ["Event date", order.eventDate],
    ["Guests", String(order.guestCount)],
    ["Package", order.packageName],
    ["Pickup or delivery", order.pickupWindow],
    ["Notes", order.notes || "None"],
  ]
    .map(
      ([label, value]) =>
        `<div style="padding:12px 0;border-top:1px solid rgba(60,23,18,0.12)"><div style="font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#6b4d3b">${label}</div><div style="margin-top:6px;font-size:15px;color:#24150f">${value}</div></div>`,
    )
    .join("");

  return `<div style="margin:0;padding:24px;background:#f7eddc;font-family:Arial,sans-serif;color:#24150f">
    <div style="max-width:640px;margin:0 auto;background:#fff8ea;border:1px solid rgba(60,23,18,0.12);border-radius:24px;overflow:hidden">
      <div style="padding:24px 28px;background:linear-gradient(135deg,#7d2418,#b94224);color:#fff8ea">
        <div style="font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;opacity:0.88">Komala Vilas</div>
        <h1 style="margin:10px 0 6px;font-size:28px;line-height:1.1">New catering request</h1>
        <p style="margin:0;font-size:15px;line-height:1.5;opacity:0.94">${order.packageName} for ${order.guestCount} guests</p>
      </div>
      <div style="padding:24px 28px">
        <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(217,155,38,0.18);color:#7d2418;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase">Order ID ${orderId}</div>
        <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#4f3428">A new catering inquiry came in from the website. Reply directly to the customer to confirm menu, quantity, and timing.</p>
        <div style="margin-top:22px">${details}</div>
      </div>
    </div>
  </div>`;
}

export async function sendCateringOrderEmail(
  order: CateringOrder,
  orderId: string,
): Promise<CateringEmailResult> {
  const recipients = getRecipients();
  const resend = getResendClient();
  if (recipients.length === 0) {
    console.warn("Skipped catering email: CATERING_ORDER_EMAILS is not set");
    return { skipped: true, reason: "missing_recipients" };
  }

  if (!resend) {
    console.warn("Skipped catering email: RESEND_API_KEY is not set");
    return { skipped: true, reason: "missing_api_key" };
  }

  const response = await resend.emails.send({
    from: getSender(),
    to: recipients,
    subject: `Komala Vilas catering request: ${order.packageName} · ${order.guestCount} guests`,
    html: getOrderHtml(order, orderId),
    text: getOrderLines(order, orderId).join("\n"),
    replyTo: order.email,
  });

  if (response.error) {
    console.error("Resend catering email failed", response.error);
    return { skipped: false, sent: false, error: response.error.message };
  }

  console.log("Resend catering email sent", {
    orderId,
    emailId: response.data?.id,
  });

  return { skipped: false, sent: true, id: response.data?.id };
}
