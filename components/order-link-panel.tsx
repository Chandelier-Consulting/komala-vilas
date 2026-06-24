import Image from "next/image";
import Link from "next/link";
import type { ResolvedImage } from "@/lib/content";
import { restaurantInfo } from "@/lib/restaurant";

type OrderLinkPanelProps = {
  backdropImage: ResolvedImage;
};

export function OrderLinkPanel({ backdropImage }: OrderLinkPanelProps) {
  return (
    <div className="order-link-panel-shell">
      <div className="order-link-panel-backdrop" aria-hidden="true">
        <Image
          className="photo-grade"
          src={backdropImage.src}
          alt=""
          fill
          sizes="(max-width: 680px) 100vw, 1180px"
          quality={88}
        />
      </div>
      <aside className="order-link-panel" aria-label="Order now">
        <div>
          <p className="eyebrow">Order now</p>
          <h2 className="text-balance">Pickup, directions, and catering in one place.</h2>
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
    </div>
  );
}
