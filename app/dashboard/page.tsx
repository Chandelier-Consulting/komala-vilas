import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <main className="dashboard-page section-shell">
      <p className="eyebrow">Komala Vilas staff</p>
      <h1 className="text-balance">Catering orders dashboard</h1>
      <DashboardClient />
    </main>
  );
}
