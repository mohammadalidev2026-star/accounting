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

      <div className="flex flex-col items-center w-full px-4 lg:px-8 py-6 bg-slate-50 dark:bg-slate-950">
        {/* Filters */}
        <div className="w-full max-w-315 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-white">
            فیلتر گزارشات
          </h2>

          <div className="flex flex-col lg:flex-row justify-center gap-5">
            {/* End Date */}
            <div className="w-full lg:w-auto">
              <label className="block text-right mb-2 font-semibold text-slate-700 dark:text-slate-200">
                تاریخ ختم
              </label>

              <input
                type="date"
                className="w-full lg:w-54 h-12 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={
                  filters.endDate
                    ? filters.endDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: new Date(e.target.value),
                  }))
                }
              />
            </div>
            {/* Start Date */}
            <div className="w-full lg:w-auto">
              <label className="block text-right mb-2 font-semibold text-slate-700 dark:text-slate-200">
                تاریخ شروع
              </label>

              <input
                type="date"
                className="w-full lg:w-54 h-12 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={
                  filters.startDate
                    ? filters.startDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: new Date(e.target.value),
                  }))
                }
              />
            </div>
            {/* Product Dropdown */}
            <div className="relative w-full lg:w-54">
              <label className="block text-right mb-2 font-semibold text-slate-700 dark:text-slate-200">
                انتخاب جنس
              </label>

              <button
                onClick={() => setOpen(!open)}
                className="w-full h-12 px-4 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center text-slate-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all flex-row-reverse cursor-pointer"
              >
                <span>{selected}</span>

                <svg
                  className={`w-4 h-4 transition-transform ${
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
                <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded overflow-hidden z-50">
                  <li
                    onClick={() => {
                      setSelected("فیلتر جنس");
                      setFilters((prev) => ({
                        ...prev,
                        productId: null,
                      }));
                      setOpen(false);
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700"
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
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700"
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="w-full max-w-315 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* transactions */}
          <div className="group `bg-gradient-to-br` from-emerald-500 to-green-600 rounded hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 rounded p-6 h-full">
              <div className="flex items-center justify-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  آمار خرید ها
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
                  <span className="text-3xl font-bold text-emerald-600">
                    {transactionsSummary?.numberOfTransactionsRecords || 0}
                  </span>

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    تعداد فاکتورهای خرید
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-600">
                    {transactionsSummary?.sumOfTotalAmount || 0}
                  </span>

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    مبلغ کل خرید
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sales */}
          <div className="group `bg-gradient-to-br` from-blue-500 to-indigo-600 rounded p-1 hover:scale-[1.02] transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 rounded p-6 h-full">
              <div className="flex items-center justify-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  آمار فروش ها
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
                  <span className="text-3xl font-bold text-green-600">
                    {salesSummary?.numberOfSalesRecords || 0}
                  </span>

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    تعداد فاکتورهای فروش
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
                  <span className="text-3xl font-bold text-green-600">
                    {salesSummary?.sumOfTotalAmount || 0}
                  </span>

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    مبلغ کل فروش
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-600">
                    {salesSummary?.sumOfIncome || 0}
                  </span>

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    مفاد کل
                  </span>
                </div>
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
