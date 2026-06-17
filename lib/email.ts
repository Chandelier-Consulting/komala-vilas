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
    `Order: ${orderId}`,
    `Name: ${order.name}`,
    `Email: ${order.email}`,
    `Phone: ${order.phone}`,
    `Date: ${order.eventDate}`,
    `Guests: ${order.guestCount}`,
    `Package: ${order.packageName}`,
    `Window: ${order.pickupWindow}`,
    `Notes: ${order.notes || "None"}`,
  ];
}

function getOrderHtml(order: CateringOrder, orderId: string) {
  const rows = getOrderLines(order, orderId)
    .map((line) => {
      const [label, ...value] = line.split(": ");
      return `<tr><th align="left" style="padding:6px 12px 6px 0">${label}</th><td style="padding:6px 0">${value.join(": ")}</td></tr>`;
    })
    .join("");

  return `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f1a17">
    <h1 style="font-size:20px;margin:0 0 12px">New catering order</h1>
    <table style="border-collapse:collapse">${rows}</table>
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
    subject: `New catering order: ${order.packageName} for ${order.guestCount}`,
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
