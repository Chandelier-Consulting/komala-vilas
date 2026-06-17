import Image from "next/image";
import Link from "next/link";
import { MotionCard, MotionHeadline, MotionMain, MotionSection } from "@/components/motion-shell";
import { OpenStatus } from "@/components/open-status";
import { OrderLinkPanel } from "@/components/order-link-panel";
import { restaurantInfo } from "@/lib/restaurant";

const signatureDishes = [
  {
    name: "Paper Masala Dosa",
    tamil: "மசாலா தோசை",
    image: "/images/signature-paper-dosa.jpg",
    desc: "A long, crisp rice-lentil crepe folded around potato masala with sambar and chutneys.",
  },
  {
    name: "Unlimited South Indian Thali",
    tamil: "சாப்பாடு",
    image: "/images/signature-thali.jpg",
    desc: "Rice, sambar, rasam, kootu, poriyal, sweet, buttermilk, and refills from the kitchen.",
  },
  {
    name: "Idli Vada Sambar",
    tamil: "இட்லி வடை",
    image: "/images/signature-idli-vada.jpg",
    desc: "Steamed idli and crisp medu vada built for hot sambar, coconut chutney, and coffee.",
  },
];

const reviews = [
  "The thali tastes like a proper South Indian lunch, not a shortcut plate.",
  "Crisp dosa, fast service, and filter coffee that actually tastes like home.",
  "A Sunnyvale staple for vegetarian food when the whole family needs to agree.",
];

export default function Home() {
  return (
    <MotionMain>
      <section className="hero-background background-pattern">
        <div className="hero-premium section-shell">
          <div className="hero-copy">
            <MotionHeadline>
              <p className="eyebrow">கோமளா விலாஸ் · Sunnyvale</p>
              <h1 className="text-balance">
                South Indian food with <span>temple-town depth.</span>
              </h1>
            </MotionHeadline>
            <p className="lede">
              Komala Vilas is a pure vegetarian South Indian kitchen for paper dosa,
              rotating thali, idli vada, filter coffee, and catered feasts.
            </p>
            <div className="action-row">
              <Link className="button button-primary" href="/catering">
                Order Catering
              </Link>
              <Link className="button button-light" href="/menu">
                Explore Menu
              </Link>
            </div>
            <div className="quick-info">
              <OpenStatus />
              <span>{restaurantInfo.shortAddress}</span>
              <a href={restaurantInfo.phoneHref}>{restaurantInfo.phone}</a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Komala Vilas South Indian dishes">
            <div className="temple-border">
              <Image
                className="photo-grade"
                src="/images/komala-vilas-premium-hero.jpg"
                alt="Premium Komala Vilas spread with dosa, thali, filter coffee, and temple pattern"
                width={1400}
                height={1800}
                priority
                quality={92}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="quote-band">
        <blockquote>
          <p className="text-balance">Every meal should feel like someone was expecting you.</p>
          <cite>Fermented overnight · simmered slow · served with refills</cite>
        </blockquote>
      </section>

      <MotionSection className="section-shell section-block">
        <OrderLinkPanel />
      </MotionSection>

      <MotionSection className="section-shell section-block" labelledBy="plates-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The signatures</p>
            <h2 id="plates-title" className="text-balance">
              Built around <strong>heat, batter, brass, and patience.</strong>
            </h2>
          </div>
          <Link className="button button-secondary" href="/menu">
            Open Full Menu
          </Link>
        </div>
        <div className="dish-grid">
          {signatureDishes.map((dish) => (
            <MotionCard key={dish.name} className="dish-card">
              <Image
                className="photo-grade"
                src={dish.image}
                alt={dish.name}
                width={900}
                height={675}
                quality={85}
              />
              <div>
                <p>{dish.tamil}</p>
                <h3 className="text-balance">{dish.name}</h3>
                <span>{dish.desc}</span>
              </div>
            </MotionCard>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="section-shell story-panel">
        <div>
          <p className="eyebrow">Catering now open</p>
          <h2 className="text-balance">Temple-feast scale for offices, weddings, and family functions.</h2>
          <p>
            Choose thali service, tiffin breakfast, or a dosa counter. Send the
            request and the Komala Vilas team can confirm quantities, timing, and
            pickup from Sunnyvale.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/catering">
              Plan Catering
            </Link>
            <a className="button button-light" href={restaurantInfo.mapUrl}>
              Get Directions
            </a>
          </div>
        </div>
        <Image
          className="photo-grade"
          src="/images/south-indian-breakfast.jpg"
          alt="South Indian breakfast with idli, vada, sambar, and chutney"
          width={1024}
          height={694}
          quality={92}
        />
      </MotionSection>

      <MotionSection className="section-shell section-block" labelledBy="reviews-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">From the tables</p>
            <h2 id="reviews-title" className="text-balance">
              Sunnyvale regulars come back for the same reason.
            </h2>
          </div>
        </div>
        <div className="review-grid">
          {reviews.map((quote) => (
            <MotionCard key={quote} className="review-card">
              <p>&quot;{quote}&quot;</p>
            </MotionCard>
          ))}
        </div>
      </MotionSection>

      <section className="section-shell visit-strip" aria-label="Visit Komala Vilas">
        <div>
          <p className="eyebrow">Come hungry</p>
          <h2 className="text-balance">{restaurantInfo.shortAddress}</h2>
          <p>Open daily from 8:30 AM. Friday and Saturday nights run until 10:00 PM.</p>
        </div>
        <div className="action-row">
          <a className="button button-dark" href={restaurantInfo.mapUrl}>
            Get Directions
          </a>
          <a className="button button-light" href={restaurantInfo.phoneHref}>
            {restaurantInfo.phone}
          </a>
        </div>
      </section>
    </MotionMain>
  );
}
