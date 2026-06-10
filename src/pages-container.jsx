import { Routes, Route } from "react-router-dom";

import Customers from "./pages/Customers";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Statistics from "./pages/Statistics";
import SaleDetails from "./pages/SaleDetails";
import TransactionDetails from "./pages/TransactionDetails";

export default function PagesContainer() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/transactions/:id" element={<TransactionDetails />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/sales/:id" element={<SaleDetails />} />
      <Route path="/products" element={<Products />} />
      <Route path="/statistics" element={<Statistics />} />
    </Routes>
  );
}
