export default function TransactionDeleteModal({
  setDeleteTransactionsModal,
  transactionId,
}) {
  function handelDelete() {
    console.log("this is id", transactionId);
    setDeleteTransactionsModal("");
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={() => setDeleteTransactionsModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white w-[90%] sm:w-96 h-52 flex flex-col justify-center items-center gap-8 rounded shadow-lg">
        <p className="font-medium text-black text-center px-4">
          آیا مطمئن هستید که می‌خواهید حذف کنید؟
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setDeleteTransactionsModal(false)}
            className="px-8 py-3 cursor-pointer bg-gray-500 hover:bg-gray-600 transition duration-300 rounded text-white"
          >
            خیر
          </button>

          <button
            onClick={handelDelete}
            className="px-8 py-3 cursor-pointer bg-red-400 hover:bg-red-500 transition duration-300 rounded text-white"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
