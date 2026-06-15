export type Cat =
  | "Столы"
  | "Стулья и кресла"
  | "Хранение"
  | "Диваны"
  | "Кровати"
  | "Садовая мебель";

export type Spec = { k: string; v: string };

export type Product = {
  id: string;
  name: string;
  cat: Cat;
  material: string;
  price: number;
  oldPrice?: number;
  stock: number;
  rating: number;
  reviews: number;
  emoji: string; // визуальная заглушка изображения
  gallery: string[]; // эмодзи для галереи
  desc: string;
  eco: string; // экологическая информация
  specs: Spec[];
  popular?: boolean;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string; // ISO
  text: string;
};

export type OrderItem = { id: string; name: string; material: string; price: number; qty: number };

export type Delivery = "courier" | "pickup" | "tk";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export type Order = {
  id: string;
  date: string; // ISO
  items: OrderItem[];
  delivery: Delivery;
  deliveryCost: number;
  address: string;
  name: string;
  phone: string;
  email?: string;
  total: number;
  status: OrderStatus;
};

export type Role = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  joined: string; // ISO
  orders: number;
  spent: number;
};
