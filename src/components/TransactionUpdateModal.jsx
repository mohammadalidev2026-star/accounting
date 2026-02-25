import { useState } from "react";
import { X } from "lucide-react";

export default function TransactionUpdateModal({
  setUpdateTransactionsModal,
  transaction,
}) {
  const [customer, setCustomer] = useState(transaction.fullName);
  const [currency, setCurrency] = useState(transaction.currencyUnit);

  function handelSubmit(e) {
    e.preventDefault();

    const amount = e.target.amount.value;
    const description = e.target.description.value;

    const variables = {
      fullName: customer,
      amount,
      description,
      currency,
    };

    console.log("UPDATE =>", variables);
    setUpdateTransactionsModal({});
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setUpdateTransactionsModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded-xl flex flex-col gap-4 shadow-lg w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setUpdateTransactionsModal({})}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-600 duration-300 transition"
        >
          <X size={20} />
        </button>

        <form onSubmit={handelSubmit}>
          <div className="flex flex-col gap-5">
            {/* مشتری */}
            <div className="relative w-full">
              <h2 className="font-medium text-black text-lg mb-2 text-right">
                مشتری
              </h2>

              <select
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                }}
                className="w-full cursor-pointer text-gray-900 bg-white border border-gray-300 rounded mt-1  h-12"
              >
                {[
                  "رضا",
                  "محمد",
                  "علی",
                  "گل محمد",
                  "کاکا صالح",
                  "یاسر",
                  "مهدی",
                  "جمعه خان",
                  "طاها",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* مبلغ */}
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                مبلغ
              </h2>
              <input
                type="text"
                name="amount"
                defaultValue={transaction.amount}
                className="w-full p-3 text-gray-900 border border-gray-300 text-right rounded"
              />
            </div>

            {/* واحد پول */}
            <div className="relative w-full">
              <h2 className="font-medium text-black text-lg mb-2 text-right">
                واحد پول
              </h2>

              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                }}
                className="w-full bg-white border text-gray-900 cursor-pointer border-gray-300 rounded h-12"
              >
                {["دلار", "یورو", "افغانی", "تومان"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* توضیحات */}
            <div className="flex flex-col gap-2 truncate">
              <h2 className="font-medium text-black text-lg text-right">
                توضیحات
              </h2>
              <textarea
                className="w-full border text-gray-900 py-3 px-3 flex justify-center items-center border-gray-300 text-right rounded"
                name="description"
                defaultValue={transaction.description}
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
