import { useEffect, useState } from "react";
import TransactionUpdateModal from "./components/TransactionUpdateModal";
import TransactionDeleteModal from "./components/TransactionDeleteModal";
import TransactionCreatModal from "./components/TransactionCreatModal";
import TransactionExitModal from "./components/TransactionExitModal";
import { NavLink } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const ADMIN_TRANSACTIONS = gql`
  query adminTransactions(
    $paginationInput: PaginationInput!
    $filterInput: TransactionFilterInput
  ) {
    adminTransactions(
      paginationInput: $paginationInput
      filterInput: $filterInput
    ) {
      edges {
        _id
        amount
        currency
        description
        createdAt
        customer {
          _id
          fullName
        }
      }
      pageInfo {
        totalCount
        totalPages
        hasNextPage
        totalAmount
      }
    }
  }
`;

const ADMIN_CUSTOMERS = gql`
  query adminCustomers($term: String) {
    adminCustomers(term: $term) {
      _id
      fullName
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

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
    startDate: undefined,
    endDate: undefined,
    customerId: undefined,
  });
  const [dark, setDark] = useState(false);
  const [pageInfo, setPageInfo] = useState({});

  const { data, loading, error, refetch } = useQuery(ADMIN_TRANSACTIONS, {
    variables: {
      paginationInput: { page: page ? page : 1 },
      filterInput: filters,
    },
  });

  const {
    data: customersData,
    loading: cLoading,
    error: cError,
  } = useQuery(ADMIN_CUSTOMERS, { variables: {} });

  useEffect(() => {
    setTransactions(data?.adminTransactions?.edges || []);
    setPageInfo(data?.adminTransactions?.pageInfo);
  }, [data, page, filters?.customerId]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const truncateText = (text) =>
    text.length > 30 ? "..." + text.slice(0, 30) : text;

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

      <div className="flex flex-col gap-4 -mb-3 mt-6 sm:flex-row sm:items-center sm:justify-between sm:mx-6 lg:mx-14">
        {/* سمت چپ */}
        <div className="flex w-full sm:w-auto">
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
        </div>

        {/* سمت راست */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div>
            <input
              className="w-full sm:w-auto px-9.5 py-3 font-medium rounded transition duration-300 border border-gray-300 dark:border-slate-700"
              type="date"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }));
              }}
            />
            <span className="font-medium mr-4"> : تاریخ ختم</span>
          </div>
          <div>
            <input
              className="w-full sm:w-auto px-9.5 py-3 font-medium rounded transition duration-300 border border-gray-300 dark:border-slate-700"
              type="date"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }));
              }}
            />
            <span className="font-medium mr-4"> : تاریخ شروع </span>
          </div>

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
              <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg max-h-64 overflow-y-auto text-gray-700 dark:text-slate-100 backdrop-blur-sm">
                <li
                  onClick={() => {
                    setSelected("فیلتر مشتری");
                    setFilters((prev) => ({ ...prev, customerId: null }));
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  همه مشتری‌ها
                </li>

                <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>

                {customersData.adminCustomers?.length > 0 ? (
                  customersData.adminCustomers.map((customer) => (
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
                      className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 group"
                    >
                      <span className="truncate group-hover:text-blue-500 transition-colors">
                        {customer.fullName}
                      </span>

                      {filters.customerId === customer._id && (
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center">
                    مشتری یافت نشد
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative mt-6 sm:mx-6 lg:mx-14">
        {/* جدول با overflow */}
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
              {transactions.map((item, index) => (
                <tr
                  key={item._id}
                  className="text-center transition duration-300 hover:bg-slate-200 dark:hover:bg-slate-900"
                >
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    <div className="flex justify-center gap-2">
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
                    {item.currency}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.amount}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {truncateText(item.description)}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.customer?.fullName}
                  </td>
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {index + 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* بخش پایین جدول */}
        <div className="w-full flex justify-between bg-green-600 p-2 text-white font-medium dark:bg-green-800 rounded-b-xl">
          {pageInfo?.totalAmount} : مبلغ کل
          <p className="font-medium text-white">
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

      {creatTransactionsModal.showModal && (
        <TransactionCreatModal
          setCreatTransactionsModal={setCreatTransactionsModal}
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
