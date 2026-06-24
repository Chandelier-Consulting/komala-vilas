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

export default async function AboutPage() {
  const sitePhotos = await getResolvedSitePhotoSlots();

  return (
    <MotionMain className="about-page">
      <section className="hero-background background-pattern">
        <div className="section-shell page-hero">
          <div>
            <p className="eyebrow">Our story</p>
            <MotionHeadline>
              <h1 className="text-balance">Not a concept. A rhythm.</h1>
            </MotionHeadline>
            <MotionGroup>
              <MotionItem>
                <p>
                  Komala Vilas works because the day has a pulse: batter before
                  sunrise, dosa on the griddle, thali at lunch, coffee in the afternoon,
                  and refills whenever the table asks.
                </p>
              </MotionItem>
              <MotionItem>
                <MotionLink className="button button-primary" href="/menu">
                  See the Food
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

      <MotionSection className="section-shell values-panel section-block">
        <MotionCard>
          <strong>Pure vegetarian</strong>
          <span>Every dish, every day. Much of the menu is vegan by nature.</span>
        </MotionCard>
        <MotionCard>
          <strong>Rotating thali</strong>
          <span>Six dishes that change through the week, like a home kitchen.</span>
        </MotionCard>
        <MotionCard>
          <strong>No shortcut cooking</strong>
          <span>Fermented batter, slow sambar, and coffee pulled the old way.</span>
        </MotionCard>
      </MotionSection>
    </MotionMain>
  );
}
