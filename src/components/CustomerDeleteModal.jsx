import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const ADMIN_DELETE_CUSTOMER = gql`
  mutation adminDeleteCustomer($id: ID!) {
    adminDeleteCustomer(id: $id) {
      success
      message
    }
  }
`;
export default function CustomerDeleteModal({
  setDeleteCustomersModal,
  customerId,
}) {
  const [adminDeleteCustomer, { loading }] = useMutation(ADMIN_DELETE_CUSTOMER);

  async function handelDelete() {
    try {
      const { data } = await adminDeleteCustomer({
        variables: {
          id: customerId,
        },
      });
      setDeleteCustomersModal("");
    } catch (error) {}
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={() => setDeleteCustomersModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white w-[90%] sm:w-96 h-52 flex flex-col justify-center items-center gap-8 rounded shadow-lg">
        <p className="font-medium text-black text-center px-4">
          آیا مطمئن هستید که می‌خواهید حذف کنید؟
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setDeleteCustomersModal(false)}
            className="px-8 py-3 cursor-pointer bg-gray-500 hover:bg-gray-600 transition rounded text-white"
          >
            خیر
          </button>

          <input
            onClick={handelDelete}
            type="button"
            value={loading ? "...در حال حذف" : "حذف"}
            disabled={loading}
            className="px-8 py-3 cursor-pointer bg-red-400 hover:bg-red-500 transition rounded text-white disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
