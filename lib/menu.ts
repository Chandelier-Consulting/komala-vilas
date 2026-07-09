import { resolveImageAsset, type CustomMenuItem, type ImageAsset, type MenuItemOverride, type ResolvedImage } from "./content";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: ResolvedImage;
  tags: string[];
  popular?: boolean;
  cateringFriendly?: boolean;
  available?: boolean;
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
    id: "idlis",
    title: "Idlis",
    tamil: "இட்லி",
    note: "Steamed rice and lentil cakes, served with sambar and chutneys.",
    items: [
      { id: "idlis-idlis-3", name: "Idlis (3)", description: "Soft, steamed rice cakes made from fermented rice and lentil batter.", price: "$8.50", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Idlis"), tags: [], popular: true },
      { id: "idlis-mini-idlis-14", name: "Mini Idlis (14)", description: "14 pieces.", price: "$8.50", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Mini idlis") , tags: [] },
      { id: "idlis-sambar-idli-2", name: "Sambar Idli (2) - Dipped", description: "Soft idlis immersed in a rich, spiced lentil and vegetable stew.", price: "$8.50", image: defaultImage("default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Sambar idli"), tags: [] },
    ],
  },
  {
    id: "vadas",
    title: "Vadas",
    tamil: "வடை",
    note: "Crisp savoury lentil doughnuts.",
    items: [
      { id: "vadas-vada-2", name: "Vada (2)", description: "Two pieces.", price: "$6.50", image: defaultImage("default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Vada"), tags: [] },
      { id: "vadas-sambar-vada-2", name: "Sambhar Vada (2) - Dipped", description: "Lentil doughnuts soaked in a tangy, spiced lentil stew.", price: "$8.50", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Sambhar vada"), tags: [] },
    ],
  },
  {
    id: "pongal-upma",
    title: "Pongal & Upma",
    tamil: "பொங்கல் & உப்புமா",
    note: "Savoury breakfast porridges.",
    items: [
      { id: "pongal-upma-pongal", name: "Pongal", description: "Creamy rice and lentil porridge with tempered spices and a hint of ghee.", price: "$8.99", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Pongal"), tags: [] },
      { id: "pongal-upma-upma", name: "Upma", description: "", price: "$7.99", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Upma"), tags: [] },
    ],
  },
  {
    id: "combos",
    title: "Combos",
    tamil: "காம்போ",
    note: "Idli, vada, pongal, and upma, mixed and matched.",
    items: [
      { id: "combos-idli3-vada1", name: "Idlis (3) + Vada (1)", description: "Three pieces idlis and one piece vada.", price: "$9.75", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Idlis and vada combo"), tags: [] },
      { id: "combos-idli2-vada2", name: "Idlis (2) + Vada (2)", description: "Soft steamed rice cakes paired with crispy lentil doughnuts, served with a side of sambar and coconut chutney.", price: "$9.75", image: defaultImage("default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Idlis and vada combo"), tags: [] },
      { id: "combos-upma-half-idli1-vada1", name: "Upma (1/2) + Idli (1) + Vada (1)", description: "Soft steamed rice cake, savory semolina porridge with spices, and a crispy lentil doughnut. Served with sambar and chutneys.", price: "$9.75", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Upma idli vada combo"), tags: [] },
      { id: "combos-pongal-half-idli1-vada1", name: "Pongal (1/2) + Idli (1) + Vada (1)", description: "Creamy pongal with a hint of spices, paired with a soft idli and a crispy vada, served with a side of tangy sambar.", price: "$9.75", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Pongal idli vada combo"), tags: [] },
      { id: "combos-sambar-idli1-vada1-dipped", name: "Sambar Idli (1) + Vada (1) Dipped", description: "", price: "$8.00", image: defaultImage("default-idli-vada", "/images/idli-vada.jpg", "Sambar idli and vada dipped"), tags: [] },
      { id: "combos-idli1-vada1", name: "Idli (1) + Vada (1)", description: "Sambar side.", price: "$6.50", image: defaultImage("default-signature-idli-vada", "/images/signature-idli-vada.jpg", "Idli and vada"), tags: [] },
      { id: "combos-pongal1-vada1", name: "Pongal (1) + Vada (1)", description: "One pongal and one piece vada.", price: "$9.75", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Pongal and vada"), tags: [] },
      { id: "combos-upma1-vada1", name: "Upma (1) + Vada (1)", description: "One upma and one piece vada.", price: "$9.75", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Upma and vada"), tags: [] },
    ],
  },
  {
    id: "uthappams",
    title: "Uthappams",
    tamil: "உத்தப்பம்",
    note: "Thick savoury pancakes topped and griddled to order.",
    items: [
      { id: "uthappams-tomato-onion-chili", name: "Tomato Onion Chili Uthappam", description: "A thick pancake topped with fresh tomatoes, onions, and chilies, served with coconut chutney, tomato chutney, and sambar.", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Tomato onion chili uthappam"), tags: [] },
      { id: "uthappams-vegetable", name: "Vegetable Uthappam", description: "A savory pancake topped with diced tomatoes, onions, and shredded cabbage, paired with a side of flavorful sambar.", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Vegetable uthappam"), tags: [] },
      { id: "uthappams-tomato-onion", name: "Tomato Onion Uthappam", description: "", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Tomato onion uthappam"), tags: [] },
      { id: "uthappams-plain", name: "Plain Uthappam", description: "Soft and fluffy fermented rice and lentil pancake served with a variety of chutneys and sambar.", price: "$8.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Plain uthappam"), tags: [] },
      { id: "uthappams-onion", name: "Onion Uthappam", description: "", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion uthappam"), tags: [] },
      { id: "uthappams-paneer", name: "Paneer Uthappam", description: "Savory lentil pancake topped with spiced paneer cheese.", price: "$10.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Paneer uthappam"), tags: [] },
    ],
  },
  {
    id: "dosas",
    title: "Dosas",
    tamil: "தோசை",
    note: "Made to order on the griddle. Ask for extra ghee.",
    items: [
      { id: "dosas-mysore-masala", name: "Mysore Masala Dosa", description: "Spicy South-Indian crepe with our Mysore hot sauce and potatoes.", price: "$9.50", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Mysore masala dosa"), tags: [] },
      { id: "dosas-plain-cone", name: "Plain Dosa / Cone Dosa", description: "Crispy rice batter crepe, served plain or in a cone shape.", price: "$8.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Plain dosa or cone dosa"), tags: [] },
      { id: "dosas-ghee-masala", name: "Ghee Masala Dosa", description: "Thin, crispy crepe made from fermented rice and lentil batter, filled with spiced mashed potatoes. Served with ghee and chutneys.", price: "$9.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Ghee masala dosa"), tags: [] },
      { id: "dosas-ghee-plain", name: "Ghee Plain Dosa", description: "Crispy rice crepe enriched with ghee, served with coconut chutney, tomato chutney, and a side of lentil sambar.", price: "$8.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Ghee plain dosa"), tags: [] },
      { id: "dosas-ghee-podi-masala", name: "Ghee Podi Masala Dosa", description: "Crispy fermented rice and lentil crepe filled with spiced potato masala, served with ghee and podi powder, chutneys, and sambar.", price: "$10.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Ghee podi masala dosa"), tags: [] },
      { id: "dosas-paneer", name: "Paneer Dosa", description: "A popular South-Indian speciality - crispy Indian crepe stuffed with spiced paneer (cheese).", price: "$10.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Paneer dosa"), tags: [] },
      { id: "dosas-paper-masala", name: "Paper Masala Dosa", description: "Crispy, thin fermented rice and lentil crepe filled with spiced mashed potatoes.", price: "$10.99", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Paper masala dosa"), tags: [] },
      { id: "dosas-ghee-kara", name: "Ghee Kara Dosa", description: "", price: "$10.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Ghee kara dosa"), tags: [] },
      { id: "dosas-onion-masala", name: "Onion Masala Dosa", description: "Crispy fermented rice and lentil crepe filled with spiced mashed potatoes and sautéed onions. Served with chutneys and sambar.", price: "$9.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion masala dosa"), tags: [] },
      { id: "dosas-podi", name: "Podi Dosa", description: "", price: "$9.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Podi dosa"), tags: [] },
      { id: "dosas-kara-masala", name: "Kara Masala Dosa", description: "Thin, crispy crepe made from fermented rice and lentil batter, filled with a spicy potato masala. Served with chutneys and sambar.", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Kara masala dosa"), tags: [] },
      { id: "dosas-cheese", name: "Cheese Dosa", description: "Crispy fermented rice crepe filled with melted cheese, served with coconut chutney, tomato chutney, green chutney, and sambar.", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Cheese dosa"), tags: [] },
      { id: "dosas-paper-plain", name: "Paper Plain Dosa", description: "", price: "$9.99", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Paper plain dosa"), tags: [] },
      { id: "dosas-podi-masala", name: "Podi Masala Dosa", description: "Crispy fermented rice and lentil crepe, filled with spiced potato masala, garnished with fresh cilantro. Served with chutneys and sambar.", price: "$10.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Podi masala dosa"), tags: [] },
      { id: "dosas-cheese-masala", name: "Cheese Masala Dosa", description: "Crispy fermented rice and lentil crepe filled with spiced mashed potatoes and melted cheese.", price: "$10.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Cheese masala dosa"), tags: [] },
      { id: "dosas-mysore-plain", name: "Mysore Plain Dosa", description: "", price: "$9.00", image: defaultImage("default-signature-paper-dosa", "/images/signature-paper-dosa.jpg", "Mysore plain dosa"), tags: [] },
      { id: "dosas-onion", name: "Onion Dosa", description: "", price: "$9.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion dosa"), tags: [] },
      { id: "dosas-onion-chili", name: "Onion Chili Dosa", description: "", price: "$9.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion chili dosa"), tags: [] },
      { id: "dosas-kara", name: "Kara Dosa", description: "Spicy.", price: "$9.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Kara dosa"), tags: [] },
      { id: "dosas-masala", name: "Masala Dosa", description: "Thin, crispy fermented rice and lentil crepe filled with spiced potato and onion mixture.", price: "$9.00", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Masala dosa"), tags: [] },
      { id: "dosas-spring-vegetable", name: "Spring / Vegetable Dosa", description: "", price: "$10.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Spring vegetable dosa"), tags: [] },
    ],
  },
  {
    id: "rava-dosas",
    title: "Rava Dosas",
    tamil: "ரவா தோசை",
    note: "Lacy semolina crepes.",
    items: [
      { id: "rava-onion", name: "Onion Rava Dosa", description: "", price: "$9.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion rava dosa"), tags: [] },
      { id: "rava-masala", name: "Rava Masala Dosa", description: "Crispy semolina crepe filled with spiced potato masala, garnished with shredded purple cabbage.", price: "$10.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Rava masala dosa"), tags: [] },
      { id: "rava-onion-masala", name: "Onion Rava Masala Dosa", description: "Thin, crispy semolina crepe filled with spiced mashed potatoes and garnished with onions.", price: "$10.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion rava masala dosa"), tags: [] },
      { id: "rava-onion-chilli-masala", name: "Onion Chilli Rava Masala Dosa", description: "Crispy semolina crepe filled with spiced mashed potatoes, onions, and green chilies. Served with coconut chutney.", price: "$10.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion chilli rava masala dosa"), tags: [] },
      { id: "rava-plain", name: "Plain Rava Dosa", description: "A thin, crispy semolina crepe served with coconut chutney, tomato chutney, and mint chutney.", price: "$9.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Plain rava dosa"), tags: [] },
      { id: "rava-onion-chili", name: "Onion Chili Rava Dosa", description: "Crispy semolina crepe with finely chopped onions and green chilies, served with sambar and tomato chutney.", price: "$10.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Onion chili rava dosa"), tags: [] },
      { id: "rava-special-masala", name: "Special Rava Masala Dosa", description: "Crispy semolina crepe filled with spiced potato masala, garnished with fresh herbs and purple cabbage.", price: "$10.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Special rava masala dosa"), tags: [] },
    ],
  },
  {
    id: "specials",
    title: "Daily Specials",
    tamil: "தினசரி சிறப்புகள்",
    note: "Rotating kitchen specials.",
    items: [
      { id: "specials-peanut-kara", name: "Peanut Kara Dosa", description: "No masala.", price: "$10.00", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Peanut kara dosa"), tags: [] },
      { id: "specials-ceylon-paratha", name: "Ceylon Paratha", description: "No cheese.", price: "$10.00", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Ceylon paratha"), tags: [] },
      { id: "specials-cheese-ceylon-paratha", name: "Cheese Ceylon Paratha", description: "Golden-brown paratha topped with melted cheese, accompanied by a side of savory curry.", price: "$10.99", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Cheese ceylon paratha"), tags: [] },
      { id: "specials-peanut-kara-masala", name: "Peanut Kara Masala Dosa", description: "Crispy rice and lentil crepe topped with a spicy peanut sauce, diced tomatoes, onions, fresh cilantro, and a side of sambar.", price: "$11.50", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Peanut kara masala dosa"), tags: [] },
      { id: "specials-set-dosa-vada-curry", name: "Set Dosa Vada Curry", description: "Crispy fermented rice and lentil crepe served with spiced lentil and vegetable curry, accompanied by vada.", price: "$11.99", image: defaultImage("default-masala-dosa", "/images/masala-dosa.jpg", "Set dosa vada curry"), tags: [] },
    ],
  },
  {
    id: "poori-chappati-parota",
    title: "Poori, Chappati, Parota",
    tamil: "பூரி, சப்பாத்தி, பரோட்டா",
    note: "Flatbreads and fried breads with curry.",
    items: [
      { id: "pcp-parota-kurma", name: "Parota Kurma", description: "Flaky, layered flatbread served with a savory, spiced vegetable curry.", price: "$10.50", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Parota kurma"), tags: [] },
      { id: "pcp-poori-chole-masala", name: "Poori (Chole + Masala)", description: "Fluffy deep-fried bread served with spiced chickpea curry and a side of seasoned potato masala.", price: "$9.00", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Poori chole masala"), tags: [] },
      { id: "pcp-chappathi-chole-kurma", name: "Chappathi Chole / Kurma", description: "Soft, flaky chappathi served with a rich channa masala made from chickpeas in a savory spiced gravy.", price: "$9.00", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Chappathi chole kurma"), tags: [] },
      { id: "pcp-channa-bhatura", name: "Channa Bhatura", description: "Fluffy deep-fried bread paired with spiced chickpea curry, chopped onions, fresh tomatoes, and cilantro.", price: "$9.99", image: defaultImage("default-south-indian-breakfast", "/images/south-indian-breakfast.jpg", "Channa bhatura"), tags: [] },
    ],
  },
  {
    id: "thali",
    title: "Thali",
    tamil: "சாப்பாடு",
    note: "The daily ritual: dishes rotate through the week.",
    items: [
      { id: "thali-daily-lunch", name: "Daily Lunch Thali", description: "Menu changes every day. A variety of dishes including rice, papad, dal, curry, spinach, vegetable stir-fry, yogurt, and a sweet treat.", price: "$16.50", image: defaultImage("default-signature-thali", "/images/signature-thali.jpg", "Daily lunch thali"), tags: [], cateringFriendly: true },
    ],
  },
  {
    id: "snacks",
    title: "Snack Items",
    tamil: "சிற்றுண்டி",
    note: "Sweets and savoury snacks.",
    items: [
      { id: "snacks-mixture", name: "Mixture", description: "Crispy blend of fried noodles, peanuts, and lentils, seasoned with spices and herbs.", price: "$6.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mixture"), tags: [] },
      { id: "snacks-boondi-laddu", name: "Boondi Laddu", description: "Sweet, round confections made from fried gram flour droplets, bound together with sugar syrup and ghee.", price: "$6.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Boondi laddu"), tags: [] },
      { id: "snacks-badam-burfi", name: "Badam Burfi", description: "Rich and dense almond fudge squares made with ground almonds, sugar, and ghee.", price: "$6.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Badam burfi"), tags: [] },
      { id: "snacks-banana-chips", name: "Banana Chips", description: "", price: "$6.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Banana chips"), tags: [] },
      { id: "snacks-mysorepak", name: "Mysorepak", description: "Rich, buttery squares of traditional Indian sweet made from ghee, sugar, and gram flour.", price: "$6.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mysorepak"), tags: [] },
      { id: "snacks-cashew-burfi", name: "Cashew Burfi", description: "Rich and dense squares of sweet cashew fudge, crafted from ground cashews and sugar, offering a smooth and creamy texture.", price: "$6.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Cashew burfi"), tags: [] },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    tamil: "பானங்கள்",
    note: "End the way every Tamil meal should.",
    items: [
      { id: "drinks-filter-coffee", name: "Filter Coffee", description: "Rich, aromatic coffee brewed through a filter, offering a robust and smooth experience with a frothy finish.", price: "$2.99", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Filter coffee"), tags: [], popular: true },
      { id: "drinks-butter-milk", name: "Butter Milk", description: "", price: "$2.99", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Butter milk"), tags: [] },
      { id: "drinks-rose-milk", name: "Rose Milk", description: "Refreshing, chilled milk infused with delicate rose syrup.", price: "$3.99", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Rose milk"), tags: [] },
      { id: "drinks-mango-lassi", name: "Mango Lassi", description: "Traditional Indian drink with mango and yogurt.", price: "$3.99", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Mango lassi"), tags: [] },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    tamil: "கூடுதல் பொருட்கள்",
    note: "Family-size sides sold by the ounce, plus a la carte add-ons.",
    items: [
      { id: "extras-sambar-8oz", name: "Sambar (8 oz)", description: "", price: "$4.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sambar 8oz"), tags: [] },
      { id: "extras-sambar-12oz", name: "Sambar (12 oz)", description: "", price: "$5.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sambar 12oz"), tags: [] },
      { id: "extras-sambar-16oz", name: "Sambar (16 oz)", description: "", price: "$6.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sambar 16oz"), tags: [] },
      { id: "extras-sambar-24oz", name: "Sambar (24 oz)", description: "", price: "$8.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sambar 24oz"), tags: [] },
      { id: "extras-sambar-32oz", name: "Sambar (32 oz)", description: "Sambar rotates daily: Monday pumpkin sambar, Wednesday okra sambar, Thursday carrot & beans sambar, Friday onion sambar (and more depending on the day).", price: "$12.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sambar 32oz"), tags: [] },

      { id: "extras-curry-8oz", name: "Curry (8 oz)", description: "", price: "$4.25", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Curry 8oz"), tags: [] },
      { id: "extras-curry-12oz", name: "Curry (12 oz)", description: "", price: "$5.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Curry 12oz"), tags: [] },
      { id: "extras-curry-16oz", name: "Curry (16 oz)", description: "", price: "$6.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Curry 16oz"), tags: [] },
      { id: "extras-curry-24oz", name: "Curry (24 oz)", description: "", price: "$8.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Curry 24oz"), tags: [] },
      { id: "extras-curry-32oz", name: "Curry (32 oz)", description: "Available only after 11:30am. Curry (poriyal) rotates daily: Monday cabbage & carrot poriyal, Wednesday beetroot curry (and more depending on the day).", price: "$12.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Curry 32oz"), tags: [], popular: true },

      { id: "extras-kootu-12oz", name: "Kootu (12 oz)", description: "", price: "$5.25", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kootu 12oz"), tags: [] },
      { id: "extras-kootu-24oz", name: "Kootu (24 oz)", description: "", price: "$8.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kootu 24oz"), tags: [] },
      { id: "extras-kootu-32oz", name: "Kootu (32 oz)", description: "Available only after 11:30am. Kootu rotates daily: Monday aviyal (mixed vegetables), Wednesday spinach kootu (and more depending on the day).", price: "$12.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kootu 32oz"), tags: [] },

      { id: "extras-rasam-12oz", name: "Rasam (12 oz)", description: "", price: "$4.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Rasam 12oz"), tags: [] },
      { id: "extras-rasam-16oz", name: "Rasam (16 oz)", description: "", price: "$5.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Rasam 16oz"), tags: [] },
      { id: "extras-rasam-24oz", name: "Rasam (24 oz)", description: "Available after 10:30am. Rasam rotates daily: Monday lemon rasam, Wednesday pepper rasam, Thursday tomato rasam (and more depending on the day).", price: "$6.99", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Rasam 24oz"), tags: [] },

      { id: "extras-kara-kozhambu-8oz", name: "Kara Kozhambu (8 oz)", description: "", price: "$4.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kara kozhambu 8oz"), tags: [] },
      { id: "extras-kara-kozhambu-12oz", name: "Kara Kozhambu (12 oz)", description: "", price: "$5.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kara kozhambu 12oz"), tags: [] },
      { id: "extras-kara-kozhambu-16oz", name: "Kara Kozhambu (16 oz)", description: "", price: "$6.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kara kozhambu 16oz"), tags: [] },
      { id: "extras-kara-kozhambu-24oz", name: "Kara Kozhambu (24 oz)", description: "", price: "$8.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kara kozhambu 24oz"), tags: [] },
      { id: "extras-kara-kozhambu-32oz", name: "Kara Kozhambu (32 oz)", description: "Available only every Wednesday after 11:30am.", price: "$10.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Kara kozhambu 32oz"), tags: [] },

      { id: "extras-mor-kozhambu-8oz", name: "Mor Kozhambu (8 oz)", description: "", price: "$4.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mor kozhambu 8oz"), tags: [] },
      { id: "extras-mor-kozhambu-12oz", name: "Mor Kozhambu (12 oz)", description: "", price: "$5.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mor kozhambu 12oz"), tags: [] },
      { id: "extras-mor-kozhambu-16oz", name: "Mor Kozhambu (16 oz)", description: "", price: "$6.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mor kozhambu 16oz"), tags: [] },
      { id: "extras-mor-kozhambu-24oz", name: "Mor Kozhambu (24 oz)", description: "", price: "$8.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mor kozhambu 24oz"), tags: [] },
      { id: "extras-mor-kozhambu-32oz", name: "Mor Kozhambu (32 oz)", description: "Available only every Thursday after 11:30am.", price: "$10.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Mor kozhambu 32oz"), tags: [] },

      { id: "extras-buttermilk-32oz", name: "Buttermilk (32 oz)", description: "Creamy buttermilk with a tangy flavor, ideal for cooking, baking, or adding to beverages.", price: "$8.00", image: defaultImage("default-filter-coffee", "/images/filter-coffee.jpg", "Buttermilk 32oz"), tags: [] },

      { id: "extras-sweet-8oz", name: "Sweet (8 oz)", description: "", price: "$4.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sweet 8oz"), tags: [] },
      { id: "extras-sweet-12oz", name: "Sweet (12 oz)", description: "", price: "$5.25", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sweet 12oz"), tags: [] },
      { id: "extras-sweet-16oz", name: "Sweet (16 oz)", description: "", price: "$6.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sweet 16oz"), tags: [] },
      { id: "extras-sweet-24oz", name: "Sweet (24 oz)", description: "", price: "$8.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sweet 24oz"), tags: [] },
      { id: "extras-sweet-32oz", name: "Sweet (32 oz)", description: "Daily sweet special, recipe rotates by day.", price: "$10.25", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Sweet 32oz"), tags: [] },

      { id: "extras-coconut-chutney-8oz", name: "Coconut Chutney (8 oz)", description: "", price: "$4.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Coconut chutney 8oz"), tags: [] },
      { id: "extras-papped", name: "Papped", description: "Available only after 11:30am.", price: "$0.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Papped"), tags: [] },
      { id: "extras-yogurt-4oz", name: "Yogurt (4 oz)", description: "Four oz.", price: "$1.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Yogurt 4oz"), tags: [] },
      { id: "extras-podi-ghee-2oz", name: "Podi (Spicy Powder) with Ghee (2 oz)", description: "", price: "$1.50", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Podi with ghee 2oz"), tags: [] },
      { id: "extras-podi-oil-2oz", name: "Podi (Spicy Powder) with Oil (2 oz)", description: "", price: "$2.00", image: defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", "Podi with oil 2oz"), tags: [] },
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
  options: { includeUnavailable?: boolean } = {},
) {
  const includeUnavailable = options.includeUnavailable ?? false;

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
        available: override.available ?? true,
        image: resolveImageAsset(item.image, override.imageAssetId, input.assets),
      };
    }).filter((item) => includeUnavailable || item.available),
  })).filter((section) => includeUnavailable || section.items.length > 0);
}

