import { useMutation, useQuery } from "@apollo/client/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { PRODUCTS } from "../graphql/product";
import { CREATE_SALES } from "../graphql/sales";
import { ADMIN_CUSTOMERS } from "../graphql/customers";

export default function SalesCreateModal({ setCreatSalesModal, refetch }) {
  const [createSale, { loading }] = useMutation(CREATE_SALES);

  const { data: productData } = useQuery(PRODUCTS, {
    variables: {
      paginationInput: { page: 1, pageSize: 50 },
      filterInput: { term: "" },
    },
  });

  const { data: customerDate } = useQuery(ADMIN_CUSTOMERS);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [openProduct, setOpenProduct] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(null);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (productData?.products?.edges) {
      setProducts(productData.products.edges);
    }
    if (customerDate?.adminCustomers) setCustomers(customerDate.adminCustomers);
  }, [productData, customerDate]);

  async function handleSubmit(e) {
    e.preventDefault();

    const description = e.target.description.value;
    const price = Number(e.target.price.value);
    const count = Number(e.target.count.value);

    if (!product) return alert("لطفاً جنس را انتخاب کنید");
    if (!price) return alert("مبلغ را وارد کنید");
    if (!count) return alert("تعداد را وارد کنید");

    try {
      await createSale({
        variables: {
          input: {
            customerId: customer._id,
            productId: product._id,
            price,
            count,
            description,
          },
        },
      });

      refetch();
      setCreatSalesModal(false);
    } catch (error) {
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setCreatSalesModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-4 shadow-md w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setCreatSalesModal({})}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* انتخاب جنس */}
          <div className="relative w-full">
            <h2 className="font-medium text-black text-lg text-right mb-2">
              جنس
            </h2>

            <div
              onClick={() => setOpenProduct(!openProduct)}
              className="h-12 flex-row-reverse px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer text-gray-400"
            >
              <span className="truncate">
                {product?.name || "نام جنس را انتخاب کنید"}
              </span>

              {/* SVG فلش */}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  openProduct ? "rotate-180" : ""
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

            {openProduct && (
              <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
                {products?.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => {
                      setProduct(item);
                      setOpenProduct(false);
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
              <span className="text-gray-500">
                {customer?.fullName || "نام مشتری را انتخاب کنید"}
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
            <h2 className="font-medium text-black text-lg text-right">مبلغ</h2>
            <input
              type="number"
              placeholder="مبلغ جنس را وارد کنید"
              name="price"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
            />
          </div>

          {/* تعداد */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">تعداد</h2>
            <input
              type="number"
              placeholder="تعداد را وارد کنید"
              name="count"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
            />
          </div>

          {/* توضیحات */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              توضیحات
            </h2>
            <textarea
              name="description"
              placeholder=" توضیحات را کامل کنید"
              className="w-full py-3 text-gray-900 border border-gray-300 text-right px-3 rounded"
            ></textarea>
          </div>

          <span className="text-red-600 text-center">{loginError}</span>

          <input
            type="submit"
            value={loading ? "...در حال ثبت" : "ثبت"}
            disabled={loading}
            className="bg-blue-500 w-full h-12 text-lg font-medium text-white rounded hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>
      </div>
    </div>
  );
}
