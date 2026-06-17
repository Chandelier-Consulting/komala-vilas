"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
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

function getValidPackageId(packageId: string | null) {
  return cateringPackages.find((item) => item.id === packageId)?.id ?? initialForm.packageId;
}

function getValidGuestCount(guestCount: string | null) {
  const parsedGuests = Number.parseInt(guestCount ?? "", 10);
  return Number.isFinite(parsedGuests) && parsedGuests >= 10
    ? String(parsedGuests)
    : initialForm.guestCount;
}

function getRequestSelectionFromHash(hash: string) {
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return null;

  const params = new URLSearchParams(hash.slice(queryStart + 1));
  return getRequestSelectionFromParams(params);
}

function getRequestSelectionFromHref(href: string) {
  const hashStart = href.indexOf("#request?");
  if (hashStart === -1) return null;

  return getRequestSelectionFromHash(href.slice(hashStart));
}

function getRequestSelectionFromParams(params: URLSearchParams) {
  return {
    packageId: getValidPackageId(params.get("package")),
    guestCount: getValidGuestCount(params.get("guests")),
  };
}

export function CateringEstimator() {
  const [guestCount, setGuestCount] = useState(initialForm.guestCount);
  const guests = Math.max(10, Number.parseInt(guestCount, 10) || 10);
  const bestPackage =
    [...cateringPackages]
      .sort((a, b) => b.minGuests - a.minGuests)
      .find((item) => guests >= item.minGuests) ?? cateringPackages[0];
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
      <div className="estimator-actions">
        <Link
          className="button button-primary"
          href={`#request?package=${bestPackage.id}&guests=${guests}`}
        >
          Use this estimate
        </Link>
      </div>
      <small>Pickup is standard. Delivery is confirmed case by case.</small>
    </div>
  );
}

export function CateringOrderForm() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [isPending, startTransition] = useTransition();

  function applyRequestSelection(
    selection: ReturnType<typeof getRequestSelectionFromHash> = getRequestSelectionFromHash(
      window.location.hash,
    ),
  ) {
    if (!selection) return;

    setForm((current) => ({ ...current, ...selection }));
    setConfirmationId("");
    setMessage("");
    window.history.replaceState(null, "", "#request");
    document.getElementById("request")?.scrollIntoView({ block: "start" });
  }

  useEffect(() => {
    function handleRequestLinkClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href*="#request?"]');
      if (!link) return;

      const selection = getRequestSelectionFromHref(link.href);
      if (!selection) return;

      event.preventDefault();
      applyRequestSelection(selection);
    }

    function handleHashChange() {
      applyRequestSelection();
    }

    const frame = window.requestAnimationFrame(() => applyRequestSelection());
    document.addEventListener("click", handleRequestLinkClick);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("click", handleRequestLinkClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmationId("");
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
      setConfirmationId(body.orderId);
    });
  }

  if (confirmationId) {
    return (
      <section id="request" className="order-form order-confirmation" aria-live="polite">
        <div className="order-form-heading">
          <div>
            <span>Request received</span>
            <h3 className="text-balance">The Komala Vilas team has your catering request.</h3>
          </div>
          <p>Order reference: {confirmationId}</p>
        </div>
        <div className="confirmation-copy">
          <p>
            A team member should reach out within 1 - 2 business days to confirm the
            menu, guest count, timing, and pickup or delivery details.
          </p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              setConfirmationId("");
              setForm(initialForm);
              setErrors({});
              setMessage("");
            }}
          >
            Send another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <form id="request" className="order-form" onSubmit={submitOrder}>
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
