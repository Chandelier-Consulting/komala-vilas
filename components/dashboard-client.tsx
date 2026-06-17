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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const configured = hasFirebaseClientConfig();

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const haystack = `${order.name} ${order.email} ${order.phone} ${order.packageName}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const statusCounts = useMemo(() => {
    return orderStatuses.reduce<Record<OrderStatus, number>>(
      (counts, status) => {
        counts[status] = orders.filter((order) => order.status === status).length;
        return counts;
      },
      {
        new: 0,
        contacted: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      },
    );
  }, [orders]);

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order.id === selectedId) ?? filteredOrders[0],
    [filteredOrders, selectedId],
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

  function exportOrdersCsv() {
    const header = ["Name", "Email", "Phone", "Package", "Date", "Guests", "Status"];
    const rows = filteredOrders.map((order) => [
      order.name,
      order.email,
      order.phone,
      order.packageName,
      order.eventDate,
      String(order.guestCount),
      order.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "komala-vilas-catering-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
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
        <div className="action-row">
          <button className="button button-secondary" type="button" onClick={exportOrdersCsv}>
            Export CSV
          </button>
          <button className="button button-secondary" type="button" onClick={() => window.print()}>
            Print order
          </button>
          <button className="button button-secondary" onClick={() => signOut(getFirebaseClientAuth())}>
            Sign out
          </button>
        </div>
      </div>

      <div className="dashboard-filters">
        <label>
          <span>Search</span>
          <input
            value={query}
            placeholder="Name, phone, email..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")}
          >
            <option value="all">All statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status} ({statusCounts[status]})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="status-counts" aria-label="Order status counts">
        {orderStatuses.map((status) => (
          <span key={status}>
            <strong>{statusCounts[status]}</strong> {status}
          </span>
        ))}
      </div>

      <div className="order-list">
        {filteredOrders.length === 0 && !isPending ? (
          <p>No catering orders yet.</p>
        ) : (
          filteredOrders.map((order) => (
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
