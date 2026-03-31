import { useQuery } from "@apollo/client/react/compiled";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import CustomerCreatModal from "./components/CustomerCreatModal";
import CustomerDeleteModal from "./components/CustomerDeleteModal";
import CustomerExitModal from "./components/CustomerExitModal";
import CustomerUpdateModal from "./components/CustomerUpdateModal";
import { ADMIN_CUSTOMERS } from "./graphql/customers";

export default function Customers() {
  const [creatCustomersModal, setCreatCustomersModal] = useState({});
  const [updateCustomersModal, setUpdateCustomersModal] = useState({});
  const [deleteCustomersModal, setDeleteCustomersModal] = useState("");
  const [exitCustomersModal, setExitCustomersModal] = useState();
  const [customers, setCustomers] = useState([]);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");

  const { data, refetch } = useQuery(ADMIN_CUSTOMERS, {
    variables: { term: search },
  });

  useEffect(() => {
    setCustomers(data?.adminCustomers || []);
  }, [data, search]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <nav className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8 py-3 sm:h-16 bg-gray-100 dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 transition-colors duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={setExitCustomersModal}
            className="text-blue-500 cursor-pointer dark:text-blue-400 font-medium hover:text-blue-600 dark:hover:text-blue-500 text-sm sm:text-lg transition duration-300"
          >
            خروج
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 mt-2 cursor-pointer sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-gray-300 dark:bg-slate-800 hover:bg-gray-400 dark:hover:bg-slate-700 transition duration-300"
          >
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="w-4 h-4"
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
                className="w-4 h-4"
              >
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center gap-6 text-sm sm:text-base">
          <NavLink
            to="/sales"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 dark:text-blue-400 font-medium"
                : "text-slate-800 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition"
            }
          >
            فاکتور فروش
          </NavLink>
          <NavLink
            to="/transactions"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 dark:text-blue-400 font-medium"
                : "text-slate-800 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition"
            }
          >
            فاکتور خرید
          </NavLink>
          <NavLink
            to="/customers"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 dark:text-blue-400 font-medium"
                : "text-slate-800 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition"
            }
          >
            مشتری ها
          </NavLink>
          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 dark:text-blue-400 font-medium"
                : "text-slate-800 dark:text-slate-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition"
            }
          >
            گدام
          </NavLink>
        </div>
      </nav>
      {/* ابزارها */}
      <div className="flex flex-col gap-4 mt-6 px-4 sm:px-6 lg:px-14 sm:flex-row sm:items-center sm:justify-between">
        <input
          onClick={() => setCreatCustomersModal(() => ({ showModal: true }))}
          type="button"
          value=" ثبت مشتری"
          className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded transition duration-300"
        />

        <input
          type="search"
          placeholder=": جستجوی مشتری"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 p-3 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 font-medium transition duration-300"
        />
      </div>

      {/* Table */}
      <div className="relative mt-6 sm:mx-6 lg:mx-14">
        {/* جدول scrollable */}
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh] rounded-xl rounded-b-none border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950">
          <table className="min-w-175 sm:min-w-full text-sm sm:text-base border-collapse">
            <thead className="bg-gray-200 dark:bg-slate-900 text-slate-900 dark:text-slate-100 sticky -top-2">
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
              {customers.map((item, index) => (
                <tr
                  key={item._id}
                  className="text-center transition duration-300 hover:bg-slate-200 dark:hover:bg-slate-900"
                >
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setDeleteCustomersModal(item._id)}
                        className="px-3 py-1 cursor-pointer bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded transition duration-300"
                      >
                        حذف
                      </button>
                      <button
                        onClick={() =>
                          setUpdateCustomersModal((prev) => ({
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
                    {item.createdAt?.slice(0, 10)}
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

        {/* Footer سبز پایین جدول */}
        <div className="absolute flex flex-row justify-end gap-2 w-full bg-green-600 p-2 text-white font-medium dark:bg-green-800 rounded-b-xl">
          <p className="font-medium text-white"> {customers.length} </p>
          {}
          <p className="font-medium text-white"> : تعداد مشتریان</p>
        </div>
      </div>

      {updateCustomersModal.showModal && (
        <CustomerUpdateModal
          setUpdateCustomersModal={setUpdateCustomersModal}
          customer={updateCustomersModal}
          refetch={refetch}
        />
      )}

      {deleteCustomersModal && (
        <CustomerDeleteModal
          setDeleteCustomersModal={setDeleteCustomersModal}
          customerId={deleteCustomersModal}
          refetch={refetch}
        />
      )}

      {creatCustomersModal.showModal && (
        <CustomerCreatModal
          setCreatCustomersModal={setCreatCustomersModal}
          refetch={refetch}
        />
      )}

      {exitCustomersModal && (
        <CustomerExitModal setExitCustomersModal={setExitCustomersModal} />
      )}
    </div>
  );
}
