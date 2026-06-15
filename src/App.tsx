import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./ui/Layout";
import { Loader } from "./ui/Spinner";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contacts from "./pages/Contacts";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const Admin = lazy(() => import("./admin/Admin"));
const Dash = lazy(() => import("./admin/Dash"));
const AdmProducts = lazy(() => import("./admin/Products"));
const AdmOrders = lazy(() => import("./admin/Orders"));
const AdmUsers = lazy(() => import("./admin/Users"));
const AdmStats = lazy(() => import("./admin/Stats"));

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="login" element={<Login />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dash />} />
          <Route path="products" element={<AdmProducts />} />
          <Route path="orders" element={<AdmOrders />} />
          <Route path="users" element={<AdmUsers />} />
          <Route path="stats" element={<AdmStats />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
