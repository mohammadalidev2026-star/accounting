import { useQuery } from "@apollo/client/react/compiled";
import { useEffect, useState } from "react";
import { useContext } from "react";

import CustomerCreatModal from "../components/CustomerCreatModal";
import CustomerDeleteModal from "../components/CustomerDeleteModal";
import CustomerUpdateModal from "../components/CustomerUpdateModal";
import CustomerExitModal from "../components/CustomerExitModal";
import { CUSTOMERS } from "../graphql/customers";
import { DarkContext } from "../hooks/DarkContext";
import Header from "../components/Header";

export default function Customers() {
  const [creatCustomersModal, setCreatCustomersModal] = useState({});
  const [updateCustomersModal, setUpdateCustomersModal] = useState({});
  const [deleteCustomersModal, setDeleteCustomersModal] = useState("");
  const [exitCustomersModal, setExitCustomersModal] = useState();
  const [customers, setCustomers] = useState([]);
  const { dark, setDark } = useContext(DarkContext);
  const [search, setSearch] = useState("");

  const { data, refetch } = useQuery(CUSTOMERS, {
    variables: { term: search },
  });

  useEffect(() => {
    setCustomers(data?.customers || []);
  }, [data, search]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <Header setExitModal={setExitCustomersModal} />

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
          className="w-full sm:w-1/3 p-3 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-100 font-medium transition duration-300"
        />
      </div>

      {/* Table */}
      <div className="relative mt-6 sm:mx-6 lg:mx-14">
        {/* جدول scrollable */}
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
        <div className="absolute flex flex-row justify-end gap-2 w-full bg-slate-200  p-2 font-medium dark:bg-slate-800 rounded-b">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {customers.length}
          </p>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            : تعداد مشتریان
          </p>
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