export function mergeMenuContentWithCustomItems(
  sections: MenuSection[],
  input: {
    itemOverrides: Record<string, MenuItemOverride>;
    customItems: CustomMenuItem[];
    assets: Record<string, ImageAsset>;
  },
  options: { includeUnavailable?: boolean } = {},
) {
  const includeUnavailable = options.includeUnavailable ?? false;
  const customItemsBySection = input.customItems.reduce<Record<string, MenuItem[]>>((itemsBySection, item) => {
    const fallbackImage =
      sections.find((section) => section.id === item.sectionId)?.items[0]?.image ??
      defaultImage("default-south-indian-thali", "/images/south-indian-thali.jpg", item.name);

    const resolvedItem: MenuItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      tags: item.tags,
      popular: item.popular,
      cateringFriendly: item.cateringFriendly,
      available: item.available ?? true,
      image: resolveImageAsset(
        { ...fallbackImage, alt: item.name },
        item.imageAssetId,
        input.assets,
      ),
    };

    if (includeUnavailable || resolvedItem.available) {
      itemsBySection[item.sectionId] = [...(itemsBySection[item.sectionId] ?? []), resolvedItem];
    }

    return itemsBySection;
  }, {});

  return mergeMenuContent(sections, input, options)
    .map((section) => ({
      ...section,
      items: [...section.items, ...(customItemsBySection[section.id] ?? [])],
    }))
    .filter((section) => includeUnavailable || section.items.length > 0);
}

export function flattenMenuItems(sections: MenuSection[]) {
  return sections.flatMap((section) => section.items.map((item) => ({ sectionId: section.id, sectionTitle: section.title, ...item })));
}
