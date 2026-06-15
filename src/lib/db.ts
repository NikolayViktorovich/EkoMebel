import type { Order, Product, Review, User } from "@/types";
import { orders as seedOrders, products as seedProducts, reviews as seedReviews, users as seedUsers } from "@/data/seed";

const KEY = "ekomebel:v1";
const VER = 3;

type DB = { products: Product[]; orders: Order[]; users: User[]; reviews: Review[]; ver: number };

const fresh = (): DB => ({
  products: structuredClone(seedProducts),
  orders: structuredClone(seedOrders),
  users: structuredClone(seedUsers),
  reviews: structuredClone(seedReviews),
  ver: VER,
});

/** Загрузка состояния «БД» из localStorage (seed при первом запуске). */
function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const data = JSON.parse(raw) as DB;
    if (data.ver !== VER) return fresh();
    return data;
  } catch {
    return fresh();
  }
}

let db = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* квота переполнена — игнорируем */
  }
}

/** Прямой доступ к коллекциям (используется только слоем api). */
export const store = {
  get: () => db,
  set: (patch: Partial<DB>) => {
    db = { ...db, ...patch };
    save();
  },
  reset: () => {
    db = fresh();
    save();
  },
};
