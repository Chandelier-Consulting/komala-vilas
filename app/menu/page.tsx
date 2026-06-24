import Image from "next/image";
import { MenuExplorer } from "@/components/menu-explorer";
import { getResolvedMenuSections, getResolvedSitePhotoSlots } from "@/lib/admin-content-store";
import { MotionGroup, MotionHeadline, MotionHeroVisual, MotionItem, MotionMain } from "@/components/motion-shell";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [menuSections, sitePhotos] = await Promise.all([
    getResolvedMenuSections(),
    getResolvedSitePhotoSlots(),
  ]);

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
              src={sitePhotos["menu-hero"].image.src}
              alt={sitePhotos["menu-hero"].image.alt}
              width={sitePhotos["menu-hero"].image.width}
              height={sitePhotos["menu-hero"].image.height}
              priority
              quality={92}
            />
          </MotionHeroVisual>
        </div>
      </section>

      <MenuExplorer
        menuSections={menuSections}
        anchorImageSrc={sitePhotos["menu-anchor"].image.src}
        anchorImageAlt={sitePhotos["menu-anchor"].image.alt}
      />
    </MotionMain>
  );
}
