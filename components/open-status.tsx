"use client";

import { useEffect, useMemo, useState } from "react";
import { formatHour, holidayNotice, restaurantHours } from "@/lib/restaurant";

function minutesFromTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function getRestaurantNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Monday";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return { weekday, minutes: hour * 60 + minute };
}

export function OpenStatus() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((current) => current + 1), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const status = useMemo(() => {
    void tick;
    const now = getRestaurantNow();
    const todayIndex = restaurantHours.findIndex((item) => item.day === now.weekday);
    const today = restaurantHours[todayIndex] ?? restaurantHours[0];
    const open = minutesFromTime(today.open);
    const close = minutesFromTime(today.close);
    const isOpen = now.minutes >= open && now.minutes < close;

    if (isOpen) {
      return {
        label: "Open now",
        detail: `Closes at ${formatHour(today.close)} today.`,
        open: true,
      };
    }

    if (now.minutes < open) {
      return {
        label: "Closed now",
        detail: `Opens at ${formatHour(today.open)} today.`,
        open: false,
      };
    }

    const tomorrow = restaurantHours[(todayIndex + 1) % restaurantHours.length];
    return {
      label: "Closed now",
      detail: `Opens ${tomorrow.shortDay} at ${formatHour(tomorrow.open)}.`,
      open: false,
    };
  }, [tick]);

  return (
    <div className={status.open ? "open-status is-open" : "open-status"}>
      <span>{status.label}</span>
      <strong>{status.detail}</strong>
      {holidayNotice ? <small>{holidayNotice}</small> : null}
    </div>
  );
}

