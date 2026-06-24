import { resolveImageAsset, type ImageAsset, type ResolvedImage, type SitePhotoAssignment } from "./content";

export type SitePhotoSlot = {
  id: string;
  label: string;
  description: string;
  image: ResolvedImage;
};

function slot(id: string, label: string, description: string, assetId: string, src: string, alt: string, width: number, height: number): SitePhotoSlot {
  return {
    id,
    label,
    description,
    image: { assetId, src, alt, width, height },
  };
}

export const defaultSitePhotoSlots: Record<string, SitePhotoSlot> = {
  "home-hero": slot("home-hero", "Home hero", "Main landing image on the homepage.", "default-home-hero", "/images/south-indian-thali.jpg", "South Indian vegetarian thali on a banana leaf", 900, 1008),
  "home-hero-corner-top": slot("home-hero-corner-top", "Home hero corner: top", "Top circular image beside the homepage hero.", "default-home-hero-corner-top", "/images/signature-paper-dosa.jpg", "Paper masala dosa", 900, 675),
  "home-hero-corner-bottom": slot("home-hero-corner-bottom", "Home hero corner: bottom", "Bottom circular image beside the homepage hero.", "default-home-hero-corner-bottom", "/images/signature-idli-vada.jpg", "Idli vada sambar", 900, 675),
  "home-signature-paper-dosa": slot("home-signature-paper-dosa", "Home signature: paper dosa", "Signature dish card on the homepage.", "default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Paper masala dosa", 900, 675),
  "home-signature-thali": slot("home-signature-thali", "Home signature: thali", "Signature dish card on the homepage.", "default-signature-thali", "/images/signature-thali.jpg", "Unlimited South Indian thali", 900, 675),
  "home-signature-idli-vada": slot("home-signature-idli-vada", "Home signature: idli vada", "Signature dish card on the homepage.", "default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Idli vada sambar", 900, 675),
  "home-order-panel-backdrop": slot("home-order-panel-backdrop", "Home order panel backdrop", "Backdrop image behind the pickup, directions, and catering panel on the homepage.", "default-home-order-panel-backdrop", "/images/komala-vilas-premium-hero.jpg", "Komala Vilas background photo", 1400, 1800),
  "home-catering-feature": slot("home-catering-feature", "Home catering feature", "Catering section image on the homepage.", "default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "South Indian breakfast with idli, vada, sambar, and chutney", 1024, 694),
  "menu-hero": slot("menu-hero", "Menu hero", "Hero image on the menu page.", "default-south-indian-thali", "/images/south-indian-thali.jpg", "South Indian vegetarian thali", 900, 1008),
  "menu-anchor": slot("menu-anchor", "Menu anchor card", "Pinned image beside the menu explorer.", "default-masala-dosa", "/images/masala-dosa.jpg", "Masala dosa", 1024, 768),
  "about-hero": slot("about-hero", "About hero", "Hero image on the about page.", "default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "South Indian breakfast plate", 1024, 694),
  "about-timeline-before-opening": slot("about-timeline-before-opening", "About timeline: before opening", "Timeline card image on the about page.", "default-idli-vada", "/images/idli-vada.jpg", "Idli and chutneys", 520, 360),
  "about-timeline-morning": slot("about-timeline-morning", "About timeline: morning griddle", "Timeline card image on the about page.", "default-masala-dosa", "/images/masala-dosa.jpg", "Masala dosa", 520, 360),
  "about-timeline-lunch": slot("about-timeline-lunch", "About timeline: lunch thali", "Timeline card image on the about page.", "default-south-indian-thali", "/images/south-indian-thali.jpg", "South Indian thali", 520, 360),
  "about-timeline-coffee": slot("about-timeline-coffee", "About timeline: coffee", "Timeline card image on the about page.", "default-filter-coffee", "/images/filter-coffee.jpg", "Filter coffee", 520, 360),
  "catering-hero": slot("catering-hero", "Catering hero", "Hero image on the catering page.", "default-south-indian-thali", "/images/south-indian-thali.jpg", "Catering-ready South Indian vegetarian thali", 900, 1008),
  "catering-package-temple-feast": slot("catering-package-temple-feast", "Catering package: temple feast", "Package card image on the catering page.", "default-south-indian-thali", "/images/south-indian-thali.jpg", "Temple feast catering", 900, 675),
  "catering-package-tiffin-table": slot("catering-package-tiffin-table", "Catering package: tiffin table", "Package card image on the catering page.", "default-idli-vada", "/images/idli-vada.jpg", "Tiffin table catering", 900, 675),
  "catering-package-dosa-counter": slot("catering-package-dosa-counter", "Catering package: dosa counter", "Package card image on the catering page.", "default-masala-dosa", "/images/masala-dosa.jpg", "Dosa counter catering", 900, 675),
};

export function resolveSitePhotoSlots(
  slots: Record<string, SitePhotoSlot>,
  input: {
    assignments: Record<string, SitePhotoAssignment>;
    assets: Record<string, ImageAsset>;
  },
) {
  return Object.fromEntries(
    Object.entries(slots).map(([slotId, slotValue]) => [
      slotId,
      {
        ...slotValue,
        image: resolveImageAsset(slotValue.image, input.assignments[slotId]?.assetId, input.assets),
      },
    ]),
  ) as Record<string, SitePhotoSlot>;
}
