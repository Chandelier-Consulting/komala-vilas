export const cateringPackages = [
  {
    id: "temple-feast",
    name: "Temple Feast",
    description:
      "A complete South Indian vegetarian spread with dosa batter service, rice, sambar, rasam, poriyal, kootu, chutneys, sweet, and curd rice.",
    serves: "25+ guests",
    minGuests: 25,
  },
  {
    id: "tiffin-table",
    name: "Tiffin Table",
    description:
      "Idli, medu vada, pongal, chutneys, sambar, mini dosa batter, and filter coffee service for morning and early afternoon events.",
    serves: "15+ guests",
    minGuests: 15,
  },
  {
    id: "dosa-counter",
    name: "Dosa Counter",
    description:
      "Crisp dosa, masala filling, sambar, coconut chutney, tomato chutney, and rotating chef specials for a focused live-station style menu.",
    serves: "30+ guests",
    minGuests: 30,
  },
] as const;

export const orderStatuses = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type CateringPackageId = (typeof cateringPackages)[number]["id"];
export type OrderStatus = (typeof orderStatuses)[number];

export type CateringOrderInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  eventDate?: unknown;
  guestCount?: unknown;
  packageId?: unknown;
  pickupWindow?: unknown;
  notes?: unknown;
};

export type CateringOrder = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  packageId: CateringPackageId;
  packageName: string;
  pickupWindow: string;
  notes: string;
  status: OrderStatus;
};

export type DashboardOrder = CateringOrder & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

type OrderErrors = Partial<Record<keyof CateringOrderInput, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidOrderStatus(status: unknown): status is OrderStatus {
  return (
    typeof status === "string" &&
    orderStatuses.includes(status as OrderStatus)
  );
}

export function getCateringPackage(packageId: unknown) {
  return cateringPackages.find((item) => item.id === packageId);
}

export function validateCateringOrder(input: CateringOrderInput):
  | { ok: true; order: CateringOrder }
  | { ok: false; errors: OrderErrors } {
  const name = asText(input.name);
  const email = asText(input.email).toLowerCase();
  const phone = asText(input.phone);
  const eventDate = asText(input.eventDate);
  const packageId = asText(input.packageId);
  const pickupWindow = asText(input.pickupWindow);
  const notes = asText(input.notes);
  const guestCount = Number.parseInt(asText(input.guestCount), 10);
  const selectedPackage = getCateringPackage(packageId);
  const errors: OrderErrors = {};

  if (!name) errors.name = "Enter a contact name.";
  if (!emailPattern.test(email)) errors.email = "Enter a valid email.";
  if (!phone) errors.phone = "Enter a phone number.";
  if (!datePattern.test(eventDate)) errors.eventDate = "Choose an event date.";
  if (!Number.isFinite(guestCount) || guestCount < 10) {
    errors.guestCount = "Catering starts at 10 guests.";
  }
  if (!selectedPackage) errors.packageId = "Choose a catering package.";
  if (!pickupWindow) {
    errors.pickupWindow = "Enter a pickup or delivery window.";
  }

  if (Object.keys(errors).length > 0 || !selectedPackage) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    order: {
      name,
      email,
      phone,
      eventDate,
      guestCount,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      pickupWindow,
      notes,
      status: "new",
    },
  };
}
