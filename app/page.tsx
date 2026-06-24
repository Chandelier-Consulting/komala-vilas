import Image from "next/image";
import Link from "next/link";
import { FeastPlanner } from "@/components/feast-planner";
import { getResolvedSitePhotoSlots } from "@/lib/admin-content-store";
import {
  MotionAmbient,
  MotionCard,
  MotionGroup,
  MotionHeadline,
  MotionHeroVisual,
  MotionItem,
  MotionLink,
  MotionMain,
  MotionScrub,
  MotionSection,
} from "@/components/motion-shell";
import { OpenStatus } from "@/components/open-status";
import { OrderLinkPanel } from "@/components/order-link-panel";
import { restaurantInfo } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

const signatureDishes = [
  {
    id: "home-signature-paper-dosa",
    name: "Paper Masala Dosa",
    tamil: "மசாலா தோசை",
    desc: "A long, crisp rice-lentil crepe folded around potato masala with sambar and chutneys.",
  },
  {
    id: "home-signature-thali",
    name: "Unlimited South Indian Thali",
    tamil: "சாப்பாடு",
    desc: "Rice, sambar, rasam, kootu, poriyal, sweet, buttermilk, and refills from the kitchen.",
  },
  {
    id: "home-signature-idli-vada",
    name: "Idli Vada Sambar",
    tamil: "இட்லி வடை",
    desc: "Steamed idli and crisp medu vada built for hot sambar, coconut chutney, and coffee.",
  },
];

const reviews = [
  {
    quote: "The thali tastes like a proper South Indian lunch, not a shortcut plate.",
    name: "Lunch regular",
    detail: "Comes back for thali refills",
  },
  {
    quote: "Crisp dosa, fast service, and filter coffee that actually tastes like home.",
    name: "Weekend table",
    detail: "Orders dosa and coffee",
  },
  {
    quote: "A Sunnyvale staple for vegetarian food when the whole family needs to agree.",
    name: "Family order",
    detail: "Catering and takeout",
  },
];

const featuredReview = {
  quote:
    "When the dosa lands hot, the sambar is still steaming, and the coffee comes in a steel tumbler, the table goes quiet first. Then everyone starts planning the next visit.",
  name: "A note from the dining room",
  detail: "What regulars keep describing",
};

const reviewHighlights = ["Crisp dosas", "Unlimited thali", "Filter coffee", "Vegetarian catering"];

