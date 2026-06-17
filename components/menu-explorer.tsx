"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MotionSection } from "@/components/motion-shell";
import { menuSections } from "@/lib/menu";

const filters = ["All", "Vegan", "Popular", "Catering-friendly"] as const;

export function MenuExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return menuSections
      .map((section) => {
        const items = section.items.filter((item) => {
          const haystack = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
          const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
          const matchesFilter =
            filter === "All" ||
            (filter === "Popular" && item.popular) ||
            (filter === "Catering-friendly" && item.cateringFriendly) ||
            item.tags.includes(filter);
          return matchesQuery && matchesFilter;
        });
        return { ...section, items };
      })
      .filter((section) => section.items.length > 0);
  }, [filter, query]);

  return (
    <>
      <nav className="menu-filter-bar section-shell" aria-label="Menu categories">
        {menuSections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>

      <section className="section-shell menu-tools" aria-label="Menu search and filters">
        <label className="menu-search">
          <span>Search menu</span>
          <input
            value={query}
            placeholder="Search dosa, thali, coffee..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="menu-tabs" role="tablist" aria-label="Dietary and menu filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="section-shell menu-workspace">
        <aside className="menu-aside">
          <strong>Today&apos;s anchor</strong>
          <Image
            className="photo-grade"
            src="/images/masala-dosa.jpg"
            alt="Masala dosa"
            width={1024}
            height={768}
            quality={85}
          />
          <p>Unlimited South Indian Thali: $13.50</p>
          <Link className="button button-primary" href="/catering">
            Order Catering
          </Link>
        </aside>

        <div className="menu-list functional-menu-list">
          {filteredSections.map((section) => (
            <MotionSection id={section.id} key={section.id} className="menu-group">
              <div className="menu-group-heading">
                <h2 className="text-balance">{section.title}</h2>
                <span>{section.tamil}</span>
              </div>
              <p>{section.note}</p>
              {section.items.map((item) => (
                <div className="menu-item" key={item.name}>
                  <div>
                    <h3>
                      {item.name}
                      {[...item.tags, item.popular ? "Popular" : "", item.cateringFriendly ? "Catering-friendly" : ""]
                        .filter(Boolean)
                        .map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                    </h3>
                    <p>{item.description}</p>
                  </div>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </MotionSection>
          ))}
          {filteredSections.length === 0 ? (
            <div className="menu-group">
              <h2>No dishes found</h2>
              <p>Try a different search or filter.</p>
            </div>
          ) : null}
          <p className="menu-disclaimer">
            Menu and prices are representative and can rotate. Call (408) 733-7400
            for today&apos;s thali and specials.
          </p>
        </div>
      </section>
    </>
  );
}

