"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { MotionDiv, MotionSection } from "@/components/motion-shell";
import { hasFirebaseClientConfig, getFirebaseClientAuth } from "@/lib/firebase-client";
import { flattenMenuItems, type MenuSection } from "@/lib/menu";
import { defaultSitePhotoSlots, type SitePhotoSlot } from "@/lib/site-photos";
import type { ImageAsset } from "@/lib/content";
import { orderStatuses, type DashboardOrder, type OrderStatus } from "@/lib/orders";

type DashboardTab = "orders" | "menu" | "photos";

type MenuPayload = {
  sections: MenuSection[];
  assets: Record<string, ImageAsset>;
};

type PhotoPayload = {
  assets: Record<string, ImageAsset>;
  slots: Record<string, SitePhotoSlot>;
};

type AssetUploadResponse = {
  assetId?: string;
  error?: string;
};

const tabs: Array<{ id: DashboardTab; label: string; detail: string }> = [
  { id: "orders", label: "Orders", detail: "Catering requests, statuses, and export." },
  { id: "menu", label: "Menu", detail: "Live menu items and image assignments." },
  { id: "photos", label: "Photos", detail: "Website image slots and uploads." },
];

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function getImagePreviewDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      resolve({ width: image.naturalWidth || 1200, height: image.naturalHeight || 900 });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      resolve({ width: 1200, height: 900 });
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}

function toMenuForm(item: ReturnType<typeof flattenMenuItems>[number]) {
  return {
    name: item.name,
    description: item.description,
    price: item.price,
    tags: item.tags.join(", "),
    popular: Boolean(item.popular),
    cateringFriendly: Boolean(item.cateringFriendly),
    imageAssetId: item.image.assetId,
  };
}

