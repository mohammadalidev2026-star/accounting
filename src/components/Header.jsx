import React from "react";
import { NavLink } from "react-router";
import { useContext } from "react";

import { DarkContext } from "../hooks/DarkContext";

export default function Header({ setExitModal }) {
  const { dark, setDark } = useContext(DarkContext);

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8 py-3 sm:h-16 bg-gray-100 dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 transition-colors duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setExitModal(true)}
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
  );
}
