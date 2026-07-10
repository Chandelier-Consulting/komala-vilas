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

      <div className="menu-backdrop-shell">
        <svg
          className="menu-page-gopuram"
          aria-hidden="true"
          viewBox="0 0 400 560"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="60,560 340,560 300,470 100,470" />
          <polygon points="100,470 300,470 272,410 128,410" />
          <polygon points="128,410 272,410 248,356 152,356" />
          <polygon points="152,356 248,356 228,306 172,306" />
          <polygon points="172,306 228,306 212,262 188,262" />
          <polygon points="188,262 212,262 202,222 198,222" />
          <circle cx="200" cy="204" r="16" />
          <path d="M200 188 L200 150" stroke="currentColor" strokeWidth="6" />
          <circle cx="200" cy="140" r="8" />
          <path d="M150 470 L150 388 Q150 340 200 340 Q250 340 250 388 L250 470 Z" />
          <circle cx="130" cy="440" r="6" />
          <circle cx="270" cy="440" r="6" />
          <circle cx="114" cy="392" r="5" />
          <circle cx="286" cy="392" r="5" />
          <circle cx="140" cy="332" r="4" />
          <circle cx="260" cy="332" r="4" />
        </svg>
        <span className="menu-page-rail menu-page-rail-left" aria-hidden="true" />
        <span className="menu-page-rail menu-page-rail-right" aria-hidden="true" />

        <MenuExplorer
          menuSections={menuSections}
          anchorImageSrc={sitePhotos["menu-anchor"].image.src}
          anchorImageAlt={sitePhotos["menu-anchor"].image.alt}
        />
      </div>
    </MotionMain>
  );
}
