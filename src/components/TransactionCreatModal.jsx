import { useState } from "react";
import { X } from "lucide-react";
import { customersData } from "../data/customers";

export default function TransactionCreatModal({ setCreatTransactionsModal }) {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [customer, setCustomer] = useState("");
  const [currency, setCurrency] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const amount = e.target.amount.value;
    const description = e.target.description.value;

    if (!customer) return alert("لطفا نام مشتری را انتخاب کنید");
    if (!amount) return alert("لطفا مبلغ را وارد کنید");
    if (!currency) return alert("لطفا واحد پول را انتخاب کنید");

    const variables = {
      fullName: customer,
      amount,
      description,
      currency,
    };

    console.log("CREATE =>", variables);
    setCreatTransactionsModal(false);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setCreatTransactionsModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded-xl flex flex-col gap-4 shadow-lg w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setCreatTransactionsModal(false)}
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
                <span className={customer ? "text-gray-700" : "text-gray-400"}>
                  {customer || "انتخاب مشتری"}
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
                <ul className="absolute w-full text-black bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-10 shadow-lg">
                  {customersData.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setCustomer(item.fullName);
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
                type="text"
                name="amount"
                placeholder="مبلغ را وارد کنید"
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
                className="h-12 px-4 border border-gray-300 rounded bg-white flex items-center justify-between cursor-pointer text-gray-500"
              >
                <span className={currency}>{currency || "انتخاب واحد"}</span>

                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    openCurrency ? "rotate-180" : ""
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

              {openCurrency && (
                <ul className="absolute w-full text-black bg-white border border-gray-300 rounded mt-1 max-h-52 overflow-y-auto z-10 shadow-lg">
                  {["دلار", "یورو", "افغانی", "تومان"].map((item) => (
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
                placeholder=".توضیحات خود را کامل کنید"
                className="w-full py-3 text-gray-900 border border-gray-300 text-right px-3 rounded"
                name="description"
              ></textarea>
            </div>

            <input
              type="submit"
              value="ثبت"
              className="bg-blue-500 w-full h-12 text-lg font-medium text-white rounded hover:bg-blue-600 transition cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
