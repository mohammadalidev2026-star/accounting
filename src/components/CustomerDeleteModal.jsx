import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { DELETE_CUSTOMER } from "../graphql/customers";

export default function CustomersDeleteModal({
  setDeleteCustomersModal,
  customerId,
  refetch,
}) {
  const [deleteCustomer, { loading }] = useMutation(DELETE_CUSTOMER);
  const [loginError, setLoginError] = useState("");

  async function handelDelete() {
    try {
      const { data } = await deleteCustomer({
        variables: {
          id: customerId,
        },
      });

      refetch();
      setDeleteCustomersModal(false);
    } catch (error) {
      setLoginError(error.message);

      setTimeout(() => {
        setLoginError("");
      }, 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={() => setDeleteCustomersModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white w-[90%] sm:w-96 p-6 flex flex-col items-center gap-6 rounded shadow-lg">
        <p className="font-medium text-black text-center">
          آیا مطمئن هستید که می‌خواهید حذف کنید؟
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setDeleteCustomersModal(false)}
            className="px-8 py-3 cursor-pointer bg-gray-500 hover:bg-gray-600 transition rounded text-white"
          >
            خیر
          </button>

          <button
            onClick={handelDelete}
            disabled={loading}
            className="px-8 py-3 cursor-pointer bg-red-400 hover:bg-red-500 transition rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "...در حال حذف" : "حذف"}
          </button>
        </div>

        {loginError && (
          <p className="text-red-600 text-sm text-center">{loginError}</p>
        )}
      </div>
    </div>
  );
}
