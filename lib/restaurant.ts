export const restaurantInfo = {
  name: "Komala Vilas",
  tamilName: "கோமளா விலாஸ்",
  tagline: "Sunnyvale · South Indian",
  phone: "(408) 733-7400",
  phoneHref: "tel:+14087337400",
  address: "1020 E El Camino Real, Sunnyvale, CA 94087",
  shortAddress: "1020 E El Camino Real, Sunnyvale",
  mapUrl:
    "https://www.google.com/maps/place/Komala+Vilas/@37.3531031,-122.0116365,15.64z/data=!4m6!3m5!1s0x808fb589fd36ead1:0x86106cdc3661185f!8m2!3d37.351395!4d-122.006376!16s%2Fg%2F1tf65qdg?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D",
  feedbackEmail: "mailto:komalavilas.sunnyvale@gmail.com?subject=Komala%20Vilas%20feedback",
  orderLinks: [
    {
      label: "Call to order",
      href: "tel:+14087337400",
      note: "Best for pickup, thali availability, and same-day questions.",
    },
    {
      label: "Catering request",
      href: "/catering",
      note: "Office meals, family functions, and dosa counters.",
    },
    {
      label: "Directions",
      href:
        "https://www.google.com/maps/place/Komala+Vilas/@37.3531031,-122.0116365,15.64z/data=!4m6!3m5!1s0x808fb589fd36ead1:0x86106cdc3661185f!8m2!3d37.351395!4d-122.006376!16s%2Fg%2F1tf65qdg?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D",
      note: "Open maps for pickup routing.",
    },
  ],
} as const;

export const restaurantHours = [
  { day: "Sunday", shortDay: "Sun", open: "08:30", close: "21:30" },
  { day: "Monday", shortDay: "Mon", open: "08:30", close: "21:30" },
  { day: "Tuesday", shortDay: "Tue", open: "08:30", close: "21:30" },
  { day: "Wednesday", shortDay: "Wed", open: "08:30", close: "21:30" },
  { day: "Thursday", shortDay: "Thu", open: "08:30", close: "21:30" },
  { day: "Friday", shortDay: "Fri", open: "08:30", close: "22:00" },
  { day: "Saturday", shortDay: "Sat", open: "08:30", close: "22:00" },
] as const;

export const holidayNotice = process.env.NEXT_PUBLIC_HOLIDAY_NOTICE ?? "";

export function formatHour(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

