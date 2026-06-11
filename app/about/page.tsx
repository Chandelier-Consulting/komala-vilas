import Link from "next/link";
import Image from "next/image";

const timelineItems = [
  {
    year: "Before the door opens",
    title: "Batter wakes up overnight",
    body: "Rice and lentils rest, ferment, and build the gentle tang that makes idli soft and dosa crisp.",
    image: "/images/idli-vada.jpg",
  },
  {
    year: "8:30 AM",
    title: "The griddle starts the day",
    body: "Breakfast moves fast: pongal, vada, chutneys, and the first wave of paper dosas.",
    image: "/images/masala-dosa.jpg",
  },
  {
    year: "Lunch rush",
    title: "The thali becomes the room",
    body: "Rice, sambar, rasam, rotating vegetables, sweet, buttermilk, and refills until the table slows down.",
    image: "/images/south-indian-thali.jpg",
  },
  {
    year: "Afternoon",
    title: "Coffee pulls everyone back",
    body: "Filter coffee is poured between tumbler and dabarah until it foams, strong and sweet.",
    image: "/images/filter-coffee.jpg",
  },
  {
    year: "Dinner",
    title: "The regulars know the rhythm",
    body: "Families, students, and Bay Area regulars come for the same steady promise: vegetarian food cooked like home.",
    image: "/images/south-indian-breakfast.jpg",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero section-shell">
        <div>
          <p className="eyebrow">Our story</p>
          <h1>Not a concept. A rhythm.</h1>
          <p>
            Komala Vilas works because the day has a pulse: batter before sunrise,
            dosa on the griddle, thali at lunch, coffee in the afternoon, and refills
            whenever the table asks.
          </p>
          <Link className="button button-dark" href="/menu">
            See the Food
          </Link>
        </div>
        <Image src="/images/south-indian-breakfast.jpg" alt="South Indian breakfast plate" width={1024} height={694} priority />
      </section>

      <section className="timeline-section section-shell" aria-labelledby="timeline-title">
        <div className="center-heading">
          <p className="eyebrow">A day at Komala Vilas</p>
          <h2 id="timeline-title">Follow the curve from batter to coffee.</h2>
        </div>
        <div className="timeline-stage">
          <svg className="timeline-curve" viewBox="0 0 1000 1500" aria-hidden="true" preserveAspectRatio="none">
            <path d="M520 20 C130 210 820 330 470 540 C170 720 870 800 530 1010 C220 1190 720 1270 440 1480" />
          </svg>
          {timelineItems.map((item, index) => (
            <article key={item.title} className={`timeline-card timeline-card-${index + 1}`}>
              <Image src={item.image} alt="" width={520} height={360} />
              <div>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell values-panel">
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
    </main>
  );
}
