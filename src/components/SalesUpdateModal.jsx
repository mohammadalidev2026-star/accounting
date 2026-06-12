import { useMutation, useQuery } from "@apollo/client/react";
import { X, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { UPDATE_SALES } from "../graphql/sales";
import { PRODUCTS } from "../graphql/products";
import { CUSTOMERS } from "../graphql/customers";

export default function SalesUpdateModal({
  setUpdateSalesModal,
  sale,
  refetch,
}) {
  const { data: productData } = useQuery(PRODUCTS, {
    variables: {
      paginationInput: { page: 1, pageSize: 50 },
      filterInput: { term: "" },
    },
  });

  const { data: customerDate } = useQuery(CUSTOMERS);

  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(sale.customer || null);
  const [customers, setCustomers] = useState([]);
  const [loginError, setLoginError] = useState("");
  const [openProduct, setOpenProduct] = useState([]);
  const [openCustomer, setOpenCustomer] = useState(false);

  const [rows, setRows] = useState(
    (sale.products || []).map((p) => ({
      product: p.product || null,
      count: p.count ?? "",
      price: p.price ?? "",
      buyPrice: p.buyPrice ?? "",
    })),
  );

  const [updateSale, { loading }] = useMutation(UPDATE_SALES);

  useEffect(() => {
    if (productData?.products?.edges) {
      setProducts(productData.products.edges);
    }
    if (customerDate?.customers) setCustomers(customerDate.customers);
  }, [productData, customerDate]);

  function addRow() {
    setRows((prev) => [
      ...prev,
      { product: null, count: "", price: "", buyPrice: "" },
    ]);
    setOpenProduct((prev) => [...prev, false]);
  }

  function removeRow(index) {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
    setOpenProduct((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(index, field, value) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].product) return alert(`جنس ردیف ${i + 1} را انتخاب کنید`);
      if (!rows[i].count) return alert(`تعداد ردیف ${i + 1} را وارد کنید`);
      if (!rows[i].price) return alert(`مبلغ فروش ردیف ${i + 1} را وارد کنید`);
      if (!rows[i].buyPrice) return alert(`مبلغ خرید ردیف ${i + 1} را وارد کنید`);
    }

    const description = e.target.description.value;
    const remainingBalance = Number(e.target.remainingBalance.value);

    try {
      await updateSale({
        variables: {
          input: {
            saleId: sale._id,
            customerId: customer?._id,
            products: rows.map((r) => ({
              productId: r.product._id,
              count: Number(r.count),
              price: Number(r.price),
              buyPrice: Number(r.buyPrice),
            })),
            remainingBalance,
            description,
          },
        },
      });

      refetch();
      setUpdateSalesModal({});
    } catch (error) {
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setUpdateSalesModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-2 shadow-lg w-full max-w-2xl py-8 px-6 sm:px-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setUpdateSalesModal({})}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-600 transition"
        >
          <X size={20} />
        </button>

        <h2 className="font-bold text-xl text-center">ویرایش فاکتور فروش</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* مشتری */}
            <div className="relative w-full dark:text-gray-900">
              <h2 className="font-medium text-black text-lg mb-2 text-right">
                مشتری
              </h2>
              <div
                onClick={() => setOpenCustomer(!openCustomer)}
                className="h-12 flex-row-reverse px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer"
              >
                <span
                  className={customer ? "text-gray-900" : "text-gray-500"}
                >
                  {customer?.fullName || "انتخاب مشتری"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${openCustomer ? "rotate-180" : ""}`}
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
              </div>
              {openCustomer && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
                  {customers.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => {
                        setCustomer(item);
                        setOpenCustomer(false);
                      }}
                      className="text-center py-2 cursor-pointer hover:bg-blue-400 hover:text-white transition"
                    >
                      {item.fullName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Product Rows */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-black text-base">محصولات</h2>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition cursor-pointer"
                >
                  <Plus size={16} /> افزودن
                </button>
              </div>

              {rows.map((row, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      ردیف {index + 1}
                    </span>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative col-span-2">
                      <div
                        onClick={() =>
                          setOpenProduct((prev) => {
                            const next = [...prev];
                            next[index] = !next[index];
                            return next;
                          })
                        }
                        className="h-10 flex-row-reverse px-3 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer text-gray-500 text-sm"
                      >
                        <span className="truncate">
                          {row.product?.name || "نام جنس را انتخاب کنید"}
                        </span>
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 shrink-0 ${
                            openProduct[index] ? "rotate-180" : ""
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
                      </div>

                      {openProduct[index] && (
                        <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto z-50 shadow-lg">
                          {products?.map((item) => (
                            <li
                              key={item._id}
                              onClick={() => {
                                updateRow(index, "product", item);
                                setOpenProduct((prev) => {
                                  const next = [...prev];
                                  next[index] = false;
                                  return next;
                                });
                              }}
                              className="text-center py-2 text-sm cursor-pointer hover:bg-blue-400 hover:text-white transition"
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <input
                      type="number"
                      placeholder="تعداد"
                      value={row.count}
                      onChange={(e) =>
                        updateRow(index, "count", e.target.value)
                      }
                      className="w-full h-10 text-gray-900 border border-gray-300 text-right px-3 rounded text-sm"
                    />

                    <input
                      type="number"
                      placeholder="مبلغ خرید"
                      value={row.buyPrice}
                      onChange={(e) =>
                        updateRow(index, "buyPrice", e.target.value)
                      }
                      className="w-full h-10 text-gray-900 border border-gray-300 text-right px-3 rounded text-sm"
                    />

                    <input
                      type="number"
                      placeholder="مبلغ فروش"
                      value={row.price}
                      onChange={(e) =>
                        updateRow(index, "price", e.target.value)
                      }
                      className="w-full h-10 text-gray-900 border border-gray-300 text-right px-3 rounded text-sm col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                الباقی
              </h2>
              <input
                type="number"
                name="remainingBalance"
                defaultValue={sale.remainingBalance ?? 0}
                className="w-full p-3 text-gray-900 border border-gray-300 text-right rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                توضیحات
              </h2>
              <textarea
                className="w-full py-3 text-gray-900 border border-gray-300 text-right px-3 rounded"
                name="description"
                defaultValue={sale.description}
              />
            </div>

            <span
              className={`text-red-600 flex justify-center transition-opacity duration-300 ${
                loginError ? "opacity-100" : "opacity-0"
              }`}
            >
              {loginError}
            </span>

            <input
              type="submit"
              value={loading ? "...در حال ثبت" : "ثبت"}
              disabled={loading}
              className="bg-blue-500 w-full h-12 text-lg font-medium text-white rounded hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
