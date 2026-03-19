import { useMutation } from "@apollo/client/react";
import { X } from "lucide-react";
import { useState } from "react";
import { CREAT_PRODUCT } from "../graphql/product";

export default function ProductCreatModal({ setCreatProductsModal, refetch }) {
  const [createProduct, { loading }] = useMutation(CREAT_PRODUCT);
  const [loginError, setLoginError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    const description = e.target.description.value;
    const inStockCount = e.target.inStockCount.value;

    try {
      const { data } = await createProduct({
        variables: {
          name,
          price: Number(price),
          description,
          inStockCount: Number(inStockCount),
        },
      });
      refetch();
      setCreatProductsModal({});
    } catch (error) {
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setCreatProductsModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-4 shadow-md w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setCreatProductsModal({})}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              نام جنس
            </h2>
            <input
              type="text"
              placeholder=".نام جنس را وارد کنید"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
              name="name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              قیمت جنس
            </h2>
            <input
              type="number"
              placeholder=". قیمت جنس را وارد کنید"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
              name="price"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              تعداد جنس
            </h2>
            <input
              type="number"
              placeholder=". تعداد جنس را وارد کنید"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
              name="inStockCount"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              توضیحات
            </h2>
            <textarea
              placeholder=".  توضیحات را وارد کنید"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
              name="description"
            ></textarea>
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
            value={loading ? "...در حال ثبت " : "ثبت"}
            disabled={loading}
            className="bg-blue-400 text-white w-full h-12 text-lg font-medium rounded hover:bg-blue-500 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>
      </div>
    </div>
  );
}
