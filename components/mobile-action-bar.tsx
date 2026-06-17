"use client";

import { MotionLink } from "@/components/motion-shell";
import { restaurantInfo } from "@/lib/restaurant";

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <MotionLink href={restaurantInfo.phoneHref}>Call</MotionLink>
      <MotionLink href={restaurantInfo.mapUrl} target="_blank" rel="noreferrer">
        Directions
      </MotionLink>
      <MotionLink href={restaurantInfo.orderUrl} target="_blank" rel="noreferrer">
        Order
      </MotionLink>
      <MotionLink href="/catering">Catering</MotionLink>
    </nav>
  );
}
