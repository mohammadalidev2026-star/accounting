import { useEffect, useState } from "react";
import { customersData } from "./data/customers";
import CustomerUpdateModal from "./components/CustomerUpdateModal";
import CustomerDeleteModal from "./components/CustomerDeleteModal";
import CustomerCreatModal from "./components/CustomerCreatModal";
import CustomerExitModal from "./components/CustomerExitModal";
import { NavLink } from "react-router";

export default function Customers() {
  const [creatCustomersModal, setCreatCustomersModal] = useState({});
  const [updateCustomersModal, setUpdateCustomersModal] = useState({});
  const [deleteCustomersModal, setDeleteCustomersModal] = useState("");
  const [exitCustomerModal, setExitCustomerModal] = useState();
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // فیلتر واقعی بر اساس search
  const filteredData = customersData.filter((item) =>
    item.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Navbar */}
      <nav className="w-full h-16 flex items-center justify-between px-4 sm:px-8 bg-gray-100 dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 transition-colors duration-500">
        <div className="flex items-center gap-6">
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

        <div className="flex items-center gap-4">
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
            onClick={setExitCustomerModal}
            className="text-blue-500 cursor-pointer dark:text-blue-400 font-medium hover:text-blue-600 dark:hover:text-blue-500  text-lg hover:text-xl transition duration-300"
          >
            خروج
          </button>
        </div>
      </nav>

      <div className="text-center mt-6">
        <h1 className="text-3xl font-bold tracking-wide">مدیریت مشتریان</h1>
      </div>

      {/* ابزارها */}
      <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between sm:mx-6 lg:mx-14">
        <input
          onClick={() =>
            setCreatCustomersModal((prev) => ({ ...prev, showModal: true }))
          }
          type="button"
          value="مشتری جدید"
          className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded transition duration-300"
        />

        <input
          type="search"
          placeholder=": جستجوی مشتری"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 p-3 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 font-medium cursor-pointer transition duration-300"
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto mt-6 sm:mx-6 lg:mx-14 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 max-h-[60vh] transition-colors duration-500">
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
                شماره تماس
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
                      onClick={() => setDeleteCustomersModal(item.id)}
                      className="px-3 py-1 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded cursor-pointer transition duration-300"
                    >
                      حذف
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded cursor-pointer transition duration-300"
                      onClick={() =>
                        setUpdateCustomersModal((prev) => ({
                          ...prev,
                          showModal: true,
                          ...item,
                        }))
                      }
                    >
                      ویرایش
                    </button>
                  </div>
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {item.date}
                </td>
                <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                  {item.phoneNumber}
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

      {/* Pagination */}
      <div className="flex justify-center gap-4 my-8">
        <button className="py-3 px-12 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded font-medium cursor-pointer transition duration-300">
          صفحه بعدی
        </button>
        <button className="py-3 px-12 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded font-medium cursor-pointer transition duration-300">
          صفحه قبلی
        </button>
      </div>

      {updateCustomersModal.showModal && (
        <CustomerUpdateModal
          setUpdateCustomersModal={setUpdateCustomersModal}
          customer={updateCustomersModal}
        />
      )}
      {deleteCustomersModal && (
        <CustomerDeleteModal
          setDeleteCustomersModal={setDeleteCustomersModal}
          customerId={deleteCustomersModal}
        />
      )}
      {creatCustomersModal.showModal && (
        <CustomerCreatModal setCreatCustomersModal={setCreatCustomersModal} />
      )}

      {exitCustomerModal && (
        <CustomerExitModal setExitCustomerModal={setExitCustomerModal} />
      )}
    </div>
  );
}
