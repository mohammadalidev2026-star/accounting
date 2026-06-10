import { useMutation, useQuery } from "@apollo/client/react";
import { X, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { PRODUCTS } from "../graphql/products";
import { CUSTOMERS } from "../graphql/customers";
import { CREATE_TRANSACTION } from "../graphql/transactions";

export default function TransactionCreatModal({
  setCreatTransactionsModal,
  refetch,
}) {
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION);

  const { data: productData } = useQuery(PRODUCTS, {
    variables: {
      paginationInput: { page: 1, pageSize: 50 },
      filterInput: { term: "" },
    },
  });

  const { data: customerData } = useQuery(CUSTOMERS);

  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [openProduct, setOpenProduct] = useState([]);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [rows, setRows] = useState([
    { product: null, count: "", price: "" },
  ]);

  useEffect(() => {
    if (productData?.products?.edges) {
      setProducts(productData.products.edges);
    }

    if (customerData?.customers) {
      setCustomers(customerData.customers);
    }
  }, [productData, customerData]);

  function addRow() {
    setRows((prev) => [...prev, { product: null, count: "", price: "" }]);
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
      if (!customer) return alert("مشتری را انتخاب کنید");
      if (!rows[i].price) return alert(`مبلغ ردیف ${i + 1} را وارد کنید`);
      if (!rows[i].count) return alert(`تعداد ردیف ${i + 1} را وارد کنید`);
    }

    const description = e.target.description.value;
    const remainingBalance = Number(e.target.remainingBalance.value);

    try {
      await createTransaction({
        variables: {
          input: {
            customerId: customer._id,
            products: rows.map((r) => ({
              productId: r.product._id,
              count: Number(r.count),
              price: Number(r.price),
            })),
            remainingBalance,
            description,
          },
        },
      });

      refetch();
      setCreatTransactionsModal(false);
    } catch (error) {
      console.log(error);
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setCreatTransactionsModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-4 shadow-md w-full max-w-2xl py-6 px-6 sm:px-7 dark:text-gray-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setCreatTransactionsModal(false)}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="font-bold text-xl text-center">ثبت فاکتور خرید</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* مشتری */}
          <div className="relative w-full">
            <h2 className="font-medium text-black text-base mb-1 text-right">
              مشتری
            </h2>

            <div
              onClick={() => setOpenCustomer(!openCustomer)}
              className="h-11 flex-row-reverse px-3 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer"
            >
              <span className="text-gray-500 truncate">
                {customer?.fullName || "نام مشتری را انتخاب کنید"}
              </span>

              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  openCustomer ? "rotate-180" : ""
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

            {openCustomer && (
              <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto z-50 shadow-lg">
                {customers?.map((item) => (
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
                  <span className="text-sm font-medium">ردیف {index + 1}</span>
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
                    placeholder="مبلغ"
                    value={row.price}
                    onChange={(e) => updateRow(index, "price", e.target.value)}
                    className="w-full h-10 text-gray-900 border border-gray-300 text-right px-3 rounded text-sm"
                  />

                  <input
                    type="number"
                    placeholder="تعداد"
                    value={row.count}
                    onChange={(e) => updateRow(index, "count", e.target.value)}
                    className="w-full h-10 text-gray-900 border border-gray-300 text-right px-3 rounded text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* باقی مانده */}
          <div className="flex flex-col gap-1">
            <h2 className="font-medium text-black text-base text-right">
              باقی مانده
            </h2>
            <input
              type="number"
              name="remainingBalance"
              placeholder="مبلغ باقی مانده را وارد کنید"
              defaultValue={0}
              className="w-full py-2.5 text-gray-900 border border-gray-300 text-right px-3 rounded"
            />
          </div>

          {/* توضیحات */}
          <div className="flex flex-col gap-1">
            <h2 className="font-medium text-black text-base text-right">
              توضیحات
            </h2>
            <textarea
              name="description"
              placeholder="توضیحات را کامل کنید"
              className="w-full py-2.5 text-gray-900 border border-gray-300 text-right px-3 rounded"
            ></textarea>
          </div>

          <span className="text-red-600 text-center text-sm">{loginError}</span>

          <input
            type="submit"
            value={loading ? "...در حال ثبت" : "ثبت"}
            disabled={loading}
            className="bg-blue-500 w-full h-11 text-base font-medium text-white rounded hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>
      </div>
    </div>
  );
}
