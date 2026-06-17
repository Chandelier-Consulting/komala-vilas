import Link from "next/link";
import { restaurantInfo } from "@/lib/restaurant";

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href={restaurantInfo.phoneHref}>Call</a>
      <a href={restaurantInfo.mapUrl} target="_blank" rel="noreferrer">Directions</a>
      <a href={restaurantInfo.orderUrl} target="_blank" rel="noreferrer">Order</a>
      <Link href="/catering">Catering</Link>
    </nav>
  );
}
