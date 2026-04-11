import { useMutation, useQuery } from "@apollo/client/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { PRODUCTS } from "../graphql/product";
import { ADMIN_UPDATE_TRANSACTION } from "../graphql/transactions";
import { ADMIN_CUSTOMERS } from "../graphql/customers";

export default function TransactionUpdateModal({
  setUpdateTransactionsModal,
  transaction,
  refetch,
}) {
  const { data: productData } = useQuery(PRODUCTS, {
    variables: { paginationInput: { page: 1, pageSize: 10 } },
  });

  const { data: customerData } = useQuery(ADMIN_CUSTOMERS);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(transaction.product || null);
  const [customer, setCustomer] = useState(transaction.customer || null);
  const [customers, setCustomers] = useState([]);
  const [openProducts, setOpenProducts] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [adminUpdateTransaction, { loading }] = useMutation(
    ADMIN_UPDATE_TRANSACTION,
  );

  useEffect(() => {
    if (productData?.products?.edges) {
      setProducts(productData.products.edges);
    }

    if (customerData?.adminCustomers) {
      setCustomers(customerData.adminCustomers);
    }
  }, [productData, customerData]);

  async function handleSubmit(e) {
    e.preventDefault();

    const price = Number(e.target.price.value);
    const count = Number(e.target.count.value);
    const description = e.target.description.value;

    try {
      await adminUpdateTransaction({
        variables: {
          input: {
            productId: product._id,
            customerId: customer._id,
            price,
            count,
            description,
          },
        },
      });

      refetch();
      setUpdateTransactionsModal(false);
    } catch (error) {
      console.log(error);
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setUpdateTransactionsModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded-xl flex flex-col gap-4 shadow-lg w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setUpdateTransactionsModal(false)}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-600 transition"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {/* جنس */}
            <div className="relative w-full">
              <h2 className="font-medium text-black text-lg mb-2 text-right">
                جنس
              </h2>

              <div
                onClick={() => setOpenProducts(!openProducts)}
                className="h-12 px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer"
              >
                <span className={product ? "text-gray-900" : "text-gray-500"}>
                  {product?.name || "انتخاب جنس"}
                </span>

                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    openProducts ? "rotate-180" : ""
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

              {openProducts && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
                  {products?.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => {
                        setProduct(item);
                        setOpenProducts(false);
                      }}
                      className="text-center py-2 cursor-pointer hover:bg-blue-400 hover:text-white transition"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* مشتری */}
            <div className="relative w-full">
              <h2 className="font-medium text-black text-lg mb-2 text-right">
                مشتری
              </h2>

              <div
                onClick={() => setOpenCustomer(!openCustomer)}
                className="h-12 flex-row-reverse px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer"
              >
                <span className={customer ? "text-gray-900" : "text-gray-500"}>
                  {customer?.fullName || "انتخاب مشتری"}
                </span>

                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
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
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
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

            {/* مبلغ */}
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-lg text-black text-right">
                مبلغ
              </h2>
              <input
                type="number"
                name="price"
                defaultValue={transaction.price}
                className="w-full p-3 text-gray-900 border border-gray-300 text-right rounded"
              />
            </div>

            {/* تعداد */}
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-lg text-black text-right">
                تعداد
              </h2>
              <input
                type="number"
                name="count"
                defaultValue={transaction.count}
                className="w-full p-3 text-gray-900 border border-gray-300 text-right rounded"
              />
            </div>

            {/* توضیحات */}
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                توضیحات
              </h2>
              <textarea
                className="w-full py-3 text-gray-900 border border-gray-300 text-right px-3 rounded"
                name="description"
                defaultValue={transaction.description}
              />
            </div>

            {/* خطا */}
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