export function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("orders");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [menuAssets, setMenuAssets] = useState<Record<string, ImageAsset>>({});
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
    popular: false,
    cateringFriendly: false,
    imageAssetId: "",
  });
  const [photoAssets, setPhotoAssets] = useState<Record<string, ImageAsset>>({});
  const [photoSlots, setPhotoSlots] = useState<Record<string, SitePhotoSlot>>(defaultSitePhotoSlots);
  const [selectedSlotId, setSelectedSlotId] = useState("home-hero");
  const [selectedSlotAssetId, setSelectedSlotAssetId] = useState("");
  const [menuImageFile, setMenuImageFile] = useState<File | null>(null);
  const [menuImageLabel, setMenuImageLabel] = useState("");
  const [menuImageAlt, setMenuImageAlt] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [assetEditId, setAssetEditId] = useState("");
  const [assetEditLabel, setAssetEditLabel] = useState("");
  const [assetEditAlt, setAssetEditAlt] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const configured = hasFirebaseClientConfig();
  const selectedMenuItemIdRef = useRef(selectedMenuItemId);
  const selectedSlotIdRef = useRef(selectedSlotId);

  const flattenedMenuItems = useMemo(() => flattenMenuItems(menuSections), [menuSections]);

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

  const selectedMenuItem = useMemo(
    () => flattenedMenuItems.find((item) => item.id === selectedMenuItemId) ?? flattenedMenuItems[0],
    [flattenedMenuItems, selectedMenuItemId],
  );

  const selectedSlot = photoSlots[selectedSlotId] ?? photoSlots["home-hero"];

  useEffect(() => {
    selectedMenuItemIdRef.current = selectedMenuItemId;
  }, [selectedMenuItemId]);

  useEffect(() => {
    selectedSlotIdRef.current = selectedSlotId;
  }, [selectedSlotId]);

  useEffect(() => {
    if (!configured) return;
    const auth = getFirebaseClientAuth();
    return onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, [configured]);

  useEffect(() => {
    if (!user) return;

    startTransition(async () => {
      try {
        const token = await user.getIdToken();
        const headers = { authorization: `Bearer ${token}` };
        const [ordersResponse, menuResponse, photosResponse] = await Promise.all([
          fetch("/api/dashboard/orders", { headers }),
          fetch("/api/dashboard/menu", { headers }),
          fetch("/api/dashboard/site-photos", { headers }),
        ]);

        if (!ordersResponse.ok || !menuResponse.ok || !photosResponse.ok) {
          throw new Error("Could not load the full staff dashboard.");
        }

        const ordersBody = (await ordersResponse.json()) as { orders?: DashboardOrder[] };
        const menuBody = (await menuResponse.json()) as MenuPayload;
        const photosBody = (await photosResponse.json()) as PhotoPayload;

        setOrders(ordersBody.orders ?? []);
        setSelectedId((current) => current ?? ordersBody.orders?.[0]?.id ?? null);
        setMenuAssets(menuBody.assets ?? {});

        const nextSections = menuBody.sections ?? [];
        const nextItems = flattenMenuItems(nextSections);
        const nextMenuItem =
          nextItems.find((item) => item.id === selectedMenuItemIdRef.current) ?? nextItems[0];

        setMenuSections(nextSections);
        setSelectedMenuItemId(nextMenuItem?.id ?? "");
        if (nextMenuItem) {
          setMenuForm(toMenuForm(nextMenuItem));
        }

        const nextSlots = photosBody.slots ?? defaultSitePhotoSlots;
        const nextAssets = photosBody.assets ?? {};
        const nextSlot =
          nextSlots[selectedSlotIdRef.current] ?? nextSlots["home-hero"] ?? Object.values(nextSlots)[0];

        setPhotoAssets(nextAssets);
        setPhotoSlots(nextSlots);
        setSelectedSlotId(nextSlot?.id ?? "home-hero");
        setSelectedSlotAssetId(nextSlot?.image.assetId ?? "");

        if (assetEditId && nextAssets[assetEditId]?.kind === "uploaded") {
          setAssetEditLabel(nextAssets[assetEditId].label);
          setAssetEditAlt(nextAssets[assetEditId].alt);
        }

        setMessage("");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not load the staff dashboard."));
      }
    });
  }, [assetEditId, configured, user]);

  async function withToken<T>(callback: (token: string) => Promise<T>) {
    if (!user) throw new Error("Sign in required.");
    const token = await user.getIdToken();
    return callback(token);
  }

  function getMenuItemPayload(imageAssetId = menuForm.imageAssetId) {
    return {
      name: menuForm.name,
      description: menuForm.description,
      price: menuForm.price,
      tags: menuForm.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      popular: menuForm.popular,
      cateringFriendly: menuForm.cateringFriendly,
      imageAssetId,
    };
  }

  async function createUploadedImageAsset(
    token: string,
    file: File,
    label: string,
    alt: string,
  ) {
    const dimensions = await getImagePreviewDimensions(file);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("label", label || file.name.replace(/\.[a-z0-9]+$/i, ""));
    formData.set("alt", alt || label || file.name.replace(/\.[a-z0-9]+$/i, ""));
    formData.set("width", String(dimensions.width));
    formData.set("height", String(dimensions.height));

    const response = await fetch("/api/dashboard/images", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const body = (await response.json().catch(() => null)) as AssetUploadResponse | null;

    if (!response.ok || !body?.assetId) {
      throw new Error(body?.error ?? "Image upload failed.");
    }

    return body.assetId;
  }

  function selectMenuItem(itemId: string) {
    const nextSelectedItem = flattenedMenuItems.find((item) => item.id === itemId);
    setSelectedMenuItemId(itemId);
    setMenuImageFile(null);
    setMenuImageLabel(nextSelectedItem?.name ?? "");
    setMenuImageAlt(nextSelectedItem?.name ?? "");
    if (nextSelectedItem) {
      setMenuForm(toMenuForm(nextSelectedItem));
    }
  }

  function selectPhotoSlot(slotId: string) {
    const nextSlot = photoSlots[slotId];
    setSelectedSlotId(slotId);
    if (nextSlot) {
      setSelectedSlotAssetId(nextSlot.image.assetId);
    }
  }

  function selectEditableAsset(nextAssetId: string) {
    const nextAsset =
      nextAssetId && photoAssets[nextAssetId]?.kind === "uploaded" ? photoAssets[nextAssetId] : null;

    setAssetEditId(nextAssetId);
    setAssetEditLabel(nextAsset?.label ?? "");
    setAssetEditAlt(nextAsset?.alt ?? "");
  }

  async function refreshMenuAndPhotos() {
    await withToken(async (token) => {
      const headers = { authorization: `Bearer ${token}` };
      const [menuResponse, photosResponse] = await Promise.all([
        fetch("/api/dashboard/menu", { headers }),
        fetch("/api/dashboard/site-photos", { headers }),
      ]);

      if (!menuResponse.ok || !photosResponse.ok) {
        throw new Error("Could not refresh menu and photo content.");
      }

      const menuBody = (await menuResponse.json()) as MenuPayload;
      const photosBody = (await photosResponse.json()) as PhotoPayload;
      setMenuAssets(menuBody.assets ?? {});

      const nextSections = menuBody.sections ?? [];
      const nextItems = flattenMenuItems(nextSections);
      const nextMenuItem =
        nextItems.find((item) => item.id === selectedMenuItemIdRef.current) ?? nextItems[0];

      setMenuSections(nextSections);
      setSelectedMenuItemId(nextMenuItem?.id ?? "");
      if (nextMenuItem) {
        setMenuForm(toMenuForm(nextMenuItem));
      }

      const nextSlots = photosBody.slots ?? defaultSitePhotoSlots;
      const nextAssets = photosBody.assets ?? {};
      const nextSlot =
        nextSlots[selectedSlotIdRef.current] ?? nextSlots["home-hero"] ?? Object.values(nextSlots)[0];

      setPhotoAssets(nextAssets);
      setPhotoSlots(nextSlots);
      setSelectedSlotId(nextSlot?.id ?? "home-hero");
      setSelectedSlotAssetId(nextSlot?.image.assetId ?? "");

      if (assetEditId && nextAssets[assetEditId]?.kind === "uploaded") {
        setAssetEditLabel(nextAssets[assetEditId].label);
        setAssetEditAlt(nextAssets[assetEditId].alt);
      }
    });
  }

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await signInWithEmailAndPassword(getFirebaseClientAuth(), email, password);
    } catch {
      setMessage("Sign in failed. Check the Firebase Auth staff user.");
    }
  }

  function updateStatus(orderId: string, status: OrderStatus) {
    if (!user) return;

    startTransition(async () => {
      try {
        await withToken(async (token) => {
          const response = await fetch(`/api/dashboard/orders/${orderId}`, {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({ status }),
          });

          if (!response.ok) throw new Error("Status update failed.");
        });

        setOrders((current) =>
          current.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        );
        setMessage("Order status updated.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Status update failed."));
      }
    });
  }

  async function saveMenuItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMenuItem) return;

    startTransition(async () => {
      try {
        await withToken(async (token) => {
          const response = await fetch(`/api/dashboard/menu/${selectedMenuItem.id}`, {
            method: "PUT",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify(getMenuItemPayload()),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.error ?? "Could not save the menu item.");
          }
        });

        await refreshMenuAndPhotos();
        setMessage("Menu item saved.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not save the menu item."));
      }
    });
  }

  async function savePhotoSlot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) return;

    startTransition(async () => {
      try {
        await withToken(async (token) => {
          const response = await fetch(`/api/dashboard/site-photos/${selectedSlot.id}`, {
            method: "PUT",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({ assetId: selectedSlotAssetId }),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.error ?? "Could not update the website photo.");
          }
        });

        await refreshMenuAndPhotos();
        setMessage("Website photo updated.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not update the website photo."));
      }
    });
  }

  async function uploadImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uploadFile) {
      setMessage("Choose an image before uploading.");
      return;
    }

    startTransition(async () => {
      try {
        await withToken(async (token) => {
          await createUploadedImageAsset(token, uploadFile, uploadLabel, uploadAlt);
        });

        setUploadFile(null);
        setUploadLabel("");
        setUploadAlt("");
        await refreshMenuAndPhotos();
        setMessage("Image uploaded.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Image upload failed."));
      }
    });
  }

  function uploadMenuItemImage() {
    if (!selectedMenuItem) return;
    if (!menuImageFile) {
      setMessage("Choose a custom image before uploading.");
      return;
    }

    startTransition(async () => {
      try {
        const uploadedAssetId = await withToken(async (token) => {
          const assetId = await createUploadedImageAsset(
            token,
            menuImageFile,
            menuImageLabel || selectedMenuItem.name,
            menuImageAlt || menuImageLabel || selectedMenuItem.name,
          );

          const response = await fetch(`/api/dashboard/menu/${selectedMenuItem.id}`, {
            method: "PUT",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify(getMenuItemPayload(assetId)),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.error ?? "Could not assign the custom menu image.");
          }

          return assetId;
        });

        setMenuForm((current) => ({ ...current, imageAssetId: uploadedAssetId }));
        setMenuImageFile(null);
        setMenuImageLabel(selectedMenuItem.name);
        setMenuImageAlt(selectedMenuItem.name);
        await refreshMenuAndPhotos();
        setMessage("Custom image uploaded and assigned to this menu item.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not upload the custom menu image."));
      }
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

  async function saveAssetMetadata(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assetEditId) return;

    startTransition(async () => {
      try {
        await withToken(async (token) => {
          const response = await fetch(`/api/dashboard/images/${assetEditId}`, {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              label: assetEditLabel,
              alt: assetEditAlt,
              status: photoAssets[assetEditId]?.status ?? "active",
            }),
          });

          if (!response.ok) {
            throw new Error("Could not update image details.");
          }
        });

        await refreshMenuAndPhotos();
        setMessage("Image details updated.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not update image details."));
      }
    });
  }

  function toggleAssetStatus(assetId: string) {
    startTransition(async () => {
      try {
        await withToken(async (token) => {
          const response = await fetch(`/api/dashboard/images/${assetId}`, {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              status: photoAssets[assetId]?.status === "archived" ? "active" : "archived",
            }),
          });

          if (!response.ok) throw new Error("Could not update the image status.");
        });

        await refreshMenuAndPhotos();
        setMessage("Image library updated.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not update the image status."));
      }
    });
  }

  function pruneUnusedImages() {
    startTransition(async () => {
      try {
        const result = await withToken(async (token) => {
          const response = await fetch("/api/dashboard/images/prune", {
            method: "POST",
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          const body = (await response.json().catch(() => null)) as
            | { deletedCount?: number; error?: string }
            | null;

          if (!response.ok) {
            throw new Error(body?.error ?? "Could not prune unused images.");
          }

          return body?.deletedCount ?? 0;
        });

        await refreshMenuAndPhotos();
        setMessage(
          result > 0
            ? `Pruned ${result} unused uploaded image${result === 1 ? "" : "s"}.`
            : "No unused uploaded images to prune.",
        );
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not prune unused images."));
      }
    });
  }

  if (!configured) {
    return (
      <div className="dashboard-empty">
        <h2 className="text-balance">Firebase dashboard configuration is missing.</h2>
        <p>
          Add `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
          `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID` to enable staff sign-in.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <form className="dashboard-login" onSubmit={signIn}>
        <h2 className="text-balance">Staff sign in</h2>
        <p>Use the Firebase Auth staff account. After sign-in you can manage orders, menu items, and website photos.</p>
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
    <section className="dashboard-shell" aria-label="Staff dashboard">
      <MotionDiv className="dashboard-overview-card">
        <div>
          <p className="eyebrow">Komala Vilas staff</p>
          <h2 className="text-balance">One place to run catering, menu items, and photos.</h2>
          <p>
            Keep the public menu current, replace website images, and move catering requests through the kitchen workflow.
          </p>
        </div>
        <div className="dashboard-overview-stats">
          <span><strong>{orders.length}</strong> total orders</span>
          <span><strong>{flattenedMenuItems.length}</strong> menu items</span>
          <span><strong>{Object.keys(photoAssets).length}</strong> image assets</span>
        </div>
      </MotionDiv>

      <MotionDiv className="dashboard-toolbar">
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
          <button
            className="button button-secondary"
            type="button"
            onClick={() => signOut(getFirebaseClientAuth())}
          >
            Sign out
          </button>
        </div>
      </MotionDiv>

      <MotionDiv className="dashboard-tab-bar" role="tablist" aria-label="Dashboard surfaces">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            <strong>{tab.label}</strong>
            <span>{tab.detail}</span>
          </button>
        ))}
      </MotionDiv>

      {activeTab === "orders" ? (
        <MotionSection className="dashboard-grid" labelledBy="dashboard-orders-title">
          <h2 id="dashboard-orders-title" className="sr-only">
            Catering orders dashboard
          </h2>
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

          <div className="dashboard-panel order-list">
            <div className="dashboard-panel-heading">
              <h3>Incoming catering</h3>
              <span>{filteredOrders.length} shown</span>
            </div>
            {filteredOrders.length === 0 && !isPending ? (
              <p>No catering orders yet.</p>
            ) : (
              filteredOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
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

          <div className="dashboard-panel order-detail">
            {selectedOrder ? (
              <>
                <div className="order-detail-heading">
                  <div>
                    <span>{selectedOrder.status}</span>
                    <h2 className="text-balance">{selectedOrder.packageName}</h2>
                    <p>{selectedOrder.eventDate} · {selectedOrder.guestCount} guests</p>
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
        </MotionSection>
      ) : null}

      {activeTab === "menu" ? (
        <MotionSection className="dashboard-grid dashboard-content-grid" labelledBy="dashboard-menu-title">
          <h2 id="dashboard-menu-title" className="sr-only">
            Menu items dashboard
          </h2>
          <div className="dashboard-panel menu-item-list">
            <div className="dashboard-panel-heading">
              <h3>Menu items</h3>
              <span>{flattenedMenuItems.length} live items</span>
            </div>
            {menuSections.map((section) => (
              <div key={section.id} className="menu-section-list">
                <strong>{section.title}</strong>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={selectedMenuItem?.id === item.id ? "content-row active" : "content-row"}
                    onClick={() => selectMenuItem(item.id)}
                  >
                    <span>{item.name}</span>
                    <small>{item.price}</small>
                  </button>
                ))}
              </div>
            ))}
          </div>

          <form className="dashboard-panel content-editor" onSubmit={saveMenuItem}>
            <div className="dashboard-panel-heading">
              <h3>Menu item editor</h3>
              <span>{selectedMenuItem?.sectionTitle ?? "Choose an item"}</span>
            </div>
            {selectedMenuItem ? (
                <>
                  <div className="content-preview">
                    <Image
                      src={selectedMenuItem.image.src}
                      alt={selectedMenuItem.image.alt}
                      width={selectedMenuItem.image.width}
                      height={selectedMenuItem.image.height}
                    />
                    <div>
                      <strong>{selectedMenuItem.name}</strong>
                      <span>{selectedMenuItem.description}</span>
                  </div>
                </div>
                <label>
                  <span>Name</span>
                  <input
                    value={menuForm.name}
                    onChange={(event) => setMenuForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </label>
                <label>
                  <span>Description</span>
                  <textarea
                    value={menuForm.description}
                    rows={4}
                    onChange={(event) =>
                      setMenuForm((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                </label>
                <div className="dashboard-form-grid">
                  <label>
                    <span>Price</span>
                    <input
                      value={menuForm.price}
                      onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>Photo</span>
                    <select
                      value={menuForm.imageAssetId}
                      onChange={(event) =>
                        setMenuForm((current) => ({ ...current, imageAssetId: event.target.value }))
                      }
                    >
                      {Object.values(menuAssets)
                        .filter((asset) => asset.status === "active")
                        .map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.label}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className="dashboard-inline-upload">
                  <div className="dashboard-inline-upload-heading">
                    <strong>Upload custom image</strong>
                    <span>Assign upload to this menu item</span>
                  </div>
                  <div className="dashboard-form-grid">
                    <label>
                      <span>Custom image file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setMenuImageFile(event.target.files?.[0] ?? null)}
                      />
                    </label>
                    <label>
                      <span>Upload label</span>
                      <input
                        value={menuImageLabel}
                        onChange={(event) => setMenuImageLabel(event.target.value)}
                        placeholder={selectedMenuItem.name}
                      />
                    </label>
                  </div>
                  <label>
                    <span>Upload alt text</span>
                    <input
                      value={menuImageAlt}
                      onChange={(event) => setMenuImageAlt(event.target.value)}
                      placeholder={selectedMenuItem.name}
                    />
                  </label>
                  <button className="button button-secondary" type="button" onClick={uploadMenuItemImage}>
                    Assign upload to this menu item
                  </button>
                </div>
                <label>
                  <span>Tags</span>
                  <input
                    value={menuForm.tags}
                    placeholder="Vegan, Signature, Weekend"
                    onChange={(event) => setMenuForm((current) => ({ ...current, tags: event.target.value }))}
                  />
                </label>
                <div className="dashboard-checkbox-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={menuForm.popular}
                      onChange={(event) =>
                        setMenuForm((current) => ({ ...current, popular: event.target.checked }))
                      }
                    />
                    <span>Mark as popular</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={menuForm.cateringFriendly}
                      onChange={(event) =>
                        setMenuForm((current) => ({ ...current, cateringFriendly: event.target.checked }))
                      }
                    />
                    <span>Catering-friendly</span>
                  </label>
                </div>
                <button className="button button-primary" type="submit">
                  Save menu item
                </button>
              </>
            ) : (
              <p>Select a menu item to edit it.</p>
            )}
          </form>
        </MotionSection>
      ) : null}

      {activeTab === "photos" ? (
        <MotionSection className="dashboard-grid dashboard-content-grid" labelledBy="dashboard-photos-title">
          <h2 id="dashboard-photos-title" className="sr-only">
            Photo management dashboard
          </h2>
          <div className="dashboard-panel photo-slot-list">
            <div className="dashboard-panel-heading">
              <h3>Website photo slots</h3>
              <span>{Object.keys(photoSlots).length} placements</span>
            </div>
            {Object.values(photoSlots).map((slot) => (
              <button
                key={slot.id}
                type="button"
                className={selectedSlot?.id === slot.id ? "content-row active" : "content-row"}
                onClick={() => selectPhotoSlot(slot.id)}
              >
                <span>{slot.label}</span>
                <small>{slot.image.assetId}</small>
              </button>
            ))}
          </div>

          <div className="photo-management-stack">
            <form className="dashboard-panel content-editor" onSubmit={savePhotoSlot}>
              <div className="dashboard-panel-heading">
                <h3>Website photo assignment</h3>
                <span>{selectedSlot?.label ?? "Choose a slot"}</span>
              </div>
              {selectedSlot ? (
                <>
                  <div className="content-preview">
                    <Image
                      src={selectedSlot.image.src}
                      alt={selectedSlot.image.alt}
                      width={selectedSlot.image.width}
                      height={selectedSlot.image.height}
                    />
                    <div>
                      <strong>{selectedSlot.label}</strong>
                      <span>{selectedSlot.description}</span>
                    </div>
                  </div>
                  <label>
                    <span>Assigned image</span>
                    <select
                      value={selectedSlotAssetId}
                      onChange={(event) => setSelectedSlotAssetId(event.target.value)}
                    >
                      {Object.values(photoAssets)
                        .filter((asset) => asset.status === "active")
                        .map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.label}
                          </option>
                        ))}
                    </select>
                  </label>
                  <button className="button button-primary" type="submit">
                    Update website photo
                  </button>
                </>
              ) : (
                <p>Select a website slot to change its photo.</p>
              )}
            </form>

            <form className="dashboard-panel content-editor" onSubmit={uploadImage}>
              <div className="dashboard-panel-heading">
                <h3>Upload image</h3>
                <span>5 MB max</span>
              </div>
              <label>
                <span>Image file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                />
              </label>
              <label>
                <span>Label</span>
                <input value={uploadLabel} onChange={(event) => setUploadLabel(event.target.value)} />
              </label>
              <label>
                <span>Alt text</span>
                <input value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} />
              </label>
              <button className="button button-primary" type="submit">
                Upload image
              </button>
              <button className="button button-secondary" type="button" onClick={pruneUnusedImages}>
                Prune unused images
              </button>
            </form>

            <form className="dashboard-panel content-editor" onSubmit={saveAssetMetadata}>
              <div className="dashboard-panel-heading">
                <h3>Image details</h3>
                <span>Uploaded assets only</span>
              </div>
              <label>
                <span>Choose image</span>
                <select value={assetEditId} onChange={(event) => selectEditableAsset(event.target.value)}>
                  <option value="">Choose one</option>
                  {Object.values(photoAssets)
                    .filter((asset) => asset.kind === "uploaded")
                    .map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.label}
                      </option>
                    ))}
                </select>
              </label>
              {assetEditId ? (
                <>
                  <label>
                    <span>Label</span>
                    <input
                      value={assetEditLabel}
                      onChange={(event) => setAssetEditLabel(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Alt text</span>
                    <input
                      value={assetEditAlt}
                      onChange={(event) => setAssetEditAlt(event.target.value)}
                    />
                  </label>
                  <div className="action-row">
                    <button className="button button-primary" type="submit">
                      Save image details
                    </button>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => toggleAssetStatus(assetEditId)}
                    >
                      {photoAssets[assetEditId]?.status === "archived" ? "Restore image" : "Archive image"}
                    </button>
                  </div>
                </>
              ) : (
                <p>Choose an uploaded asset to edit labels or archive it.</p>
              )}
            </form>
          </div>
        </MotionSection>
      ) : null}

      {message ? <p className="form-message dashboard-message">{message}</p> : null}
    </section>
  );
}
