import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

// GraphQL mutation
const ADMIN_UPDATE_TRANSACTION = gql`
  mutation adminUpdateTransaction(
    $id: ID!
    $customerId: ID!
    $amount: Float!
    $currency: CurrencyEnum!
    $description: String
  ) {
    adminUpdateTransaction(
      input: {
        id: $id
        customerId: $customerId
        amount: $amount
        currency: $currency
        description: $description
      }
    ) {
      success
      message
    }
  }
`;

// Query برای گرفتن لیست مشتری‌ها
const ADMIN_CUSTOMERS = gql`
  query adminCustomers {
    adminCustomers {
      _id
      fullName
    }
  }
`;

export default function TransactionUpdateModal({
  setUpdateTransactionsModal,
  transaction,
  refetch,
}) {
  const { data } = useQuery(ADMIN_CUSTOMERS);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(transaction.customer || null);
  const [currency, setCurrency] = useState(transaction.currency || "");
  const [loginError, setLoginError] = useState("");
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  const [adminUpdateTransaction, { loading }] = useMutation(
    ADMIN_UPDATE_TRANSACTION,
  );

  useEffect(() => {
    if (data?.adminCustomers) setCustomers(data.adminCustomers);
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();
    const amount = Number(e.target.amount.value);
    const description = e.target.description.value;
    console.log("dddkdkdkdkdkdkdkd", customer);

    try {
      await adminUpdateTransaction({
        variables: {
          id: transaction._id,
          customerId: customer._id,
          amount,
          currency,
          description,
        },
      });
      refetch();
      setUpdateTransactionsModal(false);
    } catch (error) {
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
            {/* مشتری */}
            <div className="relative w-full">
              <h2 className="font-medium text-black text-lg mb-2 text-right">
                مشتری
              </h2>
              <div
                onClick={() => setOpenCustomer(!openCustomer)}
                className="h-12 px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer"
              >
                <span className={customer ? "text-gray-900" : "text-gray-500"}>
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

            {/* مبلغ */}
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-lg text-black text-right">
                مبلغ
              </h2>
              <input
                type="number"
                name="amount"
                defaultValue={transaction.amount}
                className="w-full p-3 text-gray-900 border border-gray-300 text-right rounded"
              />
            </div>

            {/* واحد پول */}
            <div className="relative w-full">
              <h2 className="font-medium text-lg text-black text-right mb-2">
                واحد پول
              </h2>
              <div
                onClick={() => setOpenCurrency(!openCurrency)}
                className="h-12 px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer"
              >
                <span className={currency ? "text-gray-900" : "text-gray-500"}>
                  {currency || transaction.currency || "انتخاب واحد"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${openCurrency ? "rotate-180" : ""}`}
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
              {openCurrency && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
                  {["USD", "EUR", "AFN"].map((item) => (
                    <li
                      key={item}
                      onClick={() => {
                        setCurrency(item);
                        setOpenCurrency(false);
                      }}
                      className="text-center py-2 cursor-pointer hover:bg-blue-400 hover:text-white transition"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
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
              className={`text-red-600 h-4 flex justify-center transition-opacity duration-300 ${
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
