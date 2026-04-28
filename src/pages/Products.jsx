import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";

import ProductCreatModal from "../components/ProductCreatModal";
import ProductDeleteModal from "../components/ProductDeleteModal";
import ProductUpdateModal from "../components/ProductUpdateModal";
import ProductExitModal from "../components/ProductExitModal";
import { PRODUCTS } from "../graphql/product";
import { DarkContext } from "../hooks/DarkContext";
import Header from "../components/Header";
import { useContext } from "react";

export default function Products() {
  const { dark, setDark } = useContext(DarkContext);
  const [creatProductsModal, setCreatProductsModal] = useState({});
  const [updateProductsModal, setUpdateProductsModal] = useState({});
  const [deleteProductsModal, setDeleteProductsModal] = useState("");
  const [exitProductsModal, setExitProductsModal] = useState();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);

  const { data, error, loading, refetch } = useQuery(PRODUCTS, {
    variables: {
      paginationInput: {
        page: page ? page : 1,
        pageSize: 10,
      },
      filterInput: {
        term: search,
      },
    },
  });

  useEffect(() => {
    setProducts(data?.products?.edges || []);
    setPageInfo(data?.products?.pageInfo || []);
  }, [data, page, search]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const truncateText = (text) =>
    text.length > 30 ? "..." + text.slice(0, 30) : text;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <Header setExitModal={setExitProductsModal} />
      <div className="flex flex-col gap-4 mt-6 px-4 sm:px-6 lg:px-14 sm:flex-row sm:items-center sm:justify-between">
        <input
          onClick={() => setCreatProductsModal(() => ({ showModal: true }))}
          type="button"
          value=" ثبت جنس "
          className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded transition duration-300"
        />

        <input
          type="search"
          placeholder=": جستجوی جنس"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 p-3 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-right text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 font-medium transition duration-300"
        />
      </div>

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
                  تعداد موجود
                </th>
                <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                  مبلغ
                </th>
                <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                  توضیحات
                </th>

                <th className="border py-3 px-4 border-gray-300 dark:border-slate-700">
                  نام جنس
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr
                  key={item._id}
                  className="text-center transition duration-300 hover:bg-slate-200 dark:hover:bg-slate-900"
                >
                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setDeleteProductsModal(item._id)}
                        className="px-3 py-1 cursor-pointer bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded transition duration-300"
                      >
                        حذف
                      </button>
                      <button
                        onClick={() =>
                          setUpdateProductsModal((prev) => ({
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
                    {item.createdAt.slice(0, 10)}
                  </td>

                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.inStockCount}
                  </td>

                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.price}
                  </td>

                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {truncateText(item.description)}
                  </td>

                  <td className="border py-2 px-3 border-gray-300 dark:border-slate-700">
                    {item.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full text-right bg-gray-200 p-2  font-medium dark:bg-slate-800 rounded-b">
          <p className="font-medium text-slate-900 dark:text-slate-100">
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

      {creatProductsModal.showModal && (
        <ProductCreatModal
          setCreatProductsModal={setCreatProductsModal}
          refetch={refetch}
        />
      )}

      {updateProductsModal.showModal && (
        <ProductUpdateModal
          setUpdateProductsModal={setUpdateProductsModal}
          product={updateProductsModal}
          refetch={refetch}
        />
      )}

      {deleteProductsModal && (
        <ProductDeleteModal
          setDeleteProductsModal={setDeleteProductsModal}
          productId={deleteProductsModal}
          refetch={refetch}
        />
      )}

      {exitProductsModal && (
        <ProductExitModal setExitProductsModal={setExitProductsModal} />
      )}
    </div>
  );
}
