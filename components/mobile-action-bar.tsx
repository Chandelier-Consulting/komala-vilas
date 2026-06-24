"use client";

import { MotionLink } from "@/components/motion-shell";
import { PickupModalTrigger } from "@/components/pickup-modal";
import { restaurantInfo } from "@/lib/restaurant";

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <MotionLink href={restaurantInfo.phoneHref}>Call</MotionLink>
      <MotionLink href={restaurantInfo.mapUrl} target="_blank" rel="noreferrer">
        Directions
      </MotionLink>
      <span className="motion-action">
        <PickupModalTrigger label="Order" />
      </span>
      <MotionLink href="/catering">Catering</MotionLink>
    </nav>
  );
}
