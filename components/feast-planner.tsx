"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MotionLink, MotionPresence } from "@/components/motion-shell";
import { cateringPackages, type CateringPackageId } from "@/lib/orders";
import { EASE_OUT_EXPO, EASE_SPRING } from "@/lib/variants";

const eventTypes = [
  {
    id: "office-lunch",
    label: "Office lunch",
    packageId: "temple-feast",
    note: "Fast serving, full plates, easy refills.",
    flow: ["Thali line opens", "Sambar + rasam refills", "Coffee closes"],
  },
  {
    id: "morning-tiffin",
    label: "Morning tiffin",
    packageId: "tiffin-table",
    note: "Built for breakfast meetings and weekend family mornings.",
    flow: ["Idli + vada first", "Pongal and chutneys", "Filter coffee service"],
  },
  {
    id: "live-dosa",
    label: "Live dosa counter",
    packageId: "dosa-counter",
    note: "The highest-drama option when the griddle should be the room.",
    flow: ["Batter and masala prep", "Dosas fired to order", "Sambar rounds"],
  },
] as const;

function getPackage(packageId: CateringPackageId) {
  return cateringPackages.find((item) => item.id === packageId) ?? cateringPackages[0];
}

export function FeastPlanner() {
  const reduceMotion = useReducedMotion();
  const [eventTypeId, setEventTypeId] = useState<(typeof eventTypes)[number]["id"]>("office-lunch");
  const [guestCount, setGuestCount] = useState(36);
  const selectedEvent = eventTypes.find((item) => item.id === eventTypeId) ?? eventTypes[0];

  const plan = useMemo(() => {
    const recommendedPackage = getPackage(selectedEvent.packageId);
    const estimatedTrays = Math.max(1, Math.ceil(guestCount / 12));
    const cooks = guestCount >= 60 ? 3 : guestCount >= 36 ? 2 : 1;

    return {
      recommendedPackage,
      estimatedTrays,
      cooks,
      href: `/catering#request?package=${recommendedPackage.id}&guests=${guestCount}`,
    };
  }, [guestCount, selectedEvent.packageId]);

  return (
    <div className="feast-planner" aria-label="Interactive catering feast planner">
      <div className="planner-controls">
        <div>
          <span className="planner-label">Gathering type</span>
          <div className="planner-event-tabs" role="tablist" aria-label="Gathering type">
            {eventTypes.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                className={eventTypeId === item.id ? "active" : ""}
                role="tab"
                aria-selected={eventTypeId === item.id}
                onClick={() => setEventTypeId(item.id)}
                whileHover={{ scale: reduceMotion ? 1 : 1.025 }}
                whileTap={{ scale: reduceMotion ? 1 : 0.985 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE_SPRING }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="planner-guest-control">
          <div>
            <span className="planner-label">Guest count</span>
            <strong>{guestCount}</strong>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="2"
            value={guestCount}
            aria-label="Guest count"
            onChange={(event) => setGuestCount(Number(event.target.value))}
          />
          <div className="planner-stepper">
            <button type="button" onClick={() => setGuestCount((current) => Math.max(10, current - 10))}>
              -10
            </button>
            <button type="button" onClick={() => setGuestCount((current) => Math.min(120, current + 10))}>
              +10
            </button>
          </div>
        </div>
      </div>

      <MotionPresence>
        <motion.div
          key={`${selectedEvent.id}-${plan.recommendedPackage.id}-${guestCount}`}
          className="planner-result"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          transition={{ duration: reduceMotion ? 0 : 0.32, ease: EASE_OUT_EXPO }}
        >
          <div className="planner-package">
            <span>Recommended package</span>
            <h3>{plan.recommendedPackage.name}</h3>
            <p>{selectedEvent.note}</p>
          </div>

          <div className="planner-metrics" aria-label="Estimated catering plan">
            <div>
              <strong>{plan.estimatedTrays}</strong>
              <span>serving trays</span>
            </div>
            <div>
              <strong>{plan.cooks}</strong>
              <span>service lead{plan.cooks === 1 ? "" : "s"}</span>
            </div>
            <div>
              <strong>{guestCount}</strong>
              <span>guests planned</span>
            </div>
          </div>

          <ol className="planner-service-flow">
            {selectedEvent.flow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

          <div className="planner-actions">
            <MotionLink className="button button-primary" href={plan.href}>
              Plan this feast
            </MotionLink>
            <span>Opens the catering form with package and guest count prefilled.</span>
          </div>
        </motion.div>
      </MotionPresence>
    </div>
  );
}
