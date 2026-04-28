import { Routes, Route } from "react-router-dom";

import Customers from "./pages/Customers";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Sales from "./pages/Sales";
import Products from "./pages/Products";

export default function PagesContainer() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
