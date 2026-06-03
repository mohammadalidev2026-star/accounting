import React from "react";
import Header from "../components/Header";
import StatisticsExitModal from "../components/StatisticsExitModal";
import { useState, useContext, useEffect } from "react";
import { DarkContext } from "../hooks/DarkContext";
import { STATISTICS } from "../graphql/Statistics";
import { PRODUCTS } from "../graphql/products";
import { useQuery } from "@apollo/client/react";

export default function Statistics() {
  const [exitStatisticsModal, setExitStatisticsModal] = useState(false);
  const { dark, setDark } = useContext(DarkContext);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("فیلتر جنس");
  const [filters, setFilters] = useState({
    productId: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const { data, refetch } = useQuery(STATISTICS, {
    variables: {
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

  const salesSummary = data?.dashboardSummary?.salesSummary;
  const transactionsSummary = data?.dashboardSummary?.transactionsSummary;

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  return (
    <>
      <Header setExitModal={setExitStatisticsModal} />

      <div className="flex flex-col justify-center items-center">
        <div className="w-full bg-white dark:bg-slate-900 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row justify-center gap-5">
            {/* تاریخ شروع */}
            <div className="w-full lg:w-auto">
              <label className="block text-right mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                تاریخ شروع
              </label>

              <input
                type="date"
                className="w-full h-12 lg:w-55 px-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-white"
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* تاریخ ختم */}
            <div className="w-full lg:w-auto">
              <label className="block text-right mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                تاریخ ختم
              </label>

              <input
                type="date"
                className="w-full h-12 lg:w-55 px-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-white"
                value={filters.endDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* Dropdown */}
            <div className="relative w-full lg:w-56">
              <label className="block text-right mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                انتخاب جنس
              </label>

              <button
                onClick={() => setOpen(!open)}
                className="w-full h-12 px-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-white flex items-center justify-between hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              >
                <span className="truncate">{selected}</span>

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
                <ul className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded overflow-hidden max-h-72 overflow-y-auto">
                  <li
                    onClick={() => {
                      setSelected("فیلتر جنس");
                      setFilters((prev) => ({
                        ...prev,
                        productId: null,
                      }));
                      setOpen(false);
                    }}
                    className="px-4 py-3 font-semibold cursor-pointer border-b border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition"
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
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6 mt-6">
          {/* آمار فروش */}
          <div className="w-full lg:w-86">
            <label className="block text-right mb-3 text-base font-bold text-gray-700 dark:text-gray-200">
              آمار فروش ها
            </label>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-lg p-6 min-h-52.5 flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  {salesSummary?.numberOfSalesRecords || 0}
                </p>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  تعداد فروش ها
                </p>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  {salesSummary?.sumOfTotalAmount || 0}
                </p>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  مبلغ کل فروش ها
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  {salesSummary?.sumOfIncome || 0}
                </p>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  مفاد کل
                </p>
              </div>
            </div>
          </div>

          {/* آمار خرید */}
          <div className="w-full lg:w-86">
            <label className="block text-right mb-3 text-base font-bold text-gray-700 dark:text-gray-200">
              آمار خرید ها
            </label>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-lg p-6 min-h-52.5 flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  {transactionsSummary?.numberOfTransactionsRecords || 0}
                </p>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  تعداد خرید ها
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  {transactionsSummary?.sumOfTotalAmount || 0}
                </p>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  مبلغ کل خرید ها
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {exitStatisticsModal && (
        <StatisticsExitModal setExitStatisticsModal={setExitStatisticsModal} />
      )}
    </>
  );
}
