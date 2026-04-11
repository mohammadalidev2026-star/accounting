import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import SalesExitModal from "./components/SalesExitModal";
import { useQuery } from "@apollo/client/react";
import { SALES } from "./graphql/sales";
import { PRODUCTS } from "./graphql/product";
import SalesCreateModal from "./components/SalesCreateModal";
import SalesDeleteModal from "./components/SalesDeleteModal";
import SalesUpdateModal from "./components/SalesUpdateModal";
import SalesPrintModal from "./components/SalesPrintModal";

export default function Sales() {
  const [creatSalesModal, setCreatSalesModal] = useState({});
  const [deleteSalesModal, setDeleteSalesModal] = useState("");
  const [updateSalesModal, setUpdateSalesModal] = useState({});
  const [printSalesModal, setPrintSalesModal] = useState({});
  const [exitSalesModal, setExitSalesModal] = useState(false);
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState("فیلتر جنس");
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({
    productId: undefined,
    code: undefined,
  });

  const { data, refetch } = useQuery(SALES, {
    variables: {
      paginationInput: { page: page || 1 },
      filterInput: filters,
    },
  });

  const { data: productsData } = useQuery(PRODUCTS, {
    variables: {
      paginationInput: {
        page: 1,
        pageSize: 10,
      },
      filterInput: {
        term: "",
      },
    },
  });

  useEffect(() => {
    setSales(data?.sales?.edges || []);
    setPageInfo(data?.sales?.pageInfo || {});
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  const truncateText = (text = "") =>
    text.length > 30 ? "..." + text.slice(0, 30) : text;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Navbar */}
      <nav className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8 py-3 sm:h-16 bg-gray-100 dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 transition-colors duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={setExitSalesModal}
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

      <div className="flex flex-col gap-4 mt-6 px-4 sm:px-6 lg:px-14 sm:flex-row sm:items-start sm:justify-between">
        {/* دکمه ثبت */}
        <input
          type="button"
          value="ثبت فاکتور فروش"
          className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded transition duration-300"
          onClick={() =>
            setCreatSalesModal((prev) => ({
              ...prev,
              showModal: true,
            }))
          }
        />

        <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <input
            className="w-full  sm:w-56 p-3 font-medium border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right placeholder-gray-500 dark:placeholder-slate-100 transition duration-300"
            placeholder="جستجوی فاکتور"
            type="number"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                code: Number(e.target.value),
              }))
            }
          />

          <div className="relative w-full sm:w-56">
            <button
              onClick={() => setOpen(!open)}
              className="w-full h-12 cursor-pointer px-4 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-100 font-medium flex justify-between items-center hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-300"
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
              <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-lg max-h-64 overflow-y-auto">
                <li
                  onClick={() => {
                    setSelected("فیلتر جنس");
                    setFilters((prev) => ({
                      ...prev,
                      productId: null,
                    }));
                    setOpen(false);
                  }}
                  className="px-4 py-2 font-bold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  همه جنس ها
                </li>

                {productsData?.products?.edges?.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => {
                      setSelected(product.name);
                      setFilters((prev) => ({
                        ...prev,
                        productId: product._id,
                      }));
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* جدول */}
      <div className="relative mt-6 sm:mx-6 lg:mx-14">
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
                  مجموع
                </th>
                <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                  تعداد
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
                  نام جنس
                </th>
                <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                  کد فاکتور
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr
                  key={item._id}
                  className="text-center transition duration-300 hover:bg-slate-200 dark:hover:bg-slate-900"
                >
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          setPrintSalesModal((prev) => ({
                            ...prev,
                            showModal: true,
                            ...item,
                          }))
                        }
                        className="px-3 py-1 text-lg cursor-pointer bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded transition duration-300"
                      >
                        چاپ
                      </button>
                      <button
                        onClick={() => setDeleteSalesModal(item._id)}
                        className="px-3 py-1 cursor-pointer bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded transition duration-300"
                      >
                        حذف
                      </button>
                      <button
                        onClick={() =>
                          setUpdateSalesModal((prev) => ({
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
                    {item.totalAmount}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.count}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.price}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {truncateText(item.description)}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.customer?.fullName}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.product?.name}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full flex justify-between bg-gray-200 dark:bg-slate-800 p-2 text-slate-900 font-medium rounded-b-xl">
          <p className="font-medium dark:text-slate-100 text-slate-900">
            {pageInfo?.totalAmount} : مبلغ کل
          </p>
          <p className="font-medium dark:text-slate-100 text-slate-900">
            تعداد صفحه ها : {pageInfo?.totalPages}
          </p>
        </div>
      </div>

      {/* انپوت برو به صفحه پایین سمت راست */}
      <div className="flex justify-end sm:mx-14 my-2">
        <input
          className="w-48 p-2 font-medium border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 transition duration-300"
          type="number"
          onChange={(e) => setPage(Number(e.target.value))}
          defaultValue={page || 1}
        />
      </div>

      {creatSalesModal.showModal && (
        <SalesCreateModal
          setCreatSalesModal={setCreatSalesModal}
          refetch={refetch}
        />
      )}

      {updateSalesModal.showModal && (
        <SalesUpdateModal
          setUpdateSalesModal={setUpdateSalesModal}
          sale={updateSalesModal}
          refetch={refetch}
        />
      )}

      {printSalesModal.showModal && (
        <SalesPrintModal setPrintSalesModal={setPrintSalesModal} />
      )}

      {deleteSalesModal && (
        <SalesDeleteModal
          setDeleteSalesModal={setDeleteSalesModal}
          salesId={deleteSalesModal}
          refetch={refetch}
        />
      )}

      {exitSalesModal && (
        <SalesExitModal setExitSalesModal={setExitSalesModal} />
      )}
    </div>
  );
}
