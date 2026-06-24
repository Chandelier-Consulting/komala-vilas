import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <section className="section-shell section-block" aria-labelledby="dashboard-title">
        <p className="eyebrow">Komala Vilas staff</p>
        <div>
          <h1 id="dashboard-title" className="text-balance">
            Staff operations dashboard
          </h1>
        </div>
        <DashboardClient />
      </section>
    </main>
  );
}
