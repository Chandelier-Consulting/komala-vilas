import nodemailer from "nodemailer";
import type { CateringOrder } from "@/lib/orders";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getRecipients() {
  return (process.env.CATERING_ORDER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  return transporter;
}

export async function sendCateringOrderEmail(order: CateringOrder, orderId: string) {
  const recipients = getRecipients();
  if (recipients.length === 0 || !process.env.SMTP_HOST) return { skipped: true };

  await getTransporter().sendMail({
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
