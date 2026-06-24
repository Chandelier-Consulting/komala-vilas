import Image from "next/image";
import { CateringEstimator, CateringOrderForm } from "@/components/catering-form";
import { getResolvedSitePhotoSlots } from "@/lib/admin-content-store";
import {
  MotionCard,
  MotionGroup,
  MotionHeadline,
  MotionHeroVisual,
  MotionItem,
  MotionMain,
  MotionSection,
} from "@/components/motion-shell";
import { cateringPackages } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function CateringPage() {
  const sitePhotos = await getResolvedSitePhotoSlots();

  return (
    <MotionMain className="catering-page">
      <section className="hero-background background-pattern">
        <div className="section-shell page-hero">
          <div>
            <p className="eyebrow">Komala Vilas catering</p>
            <MotionHeadline>
              <h1 className="text-balance">South Indian feasts for serious gatherings.</h1>
            </MotionHeadline>
            <MotionGroup>
              <MotionItem>
                <p>
                  Order dosa counters, tiffin breakfasts, and thali-style spreads for
                  offices, weddings, pujas, birthdays, and family weekends across the
                  South Bay.
                </p>
              </MotionItem>
            </MotionGroup>
          </div>
          <MotionHeroVisual className="page-hero-visual" labelledBy="Catering-ready South Indian vegetarian thali">
            <Image
              className="photo-grade"
              src={sitePhotos["catering-hero"].image.src}
              alt={sitePhotos["catering-hero"].image.alt}
              width={sitePhotos["catering-hero"].image.width}
              height={sitePhotos["catering-hero"].image.height}
              priority
              quality={92}
            />
          </MotionHeroVisual>
        </div>
      </section>

      <MotionSection
        className="section-shell section-block catering-packages-section"
        labelledBy="packages-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Packages</p>
            <h2 id="packages-title" className="text-balance">
              Choose the format that fits the room.
            </h2>
          </div>
        </div>
        <MotionGroup className="package-grid">
          {cateringPackages.map((item, index) => (
            <MotionCard key={item.id} className="package-card">
              <a
                className="catering-package-link"
                href={`#request?package=${item.id}&guests=${item.minGuests}`}
              >
                <Image
                  className="photo-grade"
                  src={
                    index === 0
                      ? sitePhotos["catering-package-temple-feast"].image.src
                      : index === 1
                        ? sitePhotos["catering-package-tiffin-table"].image.src
                        : sitePhotos["catering-package-dosa-counter"].image.src
                  }
                  alt={item.name}
                  width={900}
                  height={675}
                  quality={85}
                />
                <div>
                  <p>{item.serves}</p>
                  <h3 className="text-balance">{item.name}</h3>
                  <span>{item.description}</span>
                  <strong>Start request</strong>
                </div>
              </a>
            </MotionCard>
          ))}
        </MotionGroup>
      </MotionSection>

      <MotionSection className="section-shell section-block catering-layout catering-request-section">
        <div>
          <p className="eyebrow">Ordering</p>
          <h2 className="text-balance">Send the details. The kitchen confirms the final count.</h2>
          <p>
            Catering starts at 10 guests. Pickup is from 1020 E El Camino Real in
            Sunnyvale unless delivery is confirmed by the team.
          </p>
          <CateringEstimator />
        </div>
        <CateringOrderForm />
      </MotionSection>
    </MotionMain>
  );
}
