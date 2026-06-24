"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  MotionCard,
  MotionDiv,
  MotionLayoutGroup,
  MotionLayoutItem,
  MotionLink,
  MotionPresence,
  MotionSection,
} from "@/components/motion-shell";
import type { MenuSection } from "@/lib/menu";

const filters = ["All", "Vegan", "Popular", "Catering-friendly"] as const;

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
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [expandedItemKey, setExpandedItemKey] = useState("");

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
  }, [filter, menuSections, query]);

  return (
    <>
      <nav className="menu-filter-bar section-shell" aria-label="Menu categories">
        {menuSections.map((section) => (
          <MotionLink key={section.id} href={`#${section.id}`}>
            {section.title}
          </MotionLink>
        ))}
      </nav>

      <MotionSection className="section-shell menu-tools">
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
        <div className="menu-tabs" role="tablist" aria-label="Dietary and menu filters">
          {filters.map((item) => (
            <MotionDiv key={item} className="menu-tab-motion">
              <button
                type="button"
                className={filter === item ? "active" : ""}
                onClick={() => {
                  setFilter(item);
                  setExpandedItemKey("");
                }}
              >
                {item}
              </button>
            </MotionDiv>
          ))}
        </div>
      </MotionSection>

      <div className="section-shell menu-workspace">
        <MotionCard className="menu-aside">
          <strong>Today&apos;s anchor</strong>
          <Image
            className="photo-grade"
            src={anchorImageSrc}
            alt={anchorImageAlt}
            width={1024}
            height={768}
            quality={85}
          />
          <p>Unlimited South Indian Thali: $13.50</p>
          <MotionLink className="button button-primary" href="/catering">
            Order Catering
          </MotionLink>
        </MotionCard>

        <MotionLayoutGroup className="menu-list functional-menu-list">
          <MotionPresence>
            {filteredSections.map((section) => (
              <MotionLayoutItem key={section.id}>
                <MotionSection id={section.id} className="menu-group">
                  <div className="menu-group-heading">
                    <h2 className="text-balance">{section.title}</h2>
                    <span>{section.tamil}</span>
                  </div>
                  <p>{section.note}</p>
                  <MotionLayoutGroup className="menu-items-list">
                    <MotionPresence>
                      {section.items.map((item) => {
                        const itemKey = item.id;
                        const detailsId = `${itemKey}-details`;
                        const isExpanded = expandedItemKey === itemKey;

                        return (
                          <MotionLayoutItem
                            className={isExpanded ? "menu-item expanded" : "menu-item"}
                            key={item.name}
                            onMouseEnter={() => setExpandedItemKey(itemKey)}
                            onMouseLeave={() => setExpandedItemKey("")}
                          >
                            <div
                              className="menu-item-accordion"
                              aria-expanded={isExpanded}
                              aria-controls={detailsId}
                              tabIndex={0}
                              role="button"
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
                              <span className="menu-item-summary">
                                <span className="menu-item-title">
                                  <span>{item.name}</span>
                                  <span className="menu-item-badges">
                                    {getItemBadges(item).map((tag) => (
                                      <span key={tag}>{tag}</span>
                                    ))}
                                  </span>
                                </span>
                                <MotionPresence>
                                  {isExpanded ? (
                                    <MotionLayoutItem id={detailsId} className="menu-item-details">
                                      <p>{item.description}</p>
                                    </MotionLayoutItem>
                                  ) : null}
                                </MotionPresence>
                              </span>
                              <strong>{item.price}</strong>
                            </div>
                          </MotionLayoutItem>
                        );
                      })}
                    </MotionPresence>
                  </MotionLayoutGroup>
                </MotionSection>
              </MotionLayoutItem>
            ))}
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
    </>
  );
}
