"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { hasFirebaseClientConfig, getFirebaseClientAuth } from "@/lib/firebase-client";
import { orderStatuses, type DashboardOrder, type OrderStatus } from "@/lib/orders";

export function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const configured = hasFirebaseClientConfig();

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? orders[0],
    [orders, selectedId],
  );

  useEffect(() => {
    if (!configured) return;
    const auth = getFirebaseClientAuth();
    return onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, [configured]);

  useEffect(() => {
    if (!user) return;
    startTransition(async () => {
      const token = await user.getIdToken();
      const response = await fetch("/api/dashboard/orders", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setMessage("Could not load catering orders.");
        return;
      }
      const body = await response.json();
      setOrders(body.orders ?? []);
      setSelectedId(body.orders?.[0]?.id ?? null);
    });
  }, [user]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await signInWithEmailAndPassword(getFirebaseClientAuth(), email, password);
    } catch {
      setMessage("Sign in failed. Check the Firebase Auth user.");
    }
  }

  function updateStatus(orderId: string, status: OrderStatus) {
    if (!user) return;
    startTransition(async () => {
      const token = await user.getIdToken();
      const response = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        setMessage("Status update failed.");
        return;
      }
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    });
  }

  if (!configured) {
    return (
      <div className="dashboard-empty">
        <h2 className="text-balance">Firebase dashboard configuration is missing.</h2>
        <p>
          Add `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
          and `NEXT_PUBLIC_FIREBASE_PROJECT_ID` to enable staff sign-in.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <form className="dashboard-login" onSubmit={signIn}>
        <h2 className="text-balance">Staff sign in</h2>
        <label>
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="button button-primary" type="submit">
          Open dashboard
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    );
  }

  return (
    <section className="dashboard-grid" aria-label="Catering orders dashboard">
      <div className="dashboard-toolbar">
        <div>
          <span>Signed in</span>
          <strong>{user.email}</strong>
        </div>
        <button className="button button-secondary" onClick={() => signOut(getFirebaseClientAuth())}>
          Sign out
        </button>
      </div>

      <div className="order-list">
        {orders.length === 0 && !isPending ? (
          <p>No catering orders yet.</p>
        ) : (
          orders.map((order) => (
            <button
              key={order.id}
              className={selectedOrder?.id === order.id ? "order-row active" : "order-row"}
              onClick={() => setSelectedId(order.id)}
            >
              <strong>{order.name}</strong>
              <span>{order.packageName}</span>
              <small>{order.eventDate} · {order.guestCount} guests</small>
            </button>
          ))
        )}
      </div>

      <div className="order-detail">
        {selectedOrder ? (
          <>
            <div className="order-detail-heading">
              <div>
                <span>{selectedOrder.status}</span>
                <h2 className="text-balance">{selectedOrder.packageName}</h2>
              </div>
              <select
                value={selectedOrder.status}
                onChange={(event) =>
                  updateStatus(selectedOrder.id, event.target.value as OrderStatus)
                }
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <dl>
              <div><dt>Contact</dt><dd>{selectedOrder.name}</dd></div>
              <div><dt>Email</dt><dd>{selectedOrder.email}</dd></div>
              <div><dt>Phone</dt><dd>{selectedOrder.phone}</dd></div>
              <div><dt>Date</dt><dd>{selectedOrder.eventDate}</dd></div>
              <div><dt>Window</dt><dd>{selectedOrder.pickupWindow}</dd></div>
              <div><dt>Guests</dt><dd>{selectedOrder.guestCount}</dd></div>
              <div><dt>Notes</dt><dd>{selectedOrder.notes || "None"}</dd></div>
            </dl>
          </>
        ) : (
          <p>Select an order to see details.</p>
        )}
      </div>
      {message ? <p className="form-message">{message}</p> : null}
    </section>
  );
}
