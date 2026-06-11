import Link from "next/link";
import Image from "next/image";

const orderUrl = "https://komalavilas.com";
const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Komala+Vilas+1020+E+El+Camino+Real+Sunnyvale+CA+94087";
const phone = "(408) 733-7400";

const signatureDishes = [
  {
    name: "Paper Masala Dosa",
    tamil: "மசாலா தோசை",
    image: "/images/masala-dosa.jpg",
    desc: "A crisp griddle crepe wrapped around spiced potato, with chutneys and sambar.",
  },
  {
    name: "Unlimited Thali",
    tamil: "சாப்பாடு",
    image: "/images/south-indian-thali.jpg",
    desc: "Rotating vegetables, rice, sambar, rasam, sweet, buttermilk, and refills.",
  },
  {
    name: "Idli & Vada",
    tamil: "இட்லி வடை",
    image: "/images/idli-vada.jpg",
    desc: "Soft steamed idli, crisp vada, and deep sambar comfort.",
  },
];

const reviews = [
  "The thali tastes like the kind of lunch someone makes when they care whether you eat well.",
  "Crisp dosa, fast service, and the filter coffee actually tastes like home.",
  "A Sunnyvale staple for South Indian vegetarian food without any fuss.",
];

export default function Home() {
  return (
    <main>
      <section className="new-hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">கோமளா விலாஸ் · Sunnyvale</p>
          <h1>
            The taste of South India, <span>turned all the way up.</span>
          </h1>
          <p className="lede">
            Komala Vilas is a warm, vegetarian South Indian kitchen for dosas,
            idli, thali, filter coffee, and the steady comfort of food made daily.
          </p>
          <div className="action-row">
            <Link className="button button-dark" href="/menu">
              Explore the Menu
            </Link>
            <a className="button button-light" href={orderUrl}>
              Order Online
            </a>
          </div>
          <div className="quick-info">
            <span className="status-dot" aria-hidden="true" />
            <strong>Open daily from 8:30 AM</strong>
            <span>1020 E El Camino Real, Sunnyvale</span>
            <a href="tel:+14087337400">{phone}</a>
          </div>
        </div>

        <div className="hero-photo-stack" aria-label="South Indian dishes from Komala Vilas">
          <Image className="hero-photo hero-photo-main" src="/images/masala-dosa.jpg" alt="Paper masala dosa with chutneys" width={1024} height={768} priority />
          <Image className="hero-photo hero-photo-float hero-photo-thali" src="/images/south-indian-thali.jpg" alt="South Indian vegetarian thali" width={900} height={1008} />
          <Image className="hero-photo hero-photo-float hero-photo-coffee" src="/images/filter-coffee.jpg" alt="South Indian filter coffee in dabarah" width={683} height={512} />
          <div className="price-card">
            <strong>$13.50</strong>
            <span>Unlimited Thali</span>
          </div>
        </div>
      </section>

      <section className="falling-spices" aria-label="Komala Vilas quote">
        <video
          className="spice-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/south-indian-breakfast.jpg"
        />
        <div className="spice-rain" aria-hidden="true">
          {Array.from({ length: 34 }).map((_, index) => (
            <span key={index} className={`falling-spice falling-spice-${(index % 5) + 1}`} />
          ))}
        </div>
        <blockquote>
          <p>Every meal should feel like someone was expecting you.</p>
          <cite>Fermented overnight · simmered slow · served with refills</cite>
        </blockquote>
      </section>

      <section className="section-shell home-feature-grid" aria-labelledby="plates-title">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">The signatures</p>
            <h2 id="plates-title">Built around the plate, not the pitch.</h2>
          </div>
          <Link href="/menu">Open the full menu</Link>
        </div>
        <div className="real-dish-grid">
          {signatureDishes.map((dish) => (
            <article key={dish.name} className="real-dish-card">
              <Image src={dish.image} alt={dish.name} width={900} height={675} />
              <div>
                <p>{dish.tamil}</p>
                <h3>{dish.name}</h3>
                <span>{dish.desc}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell split-story">
        <div>
          <p className="eyebrow">From breakfast to dinner</p>
          <h2>Easy enough for a weekday. Good enough to bring family.</h2>
          <p>
            The site is built around the workflows guests need: decide what to eat,
            understand the thali, get directions, and order without digging.
          </p>
          <div className="action-row">
            <Link className="button button-spice" href="/about">
              See the Timeline
            </Link>
            <a className="button button-light" href={mapUrl}>
              Get Directions
            </a>
          </div>
        </div>
        <Image src="/images/south-indian-breakfast.jpg" alt="South Indian breakfast with idli, vada, sambar, and chutney" width={1024} height={694} />
      </section>

      <section className="reviews" aria-labelledby="reviews-title">
        <div className="section-shell">
          <div className="center-heading">
            <p className="eyebrow">From the tables</p>
            <h2 id="reviews-title">&quot;One of the best in the Bay Area&quot;</h2>
          </div>
          <div className="review-grid">
            {reviews.map((quote) => (
              <article key={quote}>
                <div aria-label="Five stars">★★★★★</div>
                <p>&quot;{quote}&quot;</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell visit-strip" aria-label="Visit Komala Vilas">
        <div>
          <p className="eyebrow">Come hungry</p>
          <h2>1020 E El Camino Real, Sunnyvale</h2>
          <p>Open daily from 8:30 AM. Friday and Saturday nights run until 10:00 PM.</p>
        </div>
        <div className="action-row">
          <a className="button button-dark" href={mapUrl}>
            Get Directions
          </a>
          <a className="button button-light" href="tel:+14087337400">
            {phone}
          </a>
        </div>
      </section>
    </main>
  );
}
