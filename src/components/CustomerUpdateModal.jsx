import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { X } from "lucide-react";

const ADMIN_UPDATE_CUSTOMERS = gql`
  mutation adminUpdateCustomer(
    $id: ID!
    $fullName: String!
    $phoneNumber: String
  ) {
    adminUpdateCustomer(
      input: { id: $id, fullName: $fullName, phoneNumber: $phoneNumber }
    ) {
      success
      message
    }
  }
`;

export default function CustomerUpdateModal({
  setUpdateCustomersModal,
  customer,
}) {
  const [CustomerUpdateModal, { loading }] = useMutation(
    ADMIN_UPDATE_CUSTOMERS,
  );
  const [loginError, setLoginError] = useState("");

  async function handelSubmit(e) {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const phoneNumber = e.target.phoneNumber.value;

    try {
      const { data } = await CustomerUpdateModal({
        variables: {
          id: customer._id,
          fullName,
          phoneNumber,
        },
      });
      setUpdateCustomersModal({});
    } catch (error) {
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setUpdateCustomersModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-4 shadow-md w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setUpdateCustomersModal(false)}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form action="" onSubmit={handelSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                نام و تخلص مشتری
              </h2>
              <input
                type="text"
                placeholder=".نام و تخلص مشتری را وارد کنید"
                className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
                name="fullName"
                defaultValue={customer.fullName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                شماره تماس
              </h2>
              <input
                type="tel"
                placeholder=".شماره تماس را وارد کنید"
                className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
                name="phoneNumber"
                defaultValue={customer.phoneNumber}
              />
            </div>

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
              className="bg-blue-400 text-white w-full h-12 text-lg font-medium rounded hover:bg-blue-500 duration-300 cursor-pointer disabled:opacity-50"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
