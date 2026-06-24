import Image from "next/image";
import { getResolvedSitePhotoSlots } from "@/lib/admin-content-store";
import {
  MotionCard,
  MotionGroup,
  MotionHeadline,
  MotionHeroVisual,
  MotionItem,
  MotionLink,
  MotionMain,
  MotionSection,
} from "@/components/motion-shell";

export const dynamic = "force-dynamic";

const timelineItems = [
  {
    id: "about-timeline-before-opening",
    year: "Before opening",
    title: "Batter wakes up overnight",
    body: "Rice and lentils rest, ferment, and build the gentle tang that makes idli soft and dosa crisp.",
  },
  {
    id: "about-timeline-morning",
    year: "8:30 AM",
    title: "The griddle starts the day",
    body: "Pongal, vada, chutneys, and the first wave of paper dosas move across the counter.",
  },
  {
    id: "about-timeline-lunch",
    year: "Lunch",
    title: "The thali becomes the room",
    body: "Rice, sambar, rasam, rotating vegetables, sweet, buttermilk, and refills slow the table down.",
  },
  {
    id: "about-timeline-coffee",
    year: "Afternoon",
    title: "Coffee pulls everyone back",
    body: "Filter coffee is poured between tumbler and dabarah until it foams, strong and sweet.",
  },
];

const storySections = [
  {
    title: "A small dining room with a long memory",
    body:
      "Komala Vilas has stayed useful to Sunnyvale by keeping the promise simple: vegetarian South Indian food that tastes steady, familiar, and worth repeating with family, coworkers, and weekend regulars.",
  },
  {
    title: "Breakfast that still feels like breakfast",
    body:
      "The first tables come for idli, pongal, vada, and dosa because the food arrives like a proper tiffin service, not a snack. Chutneys matter, sambar matters, and the griddle never hides behind shortcuts.",
  },
  {
    title: "Lunch built for people who want to stay",
    body:
      "By noon, the room turns into thali service, refill culture, and steel tumblers of coffee. Sunnyvale regulars come back because the meal feels complete, not because it needs a trend to explain it.",
  },
];

const hospitalityPillars = [
  {
    title: "Pure vegetarian kitchen",
    body: "Every dish starts from that commitment, so families and temple-goers can order the whole table with confidence.",
  },
  {
    title: "Fermentation before speed",
    body: "Idli and dosa batter get time to develop softness, tang, and the crisp edge people expect from a reliable South Indian kitchen.",
  },
  {
    title: "Thali with rhythm",
    body: "Lunch works like a home meal: rice, gravies, vegetables, sweet, buttermilk, and refills that make the plate feel generous.",
  },
  {
    title: "Coffee to close the loop",
    body: "Filter coffee is part of the story, not an afterthought. It gives breakfast a finish and brings people back after lunch.",
  },
];

export default async function AboutPage() {
  const sitePhotos = await getResolvedSitePhotoSlots();

  return (
    <MotionMain className="about-page">
      <section className="hero-background background-pattern">
        <div className="section-shell page-hero">
          <div className="about-hero-copy">
            <p className="eyebrow">Our story</p>
            <MotionHeadline>
              <h1 className="text-balance">A small restaurant built on repeat trust.</h1>
            </MotionHeadline>
            <MotionGroup className="about-hero-flow">
              <MotionItem>
                <p>
                  Komala Vilas is the kind of neighborhood South Indian restaurant people
                  learn by habit: breakfast when they need comfort, thali when lunch has to
                  feel complete, and pickup when the family wants food everyone will eat.
                </p>
              </MotionItem>
              <MotionItem>
                <p>
                  The room is modest on purpose. What matters is the rhythm behind it:
                  batter before sunrise, dosa on the griddle, sambar kept ready, coffee
                  poured hot, and service that keeps the meal moving without rushing it.
                </p>
              </MotionItem>
              <MotionItem>
                <p>
                  That is why a small restaurant can last. People return when the food is
                  recognizable, the standards do not drift, and the table still feels like
                  it belongs to regulars.
                </p>
              </MotionItem>
              <MotionItem className="action-row">
                <MotionLink className="button button-primary" href="/menu">
                  See the Food
                </MotionLink>
                <MotionLink className="button button-light" href="/catering">
                  Plan Catering
                </MotionLink>
              </MotionItem>
            </MotionGroup>
          </div>
          <MotionHeroVisual className="page-hero-visual" labelledBy="South Indian breakfast plate">
            <Image
              className="photo-grade"
              src={sitePhotos["about-hero"].image.src}
              alt={sitePhotos["about-hero"].image.alt}
              width={sitePhotos["about-hero"].image.width}
              height={sitePhotos["about-hero"].image.height}
              priority
              quality={92}
            />
          </MotionHeroVisual>
        </div>
      </section>

      <MotionSection className="section-shell section-block" labelledBy="story-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Why it matters</p>
            <h2 id="story-title" className="text-balance">
              The story is not scale. It is consistency.
            </h2>
          </div>
        </div>
        <MotionGroup className="about-story-grid">
          {storySections.map((section) => (
            <MotionCard key={section.title} className="about-story-card">
              <h3 className="text-balance">{section.title}</h3>
              <p>{section.body}</p>
            </MotionCard>
          ))}
        </MotionGroup>
      </MotionSection>

      <MotionSection className="timeline-section section-shell section-block" labelledBy="timeline-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A day at Komala Vilas</p>
            <h2 id="timeline-title" className="text-balance">
              Follow the curve from batter to coffee.
            </h2>
          </div>
        </div>
        <MotionGroup className="timeline-stage">
          {timelineItems.map((item) => (
            <MotionCard key={item.title} className="timeline-card">
              <Image
                className="photo-grade"
                src={sitePhotos[item.id].image.src}
                alt=""
                width={sitePhotos[item.id].image.width}
                height={sitePhotos[item.id].image.height}
                quality={85}
              />
              <div>
                <span>{item.year}</span>
                <h3 className="text-balance">{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </MotionCard>
          ))}
        </MotionGroup>
      </MotionSection>

      <MotionSection className="section-shell section-block" labelledBy="hospitality-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What the room stands on</p>
            <h2 id="hospitality-title" className="text-balance">
              Four habits keep the place honest.
            </h2>
          </div>
        </div>
        <MotionGroup className="values-panel about-values-grid">
          {hospitalityPillars.map((item) => (
            <MotionCard key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </MotionCard>
          ))}
        </MotionGroup>
      </MotionSection>
    </MotionMain>
  );
}
