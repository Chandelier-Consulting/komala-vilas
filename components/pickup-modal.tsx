"use client";

import { useEffect, useId, useState } from "react";
import { restaurantInfo } from "@/lib/restaurant";

type PickupModalTriggerProps = {
  label: string;
  className?: string;
};

export function PickupModalTrigger({ label, className }: PickupModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headingId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className={className} onClick={() => setIsOpen(true)}>
        {label}
      </button>
      {isOpen ? (
        <div className="pickup-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="pickup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pickup-modal-header">
              <div>
                <p className="eyebrow">Order pickup</p>
                <h2 id={headingId}>Choose pickup</h2>
              </div>
              <button
                type="button"
                className="pickup-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close pickup options"
              >
                Close
              </button>
            </div>
            <p className="pickup-modal-copy">
              Pick the app you already use. Each link opens Komala Vilas pickup in a new tab.
            </p>
            <div className="pickup-link-grid">
              {restaurantInfo.pickupLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  <strong>{link.label}</strong>
                  <span>{link.note}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
