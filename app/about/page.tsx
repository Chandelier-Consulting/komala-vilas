import Image from "next/image";
import Link from "next/link";
import { MotionCard, MotionMain, MotionSection } from "@/components/motion-shell";

const timelineItems = [
  {
    year: "Before opening",
    title: "Batter wakes up overnight",
    body: "Rice and lentils rest, ferment, and build the gentle tang that makes idli soft and dosa crisp.",
    image: "/images/idli-vada.jpg",
  },
  {
    year: "8:30 AM",
    title: "The griddle starts the day",
    body: "Pongal, vada, chutneys, and the first wave of paper dosas move across the counter.",
    image: "/images/masala-dosa.jpg",
  },
  {
    year: "Lunch",
    title: "The thali becomes the room",
    body: "Rice, sambar, rasam, rotating vegetables, sweet, buttermilk, and refills slow the table down.",
    image: "/images/south-indian-thali.jpg",
  },
  {
    year: "Afternoon",
    title: "Coffee pulls everyone back",
    body: "Filter coffee is poured between tumbler and dabarah until it foams, strong and sweet.",
    image: "/images/filter-coffee.jpg",
  },
];

export default function AboutPage() {
  return (
    <MotionMain className="about-page">
      <section className="section-shell page-hero">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="text-balance">Not a concept. A rhythm.</h1>
          <p>
            Komala Vilas works because the day has a pulse: batter before
            sunrise, dosa on the griddle, thali at lunch, coffee in the afternoon,
            and refills whenever the table asks.
          </p>
          <Link className="button button-primary" href="/menu">
            See the Food
          </Link>
        </div>
        <Image
          className="photo-grade"
          src="/images/south-indian-breakfast.jpg"
          alt="South Indian breakfast plate"
          width={1024}
          height={694}
          priority
          quality={92}
        />
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
        <div className="timeline-stage">
          {timelineItems.map((item) => (
            <MotionCard key={item.title} className="timeline-card">
              <Image
                className="photo-grade"
                src={item.image}
                alt=""
                width={520}
                height={360}
                quality={85}
              />
              <div>
                <span>{item.year}</span>
                <h3 className="text-balance">{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </MotionCard>
          ))}
        </div>
      </MotionSection>

      <section className="section-shell values-panel section-block">
        <article>
          <strong>Pure vegetarian</strong>
          <span>Every dish, every day. Much of the menu is vegan by nature.</span>
        </article>
        <article>
          <strong>Rotating thali</strong>
          <span>Six dishes that change through the week, like a home kitchen.</span>
        </article>
        <article>
          <strong>No shortcut cooking</strong>
          <span>Fermented batter, slow sambar, and coffee pulled the old way.</span>
        </article>
      </section>
    </MotionMain>
  );
}
