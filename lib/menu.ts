export type MenuItem = {
  name: string;
  description: string;
  price: string;
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

export const menuSections: MenuSection[] = [
  {
    id: "tiffin",
    title: "Tiffin & Breakfast",
    tamil: "டிபன்",
    note: "Served all day with sambar and fresh chutneys.",
    items: [
      { name: "Idli (2 pc)", description: "Steamed rice and lentil cakes.", price: "$5.50", tags: ["Vegan"], cateringFriendly: true },
      { name: "Sambar Idli", description: "Idli soaked in piping-hot sambar.", price: "$6.50", tags: [], popular: true },
      { name: "Mini Idli Sambar", description: "Button idlis bathed in sambar and ghee.", price: "$7.50", tags: [], cateringFriendly: true },
      { name: "Medu Vada (2 pc)", description: "Crisp savoury lentil donuts.", price: "$5.50", tags: ["Vegan"], popular: true, cateringFriendly: true },
      { name: "Ven Pongal", description: "Rice and moong dal with pepper, cumin, cashew, and ghee.", price: "$7.00", tags: [] },
      { name: "Poori Masala", description: "Two fluffy pooris with potato masala.", price: "$8.50", tags: [] },
    ],
  },
  {
    id: "dosa",
    title: "Dosas",
    tamil: "தோசை",
    note: "Made to order on the griddle. Ask for extra ghee.",
    items: [
      { name: "Plain Dosa", description: "Classic crisp rice crepe.", price: "$7.50", tags: ["Vegan"] },
      { name: "Ghee Roast Dosa", description: "Extra-long and lacquered with ghee.", price: "$9.50", tags: [], popular: true },
      { name: "Masala Dosa", description: "Folded over spiced potato masala.", price: "$9.50", tags: [], popular: true, cateringFriendly: true },
      { name: "Paper Masala Dosa", description: "Wafer-thin and extra crisp.", price: "$10.50", tags: ["Signature"], popular: true },
      { name: "Rava Onion Masala Dosa", description: "Lacy semolina dosa with onion.", price: "$10.50", tags: [] },
      { name: "Mysore Masala Dosa", description: "Spread with spicy red chutney.", price: "$10.50", tags: [] },
      { name: "Set Dosa with Vada Curry", description: "Soft spongy dosas with vada curry.", price: "$10.50", tags: ["House special"] },
    ],
  },
  {
    id: "thali",
    title: "Thali & Rice Plates",
    tamil: "சாப்பாடு",
    note: "The daily ritual: dishes rotate through the week.",
    items: [
      { name: "Unlimited South Indian Thali", description: "Six rotating dishes, rice, sambar, rasam, kootu, chips, sweet, and buttermilk. Refilled.", price: "$13.50", tags: ["Signature"], popular: true, cateringFriendly: true },
      { name: "Mini Thali", description: "A lighter set plate with the same home-style flavours.", price: "$11.50", tags: [] },
      { name: "Curd Rice", description: "Soft rice with yogurt and tempering.", price: "$7.50", tags: [] },
      { name: "Lemon / Tamarind Rice", description: "Tangy rice with peanuts and curry leaf.", price: "$8.00", tags: ["Vegan"], cateringFriendly: true },
      { name: "Bisi Bele Bath", description: "Spiced rice, lentil, and vegetable one-pot.", price: "$9.00", tags: [], cateringFriendly: true },
    ],
  },
  {
    id: "specials",
    title: "Griddle Specials",
    tamil: "ஸ்பெஷல்",
    note: "Less common South Indian favorites from the hot side of the kitchen.",
    items: [
      { name: "Veechu Parotta", description: "Flaky layered flatbread, tossed thin.", price: "$8.50", tags: ["House special"] },
      { name: "Chapati Kurma", description: "Two soft chapatis with vegetable kurma.", price: "$9.00", tags: [] },
      { name: "Parotta with Vada Curry", description: "Layered parotta and rich vada curry.", price: "$10.50", tags: [] },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Sweets",
    tamil: "பானங்கள்",
    note: "End the way every Tamil meal should.",
    items: [
      { name: "Filter Coffee", description: "Degree coffee in a steel tumbler.", price: "$3.50", tags: ["Popular"], popular: true },
      { name: "Masala Chai", description: "Spiced milk tea.", price: "$3.50", tags: [] },
      { name: "Rose Milk", description: "Chilled milk with rose syrup.", price: "$4.50", tags: [] },
      { name: "Sweet / Salt Lassi", description: "Whipped yogurt cooler.", price: "$4.50", tags: [] },
      { name: "Badam Milk", description: "Almond and saffron milk.", price: "$4.50", tags: [] },
      { name: "Gulab Jamun (2 pc)", description: "Warm syrup-soaked dumplings.", price: "$4.00", tags: [] },
    ],
  },
];

