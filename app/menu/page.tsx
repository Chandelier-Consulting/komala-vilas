import Image from "next/image";
import { MenuExplorer } from "@/components/menu-explorer";
import { MotionGroup, MotionHeadline, MotionHeroVisual, MotionItem, MotionMain } from "@/components/motion-shell";

export default function MenuPage() {
  return (
    <MotionMain className="menu-page">
      <section className="hero-background background-pattern">
        <div className="section-shell page-hero">
          <div>
            <p className="eyebrow">கோமளா விலாஸ் · Pure Vegetarian</p>
            <MotionHeadline>
              <h1 className="text-balance">The Menu</h1>
            </MotionHeadline>
            <MotionGroup>
              <MotionItem>
                <p>
                  Breakfast staples, griddle dosas, unlimited thali, rice plates,
                  sweets, and filter coffee arranged for fast scanning.
                </p>
              </MotionItem>
            </MotionGroup>
          </div>
          <MotionHeroVisual className="page-hero-visual" labelledBy="South Indian vegetarian thali">
            <Image
              className="photo-grade"
              src="/images/south-indian-thali.jpg"
              alt="South Indian vegetarian thali"
              width={900}
              height={1008}
              priority
              quality={92}
            />
          </MotionHeroVisual>
        </div>
      </section>

      <MenuExplorer />
    </MotionMain>
  );
}
