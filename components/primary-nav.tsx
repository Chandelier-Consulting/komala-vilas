"use client";

import { usePathname } from "next/navigation";
import { MotionLink } from "@/components/motion-shell";
import { PickupModalTrigger } from "@/components/pickup-modal";
import { restaurantInfo } from "@/lib/restaurant";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Primary navigation">
      {links.map((link) => (
        <MotionLink
          key={link.href}
          href={link.href}
          ariaCurrent={pathname === link.href ? "page" : undefined}
        >
          {link.label}
        </MotionLink>
      ))}
      <MotionLink href={restaurantInfo.mapUrl} target="_blank" rel="noreferrer">
        Visit
      </MotionLink>
      <span className="motion-action">
        <PickupModalTrigger className="nav-order" label="Order Online" />
      </span>
    </nav>
  );
}
