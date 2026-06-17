import Link from "next/link";
import { restaurantInfo } from "@/lib/restaurant";

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href={restaurantInfo.phoneHref}>Call</a>
      <a href={restaurantInfo.mapUrl}>Directions</a>
      <Link href="/menu">Order</Link>
      <Link href="/catering">Catering</Link>
    </nav>
  );
}

