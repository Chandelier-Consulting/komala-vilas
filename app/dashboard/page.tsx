import { DashboardClient } from "@/components/dashboard-client";
import { MotionHeadline, MotionMain, MotionSection } from "@/components/motion-shell";

export default function DashboardPage() {
  return (
    <MotionMain className="dashboard-page">
      <MotionSection className="section-shell section-block" labelledBy="dashboard-title">
        <p className="eyebrow">Komala Vilas staff</p>
        <MotionHeadline>
          <h1 id="dashboard-title" className="text-balance">
            Staff operations dashboard
          </h1>
        </MotionHeadline>
        <DashboardClient />
      </MotionSection>
    </MotionMain>
  );
}