export default async function Home() {
  const sitePhotos = await getResolvedSitePhotoSlots();

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
            <MotionGroup>
              <MotionItem>
                <p className="lede">
                  Komala Vilas is a pure vegetarian South Indian kitchen for paper dosa,
                  rotating thali, idli vada, filter coffee, and catered feasts.
                </p>
              </MotionItem>
              <MotionItem className="action-row">
                <MotionLink className="button button-primary" href="/catering">
                  Order Catering
                </MotionLink>
                <MotionLink className="button button-light" href="/menu">
                  Explore Menu
                </MotionLink>
              </MotionItem>
            </MotionGroup>
            <MotionGroup className="quick-info">
              <MotionItem>
                <OpenStatus />
              </MotionItem>
              <span>{restaurantInfo.shortAddress}</span>
              <a href={restaurantInfo.phoneHref}>{restaurantInfo.phone}</a>
            </MotionGroup>
          </div>

          <MotionHeroVisual className="hero-visual" labelledBy="Komala Vilas South Indian dishes">
            <div className="hero-photo-stage">
              <div className="hero-photo-frame">
                <Image
                  className="photo-grade"
                  src={sitePhotos["home-hero"].image.src}
                  alt={sitePhotos["home-hero"].image.alt}
                  width={sitePhotos["home-hero"].image.width}
                  height={sitePhotos["home-hero"].image.height}
                  priority
                  quality={92}
                />
              </div>
              <div className="hero-corner-photo hero-corner-photo-top">
                <Image
                  className="photo-grade"
                  src={sitePhotos["home-hero-corner-top"].image.src}
                  alt=""
                  width={sitePhotos["home-hero-corner-top"].image.width}
                  height={sitePhotos["home-hero-corner-top"].image.height}
                  quality={85}
                />
              </div>
              <div className="hero-corner-photo hero-corner-photo-bottom">
                <Image
                  className="photo-grade"
                  src={sitePhotos["home-hero-corner-bottom"].image.src}
                  alt=""
                  width={sitePhotos["home-hero-corner-bottom"].image.width}
                  height={sitePhotos["home-hero-corner-bottom"].image.height}
                  quality={85}
                />
              </div>
            </div>
          </MotionHeroVisual>
        </div>
      </section>

      <section className="quote-band">
        <MotionAmbient className="quote-ambient-line" />
        <blockquote>
          <MotionScrub distance={24} scaleTo={1.02}>
            <p className="text-balance">Every meal should feel like someone was expecting you.</p>
          </MotionScrub>
          <cite>Fermented overnight · simmered slow · served with refills</cite>
        </blockquote>
      </section>

      <MotionSection className="home-section home-section-order">
        <div className="section-shell">
          <OrderLinkPanel />
        </div>
      </MotionSection>

      <MotionSection className="home-section home-section-signatures" labelledBy="plates-title">
        <div className="section-shell">
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
          <MotionGroup className="dish-grid">
            {signatureDishes.map((dish) => (
              <MotionCard key={dish.name} className="dish-card">
                <Image
                  className="photo-grade"
                  src={sitePhotos[dish.id].image.src}
                  alt={dish.name}
                  width={sitePhotos[dish.id].image.width}
                  height={sitePhotos[dish.id].image.height}
                  quality={85}
                />
                <div>
                  <p>{dish.tamil}</p>
                  <h3 className="text-balance">{dish.name}</h3>
                  <span>{dish.desc}</span>
                </div>
              </MotionCard>
            ))}
          </MotionGroup>
        </div>
      </MotionSection>

      <MotionSection className="home-section home-section-planner" labelledBy="planner-title">
        <div className="section-shell feast-planner-section">
          <div>
            <p className="eyebrow">Plan your order</p>
            <h2 id="planner-title" className="text-balance">
              Build the feast before anyone calls the restaurant.
            </h2>
            <p>
              Choose the room, tune the guest count, and turn a browse into a
              catering request with package and quantity already set.
            </p>
          </div>
          <FeastPlanner />
        </div>
      </MotionSection>

      <MotionSection className="home-section home-section-catering">
        <div className="section-shell story-panel">
          <div>
            <p className="eyebrow">Catering now open</p>
            <h2 className="text-balance">Temple-feast scale for offices, weddings, and family functions.</h2>
            <p>
              Choose thali service, tiffin breakfast, or a dosa counter. Send the
              request and the Komala Vilas team can confirm quantities, timing, and
              pickup from Sunnyvale.
            </p>
            <div className="action-row">
              <MotionLink className="button button-primary" href="/catering">
                Plan Catering
              </MotionLink>
              <MotionLink className="button button-light" href={restaurantInfo.mapUrl} target="_blank" rel="noreferrer">
                Get Directions
              </MotionLink>
            </div>
          </div>
          <MotionScrub className="story-image-motion" distance={28}>
            <Image
              className="photo-grade"
              src={sitePhotos["home-catering-feature"].image.src}
              alt={sitePhotos["home-catering-feature"].image.alt}
              width={sitePhotos["home-catering-feature"].image.width}
              height={sitePhotos["home-catering-feature"].image.height}
              quality={92}
            />
          </MotionScrub>
        </div>
      </MotionSection>

      <MotionSection className="home-section home-section-reviews" labelledBy="reviews-title">
        <div className="section-shell review-showcase">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From the tables</p>
              <h2 id="reviews-title" className="text-balance">
                Proof you can feel before the first bite.
              </h2>
            </div>
            <MotionLink className="button button-secondary" href="/catering">
              Book catering from the reviews
            </MotionLink>
          </div>

          <MotionGroup className="review-layout">
            <MotionCard className="review-feature">
              <div className="review-feature-mark" aria-hidden="true">
                ★★★★★
              </div>
              <blockquote>
                <p className="text-balance">&quot;{featuredReview.quote}&quot;</p>
                <cite>
                  <strong>{featuredReview.name}</strong>
                  <span>{featuredReview.detail}</span>
                </cite>
              </blockquote>
            </MotionCard>

            <div className="review-side">
              <div className="review-proof-bar">
                <span>Most mentioned</span>
                <div>
                  {reviewHighlights.map((item) => (
                    <strong key={item}>{item}</strong>
                  ))}
                </div>
              </div>
              <MotionGroup className="review-grid">
                {reviews.map((review) => (
                  <MotionCard key={review.quote} className="review-card">
                    <p>&quot;{review.quote}&quot;</p>
                    <span>
                      <strong>{review.name}</strong>
                      {review.detail}
                    </span>
                  </MotionCard>
                ))}
              </MotionGroup>
            </div>
          </MotionGroup>
        </div>
      </MotionSection>

      <section className="home-section home-section-visit" aria-label="Visit Komala Vilas">
        <div className="section-shell visit-strip">
          <div>
            <p className="eyebrow">Come hungry</p>
            <h2 className="text-balance">{restaurantInfo.shortAddress}</h2>
            <p>Open daily from 8:30 AM. Friday and Saturday nights run until 10:00 PM.</p>
          </div>
          <div className="action-row">
            <MotionLink className="button button-dark" href={restaurantInfo.mapUrl} target="_blank" rel="noreferrer">
              Get Directions
            </MotionLink>
            <MotionLink className="button button-light" href={restaurantInfo.phoneHref}>
              {restaurantInfo.phone}
            </MotionLink>
          </div>
        </div>
      </section>
    </MotionMain>
  );
}
