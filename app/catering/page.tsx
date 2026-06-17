import Image from "next/image";
import { CateringEstimator, CateringOrderForm } from "@/components/catering-form";
import { MotionCard, MotionMain, MotionSection } from "@/components/motion-shell";
import { cateringPackages } from "@/lib/orders";

export default function CateringPage() {
  return (
    <MotionMain className="catering-page">
      <section className="hero-background background-pattern">
        <div className="section-shell page-hero">
          <div>
            <p className="eyebrow">Komala Vilas catering</p>
            <h1 className="text-balance">South Indian feasts for serious gatherings.</h1>
            <p>
              Order dosa counters, tiffin breakfasts, and thali-style spreads for
              offices, weddings, pujas, birthdays, and family weekends across the
              South Bay.
            </p>
          </div>
          <Image
            className="photo-grade"
            src="/images/south-indian-thali.jpg"
            alt="Catering-ready South Indian vegetarian thali"
            width={900}
            height={1008}
            priority
            quality={92}
          />
        </div>
      </section>

      <MotionSection className="section-shell section-block" labelledBy="packages-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Packages</p>
            <h2 id="packages-title" className="text-balance">
              Choose the format that fits the room.
            </h2>
          </div>
        </div>
        <div className="package-grid">
          {cateringPackages.map((item, index) => (
            <MotionCard key={item.id} className="package-card">
              <Image
                className="photo-grade"
                src={
                  index === 0
                    ? "/images/south-indian-thali.jpg"
                    : index === 1
                      ? "/images/idli-vada.jpg"
                      : "/images/masala-dosa.jpg"
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
              </div>
            </MotionCard>
          ))}
        </div>
      </MotionSection>

      <section className="section-shell section-block catering-layout">
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
      </section>
    </MotionMain>
  );
}
