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
  pickupLinks: [
    {
      label: "DoorDash",
      href: "https://www.doordash.com/store/komala-vilas-sunnyvale-93323/597973/?pickup=true&rwg_token=AE37R_hW6e3xOhg3manNQD_oxcemsThoZf7PLfD4zXdh3TksMp0m4Iz1fPK4Pl-OXBJA3IMxjDV_MJcO5BuRW807rkmtBqYIOg==&utm_campaign=gpa",
      note: "Pickup ordering through DoorDash.",
    },
    {
      label: "Uber Eats",
      href: "https://www.ubereats.com/store/komala-vilas/X2yPJIFVS0C2w-1_02HDrw?diningMode=PICKUP&utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas&rwg_token=AE37R_jFcuMSukoZiIjSen4oc-ZlfO1_qdYCHWd7hjxB_11cuhxI06BjzxWnV2oA_lrR46f1CijcJprlZMOZPOUq1tQC8rvWsw%3D%3D",
      note: "Pickup ordering through Uber Eats.",
    },
    {
      label: "Grubhub",
      href: "https://www.grubhub.com/restaurant/komala-vilas-1020-e-el-camino-real-sunnyvale/1701739?utm_source=google&utm_medium=organic&utm_campaign=place-action-link&pickup=true&rwg_token=AE37R_jxLmARhtPURTjlwIKYI6CWZvzBetAYbqECfCk2-QVLOVdPUtxnufITvuhXPu4nnAid_Iu1DgQWxYV7XTN7k2q4M_vMUw%3D%3D",
      note: "Pickup ordering through Grubhub.",
    },
  ],
  orderLinks: [
    {
      label: "Order online",
      href: "https://www.doordash.com/store/komala-vilas-sunnyvale-93323/597973/?pickup=true&rwg_token=AE37R_hW6e3xOhg3manNQD_oxcemsThoZf7PLfD4zXdh3TksMp0m4Iz1fPK4Pl-OXBJA3IMxjDV_MJcO5BuRW807rkmtBqYIOg==&utm_campaign=gpa",
      note: "Direct pickup ordering for the Sunnyvale restaurant.",
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
