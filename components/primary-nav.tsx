"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
      <a href={restaurantInfo.mapUrl}>Visit</a>
      <Link className="nav-order" href="/catering">
        Order Catering
      </Link>
    </nav>
  );
}

