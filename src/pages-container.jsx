import { Routes, Route } from "react-router-dom";
import Customers from "./Customers";
import Login from "./Login";
import Transactions from "./Transactions";
import Sales from "./sales";

export default function PagesContainer() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/sales" element={<Sales />} />
    </Routes>
  );
}
