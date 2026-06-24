import { resolveImageAsset, type ImageAsset, type MenuItemOverride, type ResolvedImage } from "./content";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: ResolvedImage;
  tags: string[];
  popular?: boolean;
  cateringFriendly?: boolean;
};

export type MenuSection = {
  id: string;
  title: string;
  tamil: string;
  note: string;
  items: MenuItem[];
};

function defaultImage(assetId: string, src: string, alt: string, width = 1200, height = 900): ResolvedImage {
  return { assetId, src, alt, width, height };
}

export const defaultMenuSections: MenuSection[] = [
  {
    id: "tiffin",
    title: "Tiffin & Breakfast",
    tamil: "டிபன்",
    note: "Served all day with sambar and fresh chutneys.",
    items: [
      { id: "tiffin-idli", name: "Idli (2 pc)", description: "Steamed rice and lentil cakes.", price: "$5.50", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Idli and chutneys"), tags: ["Vegan"], cateringFriendly: true },
      { id: "tiffin-sambar-idli", name: "Sambar Idli", description: "Idli soaked in piping-hot sambar.", price: "$6.50", image: defaultImage("default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Sambar idli"), tags: [], popular: true },
      { id: "tiffin-mini-idli-sambar", name: "Mini Idli Sambar", description: "Button idlis bathed in sambar and ghee.", price: "$7.50", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Mini idli sambar"), tags: [], cateringFriendly: true },
      { id: "tiffin-medu-vada", name: "Medu Vada (2 pc)", description: "Crisp savoury lentil donuts.", price: "$5.50", image: defaultImage("default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Medu vada"), tags: ["Vegan"], popular: true, cateringFriendly: true },
      { id: "tiffin-ven-pongal", name: "Ven Pongal", description: "Rice and moong dal with pepper, cumin, cashew, and ghee.", price: "$7.00", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Ven pongal"), tags: [] },
      { id: "tiffin-poori-masala", name: "Poori Masala", description: "Two fluffy pooris with potato masala.", price: "$8.50", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Poori masala"), tags: [] },
    ],
  },
  {
    id: "dosa",
    title: "Dosas",
    tamil: "தோசை",
    note: "Made to order on the griddle. Ask for extra ghee.",
    items: [
      { id: "dosa-plain-dosa", name: "Plain Dosa", description: "Classic crisp rice crepe.", price: "$7.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Plain dosa"), tags: ["Vegan"] },
      { id: "dosa-ghee-roast-dosa", name: "Ghee Roast Dosa", description: "Extra-long and lacquered with ghee.", price: "$9.50", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Ghee roast dosa"), tags: [], popular: true },
      { id: "dosa-masala-dosa", name: "Masala Dosa", description: "Folded over spiced potato masala.", price: "$9.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Masala dosa"), tags: [], popular: true, cateringFriendly: true },
      { id: "dosa-paper-masala-dosa", name: "Paper Masala Dosa", description: "Wafer-thin and extra crisp.", price: "$10.50", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Paper masala dosa"), tags: ["Signature"], popular: true },
      { id: "dosa-rava-onion-masala-dosa", name: "Rava Onion Masala Dosa", description: "Lacy semolina dosa with onion.", price: "$10.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Rava onion masala dosa"), tags: [] },
      { id: "dosa-mysore-masala-dosa", name: "Mysore Masala Dosa", description: "Spread with spicy red chutney.", price: "$10.50", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Mysore masala dosa"), tags: [] },
      { id: "dosa-set-dosa-vada-curry", name: "Set Dosa with Vada Curry", description: "Soft spongy dosas with vada curry.", price: "$10.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Set dosa with vada curry"), tags: ["House special"] },
    ],
  },
  {
    id: "thali",
    title: "Thali & Rice Plates",
    tamil: "சாப்பாடு",
    note: "The daily ritual: dishes rotate through the week.",
    items: [
      { id: "thali-unlimited-thali", name: "Unlimited South Indian Thali", description: "Six rotating dishes, rice, sambar, rasam, kootu, chips, sweet, and buttermilk. Refilled.", price: "$13.50", image: defaultImage("default-signature-thali", "/images/signature-thali.jpg", "Unlimited South Indian thali"), tags: ["Signature"], popular: true, cateringFriendly: true },
      { id: "thali-mini-thali", name: "Mini Thali", description: "A lighter set plate with the same home-style flavours.", price: "$11.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mini thali"), tags: [] },
      { id: "thali-curd-rice", name: "Curd Rice", description: "Soft rice with yogurt and tempering.", price: "$7.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Curd rice"), tags: [] },
      { id: "thali-lemon-tamarind-rice", name: "Lemon / Tamarind Rice", description: "Tangy rice with peanuts and curry leaf.", price: "$8.00", image: defaultImage("default-signature-thali", "/images/signature-thali.jpg", "Lemon and tamarind rice"), tags: ["Vegan"], cateringFriendly: true },
      { id: "thali-bisi-bele-bath", name: "Bisi Bele Bath", description: "Spiced rice, lentil, and vegetable one-pot.", price: "$9.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Bisi bele bath"), tags: [], cateringFriendly: true },
    ],
  },
  {
    id: "specials",
    title: "Griddle Specials",
    tamil: "ஸ்பெஷல்",
    note: "Less common South Indian favorites from the hot side of the kitchen.",
    items: [
      { id: "specials-veechu-parotta", name: "Veechu Parotta", description: "Flaky layered flatbread, tossed thin.", price: "$8.50", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Veechu parotta"), tags: ["House special"] },
      { id: "specials-chapati-kurma", name: "Chapati Kurma", description: "Two soft chapatis with vegetable kurma.", price: "$9.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Chapati kurma"), tags: [] },
      { id: "specials-parotta-vada-curry", name: "Parotta with Vada Curry", description: "Layered parotta and rich vada curry.", price: "$10.50", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Parotta with vada curry"), tags: [] },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Sweets",
    tamil: "பானங்கள்",
    note: "End the way every Tamil meal should.",
    items: [
      { id: "drinks-filter-coffee", name: "Filter Coffee", description: "Degree coffee in a steel tumbler.", price: "$3.50", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Filter coffee"), tags: ["Popular"], popular: true },
      { id: "drinks-masala-chai", name: "Masala Chai", description: "Spiced milk tea.", price: "$3.50", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Masala chai"), tags: [] },
      { id: "drinks-rose-milk", name: "Rose Milk", description: "Chilled milk with rose syrup.", price: "$4.50", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Rose milk"), tags: [] },
      { id: "drinks-lassi", name: "Sweet / Salt Lassi", description: "Whipped yogurt cooler.", price: "$4.50", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Lassi"), tags: [] },
      { id: "drinks-badam-milk", name: "Badam Milk", description: "Almond and saffron milk.", price: "$4.50", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Badam milk"), tags: [] },
      { id: "drinks-gulab-jamun", name: "Gulab Jamun (2 pc)", description: "Warm syrup-soaked dumplings.", price: "$4.00", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Gulab jamun"), tags: [] },
    ],
  },
];

export const menuSections = defaultMenuSections;

export function buildAssetMap(sections: MenuSection[]) {
  return sections.reduce<Record<string, ImageAsset>>((assets, section) => {
    for (const item of section.items) {
      assets[item.image.assetId] = {
        id: item.image.assetId,
        label: item.name,
        alt: item.image.alt,
        kind: "default",
        src: item.image.src,
        width: item.image.width,
        height: item.image.height,
        status: "active",
      };
    }
    return assets;
  }, {});
}

export function mergeMenuContent(
  sections: MenuSection[],
  input: {
    itemOverrides: Record<string, MenuItemOverride>;
    assets: Record<string, ImageAsset>;
  },
) {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const override = input.itemOverrides[item.id] ?? {};

      return {
        ...item,
        name: override.name ?? item.name,
        description: override.description ?? item.description,
        price: override.price ?? item.price,
        tags: override.tags ?? item.tags,
        popular: override.popular ?? item.popular,
        cateringFriendly: override.cateringFriendly ?? item.cateringFriendly,
        image: resolveImageAsset(item.image, override.imageAssetId, input.assets),
      };
    }),
  }));
}

export function flattenMenuItems(sections: MenuSection[]) {
  return sections.flatMap((section) => section.items.map((item) => ({ sectionId: section.id, sectionTitle: section.title, ...item })));
}
