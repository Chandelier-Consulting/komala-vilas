"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  MotionCard,
  MotionLayoutGroup,
  MotionLayoutItem,
  MotionLink,
  MotionPresence,
} from "@/components/motion-shell";
import type { MenuSection } from "@/lib/menu";

const CHAPTER_ACCENTS = [
  "var(--color-tamarind)",
  "var(--color-leaf)",
  "var(--color-brass)",
  "var(--color-vermilion)",
  "var(--color-rosewood)",
  "var(--color-turmeric)",
];

function chapterNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function getItemBadges(item: {
  tags: string[];
  popular?: boolean;
  cateringFriendly?: boolean;
}) {
  return [
    ...item.tags,
    item.popular ? "Popular" : "",
    item.cateringFriendly ? "Catering-friendly" : "",
  ].filter(Boolean);
}

export function MenuExplorer({
  menuSections,
  anchorImageSrc,
  anchorImageAlt,
}: {
  menuSections: MenuSection[];
  anchorImageSrc: string;
  anchorImageAlt: string;
}) {
  const [query, setQuery] = useState("");
  const [expandedItemKey, setExpandedItemKey] = useState("");
  const [activeChapter, setActiveChapter] = useState(menuSections[0]?.id ?? "");

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return menuSections;

    return menuSections
      .map((section) => {
        const items = section.items.filter((item) => {
          const haystack = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });
        return { ...section, items };
      })
      .filter((section) => section.items.length > 0);
  }, [menuSections, query]);

  const isBrowsingAll = query.trim() === "";

  useEffect(() => {
    const sectionEls = filteredSections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sectionEls.length === 0) return;

    // Scroll-spy by "last heading crossed above the activation line" rather than
    // intersection ratio: a ratio comparison picks short sections over sections
    // taller than the viewport, which can never show a high visible ratio.
    const activationLine = 160;
    let ticking = false;

    function updateActiveChapter() {
      ticking = false;
      let current = sectionEls[0];
      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top <= activationLine) {
          current = el;
        }
      }
      setActiveChapter(current.id);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveChapter);
    }

    updateActiveChapter();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filteredSections]);

  return (
    <div className="section-shell menu-workspace">
      <MotionCard className="menu-aside">
        <nav className="chapter-rail" aria-label="Menu chapters">
          {menuSections.map((section, index) => (
            <MotionLink
              key={section.id}
              href={`#${section.id}`}
              className={activeChapter === section.id ? "chapter-link active" : "chapter-link"}
              ariaCurrent={activeChapter === section.id ? "page" : undefined}
            >
              <span className="chapter-link-index">{chapterNumber(index)}</span>
              <span className="chapter-link-name">{section.title}</span>
            </MotionLink>
          ))}
        </nav>

        <div className="menu-anchor-card">
          <strong>Today&apos;s anchor</strong>
          <Image
            className="photo-grade"
            src={anchorImageSrc}
            alt={anchorImageAlt}
            width={1024}
            height={768}
            quality={85}
          />
          <p>Daily Lunch Thali: $16.50</p>
          <MotionLink className="button button-primary" href="/catering">
            Order Catering
          </MotionLink>
        </div>
      </MotionCard>

      <div className="menu-content">
        <div className="menu-tools">
          <label className="menu-search">
            <span>Search menu</span>
            <input
              value={query}
              placeholder="Search dosa, thali, coffee..."
              onChange={(event) => {
                setQuery(event.target.value);
                setExpandedItemKey("");
              }}
            />
          </label>
        </div>

        <MotionLayoutGroup className="menu-list functional-menu-list">
          <MotionPresence>
            {filteredSections.map((section, index) => {
              const accent = CHAPTER_ACCENTS[index % CHAPTER_ACCENTS.length];
              const [featuredItem, ...restItems] = section.items;
              const showFeatured = isBrowsingAll && Boolean(featuredItem);
              const gridItems = showFeatured ? restItems : section.items;

              return (
                <div key={section.id}>
                  <section
                    id={section.id}
                    className="menu-group"
                    style={{ "--chapter-accent": accent } as CSSProperties}
                  >
                    <div className="menu-group-heading">
                      <span className="chapter-index" aria-hidden="true">
                        {chapterNumber(index)}
                      </span>
                      <div className="menu-group-heading-text">
                        <h2 className="text-balance">{section.title}</h2>
                        <span className="chapter-tamil">{section.tamil}</span>
                      </div>
                    </div>
                    <p>{section.note}</p>

                    {showFeatured && featuredItem ? (
                      <div className="menu-featured">
                        <span className="menu-featured-label">Featured</span>
                        <div className="menu-featured-card">
                          <Image
                            className="menu-featured-photo photo-grade"
                            src={featuredItem.image.src}
                            alt={featuredItem.image.alt}
                            width={featuredItem.image.width}
                            height={featuredItem.image.height}
                            quality={88}
                          />
                          <div className="menu-featured-body">
                            <div className="menu-item-title">
                              <span>{featuredItem.name}</span>
                              {featuredItem.price ? <strong>{featuredItem.price}</strong> : null}
                            </div>
                            {getItemBadges(featuredItem).length > 0 ? (
                              <div className="menu-item-badges">
                                {getItemBadges(featuredItem).map((tag) => (
                                  <span key={tag}>{tag}</span>
                                ))}
                              </div>
                            ) : null}
                            {featuredItem.description ? <p>{featuredItem.description}</p> : null}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <MotionLayoutGroup className="menu-items-list">
                      <MotionPresence>
                        {gridItems.map((item) => {
                          const itemKey = item.id;
                          const detailsId = `${itemKey}-details`;
                          const isExpanded = expandedItemKey === itemKey;

                          return (
                            <MotionLayoutItem
                              className={isExpanded ? "menu-item expanded" : "menu-item"}
                              key={item.id}
                              onMouseEnter={() => setExpandedItemKey(itemKey)}
                              onMouseLeave={() => setExpandedItemKey((current) => (current === itemKey ? "" : current))}
                            >
                              <div
                                className="menu-item-accordion"
                                aria-expanded={isExpanded}
                                aria-controls={detailsId}
                                tabIndex={0}
                                role="button"
                                onClick={() => setExpandedItemKey(isExpanded ? "" : itemKey)}
                                onFocus={() => setExpandedItemKey(itemKey)}
                                onBlur={() => setExpandedItemKey("")}
                                onKeyDown={(event) => {
                                  if (event.key !== "Enter" && event.key !== " ") return;

                                  event.preventDefault();
                                  setExpandedItemKey(isExpanded ? "" : itemKey);
                                }}
                              >
                                <Image
                                  className="menu-item-photo photo-grade"
                                  src={item.image.src}
                                  alt={item.image.alt}
                                  width={item.image.width}
                                  height={item.image.height}
                                  quality={82}
                                />
                                <div className="menu-item-summary">
                                  <div className="menu-item-title">
                                    <span>{item.name}</span>
                                    {item.price ? <strong>{item.price}</strong> : null}
                                  </div>
                                  {getItemBadges(item).length > 0 ? (
                                    <div className="menu-item-badges">
                                      {getItemBadges(item).map((tag) => (
                                        <span key={tag}>{tag}</span>
                                      ))}
                                    </div>
                                  ) : null}
                                  <MotionPresence>
                                    {isExpanded && item.description ? (
                                      <MotionLayoutItem id={detailsId} className="menu-item-details">
                                        <p>{item.description}</p>
                                      </MotionLayoutItem>
                                    ) : null}
                                  </MotionPresence>
                                </div>
                              </div>
                            </MotionLayoutItem>
                          );
                        })}
                      </MotionPresence>
                    </MotionLayoutGroup>
                  </section>
                </div>
              );
            })}
            {filteredSections.length === 0 ? (
              <MotionLayoutItem className="menu-group">
                <h2>No dishes found</h2>
                <p>Try a different search or filter.</p>
              </MotionLayoutItem>
            ) : null}
          </MotionPresence>
          <p className="menu-disclaimer">
            Menu and prices are representative and can rotate. Call (408) 733-7400
            for today&apos;s thali and specials.
          </p>
        </MotionLayoutGroup>
      </div>
    </div>
  );
}
