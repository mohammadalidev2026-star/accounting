import { useEffect, useState } from "react";
import TransactionUpdateModal from "./components/TransactionUpdateModal";
import TransactionDeleteModal from "./components/TransactionDeleteModal";
import TransactionCreatModal from "./components/TransactionCreatModal";
import TransactionExitModal from "./components/TransactionExitModal";
import { NavLink } from "react-router";
import { useQuery } from "@apollo/client/react";
import { TRANSACTIONS } from "./graphql/transactions";
import { CUSTOMERS } from "./graphql/customers";
import html2pdf from "html2pdf.js";

export default function Transactions() {
  const [creatTransactionsModal, setCreatTransactionsModal] = useState({});
  const [updateTransactionsModal, setUpdateTransactionsModal] = useState({});
  const [deleteTransactionsModal, setDeleteTransactionsModal] = useState("");
  const [exitTransactionsModal, setExitTransactionsModal] = useState();
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("فیلتر مشتری");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    customerId: undefined,
  });
  const [dark, setDark] = useState(false);
  const [pageInfo, setPageInfo] = useState({});

  const { data, loading, error, refetch } = useQuery(TRANSACTIONS, {
    variables: {
      paginationInput: { page: page ? page : 1 },
      filterInput: filters,
    },
  });

  const {
    data: customersData,
    loading: cLoading,
    error: cError,
  } = useQuery(CUSTOMERS, { variables: {} });

  const formatDate = (date) => {
    if (!date) return "";
    return date.slice(0, 10).split("-").reverse().join("-");
  };

  useEffect(() => {
    setTransactions(data?.transactions?.edges || []);
    setPageInfo(data?.transactions?.pageInfo);
  }, [data, page, filters?.customerId]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const truncateText = (text) =>
    text.length > 30 ? "..." + text.slice(0, 30) : text;

  const handlePrint = (item) => {
    const element = document.createElement("div");

    element.innerHTML = `
    <div style="
      font-family: Tahoma, Vazir, Arial;
      direction: rtl;
      text-align: right;
      padding: 40px;
      color: #000;
      font-size: 16px;
      line-height: 2;
    ">
      <h2 style="text-align:center; margin-bottom:30px;">
        جزئیات فاکتور
      </h2>

      <div style="
        border:1px solid #ddd;
        padding:25px;
        border-radius:12px;
      ">
        <p><b>شماره:</b> ${item.code || ""}</p>
        <p><b>مشتری:</b> ${item.customer?.fullName || ""}</p>
        <p><b>محصول:</b> ${item.product?.name || ""}</p>
        <p><b>تعداد:</b> ${item.count || 0}</p>
        <p><b>قیمت:</b> ${item.price || 0}</p>
        <p><b>مجموع:</b> ${item.totalAmount || 0}</p>
        <p><b>تاریخ:</b> ${formatDate(item.createdAt)}</p>
        <p><b>توضیحات:</b> ${item.description || ""}</p>
      </div>
    </div>
  `;

    document.body.appendChild(element);

    html2pdf()
      .set({
        margin: 0.6,
        filename: `invoice-${item.code || "print"}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 4,
          dpi: 300,
          letterRendering: true,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(element);
      });
  };
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Navbar */}
      <nav className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8 py-3 sm:h-16 bg-gray-100 dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 transition-colors duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={setExitTransactionsModal}
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
      <div className="flex flex-col gap-4 mt-6 px-4 sm:px-6 lg:px-14 sm:flex-row sm:items-start sm:justify-between">
        {/* دکمه ثبت */}
        <input
          type="button"
          value="ثبت فاکتور خرید"
          className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded transition duration-300"
          onClick={() =>
            setCreatTransactionsModal((prev) => ({
              ...prev,
              showModal: true,
            }))
          }
        />

        {/* فیلترها */}
        <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <div className="relative w-full sm:w-56">
            <button
              onClick={() => setOpen(!open)}
              className="w-full text-gray-500 dark:text-gray-100 h-12 cursor-pointer px-4 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-medium flex justify-between items-center hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-300"
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
                    setSelected("فیلتر مشتری");
                    setFilters((prev) => ({
                      ...prev,
                      customerId: null,
                    }));
                    setOpen(false);
                  }}
                  className="px-4 font-bold py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  همه مشتری‌ها
                </li>

                {customersData?.customers?.map((customer) => (
                  <li
                    key={customer._id}
                    onClick={() => {
                      setSelected(customer.fullName);
                      setFilters((prev) => ({
                        ...prev,
                        customerId: customer._id,
                      }));
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    {customer.fullName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* Table */}
      {/* Table */}
      <div className="relative mt-6 sm:mx-6 lg:mx-14">
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh] rounded rounded-b-none border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950">
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
              {transactions.map((item) => (
                <tr
                  key={item._id}
                  className="text-center transition duration-300 hover:bg-slate-200 dark:hover:bg-slate-900"
                >
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handlePrint(item)}
                        className="px-3 py-1 text-lg cursor-pointer bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded transition duration-300"
                      >
                        چاپ
                      </button>

                      <button
                        onClick={() => setDeleteTransactionsModal(item._id)}
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
                    {truncateText(item.description || "")}
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

        {/* footer */}
        <div className="w-full flex justify-between bg-gray-200 dark:bg-slate-800 p-2 text-slate-900 font-medium rounded-b">
          <p className="font-medium dark:text-slate-100 text-slate-900">
            {pageInfo?.totalAmount} : مبلغ کل
          </p>

          <p className="font-medium dark:text-slate-100 text-slate-900">
            تعداد صفحه ها : {pageInfo?.totalPages}
          </p>
        </div>
      </div>

      <div className="flex flex-row justify-end gap-10 my-2 sm:mx-14">
        <input
          className="w-full sm:w-2/12 p-2 font-medium border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 transition duration-300"
          type="number"
          onChange={(e) => setPage(Number(e.target.value))}
          defaultValue={page || 1}
        />

        <span className="font-medium mt-2"> برو به صفحه</span>
      </div>

      {creatTransactionsModal.showModal && (
        <TransactionCreatModal
          setCreatTransactionsModal={setCreatTransactionsModal}
          refetch={refetch}
        />
      )}

      {updateTransactionsModal.showModal && (
        <TransactionUpdateModal
          setUpdateTransactionsModal={setUpdateTransactionsModal}
          transaction={updateTransactionsModal}
          refetch={refetch}
        />
      )}

      {deleteTransactionsModal && (
        <TransactionDeleteModal
          setDeleteTransactionsModal={setDeleteTransactionsModal}
          transactionId={deleteTransactionsModal}
          refetch={refetch}
        />
      )}

      {exitTransactionsModal && (
        <TransactionExitModal
          setExitTransactionsModal={setExitTransactionsModal}
        />
      )}
    </div>
  );
}
