import { useEffect, useState } from "react";
import { patronData } from "./data/Patron";
import { customersData } from "./data/customers";
import TransactionUpdateModal from "./components/TransactionUpdateModal";
import TransactionDeleteModal from "./components/TransactionDeleteModal";
import TransactionCreatModal from "./components/TransactionCreatModal";
import TransactionExitModal from "./components/TransactionExitModal";
import { NavLink } from "react-router";

export default function Customers() {
  const [creatTransactionsModal, setCreatTransactionsModal] = useState({});
  const [updateTransactionsModal, setUpdateTransactionsModal] = useState({});
  const [deleteTransactionsModal, setDeleteTransactionsModal] = useState("");
  const [exitTransactionModal, setExitTransactionModal] = useState();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("فیلتر مشتری");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const truncateText = (text) =>
    text.length > 30 ? "..." + text.slice(0, 30) : text;

  const filteredData = patronData.filter((item) => {
    const matchesCustomer =
      selected === "فیلتر مشتری" || item.fullName === selected;

    const matchesSearch =
      item.fullName.toLowerCase().includes(search.trim().toLowerCase()) ||
      item.description.toLowerCase().includes(search.trim().toLowerCase()) ||
      item.amount.toString().includes(search.trim());

    return matchesCustomer && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Navbar */}
      <nav className="w-full h-16 flex items-center justify-between px-4 sm:px-8 bg-gray-100 dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 transition-colors duration-500">
        <div className="flex items-center gap-4">
          <NavLink
            to="/customers"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 dark:text-blue-400 font-medium transition"
                : "text-slate-800 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition"
            }
          >
            مدیریت مشتری
          </NavLink>

          <NavLink
            to="/transactions"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 dark:text-blue-400 font-medium transition"
                : "text-slate-800 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition"
            }
          >
            مدیریت تراکنش
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-gray-300 dark:bg-slate-800 hover:bg-gray-400 dark:hover:bg-slate-700 transition duration-300"
          >
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            )}
          </button>

          <button
            onClick={setExitTransactionModal}
            className="text-blue-500 cursor-pointer dark:text-blue-400 font-medium hover:text-blue-600 dark:hover:text-blue-500  text-lg hover:text-xl transition duration-300"
          >
            خروج
          </button>
        </div>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4">
        مدیریت تراکنش ها
      </h1>

      <div className="flex flex-col gap-4 mb-4 mt-8 sm:flex-row sm:items-center sm:justify-between sm:mx-6 lg:mx-14">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="button"
            value="ثبت تراکنش جدید"
            className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded transition duration-300"
            onClick={() =>
              setCreatTransactionsModal((prev) => ({
                ...prev,
                showModal: true,
              }))
            }
          />

          <div className="relative w-full sm:w-56">
            <button
              onClick={() => setOpen(!open)}
              className="w-full h-12 cursor-pointer px-4 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-100 font-medium flex justify-between items-center hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-300"
            >
              {selected}
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded shadow-md max-h-60 overflow-auto text-gray-700 dark:text-slate-100">
                <li
                  onClick={() => {
                    setSelected("فیلتر مشتری");
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-blue-500"
                >
                  همه مشتری‌ها
                </li>
                {customersData.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => {
                      setSelected(customer.fullName);
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    {customer.fullName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <input
          type="search"
          placeholder=": جستجوی مشتری"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/6 p-3 font-medium border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 transition duration-300"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto mt-6 sm:mx-6 lg:mx-14 relative rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 max-h-[60vh] transition-colors duration-500">
        <table className="min-w-full text-sm sm:text-base border-collapse">
          <thead className="bg-gray-200 dark:bg-slate-900 text-slate-900 dark:text-slate-100 sticky top-0">
            <tr>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                تنظیمات
              </th>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                تاریخ
              </th>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                واحد پول
              </th>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                مبلغ
              </th>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                توضیحات
              </th>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                نام مشتری
              </th>
              <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                شماره
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className="text-center transition duration-300 hover:bg-slate-200
                dark:hover:bg-slate-900 "
              >
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setDeleteTransactionsModal(item.id)}
                      className="px-3 py-1 cursor-pointer bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded transition duration-300"
                    >
                      حذف
                    </button>
                    <button
                      onClick={() =>
                        setUpdateTransactionsModal((prev) => ({
                          ...prev,
                          showModal: true,
                          ...item,
                        }))
                      }
                      className="px-3 py-1 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded transition duration-300"
                    >
                      ویرایش
                    </button>
                  </div>
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {item.date}
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {item.currencyUnit}
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {item.amount}
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {truncateText(item.description)}
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {item.fullName}
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {index + 1}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-center gap-4 my-9">
        <button className="py-3 px-12 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded font-medium cursor-pointer transition duration-300">
          صفحه بعدی
        </button>
        <button className="py-3 px-12 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded font-medium cursor-pointer transition duration-300">
          صفحه قبلی
        </button>
      </div>

      {updateTransactionsModal.showModal && (
        <TransactionUpdateModal
          setUpdateTransactionsModal={setUpdateTransactionsModal}
          transaction={updateTransactionsModal}
        />
      )}

      {deleteTransactionsModal && (
        <TransactionDeleteModal
          setDeleteTransactionsModal={setDeleteTransactionsModal}
          transactionId={deleteTransactionsModal}
        />
      )}

      {creatTransactionsModal.showModal && (
        <TransactionCreatModal
          setCreatTransactionsModal={setCreatTransactionsModal}
        />
      )}

      {exitTransactionModal && (
        <TransactionExitModal
          setExitTransactionModal={setExitTransactionModal}
        />
      )}
    </div>
  );
}
