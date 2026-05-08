export type StepId = "home" | "place" | "gallery" | "menu" | "matches";

export type PlacePhoto = {
  src: string;
  alt: string;
  title: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  partnerWants: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  items: MenuItem[];
};

export const steps: StepId[] = ["home", "place", "gallery", "menu", "matches"];

export const recommendationChips = [
  "одеться удобно",
  "вечерний стиль",
  "что-то для красивого вечера",
];

export const placePhotos: PlacePhoto[] = [
  {
    src: "/1.jpg",
    alt: "Атмосферное место для встречи",
    title: "Место, где можно спокойно говорить",
  },
  {
    src: "/2.jpg",
    alt: "Вечерняя атмосфера с мягким светом",
    title: "Остальное лучше увидеть лично",
  },
];

export const restaurants: Restaurant[] = [
  {
    id: "italian",
    name: "Italian",
    items: [
      {
        id: "bruschetta",
        name: "Брускетта с томатами",
        description: "Хрустящий хлеб, базилик и сладкие томаты.",
        image:
          "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80",
        partnerWants: true,
      },
      {
        id: "pasta",
        name: "Паста с сырным соусом",
        description: "Нежная паста, пармезан и сливочный соус.",
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
        partnerWants: false,
      },
      {
        id: "tiramisu",
        name: "Тирамису",
        description: "Кофейный десерт, который удобно разделить на двоих.",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
        partnerWants: true,
      },
    ],
  },
  {
    id: "sushi",
    name: "Sushi",
    items: [
      {
        id: "roll",
        name: "Ролл с лососем",
        description: "Лосось, рис, сливочный сыр и огурец.",
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
        partnerWants: true,
      },
      {
        id: "mochi",
        name: "Моти с манго",
        description: "Мягкий десерт с фруктовой начинкой.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
        partnerWants: false,
      },
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    items: [
      {
        id: "lemonade",
        name: "Домашний лимонад",
        description: "Цитрус, мята и легкая кислинка.",
        image:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
        partnerWants: false,
      },
    ],
  },
];
