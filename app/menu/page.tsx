import Link from "next/link";
import Image from "next/image";

const orderUrl = "https://komalavilas.com";

const menuSections = [
  {
    id: "tiffin",
    title: "Tiffin & Breakfast",
    tamil: "டிபன்",
    note: "Served all day with sambar and fresh chutneys.",
    items: [
      ["Idli (2 pc)", "Steamed rice and lentil cakes.", "$5.50", "Vegan"],
      ["Sambar Idli", "Idli soaked in piping-hot sambar.", "$6.50", ""],
      ["Mini Idli Sambar", "Button idlis bathed in sambar and ghee.", "$7.50", ""],
      ["Medu Vada (2 pc)", "Crisp savoury lentil donuts.", "$5.50", "Vegan"],
      ["Ven Pongal", "Rice and moong dal with pepper, cumin, cashew, and ghee.", "$7.00", ""],
      ["Poori Masala", "Two fluffy pooris with potato masala.", "$8.50", ""],
    ],
  },
  {
    id: "dosa",
    title: "Dosas",
    tamil: "தோசை",
    note: "Made to order on the griddle. Ask for extra ghee.",
    items: [
      ["Plain Dosa", "Classic crisp rice crepe.", "$7.50", "Vegan"],
      ["Ghee Roast Dosa", "Extra-long and lacquered with ghee.", "$9.50", ""],
      ["Masala Dosa", "Folded over spiced potato masala.", "$9.50", ""],
      ["Paper Masala Dosa", "Wafer-thin and extra crisp.", "$10.50", ""],
      ["Rava Onion Masala Dosa", "Lacy semolina dosa with onion.", "$10.50", ""],
      ["Mysore Masala Dosa", "Spread with spicy red chutney.", "$10.50", ""],
      ["Set Dosa with Vada Curry", "Soft spongy dosas with vada curry.", "$10.50", "House special"],
    ],
  },
  {
    id: "uthappam",
    title: "Uthappam",
    tamil: "ஊத்தப்பம்",
    note: "Thick, soft griddle pancakes with toppings.",
    items: [
      ["Onion Uthappam", "Topped with onion and green chili.", "$9.50", ""],
      ["Tomato Onion Uthappam", "Onion, tomato, and coriander.", "$10.00", ""],
      ["Mixed Veg Uthappam", "Onion, tomato, carrot, and capsicum.", "$10.50", "Vegan"],
    ],
  },
  {
    id: "thali",
    title: "Thali & Rice Plates",
    tamil: "சாப்பாடு",
    note: "The daily ritual: dishes rotate through the week.",
    items: [
      [
        "Unlimited South Indian Thali",
        "Six rotating dishes, rice, sambar, rasam, kootu, chips, sweet, and buttermilk. Refilled.",
        "$13.50",
        "Signature",
      ],
      ["Mini Thali", "A lighter set plate with the same home-style flavours.", "$11.50", ""],
      ["Curd Rice", "Soft rice with yogurt and tempering.", "$7.50", ""],
      ["Lemon / Tamarind Rice", "Tangy rice with peanuts and curry leaf.", "$8.00", "Vegan"],
      ["Bisi Bele Bath", "Spiced rice, lentil, and vegetable one-pot.", "$9.00", ""],
    ],
  },
  {
    id: "specials",
    title: "Griddle Specials",
    tamil: "ஸ்பெஷல்",
    note: "Less common South Indian favorites from the hot side of the kitchen.",
    items: [
      ["Veechu Parotta", "Flaky layered flatbread, tossed thin.", "$8.50", "House special"],
      ["Chapati Kurma", "Two soft chapatis with vegetable kurma.", "$9.00", ""],
      ["Parotta with Vada Curry", "Layered parotta and rich vada curry.", "$10.50", ""],
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Sweets",
    tamil: "பானங்கள்",
    note: "End the way every Tamil meal should.",
    items: [
      ["Filter Coffee", "Degree coffee in a steel tumbler.", "$3.50", ""],
      ["Masala Chai", "Spiced milk tea.", "$3.50", ""],
      ["Rose Milk", "Chilled milk with rose syrup.", "$4.50", ""],
      ["Sweet / Salt Lassi", "Whipped yogurt cooler.", "$4.50", ""],
      ["Badam Milk", "Almond and saffron milk.", "$4.50", ""],
      ["Gulab Jamun (2 pc)", "Warm syrup-soaked dumplings.", "$4.00", ""],
    ],
  },
];

export default function MenuPage() {
  return (
    <main className="menu-page">
      <section className="section-shell menu-hero">
        <div>
          <p className="eyebrow">கோமளா விலாஸ் · Pure Vegetarian</p>
          <h1>The Menu</h1>
          <p>
            A practical all-day menu for quick scanning: breakfast staples,
            griddle dosas, thali, rice plates, drinks, and sweets.
          </p>
        </div>
        <Image src="/images/south-indian-thali.jpg" alt="South Indian vegetarian thali" width={900} height={1008} priority />
      </section>

      <nav className="menu-filter-bar section-shell" aria-label="Menu categories">
        {menuSections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>

      <section className="section-shell menu-workspace">
        <aside className="menu-aside">
          <strong>Today&apos;s anchor</strong>
          <Image src="/images/masala-dosa.jpg" alt="Masala dosa" width={1024} height={768} />
          <p>Unlimited South Indian Thali: $13.50</p>
          <a className="button button-spice" href={orderUrl}>
            Order Online
          </a>
          <Link className="button button-light" href="/about">
            Why Komala Vilas
          </Link>
        </aside>

        <div className="menu-list functional-menu-list">
          {menuSections.map((section) => (
            <section id={section.id} key={section.id} className="menu-group">
              <div className="menu-group-heading">
                <h2>{section.title}</h2>
                <span>{section.tamil}</span>
              </div>
              <p>{section.note}</p>
              {section.items.map(([name, desc, price, tag]) => (
                <div className="menu-item" key={name}>
                  <div>
                    <h3>
                      {name}
                      {tag ? <span>{tag}</span> : null}
                    </h3>
                    <p>{desc}</p>
                  </div>
                  <span className="menu-dots" aria-hidden="true" />
                  <strong>{price}</strong>
                </div>
              ))}
            </section>
          ))}
          <p className="menu-disclaimer">
            Menu and prices are representative and can rotate. Call (408) 733-7400
            for today&apos;s thali and specials.
          </p>
        </div>
      </section>
    </main>
  );
}
