import Link from "next/link";
import { restaurantInfo } from "@/lib/restaurant";

export function OrderLinkPanel() {
  return (
    <aside className="order-link-panel" aria-label="Order now">
      <div>
        <p className="eyebrow">Order now</p>
        <h2 className="text-balance">Pickup, directions, and catering without extra tools.</h2>
      </div>
      <div className="order-link-grid">
        {restaurantInfo.orderLinks.map((link) =>
          link.href.startsWith("/") ? (
            <Link key={link.label} href={link.href}>
              <strong>{link.label}</strong>
              <span>{link.note}</span>
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <strong>{link.label}</strong>
              <span>{link.note}</span>
            </a>
          ),
        )}
      </div>
      <a className="problem-link" href={restaurantInfo.feedbackEmail}>
        Problem with an order? Send direct feedback.
      </a>
    </aside>
  );
}
