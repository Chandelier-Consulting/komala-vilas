"use client";

import { useState, useTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cateringPackages, type CateringOrderInput } from "@/lib/orders";
import { EASE_SPRING } from "@/lib/variants";

type FieldErrors = Partial<Record<keyof CateringOrderInput, string>>;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "25",
  packageId: "temple-feast",
  pickupWindow: "",
  notes: "",
};

export function CateringEstimator() {
  const [guestCount, setGuestCount] = useState("25");
  const guests = Math.max(10, Number.parseInt(guestCount, 10) || 10);
  const bestPackage =
    [...cateringPackages]
      .sort((a, b) => a.minGuests - b.minGuests)
      .find((item) => guests <= item.minGuests + 20) ?? cateringPackages[cateringPackages.length - 1];
  const trays = Math.max(1, Math.ceil(guests / 12));

  return (
    <div className="catering-estimator" aria-label="Catering quantity estimator">
      <label>
        <span>Serves calculator</span>
        <input
          type="number"
          min="10"
          value={guestCount}
          onChange={(event) => setGuestCount(event.target.value)}
        />
      </label>
      <p>
        Start with <strong>{bestPackage.name}</strong> for {guests} guests.
        Plan roughly <strong>{trays}</strong> serving tray{trays === 1 ? "" : "s"} before
        the kitchen confirms the final menu.
      </p>
      <small>Pickup is standard. Delivery is confirmed case by case.</small>
    </div>
  );
}

export function CateringOrderForm() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrors({});

    startTransition(async () => {
      const response = await fetch("/api/catering-orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json();

      if (!response.ok) {
        setErrors(body.errors ?? {});
        setMessage("Please fix the highlighted fields.");
        return;
      }

      setForm(initialForm);
      setMessage(
        `Order ${body.orderId} received. Komala Vilas will confirm the menu and pickup window.`,
      );
    });
  }

  return (
    <form className="order-form" onSubmit={submitOrder}>
      <div className="order-form-heading">
        <div>
          <span>Request details</span>
          <h3 className="text-balance">Tell us what the kitchen should prepare.</h3>
        </div>
        <p>Response by phone or email after staff confirms timing and quantity.</p>
      </div>

      <section className="form-section" aria-labelledby="contact-section-title">
        <div className="form-section-title">
          <span>01</span>
          <h4 id="contact-section-title">Contact</h4>
        </div>
        <div className="form-grid">
          <label>
            <span>Name</span>
            <input
              name="name"
              placeholder="Priya Raman"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {errors.name ? <em>{errors.name}</em> : null}
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="priya@example.com"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
            {errors.email ? <em>{errors.email}</em> : null}
          </label>
          <label>
            <span>Phone</span>
            <input
              name="phone"
              placeholder="(408) 733-7400"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            {errors.phone ? <em>{errors.phone}</em> : null}
          </label>
        </div>
      </section>

      <section className="form-section" aria-labelledby="event-section-title">
        <div className="form-section-title">
          <span>02</span>
          <h4 id="event-section-title">Event</h4>
        </div>
        <div className="form-grid">
          <label>
            <span>Event date</span>
            <input
              name="eventDate"
              type="date"
              value={form.eventDate}
              onChange={(event) => updateField("eventDate", event.target.value)}
            />
            {errors.eventDate ? <em>{errors.eventDate}</em> : null}
          </label>
          <label>
            <span>Guests</span>
            <input
              name="guestCount"
              type="number"
              min="10"
              value={form.guestCount}
              onChange={(event) => updateField("guestCount", event.target.value)}
            />
            {errors.guestCount ? <em>{errors.guestCount}</em> : null}
          </label>
          <label className="wide-field">
            <span>Pickup / delivery window</span>
            <input
              name="pickupWindow"
              value={form.pickupWindow}
              placeholder="Saturday, 11:30 AM"
              onChange={(event) => updateField("pickupWindow", event.target.value)}
            />
            {errors.pickupWindow ? <em>{errors.pickupWindow}</em> : null}
          </label>
        </div>
      </section>

      <fieldset className="form-section">
        <div className="form-section-title">
          <span>03</span>
          <legend>Package</legend>
        </div>
        <div className="package-choice-grid">
          {cateringPackages.map((item) => (
            <motion.label
              key={item.id}
              className={form.packageId === item.id ? "package-choice active" : "package-choice"}
              whileHover={{
                scale: reduceMotion ? 1 : 1.02,
                transition: { duration: reduceMotion ? 0 : 0.22, ease: EASE_SPRING },
              }}
              whileTap={{
                scale: reduceMotion ? 1 : 0.985,
                transition: { duration: reduceMotion ? 0 : 0.2, ease: EASE_SPRING },
              }}
            >
              <input
                type="radio"
                name="packageId"
                value={item.id}
                checked={form.packageId === item.id}
                onChange={(event) => updateField("packageId", event.target.value)}
              />
              <span className="package-choice-copy">
                <strong>{item.name}</strong>
                <span>{item.serves}</span>
              </span>
            </motion.label>
          ))}
        </div>
        {errors.packageId ? <em>{errors.packageId}</em> : null}
      </fieldset>

      <section className="form-section" aria-labelledby="notes-section-title">
        <div className="form-section-title">
          <span>04</span>
          <h4 id="notes-section-title">Kitchen notes</h4>
        </div>
        <label>
          <span>Notes for the kitchen</span>
          <textarea
            name="notes"
            placeholder="Jain-friendly request, extra chutney, delivery notes, serving style..."
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </label>
      </section>

      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={isPending}>
          {isPending ? "Sending order" : "Send catering order"}
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </div>
    </form>
  );
}
