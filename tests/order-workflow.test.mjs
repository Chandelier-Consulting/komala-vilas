import test from "node:test";
import assert from "node:assert/strict";

test("validateCateringOrder normalizes a valid catering request", async () => {
  const { validateCateringOrder } = await import("../lib/orders.ts");

  const result = validateCateringOrder({
    name: "  Priya Raman  ",
    email: "PRIYA@example.com ",
    phone: " (408) 733-7400 ",
    eventDate: "2026-08-15",
    guestCount: "42",
    packageId: "temple-feast",
    pickupWindow: "11:30 AM",
    notes: "Need extra coconut chutney.",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.order, {
    name: "Priya Raman",
    email: "priya@example.com",
    phone: "(408) 733-7400",
    eventDate: "2026-08-15",
    guestCount: 42,
    packageId: "temple-feast",
    packageName: "Temple Feast",
    pickupWindow: "11:30 AM",
    notes: "Need extra coconut chutney.",
    status: "new",
  });
});

test("validateCateringOrder returns field errors for invalid requests", async () => {
  const { validateCateringOrder } = await import("../lib/orders.ts");

  const result = validateCateringOrder({
    name: "",
    email: "not-email",
    phone: "",
    eventDate: "soon",
    guestCount: "2",
    packageId: "unknown",
    pickupWindow: "",
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, {
    name: "Enter a contact name.",
    email: "Enter a valid email.",
    phone: "Enter a phone number.",
    eventDate: "Choose an event date.",
    guestCount: "Catering starts at 10 guests.",
    packageId: "Choose a catering package.",
    pickupWindow: "Enter a pickup or delivery window.",
  });
});

test("isValidOrderStatus only accepts dashboard status values", async () => {
  const { isValidOrderStatus } = await import("../lib/orders.ts");

  assert.equal(isValidOrderStatus("new"), true);
  assert.equal(isValidOrderStatus("contacted"), true);
  assert.equal(isValidOrderStatus("confirmed"), true);
  assert.equal(isValidOrderStatus("completed"), true);
  assert.equal(isValidOrderStatus("cancelled"), true);
  assert.equal(isValidOrderStatus("refunded"), false);
});
